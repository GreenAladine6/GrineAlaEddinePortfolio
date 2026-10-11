import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import {
  certifications as defaultCertifications,
  education as defaultEducation,
  experiences as defaultExperiences,
  profile as defaultProfile,
  projects as defaultProjects,
  skills as defaultSkills,
  type Certification,
  type Education,
  type Experience,
  type Project,
  type SkillGroup,
} from "../data/portfolio";
import {
  certificationImageKey,
  experienceImageKey,
  readCvFile,
  readPortfolioFile,
  removeCvFile,
  removePortfolioFile,
  saveCvFile,
  savePortfolioFile,
} from "../lib/cvStorage";

const STORAGE_KEY = "ala-portfolio-content-v1";

export interface PortfolioContent {
  profile: typeof defaultProfile;
  projects: Project[];
  experiences: Experience[];
  skills: SkillGroup[];
  education: Education[];
  certifications: Certification[];
}

const defaults: PortfolioContent = {
  profile: defaultProfile,
  projects: defaultProjects,
  experiences: defaultExperiences,
  skills: defaultSkills,
  education: defaultEducation,
  certifications: defaultCertifications.map((item, index) => ({ ...item, id: item.id ?? `certification-${index + 1}` })),
};

function byDisplayOrder<T extends { order: number }>(items: T[]) {
  return [...items].sort((left, right) => left.order - right.order);
}

function readSavedContent(): PortfolioContent {
  if (typeof window === "undefined") return defaults;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaults;
    const parsed = JSON.parse(saved) as Partial<PortfolioContent>;
    return {
      ...defaults,
      ...parsed,
      profile: { ...defaults.profile, ...parsed.profile },
      certifications: (parsed.certifications ?? defaults.certifications).map((item, index) => ({ ...item, id: item.id ?? `certification-${index + 1}` })),
    };
  } catch {
    return defaults;
  }
}

interface PortfolioContextValue {
  content: PortfolioContent;
  cvUrl: string;
  certificationImageUrls: Record<string, string>;
  experienceImageUrls: Record<string, string>;
  saveProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  saveExperience: (experience: Experience) => void;
  deleteExperience: (id: string) => void;
  uploadExperienceImage: (id: string, file: File) => Promise<void>;
  removeExperienceImage: (id: string) => Promise<void>;
  saveSkillGroup: (group: SkillGroup, previousCategory?: string) => void;
  deleteSkillGroup: (category: string) => void;
  saveEducation: (item: Education, previousInstitution?: string) => void;
  deleteEducation: (institution: string) => void;
  saveCertification: (item: Certification, previousId?: string) => void;
  deleteCertification: (id: string) => void;
  uploadCertificationImage: (id: string, file: File) => Promise<void>;
  removeCertificationImage: (id: string) => Promise<void>;
  updateProfile: (profile: PortfolioContent["profile"]) => void;
  uploadCv: (file: File) => Promise<void>;
  deleteCv: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState(readSavedContent);
  const [cvFile, setCvFile] = useState<Blob | null>(null);
  const [cvUrl, setCvUrl] = useState("");
  const [certificationImageUrls, setCertificationImageUrls] = useState<Record<string, string>>({});
  const [experienceImageUrls, setExperienceImageUrls] = useState<Record<string, string>>({});
  const [certificationImageRevision, setCertificationImageRevision] = useState(0);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  useEffect(() => {
    let active = true;
    readCvFile().then((file) => { if (active && file) setCvFile(file); }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!cvFile) { setCvUrl(""); return; }
    const url = URL.createObjectURL(cvFile);
    setCvUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [cvFile]);

  useEffect(() => {
    let active = true;
    const objectUrls: string[] = [];
    setCertificationImageUrls({});
    Promise.all(content.certifications.map(async (item) => {
      if (!item.id || item.image !== `local:${item.id}`) return null;
      const file = await readPortfolioFile(certificationImageKey(item.id));
      if (!file) return null;
      const url = URL.createObjectURL(file);
      objectUrls.push(url);
      return [item.id, url] as const;
    })).then((entries) => {
      if (active) setCertificationImageUrls(Object.fromEntries(entries.filter((entry): entry is NonNullable<typeof entry> => entry !== null)));
    }).catch(() => undefined);
    return () => {
      active = false;
      objectUrls.forEach(URL.revokeObjectURL);
    };
  }, [content.certifications, certificationImageRevision]);

  useEffect(() => {
    let active = true;
    const objectUrls: string[] = [];
    const imageRows = content.experiences.flatMap((experience) => experience.images ?? [])
      .filter((image) => image.id && image.src === `local:${image.id}`);
    Promise.all(imageRows.map(async (image) => {
      const id = image.id!;
      const file = await readPortfolioFile(experienceImageKey(id));
      if (!file) return null;
      const url = URL.createObjectURL(file);
      objectUrls.push(url);
      return [id, url] as const;
    })).then((entries) => {
      if (active) setExperienceImageUrls(Object.fromEntries(entries.filter((entry): entry is NonNullable<typeof entry> => entry !== null)));
    }).catch(() => undefined);
    return () => {
      active = false;
      objectUrls.forEach(URL.revokeObjectURL);
    };
  }, [content.experiences]);

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
    setContent((current) => {
      const experience = current.experiences.find((item) => item.id === id);
      experience?.images?.forEach((image) => { if (image.id) void removePortfolioFile(experienceImageKey(image.id)).catch(() => undefined); });
      return { ...current, experiences: current.experiences.filter((item) => item.id !== id) };
    });
  }

  async function uploadExperienceImage(id: string, file: File) {
    await savePortfolioFile(experienceImageKey(id), file);
  }

  async function removeExperienceImage(id: string) {
    await removePortfolioFile(experienceImageKey(id));
    setExperienceImageUrls((current) => {
      const url = current[id];
      if (url) URL.revokeObjectURL(url);
      const next = { ...current };
      delete next[id];
      return next;
    });
  }

  function saveSkillGroup(group: SkillGroup, previousCategory = group.category) {
    setContent((current) => ({
      ...current,
      skills: [...current.skills.filter((item) => item.category !== previousCategory), group],
    }));
  }

  function deleteSkillGroup(category: string) {
    setContent((current) => ({ ...current, skills: current.skills.filter((item) => item.category !== category) }));
  }

  function saveEducation(item: Education, previousInstitution = item.institution) {
    setContent((current) => ({
      ...current,
      education: [...current.education.filter((entry) => entry.institution !== previousInstitution), item],
    }));
  }

  function deleteEducation(institution: string) {
    setContent((current) => ({ ...current, education: current.education.filter((item) => item.institution !== institution) }));
  }

  function saveCertification(item: Certification, previousId = item.id ?? "") {
    setContent((current) => ({
      ...current,
      certifications: [...current.certifications.filter((entry) => entry.id !== previousId), item],
    }));
  }

  function deleteCertification(id: string) {
    setContent((current) => ({ ...current, certifications: current.certifications.filter((item) => item.id !== id) }));
    void removePortfolioFile(certificationImageKey(id)).catch(() => undefined);
  }

  async function uploadCertificationImage(id: string, file: File) {
    await savePortfolioFile(certificationImageKey(id), file);
    setCertificationImageRevision((revision) => revision + 1);
  }

  async function removeCertificationImage(id: string) {
    await removePortfolioFile(certificationImageKey(id));
    setCertificationImageRevision((revision) => revision + 1);
  }

  function updateProfile(profile: PortfolioContent["profile"]) {
    setContent((current) => ({ ...current, profile }));
  }

  async function uploadCv(file: File) {
    await saveCvFile(file);
    setCvFile(file);
  }

  async function deleteCv() {
    await removeCvFile();
    setCvFile(null);
  }

  return <PortfolioContext.Provider value={{
    content, cvUrl, certificationImageUrls, experienceImageUrls, saveProject, deleteProject, saveExperience, deleteExperience,
    uploadExperienceImage, removeExperienceImage,
    saveSkillGroup, deleteSkillGroup, saveEducation, deleteEducation,
    saveCertification, deleteCertification, uploadCertificationImage, removeCertificationImage,
    updateProfile, uploadCv, deleteCv,
  }}>
    {children}
  </PortfolioContext.Provider>;
}

export function usePortfolioContent() {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error("usePortfolioContent must be used inside PortfolioProvider");
  return context;
}
