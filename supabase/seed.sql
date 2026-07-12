insert into vehicles (registration_number, name_model, type, max_load_capacity, odometer, acquisition_cost, region, status) values
('TRK-01', 'Ford Transit 350', 'Van', 800, 15000, 32000, 'North', 'Available'),
('TRK-02', 'Isuzu NPR', 'Truck', 3000, 42000, 55000, 'North', 'On Trip'),
('TRK-03', 'Mercedes Sprinter', 'Van', 1200, 8000, 38000, 'South', 'In Shop'),
('TRK-04', 'Volvo FH16', 'Truck', 5000, 60000, 90000, 'South', 'Available');

insert into drivers (name, license_number, license_category, license_expiry_date, contact_number, safety_score, status) values
('Rohan Verma', 'DL-MH-2019-0123456', 'LMV', '2027-05-15', '9876543210', 92, 'Available'),
('Priya Sharma', 'DL-DL-2020-0987654', 'HMV', '2025-11-30', '9123456781', 88, 'Available'),
('Meera Nair', 'DL-KA-2018-0456789', 'LMV', '2027-01-20', '9123456780', 98, 'Suspended'),
('Arjun Singh', 'DL-TN-2021-0345678', 'HMV', '2027-08-10', '9988776655', 85, 'On Trip');