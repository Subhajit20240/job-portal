-- Job Portal Database Schema and Sample Data
-- Run this in your Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE IF EXISTS companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS saved_jobs ENABLE ROW LEVEL SECURITY;

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

-- Insert Sample Companies
INSERT INTO companies (name, logo_url) VALUES
('Amazon', '/companies/amazon.svg'),
('Google', '/companies/google.webp'),
('Microsoft', '/companies/microsoft.webp'),
('Meta', '/companies/meta.svg'),
('Apple', '/companies/apple.svg'),
('Netflix', '/companies/netflix.png'),
('Uber', '/companies/uber.svg'),
('Atlassian', '/companies/atlassian.svg'),
('IBM', '/companies/ibm.svg'),
('Tesla', '/companies/tesla.svg'),
('Spotify', '/companies/spotify.svg'),
('Adobe', '/companies/adobe.svg')
ON CONFLICT (name) DO NOTHING;

-- Insert Sample Jobs
INSERT INTO jobs (title, description, location, company_id, recruiter_id, requirements, salary_min, salary_max, isOpen) VALUES
('Senior Software Engineer', 
 '## About the Role
 
We are looking for a Senior Software Engineer to join our dynamic team. You will be responsible for designing, developing, and maintaining scalable web applications.

## Responsibilities
- Design and develop high-quality software solutions
- Collaborate with cross-functional teams
- Mentor junior developers
- Participate in code reviews and technical discussions

## What We Offer
- Competitive salary and benefits
- Flexible working arrangements
- Professional development opportunities
- Modern tech stack and tools', 
 'Bangalore', 1, 'recruiter_1', 
 'React, Node.js, TypeScript, AWS, 5+ years experience', 
 1200000, 2000000, true),

('Frontend Developer', 
 '## Join Our Frontend Team
 
We are seeking a talented Frontend Developer to create amazing user experiences for millions of users worldwide.

## Key Responsibilities
- Build responsive and interactive web applications
- Collaborate with designers and backend developers
- Optimize applications for maximum speed and scalability
- Stay up-to-date with emerging technologies

## Benefits
- Stock options
- Health insurance
- Learning and development budget
- Remote work flexibility', 
 'Mumbai', 2, 'recruiter_2', 
 'React, JavaScript, CSS, HTML, 3+ years experience', 
 800000, 1500000, true),

('DevOps Engineer', 
 '## DevOps Engineer Opportunity
 
Join our infrastructure team to build and maintain scalable, reliable systems that power our global platform.

## What You''ll Do
- Design and implement CI/CD pipelines
- Manage cloud infrastructure on AWS/Azure
- Monitor system performance and reliability
- Automate deployment processes

## Perks
- Cutting-edge technology stack
- Conference attendance budget
- Flexible PTO policy
- Team building events', 
 'Hyderabad', 3, 'recruiter_3', 
 'Docker, Kubernetes, AWS, Jenkins, Python, 4+ years experience', 
 1000000, 1800000, true),

('Data Scientist', 
 '## Data Science Role
 
We are looking for a Data Scientist to help us make data-driven decisions and build intelligent systems.

## Responsibilities
- Analyze large datasets to extract insights
- Build machine learning models
- Create data visualizations and reports
- Collaborate with product teams

## What We Provide
- Access to large-scale datasets
- State-of-the-art ML infrastructure
- Mentorship from senior data scientists
- Publication opportunities', 
 'Delhi', 4, 'recruiter_4', 
 'Python, SQL, Machine Learning, Statistics, 3+ years experience', 
 1100000, 1900000, true),

('Product Manager', 
 '## Product Manager Position
 
Lead product strategy and execution for our core platform used by millions of users.

## Key Areas
- Define product roadmap and strategy
- Work with engineering and design teams
- Analyze user feedback and metrics
- Drive product launches

## Benefits Package
- Equity participation
- Comprehensive health coverage
- Professional coaching
- Innovation time', 
 'Pune', 5, 'recruiter_5', 
 'Product Management, Analytics, Agile, 4+ years experience', 
 1300000, 2200000, true),

('Full Stack Developer', 
 '## Full Stack Developer Role
 
Build end-to-end solutions using modern technologies in a fast-paced startup environment.

## Tech Stack
- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express, PostgreSQL
- Cloud: AWS, Docker, Kubernetes

## Growth Opportunities
- Work on diverse projects
- Learn new technologies
- Career advancement paths
- Startup equity', 
 'Chennai', 6, 'recruiter_6', 
 'React, Node.js, PostgreSQL, MongoDB, 2+ years experience', 
 700000, 1400000, true),

('Mobile App Developer', 
 '## Mobile Developer Opportunity
 
Create amazing mobile experiences for iOS and Android platforms.

## What You''ll Build
- Native and cross-platform mobile apps
- Real-time features and notifications
- Offline-first applications
- Performance optimizations

## Company Culture
- Innovation-driven environment
- Work-life balance
- Diverse and inclusive team
- Continuous learning', 
 'Bangalore', 7, 'recruiter_7', 
 'React Native, iOS, Android, JavaScript, 3+ years experience', 
 900000, 1600000, true),

('UI/UX Designer', 
 '## UI/UX Designer Position
 
Design beautiful and intuitive user interfaces that delight our customers.

## Design Focus
- User research and testing
- Wireframing and prototyping
- Visual design and branding
- Design system development

## Creative Environment
- Modern design tools
- Collaborative design process
- User-centered approach
- Design thinking workshops', 
 'Mumbai', 8, 'recruiter_8', 
 'Figma, Sketch, Adobe Creative Suite, User Research, 2+ years experience', 
 600000, 1200000, true),

('Backend Engineer', 
 '## Backend Engineer Role
 
Build robust and scalable backend systems that power our applications.

## Technical Challenges
- Microservices architecture
- High-performance APIs
- Database optimization
- System scalability

## Engineering Culture
- Code quality focus
- Technical mentorship
- Open source contributions
- Architecture discussions', 
 'Hyderabad', 9, 'recruiter_9', 
 'Java, Spring Boot, PostgreSQL, Redis, 4+ years experience', 
 1000000, 1700000, true),

('Machine Learning Engineer', 
 '## ML Engineer Opportunity
 
Deploy machine learning models at scale and build intelligent systems.

## ML Focus Areas
- Model deployment and monitoring
- MLOps and automation
- Feature engineering
- Model optimization

## AI Innovation
- Cutting-edge ML research
- Large-scale data processing
- GPU computing resources
- Research publications', 
 'Delhi', 10, 'recruiter_10', 
 'Python, TensorFlow, PyTorch, MLOps, 3+ years experience', 
 1200000, 2000000, true),

('Quality Assurance Engineer', 
 '## QA Engineer Position
 
Ensure the quality and reliability of our software products through comprehensive testing.

## Testing Scope
- Automated testing frameworks
- Performance testing
- Security testing
- Mobile app testing

## Quality Focus
- Test-driven development
- Continuous integration
- Bug tracking and reporting
- Quality metrics', 
 'Pune', 11, 'recruiter_11', 
 'Selenium, Jest, Cypress, API Testing, 2+ years experience', 
 500000, 1000000, true),

('Cybersecurity Specialist', 
 '## Cybersecurity Role
 
Protect our systems and data from security threats and vulnerabilities.

## Security Areas
- Threat detection and response
- Security audits and assessments
- Incident response planning
- Security awareness training

## Security Excellence
- Latest security tools
- Threat intelligence
- Compliance frameworks
- Security certifications', 
 'Chennai', 12, 'recruiter_12', 
 'Network Security, Penetration Testing, CISSP, 4+ years experience', 
 1100000, 1800000, true);

-- Create Storage Buckets (Run these in Supabase Dashboard -> Storage)
-- 1. Create bucket named 'company-logo' with public access
-- 2. Create bucket named 'resumes' with authenticated access

-- Row Level Security Policies

-- Companies policies (public read, authenticated write)
CREATE POLICY "Companies are viewable by everyone" ON companies
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert companies" ON companies
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Jobs policies
CREATE POLICY "Jobs are viewable by everyone" ON jobs
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert jobs" ON jobs
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own jobs" ON jobs
    FOR UPDATE USING (auth.uid()::text = recruiter_id);

CREATE POLICY "Users can delete their own jobs" ON jobs
    FOR DELETE USING (auth.uid()::text = recruiter_id);

-- Applications policies
CREATE POLICY "Users can view applications for their jobs" ON applications
    FOR SELECT USING (
        auth.uid()::text = candidate_id OR 
        auth.uid()::text IN (
            SELECT recruiter_id FROM jobs WHERE jobs.id = applications.job_id
        )
    );

CREATE POLICY "Authenticated users can insert applications" ON applications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update applications for their jobs" ON applications
    FOR UPDATE USING (
        auth.uid()::text IN (
            SELECT recruiter_id FROM jobs WHERE jobs.id = applications.job_id
        )
    );

-- Saved jobs policies
CREATE POLICY "Users can view their own saved jobs" ON saved_jobs
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own saved jobs" ON saved_jobs
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own saved jobs" ON saved_jobs
    FOR DELETE USING (auth.uid()::text = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter_id ON jobs(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_isopen ON jobs(isOpen);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_id ON saved_jobs(job_id);