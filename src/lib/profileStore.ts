import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { parse, stringify } from 'yaml'
import { z } from 'zod'
import { initialProfile } from '../data/initialProfile'
import { userProfileSchema } from './profileSchema'
import type { UserProfile } from '../types/profile'

const DATA_DIR = path.join(process.cwd(), 'data')
const PROFILE_PATH = path.join(DATA_DIR, 'profile.yaml')
const SCHEMA_PATH = path.join(DATA_DIR, 'profile.schema.json')

async function ensureProfileSchema() {
  try {
    await readFile(SCHEMA_PATH, 'utf8')
  } catch {
    const schema = z.toJSONSchema(userProfileSchema, {
      target: 'draft-2020-12',
    })
    await writeFile(SCHEMA_PATH, JSON.stringify(schema, null, 2) + '\n', 'utf8')
  }
}

function normalizeProfile(value: unknown): UserProfile {
  const data =
    value && typeof value === 'object' ? (value as Partial<UserProfile>) : {}

  return {
    ...initialProfile,
    ...data,
    basics: {
      ...initialProfile.basics,
      ...(data.basics ?? {}),
      status: {
        ...initialProfile.basics.status,
        ...(data.basics?.status ?? {}),
      },
      links: Array.isArray(data.basics?.links)
        ? data.basics!.links
        : initialProfile.basics.links,
    },
    experience: Array.isArray(data.experience)
      ? data.experience
      : initialProfile.experience,
    projects: Array.isArray(data.projects)
      ? data.projects
      : initialProfile.projects,
    writing: Array.isArray(data.writing)
      ? data.writing
      : initialProfile.writing,
    education: Array.isArray(data.education)
      ? data.education
      : initialProfile.education,
    skillCategories: Array.isArray(data.skillCategories)
      ? data.skillCategories
      : initialProfile.skillCategories,
    sectionVisibility: {
      ...initialProfile.sectionVisibility,
      ...(data.sectionVisibility ?? {}),
    },
    printSettings: {
      ...initialProfile.printSettings,
      ...(data.printSettings ?? {}),
    },
  }
}

export async function getProfile(): Promise<UserProfile> {
  try {
    const raw = await readFile(PROFILE_PATH, 'utf8')
    const parsed = parse(raw)
    return normalizeProfile(parsed)
  } catch (error) {
    const code =
      error && typeof error === 'object' && 'code' in error
        ? String((error as { code?: unknown }).code)
        : ''
    if (code === 'ENOENT') {
      await saveProfile(initialProfile)
      return initialProfile
    }
    throw error
  }
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true })
  await ensureProfileSchema()
  const yaml = stringify(profile, { lineWidth: 0 })
  const content = `# yaml-language-server: $schema=./profile.schema.json\n${yaml}`
  await writeFile(PROFILE_PATH, content, 'utf8')
}
