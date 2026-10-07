import { profile } from './data.js'

export const site = {
  // Set this to the final HTTPS origin, or override it with SITE_URL at build time.
  url: '',
  title: `${profile.name} | Web Developer & AI Enthusiast in the Philippines`,
  description: `${profile.name} is a web developer and IT student in ${profile.location}, building React apps, AI agent workflows, and Clak, a free typing test.`,
  image: '/social-preview.jpg',
  imageAlt: `${profile.name}, web developer and AI enthusiast in ${profile.location}`,
}
