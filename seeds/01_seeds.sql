-- Insert data into the users table
INSERT INTO users (name, email, password)
VALUES
  ('User 1', 'user1@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('User 2', 'user2@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('User 3', 'user3@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

-- Insert data into the properties table
INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES
  (1, 'Property 1', 'description', 'thumbnail_url_1', 'cover_url_1', 100, 2, 2, 3, 'Country 1', 'Street 1', 'City 1', 'Province 1', 'Postcode 1', true),
  (2, 'Property 2', 'description', 'thumbnail_url_2', 'cover_url_2', 150, 1, 1, 1, 'Country 2', 'Street 2', 'City 2', 'Province 2', 'Postcode 2', true),
  (3, 'Property 3', 'description', 'thumbnail_url_3', 'cover_url_3', 200, 3, 3, 4, 'Country 3', 'Street 3', 'City 3', 'Province 3', 'Postcode 3', true);

-- Insert data into the reservations table
INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES
  ('2018-09-11', '2018-09-26', 1, 1),
  ('2019-01-04', '2019-02-01', 2, 2),
  ('2021-10-01', '2021-10-14', 3, 3);

-- Insert data into the property_reviews table
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES
  (1, 1, 1, 5, 'Great property!'),
  (2, 2, 2, 4, 'Nice stay.'),
  (3, 3, 3, 3, 'Decent place.');