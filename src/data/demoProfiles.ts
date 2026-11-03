import type { UserProfile } from '../types/profile'
import { initialProfile } from './initialProfile'

export interface FeaturedCreatorSummary {
  handle: string
  name: string
  headline: string
  location: string
  avatarUrl: string
  statusState: 'available' | 'employed' | 'freelance' | 'busy'
  statusLabel: string
  craft: string
  recentRole: string
  company: string
}

export const DEMO_PROFILES: Record<string, UserProfile> = {
  elena: initialProfile,
  marcus: {
    basics: {
      name: 'Marcus Chen',
      handle: 'cvvd/marcus',
      headline: 'Founding Infrastructure Engineer & Systems Architect',
      avatarUrl:
        'https://res.cloudinary.com/winneredwin/image/upload/v1793721348/cvvd/avatars/marcus.svg',
      status: {
        state: 'employed',
        label: 'Building low-latency database engines at edge scale',
      },
      location: 'New York, NY',
      timezone: 'America/New_York',
      summary:
        'Specializing in distributed storage, edge networking, and database internals. Core contributor to open-source database connectors and paged buffer caching.',
      links: [
        {
          id: 'm-1',
          platform: 'github',
          label: 'github.com/marcuschen',
          url: 'https://github.com',
        },
        {
          id: 'm-2',
          platform: 'twitter',
          label: '@marcuschen_sys',
          url: 'https://twitter.com',
        },
      ],
    },
    experience: [
      {
        id: 'm-exp-1',
        company: 'Vercel',
        role: 'Staff Infrastructure Engineer',
        startDate: '2023',
        endDate: 'Now',
        isCurrent: true,
        location: 'New York, NY',
        employmentType: 'Full-time',
        summary: 'Architecting global edge routing, KV storage, and zero-cold-start compute primitives.',
        highlights: [
          'Engineered distributed session caching reducing TTFB by 42ms worldwide',
          'Authored high-concurrency connection pools in Rust and Go',
        ],
        technologies: ['Rust', 'Go', 'PostgreSQL', 'eBPF'],
        link: 'https://vercel.com',
      },
      {
        id: 'm-exp-2',
        company: 'Cloudflare',
        role: 'Systems Engineer',
        startDate: '2020',
        endDate: '2023',
        isCurrent: false,
        location: 'San Francisco, CA',
        employmentType: 'Full-time',
        summary: 'Core team member for edge worker isolation and memory sandboxing.',
        highlights: [
          'Reduced worker memory footprints under V8 isolates',
        ],
        technologies: ['C++', 'Rust', 'V8'],
        link: 'https://cloudflare.com',
      },
    ],
    projects: [
      {
        id: 'm-proj-1',
        title: 'BufferFlow',
        tagline: 'Lock-free circular buffer for IPC in Linux',
        description: 'Zero-copy memory mapped ring buffer benchmarked at 14M ops/sec.',
        year: '2024',
        link: 'https://github.com',
        technologies: ['Rust', 'Linux'],
        featured: true,
        imageUrl: '',
      },
    ],
    writing: [
      {
        id: 'm-w-1',
        title: 'Zero-Copy Networking in Modern Linux Kernels',
        publication: 'Systems Journal',
        year: '2024',
        url: 'https://example.com',
        description: 'Deep dive into io_uring and AF_XDP socket architectures.',
      },
    ],
    education: [
      {
        id: 'm-edu-1',
        institution: 'MIT',
        degree: 'B.S. in Electrical Engineering & Computer Science',
        field: 'Distributed Systems',
        startYear: '2016',
        endYear: '2020',
        honors: 'Tau Beta Pi',
      },
    ],
    skillCategories: [
      {
        id: 'm-sc-1',
        name: 'Systems & Infrastructure',
        skills: ['Rust', 'Go', 'Linux Kernel', 'Distributed Systems', 'PostgreSQL'],
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
      layoutPreset: 'single-column',
    },
  },
  sophia: {
    basics: {
      name: 'Sophia Lind',
      handle: 'cvvd/sophia',
      headline: 'Design Technologist & Type Specimen Author',
      avatarUrl:
        'https://res.cloudinary.com/winneredwin/image/upload/v1793721349/cvvd/avatars/sophia.svg',
      status: {
        state: 'freelance',
        label: 'Open for select design systems advisory & bespoke type labs',
      },
      location: 'Stockholm, Sweden',
      timezone: 'Europe/Stockholm',
      summary:
        'Investigating the intersection of computational typography, tactile interfaces, and design tokens. Author of independent variable font specimens.',
      links: [
        {
          id: 's-1',
          platform: 'website',
          label: 'sophialind.studio',
          url: 'https://sophialind.studio',
        },
        {
          id: 's-2',
          platform: 'github',
          label: 'github.com/sophialind',
          url: 'https://github.com',
        },
      ],
    },
    experience: [
      {
        id: 's-exp-1',
        company: 'Independent Studio',
        role: 'Design Technologist & Founder',
        startDate: '2022',
        endDate: 'Now',
        isCurrent: true,
        location: 'Stockholm, Sweden',
        employmentType: 'Full-time',
        summary: 'Consulting on design systems, token architecture, and computational typography for modern web products.',
        highlights: [
          'Constructed token pipelines for multi-brand Scandinavian fintechs',
          'Designed bespoke variable font inspection tools for font foundries',
        ],
        technologies: ['TypeScript', 'Design Systems', 'Variable Fonts', 'Tailwind'],
        link: 'https://sophialind.studio',
      },
    ],
    projects: [
      {
        id: 's-proj-1',
        title: 'GlyphLab',
        tagline: 'Variable font specimen generator and optical axis workbench',
        description: 'Interactive OpenType axis inspector used by digital type designers.',
        year: '2024',
        link: 'https://github.com',
        technologies: ['SVG', 'OpenType', 'Canvas'],
        featured: true,
        imageUrl: '',
      },
    ],
    writing: [
      {
        id: 's-w-1',
        title: 'Optical Sizing in Screen-First Typography',
        publication: 'Type & Tech',
        year: '2023',
        url: 'https://example.com',
        description: 'Why responsive type scales must adjust glyph weight across physical viewing distances.',
      },
    ],
    education: [
      {
        id: 's-edu-1',
        institution: 'Konstfack University of Arts, Crafts and Design',
        degree: 'M.F.A. Visual Communication',
        field: 'Typography & Digital Media',
        startYear: '2016',
        endYear: '2021',
        honors: 'Summa Cum Laude',
      },
    ],
    skillCategories: [
      {
        id: 's-sc-1',
        name: 'Design & Craft',
        skills: ['Typography', 'Design Systems', 'Micro-interactions', 'Token Automation'],
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
      layoutPreset: 'balanced',
    },
  },
  kalu: {
    basics: {
      name: 'David Kalu',
      handle: 'cvvd/kalu',
      headline: 'Frontend Architect & UI Performance Engineer',
      avatarUrl:
        'https://res.cloudinary.com/winneredwin/image/upload/v1793721351/cvvd/avatars/kalu.svg',
      status: {
        state: 'available',
        label: 'Exploring staff frontend roles at developer-first startups',
      },
      location: 'London, UK',
      timezone: 'Europe/London',
      summary:
        'Building ultra-fast, accessible web frontends. Passionate about bundle optimization, client-side caching, and keyboard-first accessibility.',
      links: [
        {
          id: 'k-1',
          platform: 'github',
          label: 'github.com/davidkalu',
          url: 'https://github.com',
        },
        {
          id: 'k-2',
          platform: 'twitter',
          label: '@davidkalu_fe',
          url: 'https://twitter.com',
        },
      ],
    },
    experience: [
      {
        id: 'k-exp-1',
        company: 'Stripe',
        role: 'Staff Frontend Engineer',
        startDate: '2021',
        endDate: '2024',
        isCurrent: false,
        location: 'London, UK',
        employmentType: 'Full-time',
        summary: 'Led the Dashboard performance initiative, reducing P95 load times across 80+ countries.',
        highlights: [
          'Rewrote the data grid virtualization engine for sub-16ms scrolling',
          'Championed WCAG AAA screen reader accessibility across payments dashboard',
        ],
        technologies: ['React', 'TypeScript', 'Web Workers', 'TanStack Query'],
        link: 'https://stripe.com',
      },
    ],
    projects: [
      {
        id: 'k-proj-1',
        title: 'VirtualGrid',
        tagline: 'High-density, 60fps virtual table for massive datasets',
        description: 'Lightweight virtualized table supporting 500,000 rows with keyboard cell selection.',
        year: '2024',
        link: 'https://github.com',
        technologies: ['TypeScript', 'DOM Virtualization'],
        featured: true,
        imageUrl: '',
      },
    ],
    writing: [
      {
        id: 'k-w-1',
        title: 'The Cost of Micro-Rerenders in Large-Scale Web Apps',
        publication: 'Web Engineering Quarterly',
        year: '2023',
        url: 'https://example.com',
        description: 'Practical profiling techniques with Chrome Performance panel and React Profiler.',
      },
    ],
    education: [
      {
        id: 'k-edu-1',
        institution: 'Imperial College London',
        degree: 'B.Eng. Computing',
        field: 'Software Engineering',
        startYear: '2015',
        endYear: '2019',
        honors: 'First Class Honours',
      },
    ],
    skillCategories: [
      {
        id: 'k-sc-1',
        name: 'Frontend Engineering',
        skills: ['React', 'TypeScript', 'Web Performance', 'Accessibility (a11y)', 'State Machines'],
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
      density: 'compact',
      showAvatarInPrint: true,
      includeLinksInPrint: true,
      layoutPreset: 'editorial',
    },
  },
}

export const FEATURED_CREATORS: FeaturedCreatorSummary[] = [
  {
    handle: 'elena',
    name: 'Elena Vance',
    headline: 'Staff Product Designer & Creative Technologist',
    location: 'San Francisco, CA',
    avatarUrl: DEMO_PROFILES.elena.basics.avatarUrl,
    statusState: 'available',
    statusLabel: 'Available for advisory & design systems',
    craft: 'Product Design',
    recentRole: 'Staff Designer at Linear',
    company: 'Linear',
  },
  {
    handle: 'marcus',
    name: 'Marcus Chen',
    headline: 'Founding Infrastructure Engineer',
    location: 'New York, NY',
    avatarUrl: DEMO_PROFILES.marcus.basics.avatarUrl,
    statusState: 'employed',
    statusLabel: 'Building edge compute at Vercel',
    craft: 'Systems & Edge',
    recentRole: 'Staff Infrastructure Engineer at Vercel',
    company: 'Vercel',
  },
  {
    handle: 'sophia',
    name: 'Sophia Lind',
    headline: 'Design Technologist & Type Author',
    location: 'Stockholm, Sweden',
    avatarUrl: DEMO_PROFILES.sophia.basics.avatarUrl,
    statusState: 'freelance',
    statusLabel: 'Open for advisory & type labs',
    craft: 'Design Systems',
    recentRole: 'Design Technologist at Studio Lind',
    company: 'Studio Lind',
  },
  {
    handle: 'kalu',
    name: 'David Kalu',
    headline: 'Senior Frontend Architect',
    location: 'London, UK',
    avatarUrl: DEMO_PROFILES.kalu.basics.avatarUrl,
    statusState: 'available',
    statusLabel: 'Exploring staff frontend roles',
    craft: 'Frontend Architecture',
    recentRole: 'Staff Frontend Engineer at Stripe',
    company: 'Stripe',
  },
]
