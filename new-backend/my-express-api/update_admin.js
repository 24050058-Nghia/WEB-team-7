const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'news_management'
});

db.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối:', err);
        process.exit(1);
    }
    
    const sql = "UPDATE users SET full_name = 'admin' WHERE full_name = 'Nguyễn Quản trị' OR role_id = 1";
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Lỗi cập nhật:', err);
        } else {
            console.log('✅ Thành công! Số dòng bị ảnh hưởng:', result.affectedRows);
        }
        db.end();
        process.exit();
    });
});
