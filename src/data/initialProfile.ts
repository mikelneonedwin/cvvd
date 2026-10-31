import type { UserProfile } from '../types/profile'

const defaultAvatar = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" width="160" height="160"><circle cx="80" cy="80" r="80" fill="%23222222"/><circle cx="80" cy="64" r="28" fill="%23d4d4d8"/><path d="M36 142 C44 104, 116 104, 124 142" fill="%23d4d4d8"/></svg>'

export const initialProfile: UserProfile = {
  basics: {
    name: 'Elena Vance',
    handle: 'read.cv/elena',
    headline: 'Staff Product Designer and Creative Technologist',
    avatarUrl: defaultAvatar,
    status: {
      state: 'available',
      label: 'Available for select advisory and design systems work',
    },
    location: 'San Francisco, CA',
    timezone: 'America/Los_Angeles',
    summary:
      'Designing tools for thought, high-density interfaces, and robust design systems. Previously Staff Designer at Linear and Design Systems Lead at Stripe. Obsessed with typographic precision, tactile software ergonomics, and modern web performance.',
    links: [
      {
        id: 'link-1',
        platform: 'website',
        label: 'elenavance.design',
        url: 'https://elenavance.design',
      },
      {
        id: 'link-2',
        platform: 'github',
        label: 'github.com/elenavance',
        url: 'https://github.com/elenavance',
      },
      {
        id: 'link-3',
        platform: 'twitter',
        label: '@elenavance',
        url: 'https://twitter.com/elenavance',
      },
      {
        id: 'link-4',
        platform: 'linkedin',
        label: 'linkedin.com/in/elenavance',
        url: 'https://linkedin.com/in/elenavance',
      },
      {
        id: 'link-5',
        platform: 'email',
        label: 'elena@vance.design',
        url: 'mailto:elena@vance.design',
      },
    ],
  },
  experience: [
    {
      id: 'exp-1',
      company: 'Linear',
      role: 'Staff Product Designer',
      startDate: '2023',
      endDate: 'Present',
      isCurrent: true,
      location: 'San Francisco, CA (Remote)',
      employmentType: 'Full-time',
      summary:
        'Leading product design for workflow velocity, desktop app interactions, and command menu orchestration across web and native clients.',
      highlights: [
        'Architected the next-generation keyboard navigation engine, reducing modal latency and command discovery time by 34%.',
        'Led the redesign of the Project Planning roadmap canvas with virtualized canvas rendering and real-time multiplayer cursors.',
        'Partnered directly with engineering to author shared layout primitives used across the entire desktop suite.',
      ],
      technologies: ['Figma', 'TypeScript', 'React', 'Desktop UX', 'Interaction Design'],
      link: 'https://linear.app',
    },
    {
      id: 'exp-2',
      company: 'Stripe',
      role: 'Design Systems Lead',
      startDate: '2020',
      endDate: '2023',
      isCurrent: false,
      location: 'San Francisco, CA',
      employmentType: 'Full-time',
      summary:
        'Oversaw the Sailor design system foundations, color science, and component infrastructure supporting thousands of internal engineers and millions of business dashboards.',
      highlights: [
        'Engineered an automated multi-theme token pipeline with automated accessibility contrast guarantees across WCAG AAA standards.',
        'Unified 40+ complex financial data grid primitives into a unified design system component library.',
        'Authored foundational documentation, Figma plugins, and migration guides adopted by over 450 designers and developers.',
      ],
      technologies: ['Design Systems', 'Tokens', 'Figma API', 'React', 'CSS Architecture'],
      link: 'https://stripe.com',
    },
    {
      id: 'exp-3',
      company: 'Figma',
      role: 'Senior Product Designer',
      startDate: '2018',
      endDate: '2020',
      isCurrent: false,
      location: 'San Francisco, CA',
      employmentType: 'Full-time',
      summary:
        'Spearheaded user experience for vector typography tools, variable font controls, and community plugin workflows.',
      highlights: [
        'Designed the variable font inspection drawer and OpenType feature controls.',
        'Co-designed the initial Figma Community publish flow and creator profile previews.',
        'Created interactive prototyping benchmarks to validate 60fps canvas performance under heavy vector loads.',
      ],
      technologies: ['Product Design', 'Typography', 'Prototyping', 'Vector Engines'],
      link: 'https://figma.com',
    },
    {
      id: 'exp-4',
      company: 'Apple',
      role: 'Interactive Design Intern',
      startDate: '2017',
      endDate: '2018',
      isCurrent: false,
      location: 'Cupertino, CA',
      employmentType: 'Full-time',
      summary:
        'Collaborated with the Human Interface Guidelines team on responsive documentation, typographic rhythm, and micro-interactions.',
      highlights: [
        'Constructed interactive SVG component demos for developer documentation.',
        'Refined typographic grids and dark mode contrast testing suites.',
      ],
      technologies: ['HIG', 'Design Systems', 'Micro-interactions', 'Swift UI Prototypes'],
      link: 'https://apple.com',
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'Typeform Kit',
      tagline: 'Variable typography laboratory for the modern web',
      description:
        'An open-source interactive specimen generator and variable font inspector designed for designers and font foundries. Features real-time optical size adjustments, glyph axis manipulation, and CSS token export.',
      year: '2024',
      link: 'https://typeformkit.dev',
      technologies: ['TypeScript', 'Canvas API', 'OpenType.js', 'Tailwind CSS'],
      featured: true,
      imageUrl: '',
    },
    {
      id: 'proj-2',
      title: 'Monolith',
      tagline: 'Distraction-free Markdown writing environment',
      description:
        'A local-first prose editor engineered for deep writing sessions. Features typographic margins, automatic word cadence analysis, zero telemetry, and pure printable PDF export.',
      year: '2023',
      link: 'https://monolith.writer',
      technologies: ['React', 'Web Workers', 'LocalStorage', 'CSS Paged Media'],
      featured: true,
      imageUrl: '',
    },
    {
      id: 'proj-3',
      title: 'Raycast Typography Suite',
      tagline: 'Instant font metrics and character inspector',
      description:
        'A curated bundle of Raycast extensions allowing quick lookup of unicode codepoints, kerning pairs, and CSS font stacks from anywhere in macOS. Used by over 40,000 creators.',
      year: '2023',
      link: 'https://raycast.com/elena/typography',
      technologies: ['Node.js', 'Raycast API', 'TypeScript'],
      featured: false,
      imageUrl: '',
    },
  ],
  writing: [
    {
      id: 'writ-1',
      title: 'The Architecture of Tactile Interfaces',
      publication: 'Substack',
      year: '2024',
      url: 'https://elenavance.substack.com/p/tactile-interfaces',
      description:
        'On spring physics, micro-feedback, and why digital tools must feel physically grounded.',
    },
    {
      id: 'writ-2',
      title: 'Designing for High-Density Productivity',
      publication: 'Smashing Magazine',
      year: '2023',
      url: 'https://smashingmagazine.com',
      description:
        'Strategies for displaying dense data grids without overwhelming modern knowledge workers.',
    },
    {
      id: 'writ-3',
      title: 'Why Monochrome Still Wins in Professional Software',
      publication: 'Columns',
      year: '2022',
      url: 'https://read.cv/columns/monochrome',
      description:
        'Exploring how neutral palettes elevate user content while reducing visual fatigue.',
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Rhode Island School of Design (RISD)',
      degree: 'Bachelor of Fine Arts (BFA)',
      field: 'Graphic Design and Computational Arts',
      startYear: '2014',
      endYear: '2018',
      honors: 'Graduated with Departmental Honors',
    },
  ],
  skillCategories: [
    {
      id: 'skill-cat-1',
      name: 'Design & Craft',
      skills: [
        'Design Systems',
        'Typography',
        'Interaction Design',
        'High-Fidelity Prototyping',
        'User Research',
        'Information Architecture',
      ],
    },
    {
      id: 'skill-cat-2',
      name: 'Engineering & Technologies',
      skills: [
        'React',
        'TypeScript',
        'Next.js',
        'Tailwind CSS',
        'HTML5 / CSS Paged Media',
        'Git & CI/CD',
        'Canvas & SVG',
      ],
    },
    {
      id: 'skill-cat-3',
      name: 'Tools & Platforms',
      skills: ['Figma', 'Linear', 'Raycast', 'VS Code', 'GitHub', 'Framer', 'Vercel'],
    },
  ],
  sectionVisibility: {
    about: true,
    experience: true,
    projects: true,
    writing: true,
    education: true,
    skills: true,
  },
  printSettings: {
    density: 'comfortable',
    showAvatarInPrint: true,
    includeLinksInPrint: true,
    layoutPreset: 'editorial',
  },
}
