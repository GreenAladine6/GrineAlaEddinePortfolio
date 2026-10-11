import { FormEvent, useState } from "react";
import type { Certification, Education, Experience, Project, SkillGroup } from "../../data/portfolio";
import { Button, EmptyState, Field, Icon, IconName, Tag, TextareaField } from "../ui";
import { isAdminAuthConfigured, verifyAdminCredentials } from "../../config/adminAuth";
import { usePortfolioContent } from "../../context/PortfolioContext";
import { CertificationForm, EducationForm, ProfileForm, SkillGroupForm } from "./ReferenceForms";
import { ExperienceForm, ProjectForm } from "./ContentForms";

type AdminPage = "Overview" | "Projects" | "Experience" | "Skills" | "Education" | "Certifications" | "Profile";

function AdminLogin({ onEnter }: { onEnter: () => void }) {
  const [error, setError] = useState(false);
  function submit(event: FormEvent) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const values = new FormData(form);
    const email = String(values.get("email") || "").trim();
    const password = String(values.get("password") || "");
    if (!verifyAdminCredentials(email, password)) return setError(true);
    onEnter();
  }
  return <main className="admin-login">
    <a className="admin-back" href="/"><Icon name="arrow" />Back to portfolio</a>
    <div className="login-layout">
      <section className="login-brand"><div><span className="admin-logo"><img src="/images/ala-eddine-grine.jpg" alt="" /></span><span className="eyebrow light">Portfolio workspace</span><h1>Manage the story behind the work.</h1><p>A focused local workspace for reviewing and organizing portfolio content.</p></div><small>Frontend-only demo · Use server authentication for production</small></section>
      <section className="login-card"><div><span className="login-icon"><Icon name="user" /></span><h2>Welcome back</h2><p>Sign in with your configured administrator credentials.</p></div>
        <form onSubmit={submit} noValidate>
          <Field label="Email" name="email" type="email" autoComplete="username" placeholder="admin@example.com" required error={error ? "Email or password is incorrect" : undefined} />
          <Field label="Password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" required error={error ? "Email or password is incorrect" : undefined} />
          <Button type="submit">Enter dashboard <Icon name="arrow" /></Button>
        </form>
        <div className="prototype-note"><Icon name="spark" /><p><strong>{isAdminAuthConfigured ? "Frontend-only credential check" : "Admin credentials are not configured"}</strong>{isAdminAuthConfigured ? "Vite exposes VITE_ values in browser code. Add server-side authentication before using this dashboard for sensitive data." : "Set VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD in .env for local development or in Vercel project environment variables, then restart or redeploy."}</p></div>
      </section>
    </div>
  </main>;
}

function AdminShell() {
  const { saveProject, deleteProject, saveExperience, deleteExperience, uploadExperienceImage, removeExperienceImage } = usePortfolioContent();
  const [page, setPage] = useState<AdminPage>("Overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [editor, setEditor] = useState<"project" | "experience" | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [deleteItem, setDeleteItem] = useState<{ title: string; onConfirm: () => void } | null>(null);
  const pages: { name: AdminPage; icon: IconName }[] = [
    { name: "Overview", icon: "grid" }, { name: "Projects", icon: "layers" }, { name: "Experience", icon: "briefcase" },
    { name: "Skills", icon: "code" }, { name: "Education", icon: "spark" }, { name: "Certifications", icon: "check" }, { name: "Profile", icon: "user" },
  ];
  const navigate = (name: AdminPage) => { setPage(name); setMobileNav(false); setEditor(null); setEditingProject(null); setEditingExperience(null); };
  const editProject = (project: Project) => { setEditingProject(project); setEditor("project"); };
  const editExperience = (experience: Experience) => { setEditingExperience(experience); setEditor("experience"); };
  const requestDelete = (title: string, onConfirm: () => void) => setDeleteItem({ title, onConfirm });
  const confirmDelete = () => {
    if (!deleteItem) return;
    deleteItem.onConfirm();
    setDeleteItem(null);
  };
  return <div className="admin-app">
    <aside className={`admin-sidebar ${mobileNav ? "is-open" : ""}`}>
      <div className="sidebar-brand"><span><img src="/images/ala-eddine-grine.jpg" alt="" /></span><div><strong>Portfolio</strong><small>Local workspace</small></div><Button variant="ghost" className="sidebar-close" aria-label="Close navigation" onClick={() => setMobileNav(false)} icon="close" /></div>
      <nav>{pages.map((item) => <button className={page === item.name ? "active" : ""} key={item.name} onClick={() => navigate(item.name)}><Icon name={item.icon} />{item.name}</button>)}</nav>
      <div className="sidebar-foot"><i /><div><strong>Browser saved</strong><small>Saved on this device</small></div></div>
    </aside>
    <div className="admin-main">
      <header className="admin-header"><Button variant="ghost" className="admin-menu" onClick={() => setMobileNav(true)} icon="menu" aria-label="Open navigation" /><div className="admin-search"><Icon name="search" /><input placeholder="Search content..." aria-label="Search dashboard content" /></div><a href="/" className="view-site">View portfolio <Icon name="external" /></a><div className="admin-avatar"><img src="/images/ala-eddine-grine.jpg" alt="Ala Eddine Grine" /></div></header>
      <main className="admin-content">
        {editor === "project" ? <ProjectForm key={editingProject?.id ?? "new-project"} project={editingProject} onClose={() => setEditor(null)} onSave={(project) => { saveProject(project); setEditor(null); setEditingProject(null); }} /> : editor === "experience" ? <ExperienceForm key={editingExperience?.id ?? "new-experience"} experience={editingExperience} onClose={() => setEditor(null)} onSave={(experience) => { saveExperience(experience); setEditor(null); setEditingExperience(null); }} onUploadImage={uploadExperienceImage} onRemoveImage={removeExperienceImage} /> : <>
          <div className="admin-title"><div><span className="eyebrow">Content workspace</span><h1>{page}</h1><p>{page === "Overview" ? "A clear view of your portfolio content and local activity." : `Review and organize your ${page.toLowerCase()} content.`}</p></div>
          {page === "Projects" && <Button icon="plus" onClick={() => { setEditingProject(null); setEditor("project"); }}>Add project</Button>}
          {page === "Experience" && <Button icon="plus" onClick={() => { setEditingExperience(null); setEditor("experience"); }}>Add experience</Button>}</div>
          {page === "Overview" ? <AdminOverview onNavigate={navigate} /> : page === "Projects" ? <AdminProjects onEdit={editProject} onDelete={(id, title) => requestDelete(title, () => deleteProject(id))} /> : page === "Experience" ? <AdminExperience onEdit={editExperience} onDelete={(id, title) => requestDelete(title, () => deleteExperience(id))} /> : <AdminSimplePage page={page} onRequestDelete={requestDelete} />}
        </>}
      </main>
    </div>
    {deleteItem && <DeleteDialog item={deleteItem.title} onClose={() => setDeleteItem(null)} onConfirm={confirmDelete} />}
  </div>;
}

function AdminOverview({ onNavigate }: { onNavigate: (page: AdminPage) => void }) {
  const { content: { projects, experiences, skills, certifications } } = usePortfolioContent();
  const stats = [
    ["Projects", projects.length, "layers"], ["Experience", experiences.length, "briefcase"],
    ["Skill groups", skills.length, "code"], ["Certifications", certifications.length, "check"],
  ] as [string, number, IconName][];
  return <><div className="stat-grid">{stats.map(([label, value, icon]) => <article key={label}><span><Icon name={icon} /></span><div><strong>{value}</strong><small>{label}</small></div><button onClick={() => onNavigate(label === "Skill groups" ? "Skills" : label as AdminPage)} aria-label={`Open ${label}`}><Icon name="chevron" /></button></article>)}</div>
    <div className="dashboard-grid"><section className="admin-panel"><div className="panel-head"><div><h2>Recent content</h2><p>Latest entries in your source data</p></div><Button variant="ghost">View all</Button></div><div className="recent-list">{projects.slice(0, 3).map((project, i) => <div key={project.id}><span className={`recent-icon ri-${i}`}><Icon name={i === 1 ? "spark" : "layers"} /></span><div><strong>{project.title}</strong><small>Project · Display order {project.order}</small></div><span className="status-pill">Published</span></div>)}</div></section>
    <aside className="admin-panel workspace-note"><span><Icon name="code" /></span><h2>Saved in this browser</h2><p>Portfolio edits are stored locally and appear on the public page in this browser. Add a shared database to publish changes for all visitors.</p><a href="/" target="_blank" rel="noreferrer">Preview portfolio <Icon name="external" /></a></aside></div>
  </>;
}

function AdminProjects({ onEdit, onDelete }: { onEdit: (project: Project) => void; onDelete: (id: string, title: string) => void }) {
  const { content: { projects } } = usePortfolioContent();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const categories = ["All categories", ...new Set(projects.map((project) => project.category))];
  const list = projects.filter((project) => project.title.toLowerCase().includes(search.toLowerCase()) && (category === "All categories" || project.category === category));
  return <section className="admin-panel management-panel"><div className="list-toolbar"><label><Icon name="search" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects" /></label><select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter project category">{categories.map((item) => <option key={item}>{item}</option>)}</select></div>
    <div className="data-list">{list.length ? list.map((project) => <article key={project.id}><div className={`list-thumb art-${project.order}`}><Icon name="layers" /></div><div className="list-primary"><strong>{project.title}</strong><small>{project.category}</small><div className="tags">{project.technologies.slice(0, 3).map((tech) => <Tag key={tech}>{tech}</Tag>)}</div></div><span className="status-pill">{project.featured ? "Featured" : "Published"}</span><div className="row-actions"><Button variant="ghost" icon="edit" onClick={() => onEdit(project)} aria-label={`Edit ${project.title}`} /><Button variant="ghost" icon="trash" onClick={() => onDelete(project.id, project.title)} aria-label={`Delete ${project.title}`} /></div></article>) : <EmptyState title="No projects found" copy="Try a different search or add a new project." />}</div>
  </section>;
}

function AdminExperience({ onEdit, onDelete }: { onEdit: (experience: Experience) => void; onDelete: (id: string, title: string) => void }) {
  const { content: { experiences } } = usePortfolioContent();
  return <section className="admin-panel management-panel"><div className="data-list">{experiences.map((item) => <article key={item.id}><div className="list-thumb company-thumb">{item.organization.slice(0, 2).toUpperCase()}</div><div className="list-primary"><strong>{item.role}</strong><small>{item.organization} · {item.startDate}</small><div className="tags">{item.technologies.slice(0, 3).map((tech) => <Tag key={tech}>{tech}</Tag>)}</div></div><div className="row-actions"><Button variant="ghost" icon="edit" onClick={() => onEdit(item)} aria-label={`Edit ${item.role}`} /><Button variant="ghost" icon="trash" onClick={() => onDelete(item.id, item.role)} aria-label={`Delete ${item.role}`} /></div></article>)}</div></section>;
}

function AdminSimplePage({ page, onRequestDelete }: {
  page: Exclude<AdminPage, "Overview" | "Projects" | "Experience">;
  onRequestDelete: (title: string, onConfirm: () => void) => void;
}) {
  const {
    content: { skills, education, certifications, profile },
    cvUrl,
    saveSkillGroup, deleteSkillGroup,
    saveEducation, deleteEducation,
    saveCertification, deleteCertification,
    uploadCertificationImage, removeCertificationImage,
    updateProfile, uploadCv, deleteCv,
  } = usePortfolioContent();
  const [editing, setEditing] = useState<SkillGroup | Education | Certification | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  function closeEditor() {
    setShowEditor(false);
    setEditing(null);
  }

  if (page === "Profile") {
    if (showEditor) return <ProfileForm value={profile} cvUrl={cvUrl} onSave={updateProfile} onUploadCv={uploadCv} onRemoveCv={deleteCv} onClose={closeEditor} />;
    return <section className="admin-panel management-panel"><div className="panel-head"><div><h2>Public profile and CV</h2><p>Update your profile details and upload a PDF for the portfolio download buttons.</p></div><Button icon="edit" onClick={() => setShowEditor(true)}>Edit profile & CV</Button></div><div className="simple-list"><div><span><Icon name="user" /></span><div><strong>{profile.name}</strong><small>{profile.headline} · {profile.email}</small></div></div><div><span><Icon name="download" /></span><div><strong>{cvUrl ? "Uploaded CV PDF" : profile.cv ? "External CV link" : "No CV uploaded"}</strong><small>{cvUrl ? "Saved in this browser's file storage" : profile.cv || "Upload a PDF to enable Download CV buttons"}</small></div></div></div><div className="inline-note"><Icon name="spark" />The uploaded PDF is stored in this browser. Other visitors and devices need a server upload service to access it.</div></section>;
  }

  if (showEditor) {
    if (page === "Skills") return <SkillGroupForm value={editing as SkillGroup | null} onClose={closeEditor} onSave={(item) => { saveSkillGroup(item, (editing as SkillGroup | null)?.category); closeEditor(); }} />;
    if (page === "Education") return <EducationForm value={editing as Education | null} onClose={closeEditor} onSave={(item) => { saveEducation(item, (editing as Education | null)?.institution); closeEditor(); }} />;
    return <CertificationForm key={(editing as Certification | null)?.id ?? "new-certification"} value={editing as Certification | null} onClose={closeEditor} onSave={(item) => { saveCertification(item, (editing as Certification | null)?.id); closeEditor(); }} onUploadImage={uploadCertificationImage} onRemoveImage={removeCertificationImage} />;
  }

  const isSkills = page === "Skills";
  const isEducation = page === "Education";
  const items = isSkills
    ? skills.map((item) => ({ key: item.category, title: item.category, subtitle: `${item.skills.length} skills · ${item.skills.join(", ")}`, value: item }))
    : isEducation
      ? education.map((item) => ({ key: item.institution, title: item.institution, subtitle: `${item.program} · ${item.startDate} — ${item.endDate}`, value: item }))
      : certifications.map((item) => ({ key: item.id ?? item.name, title: item.name, subtitle: `${item.organization}${item.date ? ` · ${item.date}` : ""}${item.credentialUrl ? " · Proof link added" : ""}`, value: item }));
  const icon: IconName = page === "Certifications" ? "check" : "code";
  const noun = page === "Skills" ? "skill group" : page === "Education" ? "education entry" : "certification";

  return <section className="admin-panel management-panel">
    <div className="panel-head"><div><h2>{page} entries</h2><p>Add, edit, or remove items shown in the public portfolio.</p></div><Button icon="plus" onClick={() => { setEditing(null); setShowEditor(true); }}>Add {noun}</Button></div>
    <div className="simple-list">{items.length ? items.map((item) => <div key={item.key}><span><Icon name={icon} /></span><div><strong>{item.title}</strong><small>{item.subtitle}</small></div><div className="row-actions"><Button variant="ghost" icon="edit" onClick={() => { setEditing(item.value); setShowEditor(true); }} aria-label={`Edit ${item.title}`} /><Button variant="ghost" icon="trash" onClick={() => onRequestDelete(item.title, () => {
      if (isSkills) deleteSkillGroup(item.key);
      else if (isEducation) deleteEducation(item.key);
      else deleteCertification(item.key);
    })} aria-label={`Delete ${item.title}`} /></div></div>) : <EmptyState title={`No ${page.toLowerCase()} added`} copy={`Add a ${noun} to show it on your portfolio.`} />}</div>
  </section>;
}

function DeleteDialog({ item, onClose, onConfirm }: { item: string; onClose: () => void; onConfirm: () => void }) {
  return <div className="dialog-backdrop" role="presentation"><div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title"><span className="danger-icon"><Icon name="trash" /></span><h2 id="delete-title">Delete this entry?</h2><p><strong>{item}</strong> will be removed from this browser's saved portfolio. This action cannot be undone.</p><div><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="danger" onClick={onConfirm} icon="trash">Delete entry</Button></div></div></div>;
}

export default function Admin() {
  const [entered, setEntered] = useState(() => sessionStorage.getItem("portfolio-admin-auth") === "open");
  const enter = () => { sessionStorage.setItem("portfolio-admin-auth", "open"); setEntered(true); };
  return entered ? <AdminShell /> : <AdminLogin onEnter={enter} />;
}
