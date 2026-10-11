import { FormEvent, useState } from "react";
import type { ChangeEvent } from "react";
import type { Experience, Project, ProjectCategory } from "../../data/portfolio";
import { Button, Field, Icon, TextareaField } from "../ui";
import { usePortfolioContent } from "../../context/PortfolioContext";

function FormHeader({ title, copy, onClose }: { title: string; copy: string; onClose: () => void }) {
  return <div className="form-header"><button onClick={onClose}><Icon name="arrow" />Back to content</button><span className="eyebrow">Content editor</span><h1>{title}</h1><p>{copy}</p></div>;
}

const projectCategories: ProjectCategory[] = [
  "Web Development",
  "AI & Machine Learning",
  "Multi-Agent Systems",
  "DevOps & MLOps",
];

function toMonthInput(value?: string) {
  if (!value || value.toLowerCase() === "present") return "";
  if (/^\d{4}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonth(value: string) {
  if (!value) return "";
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" })
    .format(new Date(Date.UTC(year, month - 1, 1)));
}

function listFromField(value: FormDataEntryValue | null) {
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function newId(prefix: string) {
  return `${prefix}-${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Date.now()}`;
}

function ProjectForm({ project, onClose, onSave }: { project: Project | null; onClose: () => void; onSave: (project: Project) => void }) {
  const [formError, setFormError] = useState("");

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const urlFields = ["github", "demo", "caseStudy"];
    for (const field of urlFields) {
      const value = String(values.get(field) || "").trim();
      if (value && !/^https?:\/\/.+/.test(value)) {
        setFormError(`Enter a complete URL beginning with https:// for ${field === "caseStudy" ? "case study" : field}.`);
        return;
      }
    }

    const category = String(values.get("category")) as ProjectCategory;
    onSave({
      id: project?.id ?? newId("project"),
      title: String(values.get("title") || "").trim(),
      summary: String(values.get("summary") || "").trim(),
      detail: String(values.get("detail") || "").trim(),
      category,
      technologies: listFromField(values.get("technologies")),
      github: String(values.get("github") || "").trim() || undefined,
      demo: String(values.get("demo") || "").trim() || undefined,
      caseStudy: String(values.get("caseStudy") || "").trim() || undefined,
      image: String(values.get("image") || "").trim() || undefined,
      featured: values.get("featured") === "on",
      order: Number(values.get("order") || 1),
    });
  }

  return <>
    <FormHeader title={project ? "Edit project" : "Add a project"} copy="Manage the details, links, and presentation used on your public project card." onClose={onClose} />
    <form className="editor-form" onSubmit={save}>
      <section className="form-section">
        <div><h2>Project details</h2><p>Write a short card summary and a fuller description of the work.</p></div>
        <div className="form-grid">
          <Field label="Project title" name="title" placeholder="e.g. Intelligent workflow platform" defaultValue={project?.title ?? ""} required />
          <label className="field"><span>Category</span><select name="category" defaultValue={project?.category ?? projectCategories[0]}>{projectCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <Field label="Short description" name="summary" placeholder="One or two sentences for the project card" defaultValue={project?.summary ?? ""} required />
          <Field label="Display order" name="order" type="number" min="1" step="1" defaultValue={project?.order ?? 1} required />
          <div className="full"><TextareaField label="Detailed description" name="detail" placeholder="Explain the problem, your approach, key features, and engineering decisions." rows={6} defaultValue={project?.detail ?? ""} required /></div>
          <div className="full"><Field label="Technologies" name="technologies" placeholder="React, TypeScript, FastAPI, PostgreSQL" defaultValue={project?.technologies.join(", ") ?? ""} /><small className="field-hint">Separate technologies with commas. They appear as tags on the project card.</small></div>
        </div>
      </section>
      <section className="form-section">
        <div><h2>Links and media</h2><p>Add repository, live website, case study, and an optional image path or URL.</p></div>
        <div className="form-grid">
          <Field label="GitHub repository URL" name="github" type="url" placeholder="https://github.com/username/repository" defaultValue={project?.github ?? ""} />
          <Field label="Live website / demo URL" name="demo" type="url" placeholder="https://example.com" defaultValue={project?.demo ?? ""} />
          <Field label="Case study URL" name="caseStudy" type="url" placeholder="https://example.com/case-study" defaultValue={project?.caseStudy ?? ""} />
          <Field label="Project image URL or public path" name="image" placeholder="https://... or /images/project-cover.jpg" defaultValue={project?.image ?? ""} />
        </div>
      </section>
      <section className="form-section compact-section"><div><h2>Publishing</h2><p>Choose whether to highlight this project.</p></div><div className="toggle-row"><label><input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} /><span /><div><strong>Featured project</strong><small>Prioritize this project in the portfolio.</small></div></label></div></section>
      {formError && <p className="form-error" role="alert">{formError}</p>}
      <div className="form-actions"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" icon="check">Save project</Button></div>
    </form>
  </>;
}

interface ExperienceImageDraft {
  id: string;
  src: string;
  alt: string;
  preview?: string;
}

function filePreview(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not preview image."));
    reader.onerror = () => reject(reader.error ?? new Error("Could not preview image."));
    reader.readAsDataURL(file);
  });
}

function ExperienceForm({ experience, onClose, onSave, onUploadImage, onRemoveImage }: {
  experience: Experience | null;
  onClose: () => void;
  onSave: (experience: Experience) => void;
  onUploadImage: (id: string, file: File) => Promise<void>;
  onRemoveImage: (id: string) => Promise<void>;
}) {
  const { experienceImageUrls } = usePortfolioContent();
  const [formError, setFormError] = useState("");
  const [images, setImages] = useState<ExperienceImageDraft[]>(() => (experience?.images ?? []).map((image, index) => ({
    ...image,
    id: image.id ?? `${experience?.id ?? "experience"}-image-${index}`,
  })));
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [uploading, setUploading] = useState(false);

  function addImageUrl() {
    const src = imageUrl.trim();
    const alt = imageAlt.trim();
    if (!/^(https?:\/\/|\/).+/.test(src)) return setFormError("Enter an https:// image URL or a path beginning with /.");
    if (!alt) return setFormError("Add a short description for the image so it has useful alt text.");
    setImages((current) => [...current, { id: newId("experience-image"), src, alt }]);
    setImageUrl("");
    setImageAlt("");
    setFormError("");
  }

  async function uploadFiles(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const files = Array.from(input.files ?? []);
    if (!files.length) return;
    setUploading(true);
    setFormError("");
    try {
      const uploaded = await Promise.all(files.map(async (file) => {
        if (!file.type.startsWith("image/")) throw new Error(`${file.name} is not an image.`);
        if (file.size > 8 * 1024 * 1024) throw new Error(`${file.name} is larger than 8 MB.`);
        const id = newId("experience-image");
        const preview = await filePreview(file);
        await onUploadImage(id, file);
        return { id, src: `local:${id}`, alt: file.name.replace(/\.[^.]+$/, "") || "Experience photo", preview };
      }));
      setImages((current) => [...current, ...uploaded]);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Could not upload the image.");
    } finally {
      setUploading(false);
      input.value = "";
    }
  }

  function removeImage(image: ExperienceImageDraft) {
    setImages((current) => current.filter((item) => item.id !== image.id));
    if (image.src.startsWith("local:")) void onRemoveImage(image.id).catch(() => setFormError("Could not remove the stored image file."));
  }

  function updateImageAlt(id: string, alt: string) {
    setImages((current) => current.map((image) => image.id === id ? { ...image, alt } : image));
  }

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const website = String(values.get("website") || "").trim();
    const projectUrl = String(values.get("projectUrl") || "").trim();
    for (const [label, value] of [["organization website", website], ["related project", projectUrl]]) {
      if (value && !/^https?:\/\/.+/.test(value)) {
        setFormError(`Enter a complete URL beginning with https:// for the ${label}.`);
        return;
      }
    }
    if (images.some((image) => !image.alt.trim())) return setFormError("Add an accessible description for each image.");

    const startDate = String(values.get("startDate") || "");
    const endDate = String(values.get("endDate") || "");
    onSave({
      id: experience?.id ?? newId("experience"),
      role: String(values.get("role") || "").trim(),
      organization: String(values.get("organization") || "").trim(),
      location: String(values.get("location") || "").trim(),
      startDate: formatMonth(startDate),
      endDate: values.get("current") === "on" ? "Present" : formatMonth(endDate),
      description: String(values.get("description") || "").trim(),
      responsibilities: String(values.get("responsibilities") || "").split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
      technologies: listFromField(values.get("technologies")),
      website: website || undefined,
      projectUrl: projectUrl || undefined,
      images: images.length ? images.map(({ preview: _preview, ...image }) => image) : undefined,
      order: Number(values.get("order") || 1),
    });
  }

  return <>
    <FormHeader title={experience ? "Edit experience" : "Add experience"} copy="Capture the role, dates, work, technologies, links, and photos shown in your timeline." onClose={onClose} />
    <form className="editor-form" onSubmit={save}>
      <section className="form-section">
        <div><h2>Role and organization</h2><p>These details identify the position in your experience timeline.</p></div>
        <div className="form-grid">
          <Field label="Job title / role" name="role" placeholder="Software Engineering Intern" defaultValue={experience?.role ?? ""} required />
          <Field label="Company or organization" name="organization" placeholder="Company or organization name" defaultValue={experience?.organization ?? ""} required />
          <Field label="Location" name="location" placeholder="Tunis, Tunisia" defaultValue={experience?.location ?? ""} />
          <Field label="Display order" name="order" type="number" min="1" step="1" defaultValue={experience?.order ?? 1} required />
          <Field label="Start month" name="startDate" type="month" defaultValue={toMonthInput(experience?.startDate)} required />
          <div className="date-field"><Field label="End month" name="endDate" type="month" defaultValue={toMonthInput(experience?.endDate)} /><label className="current-role"><input type="checkbox" name="current" defaultChecked={experience?.endDate === "Present"} /> This is my current role</label></div>
          <div className="full"><TextareaField label="Description" name="description" placeholder="Summarize the project, team, and your contribution." rows={5} defaultValue={experience?.description ?? ""} required /></div>
          <div className="full"><TextareaField label="Responsibilities and achievements" name="responsibilities" placeholder="One responsibility or measurable achievement per line." rows={5} defaultValue={experience?.responsibilities?.join("\n") ?? ""} /></div>
          <div className="full"><Field label="Technologies used" name="technologies" placeholder="React, TypeScript, FastAPI, Git" defaultValue={experience?.technologies.join(", ") ?? ""} /><small className="field-hint">Separate technologies with commas.</small></div>
        </div>
      </section>
      <section className="form-section">
        <div><h2>Links and photos</h2><p>Add organization and project links, then upload or link one or more photos.</p></div>
        <div className="form-grid">
          <Field label="Organization website" name="website" type="url" placeholder="https://company.com" defaultValue={experience?.website ?? ""} />
          <Field label="Related project website" name="projectUrl" type="url" placeholder="https://project.com" defaultValue={experience?.projectUrl ?? ""} />
          <div className="full photo-manager">
            <div className="photo-manager-heading"><div><strong>Experience photos</strong><small>{images.length} {images.length === 1 ? "image" : "images"} · images are arranged automatically in the public gallery</small></div>
              <label className={`btn btn-secondary upload-button ${uploading ? "is-uploading" : ""}`}><Icon name="plus" />{uploading ? "Uploading…" : "Upload images"}<input type="file" accept="image/*" multiple onChange={uploadFiles} disabled={uploading} /></label>
            </div>
            <div className="photo-url-row"><Field label="Image URL or public path" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://... or /images/photo.jpg" /><Field label="Image description" value={imageAlt} onChange={(event) => setImageAlt(event.target.value)} placeholder="Describe the photo" /><Button type="button" variant="secondary" onClick={addImageUrl}>Add link</Button></div>
            {images.length > 0 ? <div className={`image-upload-grid gallery-count-${Math.min(images.length, 4)}`}>{images.map((image, index) => {
              const src = image.preview ?? (image.src.startsWith("local:") ? experienceImageUrls[image.id] : image.src);
              return <article className="image-upload-card" key={image.id}><div className="image-upload-preview">{src ? <img src={src} alt="" /> : <span>Image is loading…</span>}<button type="button" onClick={() => removeImage(image)} aria-label={`Remove image ${index + 1}`}><Icon name="close" size={15} /></button></div><label className="field"><span>Image description</span><input value={image.alt} onChange={(event) => updateImageAlt(image.id, event.target.value)} /></label></article>;
            })}</div> : <div className="photo-empty-state">No photos added yet. Upload images or add them with a URL.</div>}
          </div>
        </div>
      </section>
      {formError && <p className="form-error" role="alert">{formError}</p>}
      <div className="form-actions"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" icon="check">Save experience</Button></div>
    </form>
  </>;
}

export { ProjectForm, ExperienceForm };
