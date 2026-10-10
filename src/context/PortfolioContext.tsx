import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  certifications as defaultCertifications,
  education as defaultEducation,
  experiences as defaultExperiences,
  profile as defaultProfile,
  projects as defaultProjects,
  skills as defaultSkills,
  type Experience,
  type Project,
} from "../data/portfolio";

const STORAGE_KEY = "ala-portfolio-content-v1";

export interface PortfolioContent {
  profile: typeof defaultProfile;
  projects: Project[];
  experiences: Experience[];
  skills: typeof defaultSkills;
  education: typeof defaultEducation;
  certifications: typeof defaultCertifications;
}

const defaults: PortfolioContent = {
  profile: defaultProfile,
  projects: defaultProjects,
  experiences: defaultExperiences,
  skills: defaultSkills,
  education: defaultEducation,
  certifications: defaultCertifications,
};

function byDisplayOrder<T extends { order: number }>(items: T[]) {
  return [...items].sort((left, right) => left.order - right.order);
}

function readSavedContent(): PortfolioContent {
  if (typeof window === "undefined") return defaults;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  } catch {
    return defaults;
  }
}

interface PortfolioContextValue {
  content: PortfolioContent;
  saveProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  saveExperience: (experience: Experience) => void;
  deleteExperience: (id: string) => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(readSavedContent);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  function saveProject(project: Project) {
    setContent((current) => ({
      ...current,
      projects: byDisplayOrder(current.projects.some((item) => item.id === project.id)
        ? current.projects.map((item) => item.id === project.id ? project : item)
        : [...current.projects, project]),
    }));
  }

  function deleteProject(id: string) {
    setContent((current) => ({ ...current, projects: current.projects.filter((item) => item.id !== id) }));
  }

  function saveExperience(experience: Experience) {
    setContent((current) => ({
      ...current,
      experiences: byDisplayOrder(current.experiences.some((item) => item.id === experience.id)
        ? current.experiences.map((item) => item.id === experience.id ? experience : item)
        : [...current.experiences, experience]),
    }));
  }

  function deleteExperience(id: string) {
    setContent((current) => ({ ...current, experiences: current.experiences.filter((item) => item.id !== id) }));
  }

  return <PortfolioContext.Provider value={{ content, saveProject, deleteProject, saveExperience, deleteExperience }}>
    {children}
  </PortfolioContext.Provider>;
}

export function usePortfolioContent() {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error("usePortfolioContent must be used inside PortfolioProvider");
  return context;
}
