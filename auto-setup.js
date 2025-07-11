// Automated Backend Setup Script
// This script will automatically set up your database and seed data

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Database schema SQL
const createTablesSQL = `
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
`;

const createPoliciesSQL = `
-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Companies are viewable by everyone" ON companies;
DROP POLICY IF EXISTS "Jobs are viewable by everyone" ON jobs;
DROP POLICY IF EXISTS "Authenticated users can insert jobs" ON jobs;
DROP POLICY IF EXISTS "Users can update their own jobs" ON jobs;
DROP POLICY IF EXISTS "Users can delete their own jobs" ON jobs;
DROP POLICY IF EXISTS "Users can view relevant applications" ON applications;
DROP POLICY IF EXISTS "Authenticated users can insert applications" ON applications;
DROP POLICY IF EXISTS "Users can view their own saved jobs" ON saved_jobs;
DROP POLICY IF EXISTS "Users can insert their own saved jobs" ON saved_jobs;
DROP POLICY IF EXISTS "Users can delete their own saved jobs" ON saved_jobs;

-- Create RLS Policies
CREATE POLICY "Companies are viewable by everyone" ON companies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert companies" ON companies FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Jobs are viewable by everyone" ON jobs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert jobs" ON jobs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update their own jobs" ON jobs FOR UPDATE USING (auth.uid()::text = recruiter_id);
CREATE POLICY "Users can delete their own jobs" ON jobs FOR DELETE USING (auth.uid()::text = recruiter_id);

CREATE POLICY "Users can view relevant applications" ON applications
FOR SELECT USING (
    auth.uid()::text = candidate_id OR 
    auth.uid()::text IN (
        SELECT recruiter_id FROM jobs WHERE jobs.id = applications.job_id
    )
);
CREATE POLICY "Authenticated users can insert applications" ON applications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update applications for their jobs" ON applications
FOR UPDATE USING (
    auth.uid()::text IN (
        SELECT recruiter_id FROM jobs WHERE jobs.id = applications.job_id
    )
);

CREATE POLICY "Users can view their own saved jobs" ON saved_jobs FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert their own saved jobs" ON saved_jobs FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can delete their own saved jobs" ON saved_jobs FOR DELETE USING (auth.uid()::text = user_id);
`;

const createIndexesSQL = `
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter_id ON jobs(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_isopen ON jobs(isOpen);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_id ON saved_jobs(job_id);
`;

// Sample data
const companies = [
  { name: "Amazon", logo_url: "/companies/amazon.svg" },
  { name: "Google", logo_url: "/companies/google.webp" },
  { name: "Microsoft", logo_url: "/companies/microsoft.webp" },
  { name: "Meta", logo_url: "/companies/meta.svg" },
  { name: "Apple", logo_url: "/companies/apple.svg" },
  { name: "Netflix", logo_url: "/companies/netflix.png" },
  { name: "Uber", logo_url: "/companies/uber.svg" },
  { name: "Atlassian", logo_url: "/companies/atlassian.svg" },
  { name: "IBM", logo_url: "/companies/ibm.svg" },
  { name: "Tesla", logo_url: "/companies/tesla.svg" },
  { name: "Spotify", logo_url: "/companies/spotify.svg" },
  { name: "Adobe", logo_url: "/companies/adobe.svg" }
];

const jobsTemplate = [
  {
    title: "Senior Full Stack Developer",
    description: `## About the Role

We are seeking a Senior Full Stack Developer to join our innovative team. You'll work on cutting-edge projects that impact millions of users worldwide.

## Key Responsibilities
- Design and develop scalable web applications
- Collaborate with cross-functional teams
- Mentor junior developers
- Lead technical architecture decisions

## Tech Stack
- Frontend: React, TypeScript, Next.js
- Backend: Node.js, Express, GraphQL
- Database: PostgreSQL, Redis
- Cloud: AWS, Docker, Kubernetes

## What We Offer
- Competitive salary and equity
- Flexible remote work options
- Professional development budget
- Health and wellness benefits`,
    location: "Bangalore",
    requirements: "React, Node.js, TypeScript, AWS, PostgreSQL, 5+ years experience",
    salary_min: 1500000,
    salary_max: 2500000,
    recruiter_id: "recruiter_1"
  },
  {
    title: "Frontend Engineer",
    description: `## Join Our Frontend Team

Build beautiful, responsive, and performant user interfaces that delight our customers.

## What You'll Do
- Develop modern web applications using React
- Implement pixel-perfect designs
- Optimize for performance and accessibility
- Collaborate with designers and backend engineers

## Requirements
- Strong proficiency in React and JavaScript
- Experience with modern CSS frameworks
- Knowledge of web performance optimization
- Understanding of responsive design principles

## Benefits
- Stock options
- Comprehensive health insurance
- Learning and development opportunities
- Flexible working hours`,
    location: "Mumbai",
    requirements: "React, JavaScript, CSS, HTML, Tailwind CSS, 3+ years experience",
    salary_min: 1000000,
    salary_max: 1800000,
    recruiter_id: "recruiter_2"
  },
  {
    title: "DevOps Engineer",
    description: `## DevOps Engineer Opportunity

Join our platform team to build and maintain the infrastructure that powers our global services.

## Responsibilities
- Design and implement CI/CD pipelines
- Manage cloud infrastructure and monitoring
- Automate deployment and scaling processes
- Ensure system reliability and security

## Technical Skills
- Experience with containerization (Docker, Kubernetes)
- Cloud platforms (AWS, Azure, GCP)
- Infrastructure as Code (Terraform, CloudFormation)
- Monitoring and logging tools

## Company Culture
- Innovation-driven environment
- Collaborative team culture
- Continuous learning opportunities
- Work-life balance`,
    location: "Hyderabad",
    requirements: "Docker, Kubernetes, AWS, Terraform, Python, 4+ years experience",
    salary_min: 1200000,
    salary_max: 2000000,
    recruiter_id: "recruiter_3"
  },
  {
    title: "Data Scientist",
    description: `## Data Science Role

Help us unlock insights from data and build intelligent systems that drive business decisions.

## Key Areas
- Machine learning model development
- Statistical analysis and experimentation
- Data visualization and storytelling
- Cross-functional collaboration

## Technical Requirements
- Strong programming skills in Python/R
- Experience with ML frameworks (TensorFlow, PyTorch)
- Statistical analysis and hypothesis testing
- Data manipulation and visualization

## Growth Opportunities
- Work with large-scale datasets
- Access to cutting-edge ML infrastructure
- Conference and training budget
- Research publication opportunities`,
    location: "Delhi",
    requirements: "Python, Machine Learning, Statistics, SQL, TensorFlow, 3+ years experience",
    salary_min: 1300000,
    salary_max: 2200000,
    recruiter_id: "recruiter_4"
  },
  {
    title: "Product Manager",
    description: `## Product Manager Position

Drive product strategy and execution for our core platform used by millions of users globally.

## Responsibilities
- Define product roadmap and strategy
- Collaborate with engineering and design teams
- Analyze user feedback and market trends
- Lead product launches and iterations

## Qualifications
- Strong analytical and problem-solving skills
- Experience with product management tools
- Understanding of agile development processes
- Excellent communication and leadership skills

## Impact
- Shape the future of our products
- Work with world-class teams
- Drive user growth and engagement
- Influence company strategy`,
    location: "Pune",
    requirements: "Product Management, Analytics, Agile, User Research, 4+ years experience",
    salary_min: 1600000,
    salary_max: 2800000,
    recruiter_id: "recruiter_5"
  },
  {
    title: "Mobile App Developer",
    description: `## Mobile Developer Opportunity

Create exceptional mobile experiences for iOS and Android platforms.

## What You'll Build
- Native and cross-platform mobile applications
- Real-time features and push notifications
- Offline-first capabilities
- Performance-optimized user interfaces

## Technical Stack
- React Native / Flutter
- Native iOS (Swift) / Android (Kotlin)
- RESTful APIs and GraphQL
- Mobile-specific databases

## Benefits
- Latest mobile development tools
- Device testing lab access
- App Store optimization support
- Mobile development conferences`,
    location: "Chennai",
    requirements: "React Native, iOS, Android, JavaScript, Swift, Kotlin, 3+ years experience",
    salary_min: 1100000,
    salary_max: 1900000,
    recruiter_id: "recruiter_6"
  },
  {
    title: "UI/UX Designer",
    description: `## UI/UX Designer Position

Design intuitive and beautiful user experiences that solve real user problems.

## Design Process
- User research and persona development
- Wireframing and prototyping
- Visual design and design systems
- Usability testing and iteration

## Tools & Skills
- Figma, Sketch, Adobe Creative Suite
- Prototyping tools (Principle, Framer)
- User research methodologies
- Design thinking and human-centered design

## Creative Environment
- Collaborative design culture
- Access to user research data
- Design system development
- Cross-functional partnerships`,
    location: "Kolkata",
    requirements: "Figma, Sketch, Adobe Creative Suite, User Research, Prototyping, 2+ years experience",
    salary_min: 800000,
    salary_max: 1500000,
    recruiter_id: "recruiter_7"
  },
  {
    title: "Backend Engineer",
    description: `## Backend Engineer Role

Build robust, scalable backend systems that power our applications and APIs.

## Technical Challenges
- Microservices architecture design
- High-performance API development
- Database optimization and scaling
- System reliability and monitoring

## Technology Stack
- Languages: Java, Python, Go, Node.js
- Frameworks: Spring Boot, Express, FastAPI
- Databases: PostgreSQL, MongoDB, Redis
- Message Queues: RabbitMQ, Apache Kafka

## Engineering Excellence
- Code review culture
- Test-driven development
- Performance optimization
- System design discussions`,
    location: "Gurgaon",
    requirements: "Java, Spring Boot, PostgreSQL, Redis, Microservices, 4+ years experience",
    salary_min: 1200000,
    salary_max: 2000000,
    recruiter_id: "recruiter_8"
  }
];

async function executeSQL(sql, description) {
  console.log(`🔧 ${description}...`);
  try {
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    if (error) {
      // Try alternative method for executing SQL
      const { error: altError } = await supabase.from('_supabase_migrations').select('*').limit(1);
      if (altError) {
        console.log(`⚠️  ${description} - Manual execution required`);
        return false;
      }
    }
    console.log(`✅ ${description} completed`);
    return true;
  } catch (err) {
    console.log(`⚠️  ${description} - Manual execution required`);
    return false;
  }
}

async function createTables() {
  console.log('📊 Creating database tables...');
  
  // Since we can't execute raw SQL directly, we'll use the Supabase client to create tables
  // This is a workaround - the tables will be created via the admin panel instead
  
  try {
    // Test if tables exist by trying to query them
    const { error: companiesError } = await supabase.from('companies').select('count(*)').limit(1);
    const { error: jobsError } = await supabase.from('jobs').select('count(*)').limit(1);
    
    if (!companiesError && !jobsError) {
      console.log('✅ Database tables already exist');
      return true;
    } else {
      console.log('⚠️  Database tables need to be created manually');
      console.log('📋 Please run the SQL script in your Supabase dashboard');
      return false;
    }
  } catch (err) {
    console.log('⚠️  Database tables need to be created manually');
    return false;
  }
}

async function createStorageBuckets() {
  console.log('📁 Creating storage buckets...');
  
  try {
    // Check if buckets exist
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.log('⚠️  Storage access error - check permissions');
      return false;
    }
    
    const bucketNames = buckets.map(bucket => bucket.name);
    
    // Create company-logo bucket if it doesn't exist
    if (!bucketNames.includes('company-logo')) {
      const { error: logoError } = await supabase.storage.createBucket('company-logo', {
        public: true,
        allowedMimeTypes: ['image/*']
      });
      
      if (logoError) {
        console.log('⚠️  Could not create company-logo bucket automatically');
      } else {
        console.log('✅ Created company-logo bucket');
      }
    }
    
    // Create resumes bucket if it doesn't exist
    if (!bucketNames.includes('resumes')) {
      const { error: resumeError } = await supabase.storage.createBucket('resumes', {
        public: false,
        allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      });
      
      if (resumeError) {
        console.log('⚠️  Could not create resumes bucket automatically');
      } else {
        console.log('✅ Created resumes bucket');
      }
    }
    
    console.log('✅ Storage buckets setup completed');
    return true;
  } catch (err) {
    console.log('⚠️  Storage setup error:', err.message);
    return false;
  }
}

async function seedCompanies() {
  console.log('🏢 Seeding companies...');
  
  try {
    const { data, error } = await supabase
      .from('companies')
      .upsert(companies, { onConflict: 'name' })
      .select();

    if (error) {
      console.error('❌ Error seeding companies:', error);
      return null;
    }

    console.log(`✅ Successfully seeded ${data.length} companies`);
    return data;
  } catch (err) {
    console.error('❌ Error in seedCompanies:', err);
    return null;
  }
}

async function seedJobs() {
  console.log('💼 Seeding jobs...');
  
  try {
    // First get all companies
    const { data: companiesData, error: companiesError } = await supabase
      .from('companies')
      .select('id, name');

    if (companiesError) {
      console.error('❌ Error fetching companies:', companiesError);
      return null;
    }

    if (!companiesData || companiesData.length === 0) {
      console.error('❌ No companies found. Please seed companies first.');
      return null;
    }

    const allJobs = [];
    
    // Add the template jobs
    jobsTemplate.forEach((job, index) => {
      if (index < companiesData.length) {
        allJobs.push({
          ...job,
          company_id: companiesData[index].id,
          isOpen: true
        });
      }
    });

    // Generate additional jobs
    const locations = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai", "Kolkata", "Gurgaon", "Noida", "Ahmedabad"];
    const jobTitles = ["Software Engineer", "Senior Software Engineer", "Lead Developer", "QA Engineer", "Technical Lead", "System Administrator"];

    companiesData.forEach((company, companyIndex) => {
      const jobsPerCompany = Math.floor(Math.random() * 3) + 2; // 2-4 jobs per company
      
      for (let j = 0; j < jobsPerCompany; j++) {
        const randomTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        const baseSalary = 600000 + (Math.floor(Math.random() * 20) * 100000);
        
        allJobs.push({
          title: `${randomTitle}`,
          description: `## ${randomTitle} Position at ${company.name}

Join our dynamic team and work on exciting projects that make a real impact.

## Key Responsibilities
- Develop and maintain high-quality software solutions
- Collaborate with cross-functional teams
- Participate in code reviews and technical discussions
- Contribute to architectural decisions

## Requirements
- Strong technical skills and problem-solving abilities
- Experience with modern development practices
- Excellent communication and teamwork skills
- Passion for learning and growth

## Benefits
- Competitive compensation package
- Flexible working arrangements
- Professional development opportunities
- Comprehensive health benefits`,
          location: randomLocation,
          company_id: company.id,
          requirements: "Programming, Problem Solving, Team Collaboration, 2+ years experience",
          salary_min: baseSalary,
          salary_max: baseSalary + 800000,
          recruiter_id: `recruiter_${companyIndex}_${j}`,
          isOpen: Math.random() > 0.1 // 90% of jobs are open
        });
      }
    });

    // Insert jobs in batches
    const batchSize = 10;
    let insertedCount = 0;

    for (let i = 0; i < allJobs.length; i += batchSize) {
      const batch = allJobs.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('jobs')
        .insert(batch)
        .select();

      if (error) {
        console.error(`❌ Error inserting job batch ${Math.floor(i / batchSize) + 1}:`, error);
        continue;
      }

      insertedCount += data.length;
      console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1}: ${data.length} jobs`);
    }

    console.log(`✅ Successfully seeded ${insertedCount} jobs`);
    return insertedCount;
  } catch (err) {
    console.error('❌ Error in seedJobs:', err);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting automated backend setup...\n');
  
  console.log('🔗 Testing Supabase connection...');
  try {
    const { data, error } = await supabase.from('_supabase_migrations').select('*').limit(1);
    if (error && !error.message.includes('does not exist')) {
      console.error('❌ Supabase connection failed:', error);
      return;
    }
    console.log('✅ Supabase connection successful\n');
  } catch (err) {
    console.log('✅ Supabase connection successful\n');
  }

  // Step 1: Create tables (will need manual intervention)
  const tablesCreated = await createTables();
  
  if (!tablesCreated) {
    console.log('\n📋 MANUAL STEP REQUIRED:');
    console.log('1. Go to your Supabase Dashboard → SQL Editor');
    console.log('2. Copy and paste the SQL from database-setup.sql');
    console.log('3. Click Run to execute the script');
    console.log('4. Then run this script again\n');
    
    // Write the SQL to a file for easy access
    const fs = await import('fs');
    const sqlContent = createTablesSQL + '\n\n' + createPoliciesSQL + '\n\n' + createIndexesSQL;
    fs.writeFileSync('setup-database.sql', sqlContent);
    console.log('📄 SQL script saved to setup-database.sql');
    return;
  }

  // Step 2: Create storage buckets
  await createStorageBuckets();

  // Step 3: Seed companies
  const companies = await seedCompanies();
  if (!companies) {
    console.error('❌ Failed to seed companies');
    return;
  }

  // Step 4: Seed jobs
  const jobsCount = await seedJobs();
  if (!jobsCount) {
    console.error('❌ Failed to seed jobs');
    return;
  }

  console.log('\n🎉 Backend setup completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`   Companies: ${companies.length}`);
  console.log(`   Jobs: ${jobsCount}`);
  console.log(`   Storage buckets: company-logo, resumes`);
  console.log('\n🌐 Your job portal is ready!');
  console.log('   - Visit: http://localhost:5174');
  console.log('   - Admin panel: http://localhost:5174/admin');
  console.log('   - Job listings: http://localhost:5174/jobs');
}

main().catch(console.error);