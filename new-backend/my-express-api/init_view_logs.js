const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'news_management'
}).promise();

async function init() {
    try {
        const sql = `
            CREATE TABLE IF NOT EXISTS view_logs (
                log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
                news_id INT NOT NULL,
                user_id INT DEFAULT NULL,
                ip_address VARCHAR(45),
                viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT fk_view_news_log FOREIGN KEY (news_id) REFERENCES news (id) ON DELETE CASCADE
            ) ENGINE=InnoDB;
        `;
        await db.query(sql);
        console.log('✅ Bảng view_logs đã sẵn sàng!');
        process.exit();
    } catch (err) {
        console.error('❌ Lỗi:', err);
        process.exit(1);
    }
}

init();
