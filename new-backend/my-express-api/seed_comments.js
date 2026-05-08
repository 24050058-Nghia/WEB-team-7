const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'news_management'
});

const sampleComments = [
    { news_id: 1, user_id: 1, content: "Công nghệ AI Gemini 3 này thực sự quá kinh khủng, tốc độ xử lý video 50ms là một bước ngoặt lớn!" },
    { news_id: 1, user_id: 2, content: "Liệu AI có thay thế hoàn toàn lập trình viên không nhỉ? Đọc bài xong thấy lo lắng quá." },
    { news_id: 1, user_id: 3, content: "Theo tôi AI chỉ là công cụ thôi, quan trọng là cách mình điều khiển nó." },
    { news_id: 2, user_id: 1, content: "Vừa đặt vé đi Đà Nẵng xong, may mà còn kịp suất cuối!" },
    { news_id: 2, user_id: 4, content: "Phú Quốc mùa này đẹp lắm, mọi người nên đi thử một lần cho biết." },
    { news_id: 3, user_id: 5, content: "Ronaldo Nazário +8 là ước mơ của mọi game thủ FC Online luôn." },
    { news_id: 3, user_id: 2, content: "Bộ chỉ số 150 thì hậu vệ nào đuổi cho kịp, game cân bằng dữ chưa?" },
    { news_id: 4, user_id: 3, content: "Lối sống Zero Waste rất hay, mình cũng đang tập dùng túi vải khi đi chợ." },
    { news_id: 5, user_id: 4, content: "Ẩm thực Sài Gòn thì hủ tiếu gõ vẫn là chân ái nhất!" },
    { news_id: 6, user_id: 1, content: "Sự kết hợp giữa EDM và đàn tranh nghe lạ tai mà cuốn thực sự." }
];

db.connect(async (err) => {
    if (err) {
        console.error('Lỗi kết nối:', err);
        process.exit(1);
    }

    console.log("--- Bắt đầu chèn bình luận mẫu ---");

    for (const c of sampleComments) {
        const sql = "INSERT INTO comments (news_id, user_id, content) VALUES (?, ?, ?)";
        await db.promise().query(sql, [c.news_id, c.user_id, c.content]);
    }

    // Chèn một số Reply mẫu
    const [rows] = await db.promise().query("SELECT id FROM comments LIMIT 5");
    if (rows.length > 0) {
        const parentId = rows[0].id;
        const replySql = "INSERT INTO comments (news_id, user_id, content, parent_id) VALUES (?, ?, ?, ?)";
        await db.promise().query(replySql, [1, 2, "Đúng vậy bạn ơi, mình cũng thấy thế!", parentId]);
        await db.promise().query(replySql, [1, 1, "Cảm ơn bạn đã chia sẻ nhé!", parentId]);
    }

    console.log("✅ Đã chèn xong bình luận mẫu!");
    db.end();
    process.exit();
});
