import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarLoader } from "react-spinners";
import supabaseClient from "@/utils/supabase";

const AdminPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success, error, info

  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 5000);
  };

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
    }
  ];

  const seedCompanies = async () => {
    try {
      const supabase = await supabaseClient();
      const { data, error } = await supabase
        .from('companies')
        .upsert(companies, { onConflict: 'name' })
        .select();

      if (error) {
        console.error('Error seeding companies:', error);
        return null;
      }

      return data;
    } catch (err) {
      console.error('Error in seedCompanies:', err);
      return null;
    }
  };

  const seedJobs = async () => {
    try {
      const supabase = await supabaseClient();
      
      // First get all companies
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('id, name');

      if (companiesError) {
        console.error('Error fetching companies:', companiesError);
        return null;
      }

      if (!companiesData || companiesData.length === 0) {
        console.error('No companies found. Please seed companies first.');
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
      const locations = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai", "Kolkata", "Gurgaon"];
      const jobTitles = ["Software Engineer", "Senior Software Engineer", "Lead Developer", "QA Engineer", "UI/UX Designer"];

      companiesData.forEach((company, companyIndex) => {
        const jobsPerCompany = Math.floor(Math.random() * 3) + 2; // 2-4 jobs per company
        
        for (let j = 0; j < jobsPerCompany; j++) {
          const randomTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
          const randomLocation = locations[Math.floor(Math.random() * locations.length)];
          const baseSalary = 600000 + (Math.floor(Math.random() * 20) * 100000);
          
          allJobs.push({
            title: `${randomTitle}`,
            description: `## ${randomTitle} Position

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
          console.error(`Error inserting job batch ${Math.floor(i / batchSize) + 1}:`, error);
          continue;
        }

        insertedCount += data.length;
      }

      return insertedCount;
    } catch (err) {
      console.error('Error in seedJobs:', err);
      return null;
    }
  };

  const handleSeedDatabase = async () => {
    setLoading(true);
    try {
      // Seed companies first
      const companiesResult = await seedCompanies();
      if (!companiesResult) {
        showMessage("Error seeding companies. Check console for details.", "error");
        return;
      }

      // Then seed jobs
      const jobsResult = await seedJobs();
      if (!jobsResult) {
        showMessage("Error seeding jobs. Check console for details.", "error");
        return;
      }

      showMessage(`Database seeded successfully! ${companiesResult.length} companies and ${jobsResult} jobs created.`, "success");
    } catch (error) {
      console.error("Seeding error:", error);
      showMessage("Error seeding database. Check console for details.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSeedCompanies = async () => {
    setLoading(true);
    try {
      const result = await seedCompanies();
      if (result) {
        showMessage(`Successfully seeded ${result.length} companies!`, "success");
      } else {
        showMessage("Error seeding companies. Check console for details.", "error");
      }
    } catch (error) {
      console.error("Seeding error:", error);
      showMessage("Error seeding companies. Check console for details.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSeedJobs = async () => {
    setLoading(true);
    try {
      const result = await seedJobs();
      if (result) {
        showMessage(`Successfully seeded ${result} jobs!`, "success");
      } else {
        showMessage("Error seeding jobs. Check console for details.", "error");
      }
    } catch (error) {
      console.error("Seeding error:", error);
      showMessage("Error seeding jobs. Check console for details.", "error");
    } finally {
      setLoading(false);
    }
  };

  const checkDatabase = async () => {
    setLoading(true);
    try {
      const supabase = await supabaseClient();
      
      // Check companies
      const { data: companiesData, error: companiesError } = await supabase
        .from('companies')
        .select('count(*)')
        .single();

      // Check jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('count(*)')
        .single();

      if (companiesError || jobsError) {
        showMessage("Database tables not found. Please run the SQL setup script first.", "error");
      } else {
        showMessage(`Database connected! Found ${companiesData.count} companies and ${jobsData.count} jobs.`, "success");
      }
    } catch (error) {
      console.error("Database check error:", error);
      showMessage("Error connecting to database. Check your Supabase configuration.", "error");
    } finally {
      setLoading(false);
    }
  };

  const getMessageColor = () => {
    switch (messageType) {
      case "success":
        return "text-green-600 bg-green-50 border-green-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
        
        {loading && (
          <div className="mb-6">
            <BarLoader width="100%" color="#36d7b7" />
          </div>
        )}

        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${getMessageColor()}`}>
            {message}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Database Setup Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Database Setup</CardTitle>
              <CardDescription>
                First-time setup instructions for your Supabase database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <p><strong>Step 1:</strong> Go to your Supabase project dashboard</p>
                <p><strong>Step 2:</strong> Navigate to SQL Editor</p>
                <p><strong>Step 3:</strong> Run the SQL script from <code>database-setup.sql</code></p>
                <p><strong>Step 4:</strong> Create storage buckets:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><code>company-logo</code> (public access)</li>
                  <li><code>resumes</code> (authenticated access)</li>
                </ul>
                <p><strong>Step 5:</strong> Use the buttons below to seed sample data</p>
              </div>
              <Button 
                onClick={checkDatabase} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                Check Database Connection
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Seed your database with sample data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleSeedDatabase} 
                disabled={loading}
                className="w-full"
                variant="default"
              >
                Seed Entire Database
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={handleSeedCompanies} 
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  Seed Companies
                </Button>
                
                <Button 
                  onClick={handleSeedJobs} 
                  disabled={loading}
                  variant="outline"
                  size="sm"
                >
                  Seed Jobs
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Database Schema Info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Database Schema</CardTitle>
              <CardDescription>
                Overview of the database tables and relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Tables:</h4>
                  <ul className="text-sm space-y-1">
                    <li><strong>companies</strong> - Company information and logos</li>
                    <li><strong>jobs</strong> - Job postings with details</li>
                    <li><strong>applications</strong> - Job applications from candidates</li>
                    <li><strong>saved_jobs</strong> - User's saved/bookmarked jobs</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Features:</h4>
                  <ul className="text-sm space-y-1">
                    <li>✅ Row Level Security (RLS) enabled</li>
                    <li>✅ Authentication with Clerk</li>
                    <li>✅ File storage for logos and resumes</li>
                    <li>✅ Optimized indexes for performance</li>
                    <li>✅ Comprehensive sample data</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sample Data Info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Sample Data Included</CardTitle>
              <CardDescription>
                What gets created when you seed the database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Companies (12):</h4>
                  <ul className="text-sm space-y-1">
                    <li>Amazon, Google, Microsoft</li>
                    <li>Meta, Apple, Netflix</li>
                    <li>Uber, Atlassian, IBM</li>
                    <li>Tesla, Spotify, Adobe</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Job Types:</h4>
                  <ul className="text-sm space-y-1">
                    <li>Software Engineer</li>
                    <li>Frontend/Backend Developer</li>
                    <li>DevOps Engineer</li>
                    <li>Data Scientist</li>
                    <li>Product Manager</li>
                    <li>UI/UX Designer</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Locations:</h4>
                  <ul className="text-sm space-y-1">
                    <li>Bangalore, Mumbai</li>
                    <li>Delhi, Hyderabad</li>
                    <li>Pune, Chennai</li>
                    <li>Kolkata, Gurgaon</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;