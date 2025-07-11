# Quick Setup Guide - Fix Job Posting & Add Dummy Data

## 🚨 Issues Fixed:
1. **Job posting functionality** - Added salary fields and improved validation
2. **Dummy data setup** - Created easy-to-use admin panel for seeding data

## 🛠️ Step-by-Step Setup:

### Step 1: Set Up Database Tables
1. Go to your **Supabase Dashboard** → **SQL Editor**
2. Copy and paste this SQL script:

```sql
-- Create Companies Table
CREATE TABLE IF NOT EXISTS companies (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    company_id BIGINT REFERENCES companies(id) ON DELETE CASCADE,
    recruiter_id TEXT NOT NULL,
    requirements TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    isOpen BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id TEXT NOT NULL,
    status TEXT DEFAULT 'applied' CHECK (status IN ('applied', 'interviewing', 'hired', 'rejected')),
    resume TEXT,
    skills TEXT,
    experience INTEGER,
    education TEXT,
    cover_letter TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Saved Jobs Table
CREATE TABLE IF NOT EXISTS saved_jobs (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT REFERENCES jobs(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Companies are viewable by everyone" ON companies FOR SELECT USING (true);
CREATE POLICY "Jobs are viewable by everyone" ON jobs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert jobs" ON jobs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own jobs" ON jobs FOR UPDATE USING (auth.uid()::text = recruiter_id);
CREATE POLICY "Users can delete their own jobs" ON jobs FOR DELETE USING (auth.uid()::text = recruiter_id);

-- Applications policies
CREATE POLICY "Users can view relevant applications" ON applications
FOR SELECT USING (
    auth.uid()::text = candidate_id OR 
    auth.uid()::text IN (
        SELECT recruiter_id FROM jobs WHERE jobs.id = applications.job_id
    )
);
CREATE POLICY "Authenticated users can insert applications" ON applications FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Saved jobs policies
CREATE POLICY "Users can view their own saved jobs" ON saved_jobs FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own saved jobs" ON saved_jobs FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can delete their own saved jobs" ON saved_jobs FOR DELETE USING (auth.uid()::text = user_id);
```

3. Click **Run** to execute the script

### Step 2: Create Storage Buckets
1. Go to **Storage** in your Supabase dashboard
2. Create two buckets:
   - **company-logo** (make it public)
   - **resumes** (keep it private)

### Step 3: Seed Dummy Data
1. Make sure your development server is running:
   ```bash
   npm run dev
   ```

2. Visit the admin panel: **http://localhost:5174/admin**

3. Click **"Check Database Connection"** to verify everything is working

4. Click **"Seed Entire Database"** to add dummy data:
   - 12 companies (Amazon, Google, Microsoft, etc.)
   - 30+ jobs across different roles and locations
   - Realistic salary ranges

### Step 4: Test Job Posting
1. Sign up/login as a user
2. Go to your Clerk dashboard and set your user role to "recruiter":
   - Go to **Users** → Select your user → **Metadata**
   - Add: `"role": "recruiter"` to the **unsafe metadata**

3. Visit **http://localhost:5174/post-job**
4. Fill out the form (now includes salary fields)
5. Submit to create a new job

### Step 5: Test the Application
1. **Job Listings**: Visit `/jobs` to see all jobs with filters
2. **Job Details**: Click on any job to see full details
3. **Search & Filter**: Try filtering by location and company
4. **Save Jobs**: Test the save/unsave functionality
5. **Applications**: Apply to jobs (as a candidate)

## 🎯 What's Now Working:

### ✅ Job Posting
- Complete form with all required fields
- Salary range inputs (min/max)
- Company selection from database
- Location selection (Indian states)
- Rich text editor for requirements
- Proper validation and error handling

### ✅ Dummy Data
- **12 Companies**: Amazon, Google, Microsoft, Meta, Apple, Netflix, Uber, Atlassian, IBM, Tesla, Spotify, Adobe
- **30+ Jobs**: Various roles including:
  - Senior Full Stack Developer
  - Frontend Engineer
  - DevOps Engineer
  - Data Scientist
  - Product Manager
  - Mobile App Developer
  - UI/UX Designer
  - Backend Engineer
- **Realistic Details**: Proper job descriptions, salary ranges (₹6L-₹30L), locations across India

### ✅ Features Working
- Job search and filtering
- Company-wise job listings
- Location-based filtering
- Job saving/bookmarking
- Application system
- Recruiter dashboard
- Real-time statistics on landing page

## 🔧 Troubleshooting:

### If job posting fails:
1. Check browser console for errors
2. Verify you're logged in as a recruiter
3. Ensure all required fields are filled
4. Check Supabase logs for database errors

### If dummy data doesn't load:
1. Verify database tables exist (run SQL script again)
2. Check Supabase connection in admin panel
3. Look at browser console for API errors
4. Ensure RLS policies are correctly set

### If you can't see jobs:
1. Make sure you've seeded the data
2. Check if RLS policies allow public read access
3. Verify the jobs table has data in Supabase dashboard

## 🎉 You're All Set!

Your job portal now has:
- ✅ Working job posting with salary fields
- ✅ Comprehensive dummy data (companies + jobs)
- ✅ Full CRUD operations
- ✅ Search and filtering
- ✅ User authentication and roles
- ✅ File upload capabilities
- ✅ Responsive design

Visit **http://localhost:5174** to see your fully functional job portal!