-- ======================================================
-- Hệ thống: Quản lý tin tức (Bản sửa lỗi & Tối ưu)
-- ======================================================

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';

CREATE DATABASE IF NOT EXISTS news_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE news_management;

-- 1. Bảng roles
CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` int NOT NULL PRIMARY KEY,
  `role_name` varchar(50) NOT NULL UNIQUE,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB;

INSERT IGNORE INTO `roles` VALUES  
(1, 'admin', 'Toàn quyền hệ thống'),
(2, 'editor', 'Biên tập viên viết bài'),
(3, 'user', 'Người dùng phổ thông');

-- 2. Bảng users (ĐÃ ĐỔI TÊN TẠI ĐÂY)
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `username` varchar(50) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `avatar_url` varchar(255) DEFAULT 'default-avatar.jpg',
  `role_id` int DEFAULT 3,
  `status` ENUM('active', 'inactive', 'banned') DEFAULT 'active',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_users_roles` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB;

INSERT IGNORE INTO `users` (`user_id`, `username`, `password`, `full_name`, `email`, `role_id`) VALUES  
(1, 'admin_tong', 'admin2026', 'admin', 'admin@news.com', 1), -- Đã đổi thành 'admin'
(2, 'bientap_vien', '123456', 'Trần Văn Biên', 'editor@news.com', 2),
(3, 'nguoidung_01', '123', 'Nguyễn Văn Độc Giả', 'nguoidung@gmail.com', 3);

-- 3. Bảng categories
CREATE TABLE IF NOT EXISTS `categories` (
  `cat_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `cat_name` varchar(50) NOT NULL UNIQUE,
  `slug` varchar(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT IGNORE INTO `categories` (`cat_id`, `cat_name`, `slug`) VALUES  
(1, 'XÃ HỘI', 'xa-hoi'),
(2, 'CÔNG NGHỆ', 'cong-nghe'),
(3, 'GIẢI TRÍ', 'giai-tri'),
(4, 'THỂ THAO', 'the-thao');

-- 4. Bảng news
CREATE TABLE IF NOT EXISTS `news` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL UNIQUE,
  `summary` text,
  `content` longtext NOT NULL,
  `image_url` text,
  `author_id` int NOT NULL,
  `cat_id` int DEFAULT NULL,
  `views` int DEFAULT 0,
  `is_breaking` tinyint(1) DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FULLTEXT KEY `idx_fulltext_search` (`title`, `summary`, `content`),
  CONSTRAINT `fk_news_author` FOREIGN KEY (`author_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_news_cat` FOREIGN KEY (`cat_id`) REFERENCES `categories` (`cat_id`) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT IGNORE INTO `news` (`id`, `title`, `slug`, `summary`, `content`, `author_id`, `cat_id`, `views`, `is_breaking`, `image_url`) VALUES  
(1, 'Lộ diện AI mới 2026', 'lo-dien-ai-moi-2026', 'Gemini 3 Flash xử lý siêu tốc.', 'Nội dung mẫu...', 1, 2, 1024, 1, 'default.jpg');

-- 5. Bảng comments
CREATE TABLE IF NOT EXISTS `comments` (
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` int NOT NULL,          
    `content` TEXT NOT NULL,            
    `news_id` int DEFAULT NULL,       
    `target_type` VARCHAR(50) DEFAULT 'news', 
    `parent_id` int DEFAULT NULL,    
    `status` TINYINT DEFAULT 1,         
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT `fk_comment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_comment_news` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_comment_parent` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. VIEW Thống kê
CREATE OR REPLACE VIEW view_news_dashboard AS
SELECT 
    n.id, 
    n.title, 
    c.cat_name, 
    u.full_name AS author, 
    n.views,
    (SELECT COUNT(*) FROM comments WHERE news_id = n.id) AS total_comments,
    DATE_FORMAT(n.created_at, '%d/%m/%Y') AS date_published
FROM news n
LEFT JOIN categories c ON n.cat_id = c.cat_id
JOIN users u ON n.author_id = u.user_id;

-- 7. Mở rộng (Profile, Follows, Media, Logs)
CREATE TABLE IF NOT EXISTS `user_profiles` (
  `profile_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` int NOT NULL UNIQUE,
  `bio` text,
  `phone_number` varchar(15) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_profile_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `follows` (
  `follower_id` int NOT NULL,
  `following_id` int NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`follower_id`, `following_id`),
  CONSTRAINT `fk_follower` FOREIGN KEY (`follower_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_following` FOREIGN KEY (`following_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `media` (
  `media_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `news_id` int DEFAULT NULL,
  `file_url` text NOT NULL,
  `file_type` ENUM('image', 'video', 'document') DEFAULT 'image',
  `uploaded_by` int NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_media_news` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_media_uploader` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS `audit_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` int NOT NULL,
  `action` varchar(255) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_audit_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Khôi phục thiết lập
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- KIỂM TRA
SELECT * FROM view_news_dashboard ORDER BY id DESC;