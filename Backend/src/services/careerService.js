import Career from '../models/Career.js';
import { ApiError } from '../utils/apiError.js';

/**
 * Helper to slugify career titles
 * @param {string} title 
 * @returns {string}
 */
export const slugifyTitle = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Comprehensive multi-sector career catalog
 * Covers technology, finance, sales, management, design, and education careers
 */
const DEFAULT_CAREERS = [
  // ================= TECHNOLOGY SECTOR =================
  {
    title: 'Full Stack Developer',
    slug: 'full-stack-developer',
    sector: 'Technology',
    description: 'Designs and builds complete web applications across both frontend user interfaces and backend server architectures, databases, and APIs.',
    requiredTechnicalSkills: [
      { name: 'JavaScript', importance: 'Core', weight: 2 },
      { name: 'React', importance: 'Core', weight: 2 },
      { name: 'Node.js', importance: 'Core', weight: 2 },
      { name: 'Express', importance: 'Core', weight: 1.5 },
      { name: 'MongoDB', importance: 'Core', weight: 1.5 },
      { name: 'HTML', importance: 'Core', weight: 1 },
      { name: 'CSS', importance: 'Core', weight: 1 },
      { name: 'Git', importance: 'Preferred', weight: 1 },
      { name: 'REST APIs', importance: 'Core', weight: 1.5 },
      { name: 'TypeScript', importance: 'Preferred', weight: 1 },
      { name: 'SQL', importance: 'Preferred', weight: 1 },
    ],
    requiredSoftSkills: ['Problem Solving', 'Communication', 'Teamwork', 'Adaptability'],
    requiredQualifications: ['Bachelor degree in Computer Science, IT, BCA, MCA, or related STEM engineering field'],
    suggestedNextSteps: [
      'Build and deploy a full-stack MERN or PERN application on a cloud provider.',
      'Implement secure user authentication with JWT and role-based permissions.',
      'Contribute to open-source full-stack repositories on GitHub.',
    ],
    industryDemand: 'Very High',
    averageSalaryRange: { min: 500000, max: 1400000, currency: 'INR' },
    experienceLevel: 'Entry Level',
  },
  {
    title: 'Frontend Developer',
    slug: 'frontend-developer',
    sector: 'Technology',
    description: 'Specializes in creating engaging, responsive, and accessible client-side web and mobile user interfaces with modern frameworks.',
    requiredTechnicalSkills: [
      { name: 'JavaScript', importance: 'Core', weight: 2 },
      { name: 'React', importance: 'Core', weight: 2 },
      { name: 'HTML', importance: 'Core', weight: 1.5 },
      { name: 'CSS', importance: 'Core', weight: 1.5 },
      { name: 'TypeScript', importance: 'Preferred', weight: 1.5 },
      { name: 'Tailwind CSS', importance: 'Preferred', weight: 1 },
      { name: 'Git', importance: 'Preferred', weight: 1 },
      { name: 'Responsive Design', importance: 'Core', weight: 1 },
    ],
    requiredSoftSkills: ['Attention to Detail', 'Creativity', 'Communication', 'Empathy'],
    requiredQualifications: ['Bachelor degree in Computer Science, IT, BCA or equivalent portfolio experience'],
    suggestedNextSteps: [
      'Master responsive layout techniques and CSS Grid/Flexbox.',
      'Build 3 production-grade React/Next.js UI clones with smooth animations and state management.',
      'Learn Core Web Vitals and frontend performance optimization.',
    ],
    industryDemand: 'High',
    averageSalaryRange: { min: 450000, max: 1200000, currency: 'INR' },
    experienceLevel: 'Entry Level',
  },
  {
    title: 'Backend Developer',
    slug: 'backend-developer',
    sector: 'Technology',
    description: 'Architects robust server-side business logic, microservices, databases, authentication pipelines, and high-throughput REST/GraphQL APIs.',
    requiredTechnicalSkills: [
      { name: 'Node.js', importance: 'Core', weight: 2 },
      { name: 'Express', importance: 'Core', weight: 1.5 },
      { name: 'Python', importance: 'Preferred', weight: 1.5 },
      { name: 'Java', importance: 'Preferred', weight: 1.5 },
      { name: 'MongoDB', importance: 'Core', weight: 1.5 },
      { name: 'PostgreSQL', importance: 'Core', weight: 1.5 },
      { name: 'REST APIs', importance: 'Core', weight: 2 },
      { name: 'Redis', importance: 'Preferred', weight: 1 },
      { name: 'Docker', importance: 'Preferred', weight: 1 },
    ],
    requiredSoftSkills: ['Analytical Thinking', 'Problem Solving', 'Debugging', 'Collaboration'],
    requiredQualifications: ['Bachelor degree in Computer Science, Information Technology, MCA, or related discipline'],
    suggestedNextSteps: [
      'Design normalized and NoSQL database schemas with indexing and query optimization.',
      'Implement rate-limiting, OAuth2, and caching using Redis.',
      'Deploy containerized backend microservices using Docker.',
    ],
    industryDemand: 'Very High',
    averageSalaryRange: { min: 550000, max: 1500000, currency: 'INR' },
    experienceLevel: 'Entry Level',
  },
  {
    title: 'Data Analyst',
    slug: 'data-analyst',
    sector: 'Technology',
    description: 'Collects, cleans, analyzes, and visualizes complex datasets to help businesses and institutions make evidence-based strategic decisions.',
    requiredTechnicalSkills: [
      { name: 'SQL', importance: 'Core', weight: 2 },
      { name: 'Python', importance: 'Core', weight: 2 },
      { name: 'Excel', importance: 'Core', weight: 1.5 },
      { name: 'Power BI', importance: 'Preferred', weight: 1.5 },
      { name: 'Tableau', importance: 'Preferred', weight: 1.5 },
      { name: 'Pandas', importance: 'Core', weight: 1.5 },
      { name: 'Data Visualization', importance: 'Core', weight: 1 },
      { name: 'Statistics', importance: 'Core', weight: 1 },
    ],
    requiredSoftSkills: ['Critical Thinking', 'Business Acumen', 'Data Storytelling', 'Communication'],
    requiredQualifications: ['Bachelor degree in Computer Science, Statistics, Mathematics, Economics, or Engineering'],
    suggestedNextSteps: [
      'Analyze real-world Kaggle datasets and publish interactive exploratory data analysis (EDA) notebooks.',
      'Create interactive executive dashboards in Power BI or Tableau.',
      'Master advanced SQL queries (window functions, subqueries, CTEs).',
    ],
    industryDemand: 'High',
    averageSalaryRange: { min: 400000, max: 1000000, currency: 'INR' },
    experienceLevel: 'Entry Level',
  },
  {
    title: 'Data Scientist',
    slug: 'data-scientist',
    sector: 'Technology',
    description: 'Applies statistical modeling, predictive algorithms, and machine learning techniques to extract deep insights and create predictive models from large data.',
    requiredTechnicalSkills: [
      { name: 'Python', importance: 'Core', weight: 2 },
      { name: 'SQL', importance: 'Core', weight: 1.5 },
      { name: 'Machine Learning', importance: 'Core', weight: 2 },
      { name: 'Pandas', importance: 'Core', weight: 1.5 },
      { name: 'NumPy', importance: 'Core', weight: 1 },
      { name: 'Scikit-learn', importance: 'Core', weight: 1.5 },
      { name: 'Statistics', importance: 'Core', weight: 1.5 },
      { name: 'R', importance: 'Preferred', weight: 1 },
      { name: 'Deep Learning', importance: 'Preferred', weight: 1 },
    ],
    requiredSoftSkills: ['Curiosity', 'Research Mindset', 'Mathematical Intuition', 'Problem Solving'],
    requiredQualifications: ['Bachelor or Master degree in Computer Science, Data Science, Mathematics, or AI'],
    suggestedNextSteps: [
      'Implement end-to-end regression, classification, and clustering projects.',
      'Learn feature engineering and cross-validation methodologies.',
      'Complete a Kaggle competition and share structured code on GitHub.',
    ],
    industryDemand: 'Very High',
    averageSalaryRange: { min: 650000, max: 1600000, currency: 'INR' },
    experienceLevel: 'Entry Level',
  },
  {
    title: 'AI/ML Engineer',
    slug: 'ai-ml-engineer',
    sector: 'Technology',
    description: 'Develops, trains, fine-tunes, and deploys scalable machine learning and deep learning models into production software systems.',
    requiredTechnicalSkills: [
      { name: 'Python', importance: 'Core', weight: 2 },
      { name: 'PyTorch', importance: 'Core', weight: 2 },
      { name: 'TensorFlow', importance: 'Preferred', weight: 1.5 },
      { name: 'Machine Learning', importance: 'Core', weight: 2 },
      { name: 'Deep Learning', importance: 'Core', weight: 1.5 },
      { name: 'NLP', importance: 'Preferred', weight: 1 },
      { name: 'Docker', importance: 'Preferred', weight: 1 },
      { name: 'MLOps', importance: 'Preferred', weight: 1 },
      { name: 'FastAPI', importance: 'Preferred', weight: 1 },
    ],
    requiredSoftSkills: ['Problem Solving', 'Algorithm Design', 'Continuous Learning', 'Collaboration'],
    requiredQualifications: ['Bachelor or Master degree in Computer Science, Artificial Intelligence, or Data Engineering'],
    suggestedNextSteps: [
      'Build and train PyTorch deep learning neural network models.',
      'Deploy an ML inference model as a microservice using FastAPI and Docker.',
      'Explore fine-tuning open-source LLMs and embedding models.',
    ],
    industryDemand: 'Very High',
    averageSalaryRange: { min: 700000, max: 1800000, currency: 'INR' },
    experienceLevel: 'Entry Level',
  },
  {
    title: 'Cloud Engineer',
    slug: 'cloud-engineer',
    sector: 'Technology',
    description: 'Designs, provisions, secures, and maintains cloud infrastructure and automated CI/CD pipelines across AWS, Azure, and Google Cloud.',
    requiredTechnicalSkills: [
      { name: 'AWS', importance: 'Core', weight: 2 },
      { name: 'Linux', importance: 'Core', weight: 1.5 },
      { name: 'Docker', importance: 'Core', weight: 1.5 },
      { name: 'Kubernetes', importance: 'Preferred', weight: 1.5 },
      { name: 'CI/CD', importance: 'Core', weight: 1 },
      { name: 'Terraform', importance: 'Preferred', weight: 1 },
      { name: 'Python', importance: 'Preferred', weight: 1 },
      { name: 'Bash', importance: 'Core', weight: 1 },
      { name: 'Networking', importance: 'Core', weight: 1 },
    ],
    requiredSoftSkills: ['Systematic Troubleshooting', 'Reliability', 'Collaboration', 'Documentation'],
    requiredQualifications: ['Bachelor degree in Computer Science, Information Technology, or Cloud certifications'],
    suggestedNextSteps: [
      'Earn AWS Certified Solutions Architect Associate or Cloud Practitioner certification.',
      'Deploy containerized applications with automated GitHub Actions CI/CD.',
      'Learn Infrastructure as Code (IaC) with Terraform.',
    ],
    industryDemand: 'Very High',
    averageSalaryRange: { min: 550000, max: 1500000, currency: 'INR' },
    experienceLevel: 'Entry Level',
  },
  {
    title: 'Cybersecurity Analyst',
    slug: 'cybersecurity-analyst',
    sector: 'Technology',
    description: 'Protects computer networks, systems, cloud platforms, and confidential data against security breaches, malicious attacks, and unauthorized access.',
    requiredTechnicalSkills: [
      { name: 'Network Security', importance: 'Core', weight: 2 },
      { name: 'Linux', importance: 'Core', weight: 1.5 },
      { name: 'Python', importance: 'Preferred', weight: 1 },
      { name: 'Vulnerability Assessment', importance: 'Core', weight: 1.5 },
      { name: 'Ethical Hacking', importance: 'Preferred', weight: 1 },
      { name: 'SIEM', importance: 'Preferred', weight: 1 },
      { name: 'Cryptography', importance: 'Core', weight: 1 },
      { name: 'Wireshark', importance: 'Preferred', weight: 1 },
    ],
    requiredSoftSkills: ['Integrity', 'Analytical Thinking', 'Crisis Management', 'Communication'],
    requiredQualifications: ['Bachelor degree in Computer Science, Cyber Security, IT, or CompTIA Security+ / CEH'],
    suggestedNextSteps: [
      'Practice on cybersecurity labs (TryHackMe, Hack The Box).',
      'Learn packet analysis with Wireshark and network security fundamentals.',
      'Prepare for entry-level security certifications such as CompTIA Security+.',
    ],
    industryDemand: 'High',
    averageSalaryRange: { min: 500000, max: 1300000, currency: 'INR' },
    experienceLevel: 'Entry Level',
  },
  {
    title: 'UI/UX Designer',
    slug: 'ui-ux-designer',
    sector: 'Design & Creative',
    description: 'Conducts user research, creates wireframes, prototypes, and designs intuitive, user-centric visual interfaces and user experiences for digital products.',
    requiredTechnicalSkills: [
      { name: 'Figma', importance: 'Core', weight: 2 },
      { name: 'Wireframing', importance: 'Core', weight: 2 },
      { name: 'Prototyping', importance: 'Core', weight: 1.5 },
      { name: 'User Research', importance: 'Core', weight: 1.5 },
      { name: 'HTML', importance: 'Preferred', weight: 1 },
      { name: 'CSS', importance: 'Preferred', weight: 1 },
      { name: 'Design Systems', importance: 'Core', weight: 1 },
      { name: 'Usability Testing', importance: 'Core', weight: 1 },
    ],
    requiredSoftSkills: ['Empathy', 'Communication', 'Visual Storytelling', 'Collaboration'],
    requiredQualifications: ['Bachelor degree in Design, Computer Science, Human-Computer Interaction, or strong design portfolio'],
    suggestedNextSteps: [
      'Build a design portfolio with at least 2 in-depth case studies solving real user problems.',
      'Master auto-layout, component variants, and interactive prototyping in Figma.',
      'Conduct usability tests and iterate on user feedback.',
    ],
    industryDemand: 'High',
    averageSalaryRange: { min: 450000, max: 1200000, currency: 'INR' },
    experienceLevel: 'Entry Level',
  },

  // ================= FINANCE & BANKING SECTOR =================
  {
    title: 'Financial Analyst',
    slug: 'financial-analyst',
    sector: 'Finance & Banking',
    description: 'Evaluates investment opportunities, analyzes corporate financial statements, builds forecasting models, and provides strategic financial guidance.',
    requiredTechnicalSkills: [
      { name: 'Financial Modeling', importance: 'Core', weight: 2 },
      { name: 'Excel', importance: 'Core', weight: 2 },
      { name: 'Financial Analysis', importance: 'Core', weight: 2 },
      { name: 'Accounting', importance: 'Core', weight: 1.5 },
      { name: 'Valuation', importance: 'Core', weight: 1.5 },
      { name: 'SQL', importance: 'Preferred', weight: 1 },
      { name: 'Power BI', importance: 'Preferred', weight: 1 },
      { name: 'Corporate Finance', importance: 'Core', weight: 1.5 },
    ],
    requiredSoftSkills: ['Analytical Thinking', 'Attention to Detail', 'Quantitative Reasoning', 'Communication'],
    requiredQualifications: ['Bachelor degree in Commerce (B.Com), Economics, BBA (Finance), MBA, or CFA / CA aspirants'],
    suggestedNextSteps: [
      'Master 3-statement financial modeling and discounted cash flow (DCF) valuation in Excel.',
      'Earn certifications such as CFI FMVA or prepare for CFA Level 1.',
      'Analyze quarterly financial reports and balance sheets of publicly traded companies.',
    ],
    industryDemand: 'High',
    averageSalaryRange: { min: 450000, max: 1200000, currency: 'INR' },
    experienceLevel: 'Entry Level',
  },
  {
    title: 'Investment Banking Analyst',
    slug: 'investment-banking-analyst',
    sector: 'Finance & Banking',
    description: 'Assists with mergers & acquisitions (M&A), equity/debt capital raising, corporate valuations, pitch decks, and financial due diligence.',
    requiredTechnicalSkills: [
      { name: 'DCF Modeling', importance: 'Core', weight: 2 },
      { name: 'Financial Modeling', importance: 'Core', weight: 2 },
      { name: 'Company Valuation', importance: 'Core', weight: 2 },
      { name: 'Mergers & Acquisitions', importance: 'Core', weight: 1.5 },
      { name: 'Excel', importance: 'Core', weight: 2 },
      { name: 'Pitch Books', importance: 'Preferred', weight: 1 },
      { name: 'Corporate Finance', importance: 'Core', weight: 1.5 },
    ],
    requiredSoftSkills: ['High Stress Tolerance', 'Work Ethic', 'Client Presentation', 'Negotiation'],
    requiredQualifications: ['Top-tier Bachelor or Master degree in Finance, Economics, Commerce, Engineering, or CFA'],
    suggestedNextSteps: [
      'Build comprehensive LBO and M&A transaction models.',
      'Read financial newspapers (The Economic Times, Wall Street Journal) daily to track deal activity.',
      'Participate in national investment banking and equity research case competitions.',
    ],
    industryDemand: 'Very High',
    averageSalaryRange: { min: 800000, max: 2200000, currency: 'INR' },
    experienceLevel: 'Entry Level',
  },
  {
    title: 'Accountant',
    slug: 'accountant',
    sector: 'Finance & Banking',
    description: 'Maintains financial records, prepares statements, supports tax compliance, and helps organizations make accurate financial decisions.',
    requiredTechnicalSkills: [
      { name: 'Accounting', importance: 'Core', weight: 2 },
      { name: 'Financial Reporting', importance: 'Core', weight: 2 },
      { name: 'Taxation', importance: 'Core', weight: 1.5 },
      { name: 'Excel', importance: 'Core', weight: 1.5 },
      { name: 'Bookkeeping', importance: 'Preferred', weight: 1 },
    ],
    requiredSoftSkills: ['Attention to Detail', 'Integrity', 'Organization', 'Communication'],
    requiredQualifications: ['Bachelor degree in Accounting, Commerce, Finance, or a related discipline'],
    suggestedNextSteps: [
      'Practice preparing balance sheets, income statements, and cash-flow statements.',
      'Build proficiency in Excel and accounting software used by local employers.',
      'Learn the tax and compliance requirements relevant to your intended industry.',
    ],
    industryDemand: 'High',
    averageSalaryRange: { min: 300000, max: 800000, currency: 'INR' },
    experienceLevel: 'Entry Level',
  },
  {
    title: 'Teacher',
    slug: 'teacher',
    sector: 'Education & Training',
    description: 'Plans lessons, teaches a subject to learners, assesses progress, and adapts instruction to support different learning needs.',
    requiredTechnicalSkills: [
      { name: 'Subject Knowledge', importance: 'Core', weight: 2 },
      { name: 'Lesson Planning', importance: 'Core', weight: 2 },
      { name: 'Classroom Management', importance: 'Core', weight: 1.5 },
      { name: 'Educational Technology', importance: 'Preferred', weight: 1 },
    ],
    requiredSoftSkills: ['Communication', 'Patience', 'Empathy', 'Organization'],
    requiredQualifications: ['Bachelor degree in the subject area; teaching qualification requirements vary by school and region'],
    suggestedNextSteps: [
      'Choose a subject and learner age group, then prepare a short sample lesson.',
      'Practice explaining a topic clearly and checking learner understanding.',
      'Research teaching qualification and certification requirements in your region.',
    ],
    industryDemand: 'High',
    averageSalaryRange: { min: 300000, max: 700000, currency: 'INR' },
    experienceLevel: 'Entry Level',
  },

  // ================= SALES & MARKETING SECTOR =================
  {
    title: 'Tech Sales & Business Development Representative',
    slug: 'tech-sales-bdr',
    sector: 'Sales & Marketing',
    description: 'Drives revenue growth by identifying, qualifying, and engaging prospective B2B clients, pitching software solutions, and closing contracts.',
    requiredTechnicalSkills: [
      { name: 'CRM (Salesforce/HubSpot)', importance: 'Core', weight: 2 },
      { name: 'Lead Generation', importance: 'Core', weight: 2 },
      { name: 'Sales Pipeline Management', importance: 'Core', weight: 1.5 },
      { name: 'Cold Outreach', importance: 'Core', weight: 1.5 },
      { name: 'Product Demonstrations', importance: 'Core', weight: 1.5 },
      { name: 'LinkedIn Sales Navigator', importance: 'Preferred', weight: 1 },
      { name: 'Email Campaign Management', importance: 'Preferred', weight: 1 },
    ],
    requiredSoftSkills: ['Persuasion', 'Active Listening', 'Relationship Building', 'Resilience', 'Verbal Communication'],
    requiredQualifications: ['Bachelor degree in any discipline (BBA, B.Com, B.A, B.Tech) with strong communication skills'],
    suggestedNextSteps: [
      'Learn Hubspot or Salesforce Inbound Sales methodology and certifications.',
      'Practice mock sales pitches, cold-calling scripts, and objection-handling techniques.',
      'Build a strong personal LinkedIn presence targeting B2B industry leaders.',
    ],
    industryDemand: 'Very High',
    averageSalaryRange: { min: 450000, max: 1300000, currency: 'INR' },
    experienceLevel: 'Entry Level',
  },
  {
    title: 'Digital Marketing Specialist',
    slug: 'digital-marketing-specialist',
    sector: 'Sales & Marketing',
    description: 'Plans, executes, and optimizes digital customer acquisition campaigns across search engines (SEO/SEM), social media, email, and content funnels.',
    requiredTechnicalSkills: [
      { name: 'SEO', importance: 'Core', weight: 2 },
      { name: 'Google Analytics (GA4)', importance: 'Core', weight: 2 },
      { name: 'Performance Marketing (PPC)', importance: 'Core', weight: 2 },
      { name: 'Meta Ads', importance: 'Core', weight: 1.5 },
      { name: 'Content Strategy', importance: 'Core', weight: 1.5 },
      { name: 'Email Marketing', importance: 'Preferred', weight: 1 },
      { name: 'Copywriting', importance: 'Core', weight: 1.5 },
    ],
    requiredSoftSkills: ['Creativity', 'Commercial Awareness', 'Adaptability', 'Storytelling'],
    requiredQualifications: ['Bachelor degree in Marketing, Mass Communication, Business, or verified Google/Meta certifications'],
    suggestedNextSteps: [
      'Complete Google Analytics (GA4) and Google Ads search certifications.',
      'Run a live content blog or social media growth experiment documenting real ROI.',
      'Master copywriting and conversion rate optimization (CRO) principles.',
    ],
    industryDemand: 'High',
    averageSalaryRange: { min: 380000, max: 950000, currency: 'INR' },
    experienceLevel: 'Entry Level',
  },

  // ================= BUSINESS & MANAGEMENT SECTOR =================
  {
    title: 'Business Analyst',
    slug: 'business-analyst',
    sector: 'Business & Management',
    description: 'Bridges the gap between business stakeholders and technical teams by analyzing workflows, documenting requirements, and evaluating systems.',
    requiredTechnicalSkills: [
      { name: 'Requirements Gathering', importance: 'Core', weight: 2 },
      { name: 'Process Modeling (BPMN)', importance: 'Core', weight: 1.5 },
      { name: 'Data Analysis', importance: 'Core', weight: 1.5 },
      { name: 'SQL', importance: 'Core', weight: 1.5 },
      { name: 'Agile/Scrum', importance: 'Core', weight: 1.5 },
      { name: 'Jira', importance: 'Preferred', weight: 1 },
      { name: 'Excel', importance: 'Core', weight: 1.5 },
    ],
    requiredSoftSkills: ['Stakeholder Management', 'Critical Thinking', 'Problem Solving', 'Facilitation'],
    requiredQualifications: ['Bachelor degree in Business, Management, IT, Engineering, Economics, or MBA'],
    suggestedNextSteps: [
      'Learn User Story writing and Business Requirements Document (BRD) creation.',
      'Complete the IIBA Entry Certificate in Business Analysis (ECBA).',
      'Practice process flow charting in Lucidchart or Miro.',
    ],
    industryDemand: 'Very High',
    averageSalaryRange: { min: 500000, max: 1300000, currency: 'INR' },
    experienceLevel: 'Entry Level',
  },
  {
    title: 'Product Manager',
    slug: 'product-manager',
    sector: 'Business & Management',
    description: 'Guides the vision, execution, and launch of digital products by aligning customer needs, business goals, and engineering velocity.',
    requiredTechnicalSkills: [
      { name: 'Product Strategy', importance: 'Core', weight: 2 },
      { name: 'User Research', importance: 'Core', weight: 1.5 },
      { name: 'Roadmapping', importance: 'Core', weight: 1.5 },
      { name: 'A/B Testing', importance: 'Preferred', weight: 1 },
      { name: 'Agile/Scrum', importance: 'Core', weight: 1.5 },
      { name: 'Product Analytics (Mixpanel/Amplitude)', importance: 'Preferred', weight: 1 },
      { name: 'Wireframing', importance: 'Preferred', weight: 1 },
    ],
    requiredSoftSkills: ['Leadership', 'Strategic Thinking', 'Prioritization', 'Cross-functional Communication'],
    requiredQualifications: ['Bachelor or Master degree in Engineering, Business, Design, or MBA'],
    suggestedNextSteps: [
      'Conduct a product teardown of a popular app and present improvements in a slide deck.',
      'Learn product metrics (CAC, LTV, Retention, Churn, NPS).',
      'Build a simple product prototype and measure user feedback.',
    ],
    industryDemand: 'Very High',
    averageSalaryRange: { min: 750000, max: 2000000, currency: 'INR' },
    experienceLevel: 'Entry Level',
  },
];

/**
 * Seed default careers if collection is empty or missing entries
 */
export const seedDefaultCareers = async () => {
  for (const careerData of DEFAULT_CAREERS) {
    const slug = careerData.slug || slugifyTitle(careerData.title);
    await Career.findOneAndUpdate(
      { title: careerData.title },
      {
        $set: {
          ...careerData,
          slug,
        },
      },
      { upsert: true, returnDocument: 'after' }
    );
  }
};

/**
 * Get all active careers with optional filtering by sector, keyword, and demand
 * @param {object} query 
 */
export const getAllCareers = async (query = {}) => {
  // Ensure default careers exist in database
  const count = await Career.countDocuments();
  if (count < DEFAULT_CAREERS.length) {
    await seedDefaultCareers();
  }

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const filter = { isActive: true };

  if (query.sector) {
    filter.sector = new RegExp(`^${query.sector.trim()}$`, 'i');
  }

  if (query.search) {
    const searchRegex = new RegExp(query.search.trim(), 'i');
    filter.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { sector: searchRegex },
      { 'requiredTechnicalSkills.name': searchRegex },
    ];
  }

  if (query.demand) {
    filter.industryDemand = query.demand;
  }

  const total = await Career.countDocuments(filter);
  const items = await Career.find(filter)
    .sort({ sector: 1, title: 1 })
    .skip(skip)
    .limit(limit);

  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Get single career by ID or Slug
 * @param {string} idOrSlug 
 */
export const getCareerById = async (idOrSlug) => {
  let career;
  if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    career = await Career.findById(idOrSlug);
  }
  if (!career) {
    career = await Career.findOne({ slug: idOrSlug.toLowerCase() });
  }

  if (!career) {
    throw ApiError.notFound(`Career not found for '${idOrSlug}'`);
  }

  return career;
};
