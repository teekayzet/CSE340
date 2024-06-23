-- Update the description of the GM Hummer record to change 'small interiors' to 'a huge interior'
UPDATE inventory
SET description = REPLACE(description, 'small interiors', 'a huge interior')
WHERE make = 'GM' AND model = 'Hummer';

-- Update the file paths in inv_image and inv_thumbnail columns to include '/vehicles' in the middle
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
