import { profile } from './data.js'

export const site = {
  // Set this to the final HTTPS origin, or override it with SITE_URL at build time.
  url: '',
  title: `${profile.name} | Full Stack Developer & AI Enthusiast in the Philippines`,
  description: `${profile.name} is a full stack developer and IT student in ${profile.location}, building React apps, AI agent workflows, and Clak, a free typing test.`,
  image: '/social-preview.jpg',
  imageAlt: `${profile.name}, full stack developer and AI enthusiast in ${profile.location}`,
}
