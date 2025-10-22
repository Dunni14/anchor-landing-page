-- Anchor Bible Meditation App Waitlist Database Schema
-- Run this in your Neon Database to create the waitlist table

CREATE TABLE IF NOT EXISTS waitlist_signups (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_agent TEXT,
    ip_address VARCHAR(45),
    referral_source VARCHAR(100),
    
    -- Indexes for better query performance
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_signups(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist_signups(created_at);

-- Insert a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_waitlist_updated_at 
    BEFORE UPDATE ON waitlist_signups 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for analytics
CREATE OR REPLACE VIEW waitlist_analytics AS
SELECT 
    COUNT(*) as total_signups,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as signups_today,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as signups_this_week,
    COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as signups_this_month,
    DATE_TRUNC('day', created_at) as signup_date,
    COUNT(*) as daily_signups
FROM waitlist_signups
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY signup_date DESC;