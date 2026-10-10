import { FormEvent, useState } from "react";
import {
  certifications, education, experiences, Experience, profile, projects, Project, skills,
} from "../../data/portfolio";
import { Button, EmptyState, Field, Icon, IconName, Tag, TextareaField } from "../ui";
import { isAdminAuthConfigured, verifyAdminCredentials } from "../../config/adminAuth";

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
  const [page, setPage] = useState<AdminPage>("Overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [editor, setEditor] = useState<"project" | "experience" | null>(null);
  const [deleteItem, setDeleteItem] = useState<string | null>(null);
  const pages: { name: AdminPage; icon: IconName }[] = [
    { name: "Overview", icon: "grid" }, { name: "Projects", icon: "layers" }, { name: "Experience", icon: "briefcase" },
    { name: "Skills", icon: "code" }, { name: "Education", icon: "spark" }, { name: "Certifications", icon: "check" }, { name: "Profile", icon: "user" },
  ];
  const navigate = (name: AdminPage) => { setPage(name); setMobileNav(false); setEditor(null); };
  return <div className="admin-app">
    <aside className={`admin-sidebar ${mobileNav ? "is-open" : ""}`}>
      <div className="sidebar-brand"><span><img src="/images/ala-eddine-grine.jpg" alt="" /></span><div><strong>Portfolio</strong><small>Local workspace</small></div><Button variant="ghost" className="sidebar-close" aria-label="Close navigation" onClick={() => setMobileNav(false)} icon="close" /></div>
      <nav>{pages.map((item) => <button className={page === item.name ? "active" : ""} key={item.name} onClick={() => navigate(item.name)}><Icon name={item.icon} />{item.name}</button>)}</nav>
      <div className="sidebar-foot"><i /><div><strong>Local data</strong><small>Changes are temporary</small></div></div>
    </aside>
    <div className="admin-main">
      <header className="admin-header"><Button variant="ghost" className="admin-menu" onClick={() => setMobileNav(true)} icon="menu" aria-label="Open navigation" /><div className="admin-search"><Icon name="search" /><input placeholder="Search content..." aria-label="Search dashboard content" /></div><a href="/" className="view-site">View portfolio <Icon name="external" /></a><div className="admin-avatar"><img src="/images/ala-eddine-grine.jpg" alt="Ala Eddine Grine" /></div></header>
      <main className="admin-content">
        {editor === "project" ? <ProjectForm onClose={() => setEditor(null)} /> : editor === "experience" ? <ExperienceForm onClose={() => setEditor(null)} /> : <>
          <div className="admin-title"><div><span className="eyebrow">Content workspace</span><h1>{page}</h1><p>{page === "Overview" ? "A clear view of your portfolio content and local activity." : `Review and organize your ${page.toLowerCase()} content.`}</p></div>
          {page === "Projects" && <Button icon="plus" onClick={() => setEditor("project")}>Add project</Button>}
          {page === "Experience" && <Button icon="plus" onClick={() => setEditor("experience")}>Add experience</Button>}</div>
          {page === "Overview" ? <AdminOverview onNavigate={navigate} /> : page === "Projects" ? <AdminProjects onEdit={() => setEditor("project")} onDelete={setDeleteItem} /> : page === "Experience" ? <AdminExperience onEdit={() => setEditor("experience")} onDelete={setDeleteItem} /> : <AdminSimplePage page={page} />}
        </>}
      </main>
    </div>
    {deleteItem && <DeleteDialog item={deleteItem} onClose={() => setDeleteItem(null)} />}
  </div>;
}

function AdminOverview({ onNavigate }: { onNavigate: (page: AdminPage) => void }) {
  const stats = [
    ["Projects", projects.length, "layers"], ["Experience", experiences.length, "briefcase"],
    ["Skill groups", skills.length, "code"], ["Certifications", certifications.length, "check"],
  ] as [string, number, IconName][];
  return <><div className="stat-grid">{stats.map(([label, value, icon]) => <article key={label}><span><Icon name={icon} /></span><div><strong>{value}</strong><small>{label}</small></div><button onClick={() => onNavigate(label === "Skill groups" ? "Skills" : label as AdminPage)} aria-label={`Open ${label}`}><Icon name="chevron" /></button></article>)}</div>
    <div className="dashboard-grid"><section className="admin-panel"><div className="panel-head"><div><h2>Recent content</h2><p>Latest entries in your source data</p></div><Button variant="ghost">View all</Button></div><div className="recent-list">{projects.slice(0, 3).map((project, i) => <div key={project.id}><span className={`recent-icon ri-${i}`}><Icon name={i === 1 ? "spark" : "layers"} /></span><div><strong>{project.title}</strong><small>Project · Display order {project.order}</small></div><span className="status-pill">Published</span></div>)}</div></section>
    <aside className="admin-panel workspace-note"><span><Icon name="code" /></span><h2>How publishing works</h2><p>Dashboard edits are a local interface prototype. Permanent changes require updating <code>src/data/portfolio.ts</code> and redeploying.</p><a href="https://vite.dev/guide/static-deploy.html" target="_blank" rel="noreferrer">Read deployment notes <Icon name="external" /></a></aside></div>
  </>;
}

function AdminProjects({ onEdit, onDelete }: { onEdit: () => void; onDelete: (value: string) => void }) {
  const [search, setSearch] = useState("");
  const list = projects.filter((project) => project.title.toLowerCase().includes(search.toLowerCase()));
  return <section className="admin-panel management-panel"><div className="list-toolbar"><label><Icon name="search" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search projects" /></label><select aria-label="Filter project category"><option>All categories</option><option>Web Development</option><option>AI & Machine Learning</option></select></div>
    <div className="data-list">{list.length ? list.map((project) => <article key={project.id}><div className={`list-thumb art-${project.order}`}><Icon name="layers" /></div><div className="list-primary"><strong>{project.title}</strong><small>{project.category}</small><div className="tags">{project.technologies.slice(0, 3).map((tech) => <Tag key={tech}>{tech}</Tag>)}</div></div><span className="status-pill">{project.featured ? "Featured" : "Published"}</span><div className="row-actions"><Button variant="ghost" icon="edit" onClick={onEdit} aria-label={`Edit ${project.title}`} /><Button variant="ghost" icon="trash" onClick={() => onDelete(project.title)} aria-label={`Delete ${project.title}`} /></div></article>) : <EmptyState title="No projects found" copy="Try a different search or add a new project." />}</div>
  </section>;
}

function AdminExperience({ onEdit, onDelete }: { onEdit: () => void; onDelete: (value: string) => void }) {
  return <section className="admin-panel management-panel"><div className="data-list">{experiences.map((item) => <article key={item.id}><div className="list-thumb company-thumb">{item.organization.slice(0, 2).toUpperCase()}</div><div className="list-primary"><strong>{item.role}</strong><small>{item.organization} · {item.startDate}</small><div className="tags">{item.technologies.slice(0, 3).map((tech) => <Tag key={tech}>{tech}</Tag>)}</div></div><div className="row-actions"><Button variant="ghost" icon="edit" onClick={onEdit} aria-label={`Edit ${item.role}`} /><Button variant="ghost" icon="trash" onClick={() => onDelete(item.role)} aria-label={`Delete ${item.role}`} /></div></article>)}</div></section>;
}

function AdminSimplePage({ page }: { page: Exclude<AdminPage, "Overview" | "Projects" | "Experience"> }) {
  const content: Record<string, { title: string; subtitle: string }[]> = {
    Skills: skills.map((item) => ({ title: item.category, subtitle: `${item.skills.length} skills · ${item.skills.slice(0, 3).join(", ")}` })),
    Education: education.map((item) => ({ title: item.institution, subtitle: item.program })),
    Certifications: certifications.map((item) => ({ title: item.name, subtitle: item.organization })),
    Profile: [{ title: profile.name, subtitle: `${profile.headline} · ${profile.email}` }],
  };
  return <section className="admin-panel management-panel"><div className="panel-head"><div><h2>{page === "Profile" ? "Public profile" : `${page} entries`}</h2><p>Content loaded from the local portfolio data file.</p></div><Button icon="plus">Add {page === "Profile" ? "field" : "entry"}</Button></div><div className="simple-list">{content[page].map((item) => <div key={item.title}><span><Icon name={page === "Certifications" ? "check" : page === "Profile" ? "user" : "code"} /></span><div><strong>{item.title}</strong><small>{item.subtitle}</small></div><Button variant="ghost" icon="edit" aria-label={`Edit ${item.title}`} /></div>)}</div>{page === "Profile" && <div className="inline-note"><Icon name="spark" />These fields represent local portfolio data and are not saved to a server.</div>}</section>;
}

function FormHeader({ title, copy, onClose }: { title: string; copy: string; onClose: () => void }) {
  return <div className="form-header"><button onClick={onClose}><Icon name="arrow" />Back to content</button><span className="eyebrow">Content editor</span><h1>{title}</h1><p>{copy}</p></div>;
}

function ProjectForm({ onClose }: { onClose: () => void }) {
  const [urlError, setUrlError] = useState("");
  function save(event: FormEvent) {
    event.preventDefault();
    const value = new FormData(event.currentTarget as HTMLFormElement).get("github") as string;
    if (value && !/^https?:\/\/.+/.test(value)) return setUrlError("Enter a full URL beginning with http:// or https://");
    onClose();
  }
  return <><FormHeader title="Add a new project" copy="Create a polished project entry for the public portfolio." onClose={onClose} /><form className="editor-form" onSubmit={save}>
    <section className="form-section"><div><h2>Project details</h2><p>The core information shown on project cards.</p></div><div className="form-grid"><Field label="Project title" name="title" placeholder="e.g. Intelligent workflow platform" required /><Field label="Category" name="category" placeholder="AI & Machine Learning" /><Field label="Short description" name="summary" placeholder="A concise one-line summary" /><Field label="Display order" name="order" type="number" defaultValue="1" /><div className="full"><TextareaField label="Detailed description" name="detail" placeholder="Explain the problem, approach, and key engineering decisions..." rows={5} /></div><div className="full"><Field label="Technologies / tech stack" name="tech" placeholder="React, TypeScript, FastAPI, PostgreSQL" /></div></div></section>
    <section className="form-section"><div><h2>Links & media</h2><p>All links are optional and hidden when empty.</p></div><div className="form-grid"><Field label="GitHub repository URL" name="github" placeholder="https://github.com/..." error={urlError} /><Field label="Live demo URL" name="demo" placeholder="https://..." /><Field label="Case study URL" name="caseStudy" placeholder="https://..." /><Field label="Project image URL or local path" name="image" placeholder="/images/project-cover.jpg" /></div></section>
    <section className="form-section compact-section"><div><h2>Publishing</h2><p>Control prominence and ordering.</p></div><div className="toggle-row"><label><input type="checkbox" /><span /><div><strong>Featured project</strong><small>Prioritize this project in the public portfolio.</small></div></label></div></section>
    <div className="form-actions"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" icon="check">Save project locally</Button></div>
  </form></>;
}

function ExperienceForm({ onClose }: { onClose: () => void }) {
  return <><FormHeader title="Add experience" copy="Document a role, internship, or meaningful professional engagement." onClose={onClose} /><form className="editor-form" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
    <section className="form-section"><div><h2>Role details</h2><p>Describe the organization and timeframe.</p></div><div className="form-grid"><Field label="Job title / role" name="role" placeholder="Software Engineering Intern" required /><Field label="Company or organization" name="company" placeholder="Organization name" required /><Field label="Location" name="location" placeholder="Tunis, Tunisia" /><Field label="Display order" name="order" type="number" defaultValue="1" /><Field label="Start date" name="start" type="month" /><Field label="End date" name="end" type="month" /><div className="full"><TextareaField label="Description" name="description" rows={4} placeholder="A concise overview of your work..." /></div><div className="full"><TextareaField label="Responsibilities or achievements" name="responsibilities" rows={4} placeholder="Add one responsibility per line..." /></div><div className="full"><Field label="Technologies used" name="tech" placeholder="React, TypeScript, NestJS" /></div></div></section>
    <section className="form-section"><div><h2>Links & media</h2><p>Optional supporting references.</p></div><div className="form-grid"><Field label="Company website URL" name="companyUrl" placeholder="https://..." /><Field label="Related project URL" name="projectUrl" placeholder="https://..." /><Field label="Logo or image reference" name="image" placeholder="/images/company-logo.svg" /></div></section>
    <div className="form-actions"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" icon="check">Save experience locally</Button></div>
  </form></>;
}

function DeleteDialog({ item, onClose }: { item: string; onClose: () => void }) {
  return <div className="dialog-backdrop" role="presentation"><div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title"><span className="danger-icon"><Icon name="trash" /></span><h2 id="delete-title">Delete this entry?</h2><p><strong>{item}</strong> will be removed from this local dashboard session. This action cannot be undone.</p><div><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="danger" onClick={onClose} icon="trash">Delete entry</Button></div></div></div>;
}

export default function Admin() {
  const [entered, setEntered] = useState(() => sessionStorage.getItem("portfolio-admin-auth") === "open");
  const enter = () => { sessionStorage.setItem("portfolio-admin-auth", "open"); setEntered(true); };
  return entered ? <AdminShell /> : <AdminLogin onEnter={enter} />;
}
