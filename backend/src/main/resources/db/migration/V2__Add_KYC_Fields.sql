-- Migration to add KYC fields to company_profiles
-- Clean up existing mock data that won't cast to BIGINT
UPDATE company_profiles SET user_id = '1' WHERE user_id = 'current_user';
ALTER TABLE company_profiles ALTER COLUMN user_id TYPE BIGINT USING (user_id::BIGINT);
ALTER TABLE company_profiles ADD COLUMN business_license_number VARCHAR(255);
ALTER TABLE company_profiles ADD COLUMN registration_date DATE;
ALTER TABLE company_profiles ADD COLUMN contact_person VARCHAR(255);
