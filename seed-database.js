// Simple database seeding script
// Run this with: node seed-database.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample companies data
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

// Sample jobs data
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

// Additional job titles and locations for variety
const additionalJobTitles = [
  "Software Engineer",
  "Senior Software Engineer", 
  "Lead Developer",
  "Machine Learning Engineer",
  "Quality Assurance Engineer",
  "Cybersecurity Specialist",
  "Cloud Architect",
  "Database Administrator"
];

const locations = [
  "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai",
  "Kolkata", "Ahmedabad", "Jaipur", "Kochi", "Gurgaon", "Noida"
];

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

    // Generate additional random jobs
    for (let i = 0; i < companiesData.length; i++) {
      const company = companiesData[i];
      const jobsPerCompany = Math.floor(Math.random() * 3) + 2; // 2-4 jobs per company
      
      for (let j = 0; j < jobsPerCompany; j++) {
        const randomTitle = additionalJobTitles[Math.floor(Math.random() * additionalJobTitles.length)];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        const baseSalary = 600000 + (Math.floor(Math.random() * 20) * 100000);
        
        allJobs.push({
          title: `${randomTitle} at ${company.name}`,
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
          recruiter_id: `recruiter_${i}_${j}`,
          isOpen: Math.random() > 0.1 // 90% of jobs are open
        });
      }
    }

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

async function checkTables() {
  console.log('🔍 Checking database tables...');
  
  try {
    // Check if companies table exists and has data
    const { data: companiesData, error: companiesError } = await supabase
      .from('companies')
      .select('count(*)')
      .single();

    if (companiesError) {
      console.error('❌ Companies table error:', companiesError);
      console.log('💡 You may need to run the database-setup.sql script first');
      return false;
    }

    // Check if jobs table exists
    const { data: jobsData, error: jobsError } = await supabase
      .from('jobs')
      .select('count(*)')
      .single();

    if (jobsError) {
      console.error('❌ Jobs table error:', jobsError);
      console.log('💡 You may need to run the database-setup.sql script first');
      return false;
    }

    console.log('✅ Database tables are accessible');
    return true;
  } catch (err) {
    console.error('❌ Error checking tables:', err);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting database seeding...\n');
  
  // Check if tables exist
  const tablesExist = await checkTables();
  if (!tablesExist) {
    console.log('\n❌ Database tables not found or not accessible.');
    console.log('📋 Please follow these steps:');
    console.log('1. Go to your Supabase project dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run the contents of database-setup.sql');
    console.log('4. Create storage buckets: company-logo, resumes');
    console.log('5. Run this script again');
    return;
  }

  // Seed companies
  const companies = await seedCompanies();
  if (!companies) {
    console.error('❌ Failed to seed companies');
    return;
  }

  // Seed jobs
  const jobsCount = await seedJobs();
  if (!jobsCount) {
    console.error('❌ Failed to seed jobs');
    return;
  }

  console.log('\n🎉 Database seeding completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`   Companies: ${companies.length}`);
  console.log(`   Jobs: ${jobsCount}`);
  console.log('\n🌐 You can now visit your application and see the jobs!');
  console.log('   - Job listings: http://localhost:5174/jobs');
  console.log('   - Admin panel: http://localhost:5174/admin');
}

main().catch(console.error);