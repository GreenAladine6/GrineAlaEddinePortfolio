import { useState } from "react";
import type { Project } from "./data/portfolio";

import { Button, Icon, LinkButton, Tag, IconName } from "./components/ui";
import Admin from "./components/admin/Admin";
import { PortfolioProvider, usePortfolioContent } from "./context/PortfolioContext";

function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{intro && <p>{intro}</p>}</div>;
}

function PublicHeader() {
  const { content: { profile } } = usePortfolioContent();
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
  const { content: { profile } } = usePortfolioContent();
  if (profile.cv) return <LinkButton href={profile.cv} download variant={secondary ? "secondary" : "primary"} icon="download">Download CV</LinkButton>;
  return <a className={`btn btn-${secondary ? "secondary" : "primary"}`} href={`mailto:${profile.email}?subject=CV request`}><Icon name="download" />Request CV</a>;
}

function HeroVisual() {
  const { content: { profile } } = usePortfolioContent();
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
      {project.image && <img className="project-image" src={project.image} alt={`${project.title} preview`} loading="lazy" />}
      <div className="art-window"><span /><span /><span /></div>
      <Icon name={project.category === "Multi-Agent Systems" ? "layers" : project.category === "DevOps & MLOps" ? "grid" : "code"} size={38} />
      <span className="art-label">{project.category}</span>
    </div>
    <div className="project-body">
      <span className="project-category">{project.category}</span>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      {project.detail && <details className="project-details"><summary>Project details</summary><p>{project.detail}</p></details>}
      <div className="tags">{project.technologies.slice(0, 5).map((tech) => <Tag key={tech}>{tech}</Tag>)}</div>
      <div className="project-actions">
        {url ? <a href={url} target="_blank" rel="noreferrer" className="text-link">View project <Icon name="arrow" /></a> : <span className="text-link is-muted">Case study coming soon</span>}
        <div>{project.github && <a className="icon-link" href={project.github} aria-label={`${project.title} on GitHub`}><Icon name="github" /></a>}{project.demo && <a className="icon-link" href={project.demo} aria-label={`${project.title} live website`}><Icon name="external" /></a>}</div>
      </div>
    </div>
  </article>;
}

function Portfolio() {
  const { content } = usePortfolioContent();
  const { profile, projects, experiences, skills, education, certifications } = content;
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
                {experience.responsibilities && experience.responsibilities.length > 0 && <ul className="experience-responsibilities">{experience.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul>}
                {(experience.website || experience.projectUrl) && <div className="experience-links">{experience.website && <a href={experience.website} target="_blank" rel="noreferrer">Organization website <Icon name="external" size={14} /></a>}{experience.projectUrl && <a href={experience.projectUrl} target="_blank" rel="noreferrer">Related project <Icon name="external" size={14} /></a>}</div>}
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
  const { content: { profile } } = usePortfolioContent();
  return <div className="social-links">
    {profile.github ? <a href={profile.github} aria-label="GitHub"><Icon name="github" /></a> : <span aria-label="GitHub profile not yet linked"><Icon name="github" /></span>}
    {profile.linkedin ? <a href={profile.linkedin} aria-label="LinkedIn"><Icon name="linkedin" /></a> : <span aria-label="LinkedIn profile not yet linked"><Icon name="linkedin" /></span>}
  </div>;
}


function AppContent() {
  const isAdmin = /^\/admin\/?$/.test(window.location.pathname);
  return isAdmin ? <Admin /> : <Portfolio />;
}

export default function App() {
  return <PortfolioProvider><AppContent /></PortfolioProvider>;
}
