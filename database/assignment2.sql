-- #1
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n' )

-- #2
UPDATE account SET account_type = 'Admin'
WHERE account_id = '1'

-- #3
DELETE FROM account WHERE account_id = '1'

-- #4
UPDATE inventory 
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer'

-- #5 (Had problems with data being locked, so I don't know if this works)
SELECT i.inv_make, i.inv_model, c.classification_name
FROM classification c
	JOIN inventory i
		ON i.classification_id = c.classification_id
	WHERE c.classification_name = 'SPORT'

-- #6 
UPDATE inventory 
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');



