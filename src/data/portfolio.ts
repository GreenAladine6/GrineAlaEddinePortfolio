export type ProjectCategory =
  | "Web Development"
  | "AI & Machine Learning"
  | "Multi-Agent Systems"
  | "DevOps & MLOps";

export interface Project {
  id: string;
  title: string;
  summary: string;
  detail: string;
  category: ProjectCategory;
  technologies: string[];
  github?: string;
  demo?: string;
  caseStudy?: string;
  image?: string;
  featured: boolean;
  order: number;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  responsibilities?: string[];
  technologies: string[];
  website?: string;
  projectUrl?: string;
  images?: { id?: string; src: string; alt: string }[];
  order: number;
}

export interface Education {
  institution: string;
  program: string;
  startDate: string;
  endDate: string;
  location: string;
  description?: string;
}

export interface Certification {
  id?: string;
  name: string;
  organization: string;
  date?: string;
  credentialUrl?: string;
  image?: string;
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export const profile = {
  name: "Ala Eddine Grine",
  headline: "Final-year Computer Engineering Student",
  heroHeadline: "Building intelligent software. Turning ideas into impact.",
  email: "greenala139@gmail.com",
  location: "Tunis, Tunisia",
  availability: "Open to PFE Opportunities",
  github: "",
  linkedin: "",
  cv: "",
  about:
    "I enjoy turning complex ideas into practical software—from thoughtfully engineered full-stack products to AI-powered systems. My work explores reliable application architecture, multi-agent workflows, and the cloud practices that help software move confidently from concept to production.",
};

export const projects: Project[] = [
  {
    id: "student-mlops",
    title: "Student Performance MLOps Pipeline",
    summary: "An end-to-end machine learning application predicting student pass or fail outcomes.",
    detail:
      "A production-minded ML pipeline featuring automated tests, containerization, typed API validation, and continuous integration.",
    category: "DevOps & MLOps",
    technologies: ["Python", "Scikit-learn", "FastAPI", "Docker", "GitHub Actions"],
    featured: true,
    order: 1,
  },
  {
    id: "ragvengers",
    title: "RAGvengers — Multi-Agent AI System",
    summary: "A multi-agent system that analyzes Git repositories and produces structured contribution reports.",
    detail:
      "Agent workflows coordinate repository analysis and synthesize code changes into clear, structured technical reports.",
    category: "Multi-Agent Systems",
    technologies: ["Python", "FastAPI", "React", "LangGraph", "LangChain"],
    featured: true,
    order: 2,
  },
  {
    id: "marquardt-dashboard",
    title: "Marquardt KPI Dashboard",
    summary: "A full-stack dashboard for KPI visualization and project monitoring.",
    detail:
      "A focused operational interface for reviewing project indicators and monitoring performance data.",
    category: "Web Development",
    technologies: ["C#", ".NET", "React", "SQL Server"],
    featured: true,
    order: 3,
  },
  {
    id: "mbeaute",
    title: "Mbeaute Web Application",
    summary: "Web application and backend API development for data analysis and processing.",
    detail:
      "RESTful services support data processing workflows for a responsive customer-facing web experience.",
    category: "Web Development",
    technologies: ["Python", "FastAPI", "Pandas", "JavaScript"],
    demo: "https://mbeaute.tn",
    featured: false,
    order: 4,
  },
];

export const experiences: Experience[] = [
  {
    id: "marquardt",
    role: "Software Engineering Intern",
    organization: "Marquardt Automotive Tunisia",
    location: "Tunisia",
    startDate: "July 2026",
    endDate: "July 2026",
    description:
      "Developed a full-stack KPI visualization and monitoring application using C#/.NET and React.",
    technologies: ["C#", ".NET", "React", "SQL Server"],
    order: 1,
  },
  {
    id: "mbeaute-exp",
    role: "Project Manager & Backend Developer",
    organization: "Mbeaute Web Application, ENSIT Junior Enterprise",
    location: "Tunis, Tunisia",
    startDate: "December 2025",
    endDate: "March 2026",
    description:
      "Led the Mbeaute web application project at ENSIT Junior Enterprise while developing RESTful APIs for data analysis and processing in a collaborative Scrum workflow.",
    technologies: ["Python", "FastAPI", "Pandas", "JavaScript", "Git", "Scrum"],
    website: "https://mbeaute.tn",
    images: [
      {
        src: "/images/ensit-je-project-manager.jpg",
        alt: "Ala Eddine Grine presented as Project Manager at ENSIT Junior Enterprise",
      },
      {
        src: "/images/ensit-je-executive-board.jpg",
        alt: "ENSIT Junior Enterprise executive board for the 2025–2026 term",
      },
      {
        src: "/images/ensit-je-jetxpo-2024.jpg",
        alt: "ENSIT Junior Enterprise team at JET'XPO 2024",
      },
      {
        src: "/images/ensit-je-jetxpo.jpg",
        alt: "ENSIT Junior Enterprise team at JET'XPO",
      },
    ],
    order: 2,
  },
  {
    id: "sofia",
    role: "Software Engineering Intern",
    organization: "Sofia Technologies",
    location: "Tunisia",
    startDate: "July 2025",
    endDate: "July 2025",
    description:
      "Worked on a mobile application platform spanning frontend, backend, and API integration.",
    technologies: ["React Native", "Expo", "TypeScript", "NestJS", "PostgreSQL", "Vercel"],
    order: 3,
  },
];

export const skills: SkillGroup[] = [
  { category: "Programming Languages", skills: ["C", "C++", "C#", "Python", "Java", "JavaScript", "TypeScript", "SQL"] },
  { category: "Frameworks & Development", skills: ["React.js", "Node.js", "Angular", "Spring Boot", ".NET", "FastAPI", "Flask", "NestJS", "React Native"] },
  { category: "AI & Machine Learning", skills: ["LangChain", "LangGraph", "Agent Workflows", "Machine Learning", "Scikit-learn"] },
  { category: "Databases", skills: ["PostgreSQL", "SQL Server", "Oracle SQL"] },
  { category: "DevOps & Tools", skills: ["Docker", "Git", "GitHub", "GitHub Actions", "Linux/Unix", "Bash", "VS Code", "Render", "Vercel"] },
];

export const education: Education[] = [
  {
    institution: "École Nationale Supérieure d'Ingénieurs de Tunis (ENSIT)",
    program: "Engineering Degree in Computer Science",
    startDate: "September 2024",
    endDate: "Present",
    location: "Tunis, Tunisia",
  },
  {
    institution: "Institut Préparatoire aux Études d'Ingénieurs El Manar",
    program: "Engineering Preparatory Studies — Mathematics and Physics",
    startDate: "September 2022",
    endDate: "June 2024",
    location: "Tunis, Tunisia",
  },
];

export const certifications: Certification[] = [
  { name: "GoMyCode Cybersecurity Certificate", organization: "GoMyCode" },
  { name: "Cyber Security Bootcamp — CompTIA Security+ 701 Course", organization: "CompTIA" },
  { name: "Cisco Certified Network Associate (CCNA) 1, 2, 3", organization: "Cisco Networking Academy" },
  { name: "Introduction to Cloud and Foundations of Machine Learning", organization: "AWS Academy" },
];
