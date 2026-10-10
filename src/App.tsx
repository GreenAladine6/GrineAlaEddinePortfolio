import { FormEvent, ReactNode, useMemo, useState } from "react";
import {
  certifications,
  education,
  experiences,
  Experience,
  profile,
  projects,
  Project,
  ProjectCategory,
  skills,
} from "./data/portfolio";

type IconName =
  | "arrow"
  | "briefcase"
  | "check"
  | "chevron"
  | "close"
  | "code"
  | "download"
  | "edit"
  | "external"
  | "github"
  | "grid"
  | "layers"
  | "linkedin"
  | "location"
  | "mail"
  | "menu"
  | "plus"
  | "search"
  | "spark"
  | "trash"
  | "user";

const iconPaths: Record<IconName, ReactNode> = {
  arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
  briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  close: <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
  code: <><path d="m8 9-4 3 4 3"/><path d="m16 9 4 3-4 3"/><path d="m14 5-4 14"/></>,
  download: <><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></>,
  edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/></>,
  external: <><path d="M15 3h6v6"/><path d="m10 14 11-11"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
  github: <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.4 5.4 0 0 0 19.3 4 5 5 0 0 0 19.1.5S18 0 15 2a13.4 13.4 0 0 0-7 0C5-.1 3.9.5 3.9.5A5 5 0 0 0 3.7 4a5.4 5.4 0 0 0-1.5 3.7c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4"/>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  layers: <><path d="m12 2 9 5-9 5-9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></>,
  linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>,
  location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
  menu: <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
  plus: <><path d="M12 5v14"/><path d="M5 12h14"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  spark: <path d="m12 3-1.4 4.2A5 5 0 0 1 7.2 10L3 12l4.2 1.4a5 5 0 0 1 3.4 3.4L12 21l1.4-4.2a5 5 0 0 1 3.4-3.4L21 12l-4.2-1.4a5 5 0 0 1-3.4-3.4Z"/>,
  trash: <><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 15H6L5 6"/><path d="M10 11v5M14 11v5"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
};

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{iconPaths[name]}</svg>;
}

function Button({
  children,
  variant = "primary",
  icon,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger"; icon?: IconName }) {
  return <button className={`btn btn-${variant} ${className}`} {...props}>{icon && <Icon name={icon} />}{children}</button>;
}

function LinkButton({ children, href, variant = "primary", icon, download }: { children: ReactNode; href: string; variant?: "primary" | "secondary" | "ghost"; icon?: IconName; download?: boolean }) {
  return <a className={`btn btn-${variant}`} href={href} download={download}>{icon && <Icon name={icon} />}{children}</a>;
}

function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</div>;
}

function Tag({ children }: { children: ReactNode }) {
  return <span className="tag">{children}</span>;
}

function PublicHeader() {
  const [open, setOpen] = useState(false);
  const links = ["About", "Experience", "Projects", "Skills", "Education", "Contact"];
  return <header className="site-header">
    <div className="nav-shell">
      <a className="wordmark" href="#top" aria-label="Ala Eddine Grine, home"><span><img src="/images/ala-eddine-grine.jpg" alt="" /></span><strong>Ala Eddine Grine</strong></a>
      <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="Primary navigation">
        {links.map((link) => <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setOpen(false)}>{link}</a>)}
        <div className="nav-mobile-actions"><span className="availability"><i />{profile.availability}</span><CvButton /></div>
      </nav>
      <div className="nav-actions"><span className="availability"><i />{profile.availability}</span><CvButton /></div>
      <Button className="menu-button" variant="ghost" aria-expanded={open} aria-label="Toggle navigation" onClick={() => setOpen(!open)} icon={open ? "close" : "menu"} />
    </div>
  </header>;
}

function CvButton({ secondary = false }: { secondary?: boolean }) {
  if (profile.cv) return <LinkButton href={profile.cv} download variant={secondary ? "secondary" : "primary"} icon="download">Download CV</LinkButton>;
  return <a className={`btn btn-${secondary ? "secondary" : "primary"}`} href={`mailto:${profile.email}?subject=CV request`}><Icon name="download" />Request CV</a>;
}

function HeroVisual() {
  return <div className="hero-visual">
    <div className="orb orb-one" /><div className="orb orb-two" />
    <div className="visual-grid" />
    <div className="portrait-frame">
      <img src="/images/ala-eddine-grine.jpg" alt="Ala Eddine Grine" />
      <div className="portrait-caption"><span>Ala Eddine Grine</span><strong>Computer Engineering · ENSIT</strong></div>
    </div>
    <div className="system-card"><span className="mini-icon"><Icon name="briefcase" /></span><div><small>EXPERIENCE</small><strong>Project Manager · ENSIT JE</strong></div></div>
    <div className="status-card"><span><i /> Available for PFE</span><strong>2026</strong></div>
  </div>;
}

function ProjectCard({ project }: { project: Project }) {
  const url = project.demo || project.github || project.caseStudy;
  return <article className="project-card">
    <div className={`project-art art-${project.order}`}>
      <div className="art-window"><span /><span /><span /></div>
      <Icon name={project.category === "Multi-Agent Systems" ? "layers" : project.category === "DevOps & MLOps" ? "grid" : "code"} size={38} />
      <span className="art-label">{project.category}</span>
    </div>
    <div className="project-body">
      <span className="project-category">{project.category}</span>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <div className="tags">{project.technologies.slice(0, 5).map((tech) => <Tag key={tech}>{tech}</Tag>)}</div>
      <div className="project-actions">
        {url ? <a href={url} target="_blank" rel="noreferrer" className="text-link">View project <Icon name="arrow" /></a> : <span className="text-link is-muted">Case study coming soon</span>}
        <div>{project.github && <a className="icon-link" href={project.github} aria-label={`${project.title} on GitHub`}><Icon name="github" /></a>}{project.demo && <a className="icon-link" href={project.demo} aria-label={`${project.title} live website`}><Icon name="external" /></a>}</div>
      </div>
    </div>
  </article>;
}

function Portfolio() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Web Development", "AI & Machine Learning", "Multi-Agent Systems", "DevOps & MLOps"];
  const visibleProjects = filter === "All" ? projects : projects.filter((project) => project.category === filter);

  return <div id="top" className="public-site">
    <PublicHeader />
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy hero-story-card">
            <div className="hero-kicker"><span className="availability"><i />{profile.availability}</span><span>Based in Tunis</span></div>
            <h1>Building intelligent software. <em>Turning ideas into impact.</em></h1>
            <p className="hero-lead">I’m Ala Eddine Grine, a final-year Computer Engineering student at ENSIT, passionate about software engineering, AI-powered applications, multi-agent systems, and cloud technologies.</p>
            <div className="hero-actions"><LinkButton href="#projects" icon="arrow">Explore my projects</LinkButton><CvButton secondary /></div>
            <div className="hero-meta">
              <span><Icon name="location" />Tunis, Tunisia</span>
              <span><Icon name="briefcase" />Final-year Engineering Student</span>
              <SocialLinks />
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      <section id="about" className="section">
        <div className="container about-grid">
          <div>
            <SectionHeading eyebrow="About me" title="A little about me" />
            <p className="about-lead">{profile.about}</p>
            <div className="interest-grid">
              {[
                ["code", "Software Engineering", "Building maintainable, human-centered products."],
                ["spark", "AI & Agentic Systems", "Exploring useful intelligence and coordinated workflows."],
                ["layers", "Cloud, DevOps & MLOps", "Creating reliable paths from development to delivery."],
              ].map(([icon, title, copy]) => <div className="interest-card" key={title}><span><Icon name={icon as IconName} /></span><h3>{title}</h3><p>{copy}</p></div>)}
            </div>
          </div>
          <aside className="profile-panel">
            <div className="profile-monogram"><img src="/images/ala-eddine-grine.jpg" alt="" /><span /></div>
            <h3>{profile.name}</h3><p>{profile.headline}</p>
            <dl>
              <div><dt>Location</dt><dd>{profile.location}</dd></div>
              <div><dt>Education</dt><dd>ENSIT, Tunis</dd></div>
              <div><dt>Objective</dt><dd>International PFE opportunity</dd></div>
            </dl>
            <CvButton secondary />
          </aside>
        </div>
      </section>

      <section id="experience" className="section section-tint">
        <div className="container">
          <SectionHeading eyebrow="Experience" title="Learning by building" intro="Practical experience across full-stack applications, APIs, mobile products, and engineering teams." />
          <div className="timeline">
            {experiences.map((experience, index) => <article className="timeline-item" key={experience.id}>
              <div className="timeline-date"><strong>{experience.startDate}</strong>{experience.endDate !== experience.startDate && <span>— {experience.endDate}</span>}</div>
              <div className="timeline-marker"><i>{String(index + 1).padStart(2, "0")}</i></div>
              <div className="experience-card">
                <div className="experience-top"><div><h3>{experience.role}</h3>{experience.website ? <a href={experience.website} target="_blank" rel="noreferrer">{experience.organization} <Icon name="external" size={14} /></a> : <strong>{experience.organization}</strong>}</div><span><Icon name="location" size={15} />{experience.location}</span></div>
                <p>{experience.description}</p><div className="tags">{experience.technologies.map((tech) => <Tag key={tech}>{tech}</Tag>)}</div>
                {experience.images && <div className="experience-gallery">
                  {experience.images.map((image, imageIndex) => <figure className={imageIndex === 0 ? "gallery-featured" : ""} key={image.src}>
                    <img src={image.src} alt={image.alt} loading="lazy" />
                    {imageIndex === 0 && <figcaption><span>ENSIT Junior Enterprise</span><strong>Project Manager</strong></figcaption>}
                  </figure>)}
                </div>}
              </div>
            </article>)}
          </div>
        </div>
      </section>

      <section id="projects" className="section">
        <div className="container">
          <SectionHeading eyebrow="Selected work" title="Projects built with purpose" intro="A selection of systems that combine careful engineering with emerging technologies." />
          <div className="filter-row" role="group" aria-label="Filter projects">
            {categories.map((category) => <button key={category} onClick={() => setFilter(category)} className={filter === category ? "active" : ""}>{category}</button>)}
          </div>
          <div className="projects-grid">{visibleProjects.map((project) => <ProjectCard project={project} key={project.id} />)}</div>
        </div>
      </section>

      <section id="skills" className="section section-dark">
        <div className="container">
          <SectionHeading eyebrow="Technical toolkit" title="The tools behind the work" intro="A growing toolkit selected for solving problems—not filling progress bars." />
          <div className="skills-grid">{skills.map((group, index) => <article className="skill-card" key={group.category}><span className="skill-number">0{index + 1}</span><div className="skill-title"><span><Icon name={index === 2 ? "spark" : index === 4 ? "layers" : "code"} /></span><h3>{group.category}</h3></div><div className="skill-list">{group.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></article>)}</div>
        </div>
      </section>

      <section id="education" className="section">
        <div className="container education-layout">
          <div><SectionHeading eyebrow="Education" title="Foundations for what’s next" />
            <div className="education-list">{education.map((item) => <article key={item.institution}><span className="education-dot" /><div><span className="date-label">{item.startDate} — {item.endDate}</span><h3>{item.institution}</h3><p>{item.program}</p><small><Icon name="location" size={14} />{item.location}</small></div></article>)}</div>
          </div>
          <div><SectionHeading eyebrow="Certifications" title="Continuous learning" />
            <div className="cert-grid">{certifications.map((cert, index) => <article key={cert.name}><span className="cert-icon"><Icon name="check" /></span><div><small>0{index + 1} · {cert.organization}</small><h3>{cert.name}</h3></div></article>)}</div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="container contact-panel">
          <div className="contact-copy"><span className="eyebrow light">Let’s connect</span><h2>Have an opportunity or an interesting project in mind?</h2><p>I’m open to discussing software engineering, AI, and final-year project opportunities.</p><div className="contact-actions"><LinkButton href={`mailto:${profile.email}?subject=Let’s connect`} variant="secondary" icon="mail">Send me an email</LinkButton><CvButton secondary /></div></div>
          <div className="contact-details">
            <a href={`mailto:${profile.email}`}><span><Icon name="mail" /></span><div><small>Email</small><strong>{profile.email}</strong></div></a>
            <div><span><Icon name="location" /></span><div><small>Location</small><strong>{profile.location}</strong></div></div>
            <div className="contact-note">This static portfolio uses email for contact. No form data is stored or submitted.</div>
          </div>
        </div>
      </section>
    </main>
    <footer><div className="container footer-grid"><div><a className="wordmark footer-wordmark" href="#top"><span><img src="/images/ala-eddine-grine.jpg" alt="" /></span><strong>{profile.name}</strong></a><p>Designed with care and built with code.</p></div><nav>{["About", "Experience", "Projects", "Skills", "Contact"].map((item) => <a key={item} href={`#${item.toLowerCase()}`}>{item}</a>)}</nav><div className="footer-contact"><a href={`mailto:${profile.email}`}>{profile.email}</a><SocialLinks /></div></div><div className="container copyright">© {new Date().getFullYear()} {profile.name}. All rights reserved.</div></footer>
  </div>;
}

function SocialLinks() {
  return <div className="social-links">
    {profile.github ? <a href={profile.github} aria-label="GitHub"><Icon name="github" /></a> : <span aria-label="GitHub profile not yet linked"><Icon name="github" /></span>}
    {profile.linkedin ? <a href={profile.linkedin} aria-label="LinkedIn"><Icon name="linkedin" /></a> : <span aria-label="LinkedIn profile not yet linked"><Icon name="linkedin" /></span>}
  </div>;
}

type AdminPage = "Overview" | "Projects" | "Experience" | "Skills" | "Education" | "Certifications" | "Profile";

function AdminLogin({ onEnter }: { onEnter: () => void }) {
  const [error, setError] = useState(false);
  function submit(event: FormEvent) {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const values = new FormData(form);
    if (!values.get("username") || !values.get("password")) return setError(true);
    onEnter();
  }
  return <main className="admin-login">
    <a className="admin-back" href="/"><Icon name="arrow" />Back to portfolio</a>
    <div className="login-layout">
      <section className="login-brand"><div><span className="admin-logo"><img src="/images/ala-eddine-grine.jpg" alt="" /></span><span className="eyebrow light">Portfolio workspace</span><h1>Manage the story behind the work.</h1><p>A focused local workspace for reviewing and organizing portfolio content.</p></div><small>Static frontend prototype · No server connection</small></section>
      <section className="login-card"><div><span className="login-icon"><Icon name="user" /></span><h2>Welcome back</h2><p>Enter any non-empty values to preview the dashboard interface.</p></div>
        <form onSubmit={submit} noValidate>
          <Field label="Username" name="username" placeholder="Local editor" error={error ? "Enter a username" : undefined} />
          <Field label="Password" name="password" type="password" placeholder="••••••••" error={error ? "Enter a prototype password" : undefined} />
          <Button type="submit">Enter dashboard <Icon name="arrow" /></Button>
        </form>
        <div className="prototype-note"><Icon name="spark" /><p><strong>Visual prototype only</strong>This screen does not provide secure authentication. No credentials are saved or transmitted.</p></div>
      </section>
    </div>
  </main>;
}

function Field({ label, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return <label className={`field ${error ? "has-error" : ""}`}><span>{label}</span><input {...props} />{error && <small>{error}</small>}</label>;
}

function TextareaField({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return <label className="field"><span>{label}</span><textarea {...props} /></label>;
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

function EmptyState({ title, copy }: { title: string; copy: string }) {
  return <div className="empty-state"><span><Icon name="search" /></span><h3>{title}</h3><p>{copy}</p></div>;
}

function DeleteDialog({ item, onClose }: { item: string; onClose: () => void }) {
  return <div className="dialog-backdrop" role="presentation"><div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title"><span className="danger-icon"><Icon name="trash" /></span><h2 id="delete-title">Delete this entry?</h2><p><strong>{item}</strong> will be removed from this local dashboard session. This action cannot be undone.</p><div><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="danger" onClick={onClose} icon="trash">Delete entry</Button></div></div></div>;
}

function Admin() {
  const [entered, setEntered] = useState(() => sessionStorage.getItem("portfolio-admin-preview") === "open");
  const enter = () => { sessionStorage.setItem("portfolio-admin-preview", "open"); setEntered(true); };
  return entered ? <AdminShell /> : <AdminLogin onEnter={enter} />;
}

export default function App() {
  const isAdmin = useMemo(() => window.location.pathname.startsWith("/admin"), []);
  return isAdmin ? <Admin /> : <Portfolio />;
}
