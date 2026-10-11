import { FormEvent, useState } from "react";
import type { ChangeEvent } from "react";
import type { Certification, Education, SkillGroup } from "../../data/portfolio";
import type { PortfolioContent } from "../../context/PortfolioContext";
import { Button, Field, Icon, TextareaField } from "../ui";

type ProfileFields = PortfolioContent["profile"];

function FormHeader({ title, description, onClose }: { title: string; description: string; onClose: () => void }) {
  return <div className="form-header"><button type="button" onClick={onClose}><Icon name="arrow" />Back to content</button><span className="eyebrow">Content editor</span><h1>{title}</h1><p>{description}</p></div>;
}

function commaList(value: FormDataEntryValue | null) {
  return String(value || "").split(",").map((part) => part.trim()).filter(Boolean);
}

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : String(Date.now());
}

export function SkillGroupForm({ value, onSave, onClose }: { value: SkillGroup | null; onSave: (item: SkillGroup) => void; onClose: () => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    onSave({ category: String(values.get("category") || "").trim(), skills: commaList(values.get("skills")) });
  }
  return <><FormHeader title={value ? "Edit skill group" : "Add skill group"} description="Organize the skills that appear in the portfolio toolkit." onClose={onClose} /><form className="editor-form" onSubmit={submit}>
    <section className="form-section"><div><h2>Skill group</h2><p>Add a heading and the skills shown beneath it.</p></div><div className="form-grid"><Field label="Category name" name="category" placeholder="Frameworks & Development" defaultValue={value?.category ?? ""} required /><div className="full"><TextareaField label="Skills" name="skills" rows={5} placeholder="React, TypeScript, Node.js, PostgreSQL" defaultValue={value?.skills.join(", ") ?? ""} required /><small className="field-hint">Separate each skill with a comma.</small></div></div></section>
    <div className="form-actions"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" icon="check">Save skills</Button></div>
  </form></>;
}

function toMonth(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(value: string) {
  if (!value) return "";
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(year, month - 1, 1)));
}

export function EducationForm({ value, onSave, onClose }: { value: Education | null; onSave: (item: Education) => void; onClose: () => void }) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    onSave({
      institution: String(values.get("institution") || "").trim(),
      program: String(values.get("program") || "").trim(),
      startDate: monthLabel(String(values.get("startDate") || "")),
      endDate: String(values.get("current") || "") === "on" ? "Present" : monthLabel(String(values.get("endDate") || "")),
      location: String(values.get("location") || "").trim(),
      description: String(values.get("description") || "").trim() || undefined,
    });
  }
  return <><FormHeader title={value ? "Edit education" : "Add education"} description="Manage an education entry in the public education timeline." onClose={onClose} /><form className="editor-form" onSubmit={submit}>
    <section className="form-section"><div><h2>School and program</h2><p>Include institution, qualification, dates, and location.</p></div><div className="form-grid"><Field label="Institution" name="institution" defaultValue={value?.institution ?? ""} required /><Field label="Program / degree" name="program" defaultValue={value?.program ?? ""} required /><Field label="Location" name="location" defaultValue={value?.location ?? ""} /><Field label="Start month" name="startDate" type="month" defaultValue={value ? toMonth(value.startDate) : ""} required /><div className="date-field"><Field label="End month" name="endDate" type="month" defaultValue={value && value.endDate !== "Present" ? toMonth(value.endDate) : ""} /><label className="current-role"><input type="checkbox" name="current" defaultChecked={value?.endDate === "Present"} /> Currently studying here</label></div><div className="full"><TextareaField label="Additional details" name="description" rows={4} defaultValue={value?.description ?? ""} placeholder="Relevant coursework, distinctions, or focus areas." /></div></div></section>
    <div className="form-actions"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" icon="check">Save education</Button></div>
  </form></>;
}

export function CertificationForm({ value, onSave, onClose, onUploadImage, onRemoveImage }: { value: Certification | null; onSave: (item: Certification) => void; onClose: () => void; onUploadImage: (id: string, file: File) => Promise<void>; onRemoveImage: (id: string) => Promise<void> }) {
  const [error, setError] = useState("");
  const [imageStatus, setImageStatus] = useState("");
  const [image, setImage] = useState(value?.image ?? "");
  const [id] = useState(() => value?.id ?? `certification-${newId()}`);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const proof = String(values.get("credentialUrl") || "").trim();
    const imageUrl = String(values.get("image") || "").trim();
    for (const [label, url] of [["proof link", proof], ["certificate image", image.startsWith("local:") ? "" : imageUrl]]) {
      if (url && !/^(https?:\/\/|\/).+/.test(url)) {
        setError(`Use a full https:// URL or a public file path for the ${label}.`);
        return;
      }
    }
    onSave({
      id,
      name: String(values.get("name") || "").trim(),
      organization: String(values.get("organization") || "").trim(),
      date: String(values.get("date") || "").trim() || undefined,
      credentialUrl: proof || undefined,
      image: image.startsWith("local:") ? image : imageUrl || undefined,
    });
  }
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Choose an image file."); return; }
    if (file.size > 8 * 1024 * 1024) { setError("The image must be 8 MB or smaller."); return; }
    try {
      await onUploadImage(id, file);
      setImage(`local:${id}`);
      setImageStatus(`${file.name} saved in this browser.`);
      setError("");
      input.value = "";
    } catch {
      setError("Could not save the image in this browser.");
    }
  }
  return <><FormHeader title={value ? "Edit certification" : "Add certification"} description="Add the certificate details and either a credential proof link or an image." onClose={onClose} /><form className="editor-form" onSubmit={submit}>
    <section className="form-section"><div><h2>Certificate details</h2><p>The certificate name links to its proof when a URL is provided. You can also upload a certificate photo.</p></div><div className="form-grid"><Field label="Certificate name" name="name" defaultValue={value?.name ?? ""} required /><Field label="Issuing organization" name="organization" defaultValue={value?.organization ?? ""} required /><Field label="Date earned" name="date" placeholder="June 2025" defaultValue={value?.date ?? ""} /><Field label="Proof / credential URL" name="credentialUrl" type="url" placeholder="https://issuer.com/verify/credential" defaultValue={value?.credentialUrl ?? ""} /><div className="full"><Field label="Certificate image URL or public path" name="image" placeholder="https://... or /images/certificate.jpg" value={image.startsWith("local:") ? "" : image} onChange={(event) => { setImage(event.target.value); setImageStatus(""); }} /><small className="field-hint">Paste an image URL/path or choose a local image below.</small></div><label className="field full"><span>Upload certificate image (max 8 MB)</span><input type="file" accept="image/*" onChange={upload} /></label>{image.startsWith("local:") && <div className="upload-status full"><span><Icon name="check" /></span><div><strong>Certificate image uploaded</strong><small>{imageStatus || "Saved in this browser."}</small></div><Button type="button" variant="danger" onClick={async () => { try { await onRemoveImage(id); setImage(""); setImageStatus(""); } catch { setError("Could not remove this image."); } }}>Remove image</Button></div>}</div></section>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="form-actions"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" icon="check">Save certification</Button></div>
  </form></>;
}

export function ProfileForm({ value, cvUrl, onSave, onUploadCv, onRemoveCv, onClose }: { value: ProfileFields; cvUrl: string; onSave: (profile: ProfileFields) => void; onUploadCv: (file: File) => Promise<void>; onRemoveCv: () => Promise<void>; onClose: () => void }) {
  const [cvError, setCvError] = useState("");
  const [cvStatus, setCvStatus] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    onSave({
      name: String(values.get("name") || "").trim(),
      headline: String(values.get("headline") || "").trim(),
      heroHeadline: String(values.get("heroHeadline") || "").trim(),
      email: String(values.get("email") || "").trim(),
      location: String(values.get("location") || "").trim(),
      availability: String(values.get("availability") || "").trim(),
      github: String(values.get("github") || "").trim(),
      linkedin: String(values.get("linkedin") || "").trim(),
      cv: String(values.get("cv") || "").trim(),
      about: String(values.get("about") || "").trim(),
    });
    onClose();
  }
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setCvError("Choose a PDF file.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setCvError("The PDF must be 15 MB or smaller.");
      return;
    }
    try {
      await onUploadCv(file);
      setCvError("");
      setCvStatus(`${file.name} saved in this browser.`);
      input.value = "";
    } catch {
      setCvError("The PDF could not be saved in this browser. Check available storage and try again.");
    }
  }
  return <><FormHeader title="Profile and CV" description="Edit the profile used throughout the portfolio and manage its downloadable CV." onClose={onClose} /><form className="editor-form" onSubmit={submit}>
    <section className="form-section"><div><h2>Public profile</h2><p>These fields update the portfolio identity, links, and contact information.</p></div><div className="form-grid">
      <Field label="Name" name="name" defaultValue={value.name} required /><Field label="Professional headline" name="headline" defaultValue={value.headline} required /><Field label="Hero headline" name="heroHeadline" defaultValue={value.heroHeadline} /><Field label="Contact email" name="email" type="email" defaultValue={value.email} required /><Field label="Location" name="location" defaultValue={value.location} /><Field label="Availability" name="availability" defaultValue={value.availability} /><Field label="GitHub profile URL" name="github" type="url" defaultValue={value.github} /><Field label="LinkedIn profile URL" name="linkedin" type="url" defaultValue={value.linkedin} /><Field label="External CV URL (optional)" name="cv" type="url" defaultValue={value.cv} /><div className="full"><TextareaField label="About me" name="about" rows={6} defaultValue={value.about} /></div>
    </div></section>
    <section className="form-section"><div><h2>CV file upload</h2><p>Choose a PDF to use for the public Download CV buttons.</p></div><div className="cv-upload-panel">
      <label className="field"><span>Upload CV (PDF, max 15 MB)</span><input type="file" accept="application/pdf,.pdf" onChange={upload} /></label>
      {cvUrl ? <div className="cv-file-state"><span><Icon name="check" /></span><div><strong>CV PDF is saved</strong><small>This browser will keep the uploaded PDF between visits.</small></div><Button type="button" variant="danger" onClick={async () => { try { await onRemoveCv(); setCvStatus("Uploaded CV removed."); setCvError(""); } catch { setCvError("Could not remove the saved PDF."); } }}>Remove PDF</Button></div> : <p className="field-hint">No uploaded PDF is saved. An external CV URL, if set above, will remain available.</p>}
      {cvStatus && <p className="field-hint" role="status">{cvStatus}</p>}{cvError && <p className="form-error" role="alert">{cvError}</p>}
    </div></section>
    <div className="form-actions"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" icon="check">Save profile</Button></div>
  </form></>;
}
