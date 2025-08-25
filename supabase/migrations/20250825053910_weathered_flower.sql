-- Customer Questions Database Schema (Updated)
-- MySQL structure for customer delivery/return questions with cost calculations
-- Updated to use existing 'customer_admin_categories' table

-- Main customer questions table
CREATE TABLE `customer_questions` (
  `id` varchar(255) NOT NULL PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `category_id` varchar(255) NOT NULL,
  `required` tinyint(1) NOT NULL DEFAULT 0,
  `delivery_text` varchar(255) NOT NULL COMMENT 'Text shown for delivery (e.g., "Keys Delivered")',
  `return_text` varchar(255) NOT NULL COMMENT 'Text shown for return (e.g., "Keys Returned")',
  `sync_texts` tinyint(1) NOT NULL DEFAULT 1 COMMENT 'If true, delivery and return texts are synced',
  `answer_sync_map` json DEFAULT NULL COMMENT 'Maps answer index to sync status {0: true, 1: false}',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key constraint using your existing categories table
  CONSTRAINT `fk_customer_questions_category` 
    FOREIGN KEY (`category_id`) REFERENCES `customer_admin_categories` (`id`) 
    ON DELETE RESTRICT ON UPDATE CASCADE,
    
  -- Indexes for performance
  INDEX `idx_customer_questions_category` (`category_id`),
  INDEX `idx_customer_questions_required` (`required`),
  INDEX `idx_customer_questions_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customer answer options for delivery
CREATE TABLE `customer_delivery_answers` (
  `id` varchar(255) NOT NULL PRIMARY KEY,
  `question_id` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `dollar_value` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Cost value for delivery',
  `sort_order` int NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key constraint
  CONSTRAINT `fk_delivery_answers_question` 
    FOREIGN KEY (`question_id`) REFERENCES `customer_questions` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
    
  -- Indexes
  INDEX `idx_delivery_answers_question` (`question_id`),
  INDEX `idx_delivery_answers_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Customer answer options for return
CREATE TABLE `customer_return_answers` (
  `id` varchar(255) NOT NULL PRIMARY KEY,
  `question_id` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `dollar_value` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Cost value for return',
  `sort_order` int NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign key constraint
  CONSTRAINT `fk_return_answers_question` 
    FOREIGN KEY (`question_id`) REFERENCES `customer_questions` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
    
  -- Indexes
  INDEX `idx_return_answers_question` (`question_id`),
  INDEX `idx_return_answers_sort` (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data insertion
INSERT INTO `customer_questions` (
  `id`, `name`, `category_id`, `required`, `delivery_text`, `return_text`, 
  `sync_texts`, `answer_sync_map`
) VALUES 
(
  'cq-keys', 
  'Equipment Keys', 
  'ccat-keys', 
  1, 
  'Keys Delivered', 
  'Keys Returned', 
  1, 
  '{"0": true, "1": true}'
),
(
  'cq-remote', 
  'Remote Control', 
  'ccat-keys', 
  0, 
  'Remote Control Delivered', 
  'Remote Control Returned', 
  1, 
  '{"0": true, "1": true, "2": true}'
),
(
  'cq-bucket', 
  'Standard Bucket', 
  'ccat-attachments', 
  1, 
  'Standard Bucket Delivered', 
  'Standard Bucket Returned', 
  1, 
  '{"0": true, "1": false, "2": false}'
);

-- Sample delivery answers
INSERT INTO `customer_delivery_answers` (
  `id`, `question_id`, `description`, `dollar_value`, `sort_order`
) VALUES 
-- Keys delivery answers
('cans-1', 'cq-keys', 'Yes', 0.00, 1),
('cans-2', 'cq-keys', 'No', 0.00, 2),

-- Remote delivery answers
('cans-5', 'cq-remote', 'Yes', 0.00, 1),
('cans-6', 'cq-remote', 'No', 0.00, 2),
('cans-7', 'cq-remote', 'N/A - Not Applicable', 0.00, 3),

-- Bucket delivery answers
('cans-11', 'cq-bucket', 'Good Condition', 0.00, 1),
('cans-12', 'cq-bucket', 'Minor Wear', 0.00, 2),
('cans-13', 'cq-bucket', 'Not Delivered', 0.00, 3);

-- Sample return answers
INSERT INTO `customer_return_answers` (
  `id`, `question_id`, `description`, `dollar_value`, `sort_order`
) VALUES 
-- Keys return answers (customer charged if not returned)
('cans-3', 'cq-keys', 'Yes', 0.00, 1),
('cans-4', 'cq-keys', 'No', 150.00, 2),

-- Remote return answers
('cans-8', 'cq-remote', 'Yes', 0.00, 1),
('cans-9', 'cq-remote', 'No', 300.00, 2),
('cans-10', 'cq-remote', 'N/A - Not Applicable', 0.00, 3),

-- Bucket return answers (escalating damage costs)
('cans-14', 'cq-bucket', 'Good Condition', 0.00, 1),
('cans-15', 'cq-bucket', 'Minor Damage', 200.00, 2),
('cans-16', 'cq-bucket', 'Major Damage', 800.00, 3),
('cans-17', 'cq-bucket', 'Missing', 1500.00, 4);

-- Create view for easier querying with category names
CREATE VIEW `customer_questions_with_details` AS
SELECT 
  cq.id,
  cq.name,
  cq.category_id,
  cac.name as category_name,
  cq.required,
  cq.delivery_text,
  cq.return_text,
  cq.sync_texts,
  cq.answer_sync_map,
  cq.created_at,
  cq.updated_at,
  (SELECT COUNT(*) FROM customer_delivery_answers WHERE question_id = cq.id) as delivery_answers_count,
  (SELECT COUNT(*) FROM customer_return_answers WHERE question_id = cq.id) as return_answers_count
FROM customer_questions cq
LEFT JOIN customer_admin_categories cac ON cq.category_id = cac.id
ORDER BY cq.name;

-- Optional: Add indexes for better performance with your category table
CREATE INDEX `idx_customer_questions_category_lookup` ON `customer_questions` (`category_id`, `name`);
CREATE INDEX `idx_customer_questions_search_full` ON `customer_questions` (`name`, `delivery_text`, `return_text`);

-- Query examples for your Laravel application:

-- Get all questions with category names
-- SELECT * FROM customer_questions_with_details WHERE category_name = 'Keys & Access';

-- Get questions with their answers for a specific category
-- SELECT 
--   cq.*,
--   cac.name as category_name,
--   (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'description', description, 'dollar_value', dollar_value, 'sort_order', sort_order)) 
--    FROM customer_delivery_answers WHERE question_id = cq.id ORDER BY sort_order) as delivery_answers,
--   (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', id, 'description', description, 'dollar_value', dollar_value, 'sort_order', sort_order)) 
--    FROM customer_return_answers WHERE question_id = cq.id ORDER BY sort_order) as return_answers
-- FROM customer_questions cq
-- LEFT JOIN customer_admin_categories cac ON cq.category_id = cac.id
-- ORDER BY cq.name;