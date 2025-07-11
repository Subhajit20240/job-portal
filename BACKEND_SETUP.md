# Job Portal Backend Setup Guide

This guide will help you set up the complete backend infrastructure for your job portal using Supabase.

## 🚀 Quick Start

### Prerequisites
- Supabase account and project
- Node.js and npm/yarn installed
- Your environment variables configured

### Environment Variables
Make sure your `.env` file contains:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

## 📊 Database Setup

### Step 1: Create Database Schema
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database-setup.sql`
4. Click **Run** to execute the script

This will create:
- All necessary tables (companies, jobs, applications, saved_jobs)
- Row Level Security policies
- Database indexes for performance
- Sample data

### Step 2: Create Storage Buckets
1. Go to **Storage** in your Supabase dashboard
2. Create two buckets:
   - `company-logo` (Public bucket for company logos)
   - `resumes` (Private bucket for candidate resumes)

### Step 3: Configure Storage Policies
For the `company-logo` bucket:
```sql
-- Allow public read access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'company-logo');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'company-logo' AND auth.role() = 'authenticated');
```

For the `resumes` bucket:
```sql
-- Allow users to read their own resumes and recruiters to read applications
CREATE POLICY "Users can read own resumes" ON storage.objects
FOR SELECT USING (
  bucket_id = 'resumes' AND 
  (auth.uid()::text = (storage.foldername(name))[1] OR 
   auth.uid()::text IN (
     SELECT recruiter_id FROM jobs 
     WHERE id IN (
       SELECT job_id FROM applications 
       WHERE resume LIKE '%' || name || '%'
     )
   ))
);

-- Allow authenticated users to upload resumes
CREATE POLICY "Authenticated users can upload resumes" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');
```

## 🎯 Seeding Sample Data

### Option 1: Using the Admin Interface
1. Start your development server: `npm run dev`
2. Navigate to `/admin` in your browser
3. Click "Seed Entire Database" to populate with sample data

### Option 2: Manual Seeding
```javascript
import { seedDatabase } from './src/utils/seedData.js';

// Run this in your browser console or create a script
seedDatabase();
```

## 📋 Database Schema Overview

### Tables Structure

#### Companies Table
```sql
- id (Primary Key)
- name (Unique)
- logo_url
- created_at
```

#### Jobs Table
```sql
- id (Primary Key)
- title
- description (Markdown supported)
- location
- company_id (Foreign Key)
- recruiter_id (Clerk User ID)
- requirements
- salary_min
- salary_max
- isOpen (Boolean)
- created_at
```

#### Applications Table
```sql
- id (Primary Key)
- job_id (Foreign Key)
- candidate_id (Clerk User ID)
- status (applied/interviewing/hired/rejected)
- resume (File URL)
- skills
- experience
- education
- cover_letter
- created_at
```

#### Saved Jobs Table
```sql
- id (Primary Key)
- job_id (Foreign Key)
- user_id (Clerk User ID)
- created_at
```

## 🔐 Security Features

### Row Level Security (RLS)
- **Companies**: Public read, authenticated write
- **Jobs**: Public read, owner can update/delete
- **Applications**: Candidates see their own, recruiters see applications for their jobs
- **Saved Jobs**: Users can only see/modify their own saved jobs

### Authentication Integration
- Uses Clerk for user authentication
- Supabase RLS policies integrate with Clerk user IDs
- Secure file upload with user-specific access

## 🎨 Sample Data Included

### Companies (15+)
- Major tech companies: Amazon, Google, Microsoft, Meta, Apple
- Startups and scale-ups: Uber, Netflix, Spotify, Tesla
- Enterprise: IBM, Oracle, Salesforce, Adobe

### Jobs (50+)
- Various roles: Software Engineer, DevOps, Data Scientist, Product Manager
- Different experience levels: Junior to Senior positions
- Multiple locations: Major Indian cities
- Realistic salary ranges: ₹6L - ₹30L per annum

### Job Categories
- **Engineering**: Frontend, Backend, Full Stack, Mobile, DevOps
- **Data**: Data Scientist, ML Engineer, Data Analyst
- **Product**: Product Manager, Product Designer
- **Design**: UI/UX Designer, Visual Designer
- **Quality**: QA Engineer, Test Automation Engineer

## 🛠️ API Functions Available

### Jobs API (`src/api/apiJobs.js`)
- `getJobs()` - Fetch jobs with filters
- `getSingleJob()` - Get job details
- `getMyJobs()` - Get recruiter's posted jobs
- `addNewJob()` - Create new job posting
- `updateHiringStatus()` - Toggle job open/closed
- `deleteJob()` - Remove job posting
- `saveJob()` - Save/unsave job for candidate
- `getSavedJobs()` - Get user's saved jobs

### Companies API (`src/api/apiCompanies.js`)
- `getCompanies()` - Fetch all companies
- `addNewCompany()` - Add new company with logo upload

### Applications API (`src/api/apiApplication.js`)
- `applyToJob()` - Submit job application with resume
- `getApplications()` - Get candidate's applications
- `updateApplicationStatus()` - Update application status (recruiter)

## 🔧 Development Tips

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Access admin panel
http://localhost:5173/admin
```

### Testing the Setup
1. Visit `/admin` to seed data
2. Go to `/jobs` to see job listings
3. Try filtering by location and company
4. Test job application flow
5. Check saved jobs functionality

### Debugging
- Check browser console for API errors
- Verify Supabase RLS policies in dashboard
- Ensure environment variables are correct
- Check network tab for failed requests

## 📈 Performance Optimizations

### Database Indexes
- Jobs: company_id, recruiter_id, location, isOpen
- Applications: job_id, candidate_id
- Saved Jobs: user_id, job_id

### Query Optimizations
- Use select() to fetch only needed columns
- Implement pagination for large datasets
- Cache frequently accessed data

## 🚀 Deployment Checklist

### Before Deploying
- [ ] Database schema created
- [ ] Storage buckets configured
- [ ] RLS policies enabled
- [ ] Sample data seeded (optional)
- [ ] Environment variables set
- [ ] API functions tested

### Production Considerations
- Enable database backups
- Set up monitoring and alerts
- Configure proper CORS settings
- Review and tighten RLS policies
- Set up database connection pooling

## 🆘 Troubleshooting

### Common Issues

**"Permission denied" errors**
- Check RLS policies are correctly configured
- Verify user authentication status
- Ensure Clerk integration is working

**File upload failures**
- Check storage bucket policies
- Verify bucket names match code
- Ensure file size limits are appropriate

**API connection issues**
- Verify Supabase URL and keys
- Check network connectivity
- Review CORS settings

### Getting Help
- Check Supabase documentation
- Review Clerk authentication guides
- Check browser developer tools
- Look at network requests and responses

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [React Query Documentation](https://tanstack.com/query)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---

Your job portal backend is now fully configured with Supabase! 🎉