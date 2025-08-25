-- Customer Questions Database Schema (Corrected)
-- MySQL structure for customer delivery/return questions with cost calculations
-- Updated to use existing 'customer_admin_categories' table with proper column names

-- Main customer questions table
CREATE TABLE IF NOT EXISTS `customer_questions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `unique_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_unique_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'References customer_admin_categories.unique_id',
  `required` tinyint(1) NOT NULL DEFAULT 0,
  `delivery_text` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Text shown for delivery (e.g., "Keys Delivered")',
  `return_text` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Text shown for return (e.g., "Keys Returned")',
  `sync_texts` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'If true, delivery and return texts are synced',
  `answer_sync_map` json DEFAULT NULL COMMENT 'Maps answer index to sync status {0: true, 1: false}',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_questions_unique_id_unique` (`unique_id`),
  
  -- Foreign key constraint using your existing categories table
  CONSTRAINT `fk_customer_questions_category` 
    FOREIGN KEY (`category_unique_id`) REFERENCES `customer_admin_categories` (`unique_id`) 
    ON DELETE RESTRICT ON UPDATE CASCADE,
    
  -- Indexes for performance
  INDEX `idx_customer_questions_category` (`category_unique_id`),
  INDEX `idx_customer_questions_required` (`required`),
  INDEX `idx_customer_questions_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customer answer options for delivery
CREATE TABLE IF NOT EXISTS `customer_delivery_answers` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `unique_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `question_unique_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'References customer_questions.unique_id',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dollar_value` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Cost value for delivery',
  `sort_order` int NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_delivery_answers_unique_id_unique` (`unique_id`),
  
  -- Foreign key constraint
  CONSTRAINT `fk_delivery_answers_question` 
    FOREIGN KEY (`question_unique_id`) REFERENCES `customer_questions` (`unique_id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
    
  -- Indexes
  INDEX `idx_delivery_answers_question` (`question_unique_id`),
  INDEX `idx_delivery_answers_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customer answer options for return
CREATE TABLE IF NOT EXISTS `customer_return_answers` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `unique_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `question_unique_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'References customer_questions.unique_id',
  `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dollar_value` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Cost value for return',
  `sort_order` int NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  
  PRIMARY KEY (`id`),
  UNIQUE KEY `customer_return_answers_unique_id_unique` (`unique_id`),
  
  -- Foreign key constraint
  CONSTRAINT `fk_return_answers_question` 
    FOREIGN KEY (`question_unique_id`) REFERENCES `customer_questions` (`unique_id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
    
  -- Indexes
  INDEX `idx_return_answers_question` (`question_unique_id`),
  INDEX `idx_return_answers_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data insertion (using your table structure)
INSERT INTO `customer_questions` (
  `unique_id`, `name`, `category_unique_id`, `required`, `delivery_text`, `return_text`, 
  `sync_texts`, `answer_sync_map`, `created_at`, `updated_at`
) VALUES 
(
  'cq-keys', 
  'Equipment Keys', 
  'ccat-keys', 
  1, 
  'Keys Delivered', 
  'Keys Returned', 
  1, 
  '{"0": true, "1": true}',
  NOW(),
  NOW()
),
(
  'cq-remote', 
  'Remote Control', 
  'ccat-keys', 
  0, 
  'Remote Control Delivered', 
  'Remote Control Returned', 
  1, 
  '{"0": true, "1": true, "2": true}',
  NOW(),
  NOW()
),
(
  'cq-bucket', 
  'Standard Bucket', 
  'ccat-attachments', 
  1, 
  'Standard Bucket Delivered', 
  'Standard Bucket Returned', 
  1, 
  '{"0": true, "1": false, "2": false}',
  NOW(),
  NOW()
);

-- Sample delivery answers
INSERT INTO `customer_delivery_answers` (
  `unique_id`, `question_unique_id`, `description`, `dollar_value`, `sort_order`, `created_at`, `updated_at`
) VALUES 
-- Keys delivery answers
('cans-1', 'cq-keys', 'Yes', 0.00, 1, NOW(), NOW()),
('cans-2', 'cq-keys', 'No', 0.00, 2, NOW(), NOW()),

-- Remote delivery answers
('cans-5', 'cq-remote', 'Yes', 0.00, 1, NOW(), NOW()),
('cans-6', 'cq-remote', 'No', 0.00, 2, NOW(), NOW()),
('cans-7', 'cq-remote', 'N/A - Not Applicable', 0.00, 3, NOW(), NOW()),

-- Bucket delivery answers
('cans-11', 'cq-bucket', 'Good Condition', 0.00, 1, NOW(), NOW()),
('cans-12', 'cq-bucket', 'Minor Wear', 0.00, 2, NOW(), NOW()),
('cans-13', 'cq-bucket', 'Not Delivered', 0.00, 3, NOW(), NOW());

-- Sample return answers
INSERT INTO `customer_return_answers` (
  `unique_id`, `question_unique_id`, `description`, `dollar_value`, `sort_order`, `created_at`, `updated_at`
) VALUES 
-- Keys return answers (customer charged if not returned)
('cans-3', 'cq-keys', 'Yes', 0.00, 1, NOW(), NOW()),
('cans-4', 'cq-keys', 'No', 150.00, 2, NOW(), NOW()),

-- Remote return answers
('cans-8', 'cq-remote', 'Yes', 0.00, 1, NOW(), NOW()),
('cans-9', 'cq-remote', 'No', 300.00, 2, NOW(), NOW()),
('cans-10', 'cq-remote', 'N/A - Not Applicable', 0.00, 3, NOW(), NOW()),

-- Bucket return answers (escalating damage costs)
('cans-14', 'cq-bucket', 'Good Condition', 0.00, 1, NOW(), NOW()),
('cans-15', 'cq-bucket', 'Minor Damage', 200.00, 2, NOW(), NOW()),
('cans-16', 'cq-bucket', 'Major Damage', 800.00, 3, NOW(), NOW()),
('cans-17', 'cq-bucket', 'Missing', 1500.00, 4, NOW(), NOW());

-- Create view for easier querying with category names
CREATE VIEW `customer_questions_with_details` AS
SELECT 
  cq.id,
  cq.unique_id,
  cq.name,
  cq.category_unique_id,
  cac.category_name,
  cac.description as category_description,
  cq.required,
  cq.delivery_text,
  cq.return_text,
  cq.sync_texts,
  cq.answer_sync_map,
  cq.created_at,
  cq.updated_at,
  (SELECT COUNT(*) FROM customer_delivery_answers WHERE question_unique_id = cq.unique_id) as delivery_answers_count,
  (SELECT COUNT(*) FROM customer_return_answers WHERE question_unique_id = cq.unique_id) as return_answers_count
FROM customer_questions cq
LEFT JOIN customer_admin_categories cac ON cq.category_unique_id = cac.unique_id
ORDER BY cq.name;

-- Useful queries for your application:

-- Get all questions with category names and answer counts
-- SELECT * FROM customer_questions_with_details WHERE category_name = 'Keys & Access';

-- Get questions with their complete answer sets
-- SELECT 
--   cq.*,
--   cac.category_name,
--   (SELECT JSON_ARRAYAGG(JSON_OBJECT('unique_id', unique_id, 'description', description, 'dollar_value', dollar_value, 'sort_order', sort_order)) 
--    FROM customer_delivery_answers WHERE question_unique_id = cq.unique_id ORDER BY sort_order) as delivery_answers,
--   (SELECT JSON_ARRAYAGG(JSON_OBJECT('unique_id', unique_id, 'description', description, 'dollar_value', dollar_value, 'sort_order', sort_order)) 
--    FROM customer_return_answers WHERE question_unique_id = cq.unique_id ORDER BY sort_order) as return_answers
-- FROM customer_questions cq
-- LEFT JOIN customer_admin_categories cac ON cq.category_unique_id = cac.unique_id
-- ORDER BY cq.name;

-- Calculate cost for a specific delivery/return answer pair
-- SELECT 
--   (ra.dollar_value - da.dollar_value) as customer_charge
-- FROM customer_delivery_answers da
-- JOIN customer_return_answers ra ON ra.question_unique_id = da.question_unique_id
-- WHERE da.unique_id = 'cans-1' AND ra.unique_id = 'cans-4';