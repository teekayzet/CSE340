-- Insert a new record into the account table
-- The account_id and account_type fields are not included as they handle their own values
INSERT INTO account (first_name, last_name, email, password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');


-- Update the account_type for Tony Stark to 'Admin'
UPDATE account
SET account_type = 'Admin'
WHERE email = 'tony@starkent.com';


-- Delete the record for Tony Stark from the account table
DELETE FROM account
WHERE email = 'tony@starkent.com';


-- Update the description of the GM Hummer record to change 'small interiors' to 'a huge interior'
UPDATE inventory
SET description = REPLACE(description, 'small interiors', 'a huge interior')
WHERE make = 'GM' AND model = 'Hummer';


-- Select make and model from inventory and classification name from classification for items in the 'Sport' category
SELECT i.make, i.model, c.classification_name
FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';


-- Update the file paths in inv_image and inv_thumbnail columns to include '/vehicles' in the middle
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
