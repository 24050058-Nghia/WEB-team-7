require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 5001;
const SECRET_KEY = '2006';

// --- 1. CẤU HÌNH MIDDLEWARE ---
app.use(cors({
    origin: true, // Cho phép tất cả các domain gọi API (phản chiếu origin) thay vì '*' gây lỗi với credentials
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning']
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- 2. KẾT NỐI DATABASE MYSQL (Sử dụng Pool để tối ưu) ---
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456', 
    database: process.env.DB_NAME || 'news_management',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Kiểm tra kết nối và khởi tạo bảng khi startup
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Lỗi kết nối MySQL:", err.message);
        console.log("👉 Hãy kiểm tra lại mật khẩu và đảm bảo MySQL đang chạy.");
    } else {
        console.log("✅ Kết nối Database news_management thành công!");
        connection.release(); // Trả lại kết nối vào pool

        // Tự động tạo bảng comments nếu chưa tồn tại (Đơn giản hóa để tránh lỗi Foreign Key)
        const createCommentsTable = `
            CREATE TABLE IF NOT EXISTS comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                news_id INT NOT NULL,
                user_id INT NOT NULL,
                content TEXT NOT NULL,
                parent_id INT DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `;
        db.query(createCommentsTable, (createErr) => {
            if (createErr) {
                console.error("❌ Lỗi tạo bảng comments:", createErr.message);
            } else {
                console.log("✅ Bảng 'comments' đã sẵn sàng!");
            }
        });
    }
});

// --- 3. MIDDLEWARE XÁC THỰC TOKEN ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Vui lòng đăng nhập lại!" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Phiên đăng nhập hết hạn" });
        req.user = user;
        next();
    });
};

// --- 4. CÁC API ROUTES ---

// [POST] Đăng ký
app.post('/api/register', (req, res) => {
    const { username, full_name, email, password } = req.body;

    if (!username || !full_name || !email || !password) {
        return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
    }

    // Kiểm tra xem email hoặc username đã tồn tại chưa
    const checkQuery = 'SELECT * FROM users WHERE email = ? OR username = ?';
    db.query(checkQuery, [email, username], (err, results) => {
        if (err) return res.status(500).json({ message: "Lỗi kiểm tra cơ sở dữ liệu", error: err.message });
        
        if (results.length > 0) {
            const existingUser = results[0];
            if (existingUser.email === email) {
                return res.status(400).json({ message: "Email này đã được sử dụng!" });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ message: "Tên đăng nhập đã tồn tại!" });
            }
        }

        // Chèn user mới, mặc định role_id = 3 (thường là User/Reader)
        const insertQuery = 'INSERT INTO users (username, full_name, email, password, role_id, status) VALUES (?, ?, ?, ?, 3, "active")';
        db.query(insertQuery, [username, full_name, email, password], (insertErr, result) => {
            if (insertErr) return res.status(500).json({ message: "Lỗi tạo tài khoản", error: insertErr.message });
            res.status(201).json({ message: "Đăng ký tài khoản thành công!", userId: result.insertId });
        });
    });
});

// [POST] Đăng nhập
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const query = `
        SELECT u.*, r.role_name FROM users u 
        LEFT JOIN roles r ON u.role_id = r.role_id 
        WHERE u.email = ?
    `;

    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(401).json({ message: 'Tài khoản không tồn tại' });

        const user = results[0];
        // Lưu ý: Nên dùng bcrypt để so sánh mật khẩu nếu bạn đã hash nó trong DB
        if (password !== user.password) return res.status(401).json({ message: 'Mật khẩu không chính xác' });

        const token = jwt.sign({
            id: user.user_id,
            username: user.full_name || "Admin",
            role: user.role_id
        }, SECRET_KEY, { expiresIn: '24h' });

        res.json({
            token,
            user: { full_name: user.full_name, role: user.role_name }
        });
    });
});

// [GET] Lấy danh sách bài viết (Hỗ trợ tìm kiếm cho Admin)
app.get('/api/news', (req, res) => {
    const { search } = req.query;
    let sql = `
        SELECT n.*, c.cat_name as category, u.full_name as author 
        FROM news n 
        LEFT JOIN categories c ON n.cat_id = c.cat_id 
        LEFT JOIN users u ON n.author_id = u.user_id 
    `;

    const params = [];
    if (search) {
        sql += ` WHERE n.title LIKE ? `;
        params.push(`%${search}%`);
    }

    sql += ` ORDER BY n.id DESC, n.created_at DESC `;

    db.query(sql, params, (err, results) => {
        if (err) {
            console.error("Lỗi lấy danh sách bài viết:", err);
            return res.status(500).json({ error: "Lỗi lấy dữ liệu" });
        }

        const catsMap = { 1: 'XÃ HỘI', 2: 'CÔNG NGHỆ', 3: 'GIẢI TRÍ', 4: 'THỂ THAO', 5: 'KINH TẾ', 6: 'ĐỜI SỐNG' };
        const mappedResults = results.map(item => ({
            ...item,
            category: item.category || catsMap[item.cat_id] || 'KHÁC',
            author: item.author || 'Quản trị viên'
        }));

        res.json(mappedResults);
    });
});

// [GET] Lấy chi tiết một bài viết
app.get('/api/news/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT n.*, c.cat_name as category, u.full_name as author 
        FROM news n 
        LEFT JOIN categories c ON n.cat_id = c.cat_id 
        LEFT JOIN users u ON n.author_id = u.user_id 
        WHERE n.id = ?
    `;

    db.query(query, [id], (err, results) => {
        if (err) return res.status(500).json({ error: "Lỗi lấy chi tiết bài viết" });
        if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy bài viết" });

        const item = results[0];
        const catsMap = { 1: 'XÃ HỘI', 2: 'CÔNG NGHỆ', 3: 'GIẢI TRÍ', 4: 'THỂ THAO', 5: 'KINH TẾ', 6: 'ĐỜI SỐNG' };
        
        res.json({
            ...item,
            category: item.category || catsMap[item.cat_id] || 'KHÁC',
            author: item.author || 'Quản trị viên'
        });
    });
});

// [POST] Đăng bài viết mới
app.post('/api/news', authenticateToken, (req, res) => {
    const { title, content, summary, category, image_url } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: "Vui lòng nhập đủ tít và nội dung!" });
    }

    const slug = title.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const catsMap = { 'XÃ HỘI': 1, 'CÔNG NGHỆ': 2, 'GIẢI TRÍ': 3, 'THỂ THAO': 4, 'KINH TẾ': 5, 'ĐỜI SỐNG': 6 };
    const cat_id = catsMap[String(category).toUpperCase()] || 1;

    const sql = "INSERT INTO news (title, slug, summary, content, author_id, cat_id, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [title, slug, summary, content, req.user.id, cat_id, image_url], (err, result) => {
        if (err) return res.status(500).json({ error: "Lỗi Database", details: err.message });
        res.status(201).json({ message: "Đăng bài thành công!", id: result.insertId });
    });
});

// [PUT] Cập nhật bài viết
app.put('/api/news/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { title, content, summary, category, image_url } = req.body;

    const catsMap = { 'XÃ HỘI': 1, 'CÔNG NGHỆ': 2, 'GIẢI TRÍ': 3, 'THỂ THAO': 4, 'KINH TẾ': 5, 'ĐỜI SỐNG': 6 };
    const cat_id = catsMap[String(category).toUpperCase()] || 1;

    const sql = "UPDATE news SET title=?, summary=?, content=?, cat_id=?, image_url=? WHERE id=?";
    db.query(sql, [title, summary, content, cat_id, image_url, id], (err, result) => {
        if (err) return res.status(500).json({ error: "Lỗi cập nhật Database" });
        res.json({ message: "Cập nhật thành công!" });
    });
});

// [DELETE] Xóa bài viết
app.delete('/api/news/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM news WHERE id=?", [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Lỗi xóa bài viết" });
        res.json({ message: "Xóa thành công!" });
    });
});

// [PUT] Tăng lượt xem bài viết (CÓ CHỐNG SPAM F5)
app.put('/api/news/:id/view', (req, res) => {
    const { id } = req.params;
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Kiểm tra xem IP này có xem bài này trong 10 phút qua chưa
    const checkSql = `
        SELECT log_id FROM view_logs 
        WHERE news_id = ? AND ip_address = ? 
        AND viewed_at > DATE_SUB(NOW(), INTERVAL 10 MINUTE)
        LIMIT 1
    `;

    db.query(checkSql, [id, ip], (err, results) => {
        if (err) return res.status(500).json({ error: "Lỗi kiểm tra log lượt xem" });

        if (results.length > 0) {
            return res.json({ message: "Lượt xem đã được ghi nhận trước đó (Anti-spam)" });
        }

        // Ghi log và tăng views
        const logSql = "INSERT INTO view_logs (news_id, ip_address) VALUES (?, ?)";
        db.query(logSql, [id, ip], (err) => {
            if (err) console.error("Lỗi ghi log view:", err);
            
            const updateSql = "UPDATE news SET views = IFNULL(views, 0) + 1 WHERE id = ?";
            db.query(updateSql, [id], (err) => {
                if (err) return res.status(500).json({ error: "Lỗi cập nhật lượt xem" });
                res.json({ message: "Đã tăng lượt xem thật!" });
            });
        });
    });
});

// [GET] Thống kê lượt xem cho Admin
app.get('/api/admin/view-stats', authenticateToken, (req, res) => {
    const sql = `
        SELECT 
            n.id, 
            n.title, 
            IFNULL(n.views, 0) as total_views,
            (SELECT COUNT(*) FROM view_logs WHERE news_id = n.id AND viewed_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)) as views_24h
        FROM news n
        ORDER BY n.views DESC
        LIMIT 10
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Lỗi thống kê" });
        res.json(results);
    });
});

// ==========================================
// --- COMMENT ROUTES ---
// ==========================================

// [GET] Lấy danh sách bình luận của một bài viết
app.get('/api/news/:id/comments', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT 
            c.*, 
            COALESCE(u.full_name, u.username, 'Người dùng') as user_name
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.user_id
        WHERE c.news_id = ?
        ORDER BY c.created_at ASC
    `;
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: "Lỗi lấy danh sách bình luận" });
        
        // Chuyển danh sách phẳng thành cấu trúc cây (parent-child)
        const commentMap = {};
        const tree = [];

        results.forEach(c => {
            c.replies = [];
            commentMap[c.id] = c;
            if (c.parent_id === null) {
                tree.push(c);
            } else if (commentMap[c.parent_id]) {
                commentMap[c.parent_id].replies.push(c);
            }
        });

        // Trả về tree theo thứ tự mới nhất lên đầu
        res.json(tree.reverse());
    });
});

// [POST] Đăng bình luận mới (yêu cầu đăng nhập)
app.post('/api/news/:id/comments', authenticateToken, (req, res) => {
    const newsId = parseInt(req.params.id); // Ép kiểu về số nguyên
    const { content, parent_id } = req.body;

    if (isNaN(newsId)) {
        return res.status(400).json({ message: "ID bài viết không hợp lệ!" });
    }

    if (!content || !content.trim()) {
        return res.status(400).json({ message: "Nội dung bình luận không được trống!" });
    }

    const sql = "INSERT INTO comments (news_id, user_id, content, parent_id) VALUES (?, ?, ?, ?)";
    db.query(sql, [newsId, req.user.id, content.trim(), parent_id || null], (err, result) => {
        if (err) {
            console.error("❌ Lỗi INSERT bình luận:", err.message);
            return res.status(500).json({ error: "Lỗi Database khi lưu bình luận", details: err.message });
        }

        // Trả về bình luận vừa tạo kèm thông tin user
        const fetchSql = `
            SELECT c.*, u.full_name as user_name, u.username
            FROM comments c
            LEFT JOIN users u ON c.user_id = u.user_id
            WHERE c.id = ?
        `;
        db.query(fetchSql, [result.insertId], (fetchErr, rows) => {
            if (fetchErr) {
                return res.status(201).json({ message: "Đăng bình luận thành công!", id: result.insertId });
            }
            res.status(201).json({ message: "Đăng bình luận thành công!", comment: { ...rows[0], replies: [] } });
        });
    });
});

// [DELETE] Xóa bình luận (chỉ chủ sở hữu hoặc admin)
app.delete('/api/comments/:commentId', authenticateToken, (req, res) => {
    const { commentId } = req.params;
    
    // Kiểm tra quyền: chỉ chủ bình luận hoặc admin (role_id = 1 hoặc 2) mới được xóa
    const checkSql = "SELECT user_id FROM comments WHERE id = ?";
    db.query(checkSql, [commentId], (err, results) => {
        if (err) return res.status(500).json({ error: "Lỗi kiểm tra bình luận" });
        if (results.length === 0) return res.status(404).json({ message: "Không tìm thấy bình luận" });

        const comment = results[0];
        const isOwner = comment.user_id === req.user.id;
        const isAdmin = req.user.role === 1 || req.user.role === 2;

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Bạn không có quyền xóa bình luận này!" });
        }

        db.query("DELETE FROM comments WHERE id = ?", [commentId], (deleteErr) => {
            if (deleteErr) return res.status(500).json({ error: "Lỗi xóa bình luận" });
            res.json({ message: "Đã xóa bình luận!" });
        });
    });
});

// [GET] Lấy TẤT CẢ bình luận (Chỉ dành cho Admin - Hỗ trợ tìm kiếm)
app.get('/api/admin/comments', authenticateToken, (req, res) => {
    // Chỉ Admin (role 1) hoặc Editor (role 2) mới được xem
    if (req.user.role !== 1 && req.user.role !== 2) {
        return res.status(403).json({ message: "Bạn không có quyền truy cập dữ liệu này!" });
    }

    const { search } = req.query;
    let sql = `
        SELECT 
            c.*, 
            u.full_name as user_name, u.username,
            n.title as article_title
        FROM comments c
        LEFT JOIN users u ON c.user_id = u.user_id
        LEFT JOIN news n ON c.news_id = n.id
    `;

    const params = [];
    if (search) {
        sql += ` WHERE (c.content LIKE ? OR u.full_name LIKE ?) `;
        params.push(`%${search}%`, `%${search}%`);
    }

    sql += ` ORDER BY c.created_at DESC `;

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ error: "Lỗi lấy danh sách bình luận Admin" });
        res.json(results);
    });
});

// --- 5. KHỞI CHẠY SERVER ---
app.listen(PORT, () => {
    console.log(`🚀 Server News Management 2026 đang chạy tại: http://localhost:${PORT}`);
});