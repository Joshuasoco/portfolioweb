// All portfolio content lives here, so updating the site never means touching layout code.
//
// Images: drop files into `public/images/projects/` and set `image` to the path,
// for example `image: '/images/projects/clak.png'`. Leave it as `null` to show the
// placeholder frame. Recommended size is noted on each placeholder.

export const profile = {
  name: 'Joshua Co',
  firstName: 'Joshua',
  roles: ['IT Student', 'AI Enthusiast', 'Web Developer'],
  location: 'Dagupan City, Philippines',
  email: 'joshuasoyco@gmail.com',
  github: 'https://github.com/Joshuasoco',
  githubLabel: 'github.com/Joshuasoco',
  linkedin: 'https://www.linkedin.com/in/joshua-co-92728b298',
  linkedinLabel: 'linkedin.com/in/joshua-co',
  // Set to '/images/profile.png' once you add a photo (portrait, 4:5).
  photo: '/images/profile.png',
}

export const projects = [
  {
    id: 'clak',
    name: 'Clak',
    tagline: 'A free typing test with mechanical keyboard sounds.',
    role: 'Developer',
    url: 'https://claks.app',
    urlLabel: 'claks.app',
    stack: ['React', 'Vite', 'Web Audio API'],
    points: [
      'Quick 15-second tests that measure your WPM and accuracy.',
      'A mechanical keyboard preview with optional switch sounds.',
    ],
    image: '/images/projects/clak.png',
    imageHint: '1600 × 1000',
  },
  {
    id: 'msme-pathways',
    name: 'MSME-Pathways',
    tagline: 'Smart loan support for the informal sector.',
    role: 'AI & Mobile Developer',
    url: 'https://msmepath.netlify.app',
    urlLabel: 'msmepath.netlify.app',
    stack: ['Python', 'LangChain', 'Flutter', 'MongoDB'],
    points: [
      'A conversational AI agent that explains loan terms in Taglish and simple local dialects.',
      'Predictive pre-screening using alternative data, like cash-flow patterns, to help unbanked users build a digital credit footprint.',
      'A mobile-first interface designed for sari-sari store owners and market vendors with low digital literacy.',
    ],
    note: 'Aligned with SDG 9: Industry, Innovation and Infrastructure.',
    image: '/images/projects/msme-pathways.png',
    imageHint: '1600 × 1000',
  },
  {
    id: 'plant-identifier',
    name: 'Plant Identifier',
    tagline: 'Know the plants around you.',
    role: 'Front-End Developer',
    url: 'https://plant-identifier-scanner.netlify.app/login',
    urlLabel: 'plant-identifier-scanner.netlify.app',
    stack: ['React', 'Flutter', 'TensorFlow', 'Python'],
    points: [
      'AI-powered identification of Philippine plant species, with care recommendations for each.',
      'An intuitive, modern interface built for quick, one-handed use.',
      'Functional testing that reached 95% classification accuracy.',
    ],
    metric: { value: '95%', label: 'classification accuracy' },
    image: '/images/projects/plant-identifier.png',
    imageHint: '1600 × 1000',
  },
  {
    id: 'readmissions',
    name: 'Reducing Readmissions',
    tagline: 'A predictive system for hospital patients.',
    role: 'Software Developer',
    stack: ['React', 'Python', 'Machine Learning'],
    points: [
      'A machine-learning prototype that predicts a patient’s risk of readmission.',
      'Careful data validation so predictions rest on clean inputs.',
      'A clear interface that helps providers make faster, better-informed discharge decisions.',
    ],
    image: '/images/projects/readmission.png',
    imageHint: '1600 × 1000',
  },
  {
    id: 'day-one-survival',
    name: 'Day One: Survival',
    tagline: 'Survival items you actually own.',
    role: 'Blockchain Integration Developer',
    stack: ['Unity', 'thirdweb', 'Polygon Amoy'],
    points: [
      'Blockchain integration using the thirdweb Unity SDK on the Polygon Amoy testnet.',
      'Wallet connectivity built straight into the game.',
      'An NFT-based in-game shop for blockchain-backed ownership of survival items.',
    ],
    image: '/images/projects/day-one-survival.png',
    imageHint: '1600 × 1000',
  },
]

export const skills = [
  {
    title: 'Generative AI & Automation',
    span: 'wide',
    items: [
      'Prompt engineering',
      'AI agent workflows',
      'Model Context Protocol (MCP)',
      'Tool & plugin integration',
      'AI coding harnesses',
      'Workflow automation',
    ],
  },
  {
    title: 'Frontend',
    items: [
      'React',
      'Vite',
      'Tailwind CSS',
      'shadcn/ui',
      'GSAP',
      'Framer',
      'Three.js',
      'WebGL',
      'HTML5',
      'CSS3',
      'Bootstrap',
    ],
  },
  {
    title: 'Languages',
    items: ['Python', 'TypeScript', 'JavaScript', 'Java', 'PHP', 'Solidity'],
  },
  {
    title: 'Backend',
    items: ['Django', 'Node.js', 'Celery', 'Redis'],
  },
  {
    title: 'Web3 & Blockchain',
    items: ['Hardhat', 'Ganache', 'MetaMask', 'thirdweb'],
  },
  {
    title: 'Tools & Platforms',
    span: 'full',
    items: [
      'Git & GitHub',
      'GitHub Actions',
      'Docker',
      'Netlify',
      'Vercel',
      'Postman',
      'Insomnia',
    ],
  },
]

export const education = {
  degree: 'Bachelor of Science in Information Technology',
  school: 'PHINMA – University of Pangasinan',
  place: 'Dagupan City, Pangasinan',
  period: 'June 2023 – Present',
}

export const certifications = [
  {
    title: 'AI Fluency: Framework & Foundations',
    issuer: 'Anthropic',
    kind: 'Completion',
  },
  {
    title: 'Build, Break, Repeat',
    issuer: 'AWS Philippines',
    kind: 'Participation',
  },
  {
    title: 'Agentic Coding using Gemini Pro and Antigravity',
    issuer: 'CITE',
    kind: 'Participation',
  },
  {
    title: 'Prompt Like an Engineer',
    issuer: 'Cisco Networking Academy',
    kind: 'Completion',
  },
  {
    title: 'What Is Generative AI?',
    issuer: 'LinkedIn Learning',
    kind: 'Completion',
  },
  {
    title: 'AWS Fundamentals',
    issuer: 'Zuitt Learning Institute',
    kind: 'Completion',
  },
]

export const languages = ['English', 'Filipino']
