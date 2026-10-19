const CAREER_PROFILES = [
  {
    title: 'Frontend Developer',
    keywords: ['javascript', 'typescript', 'react', 'html', 'css', 'responsive design', 'accessibility', 'ui', 'frontend', 'web development', 'testing', 'git']
  },
  {
    title: 'Full-Stack Developer',
    keywords: ['javascript', 'typescript', 'react', 'node.js', 'api', 'sql', 'database', 'backend', 'frontend', 'html', 'css', 'git']
  },
  {
    title: 'Backend Developer',
    keywords: ['python', 'java', 'node.js', 'api', 'sql', 'database', 'docker', 'microservices', 'backend', 'testing', 'cloud', 'git']
  },
  {
    title: 'Data Analyst',
    keywords: ['sql', 'python', 'excel', 'power bi', 'tableau', 'statistics', 'pandas', 'data visualization', 'analytics', 'reporting', 'data cleaning', 'communication']
  },
  {
    title: 'AI Engineer',
    keywords: ['python', 'machine learning', 'deep learning', 'generative ai', 'large language models', 'llm', 'natural language processing', 'computer vision', 'tensorflow', 'pytorch', 'transformers', 'model deployment', 'vector databases', 'prompt engineering', 'cloud', 'git']
  },
  {
    title: 'Machine Learning Engineer',
    keywords: ['python', 'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'statistics', 'sql', 'data preprocessing', 'model deployment', 'cloud', 'git']
  },
  {
    title: 'UI/UX Designer',
    keywords: ['figma', 'wireframing', 'prototyping', 'user research', 'usability testing', 'design systems', 'accessibility', 'visual design', 'ui', 'ux', 'communication', 'portfolio']
  }
];

const SKILL_TERMS = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'HTML', 'CSS',
  'Excel', 'Power BI', 'Tableau', 'Figma', 'Docker', 'AWS', 'Azure', 'Git', 'Machine Learning',
  'TensorFlow', 'PyTorch', 'Pandas', 'Generative AI', 'Large Language Models', 'LLM',
  'Natural Language Processing', 'Computer Vision', 'Transformers', 'Prompt Engineering',
  'Vector Databases', 'Communication', 'Leadership', 'Project Management'
];

const SECTION_PATTERNS = [
  { label: 'Professional summary', pattern: /\b(summary|profile|objective)\b/i },
  { label: 'Work experience', pattern: /\b(experience|employment|work history|internship)\b/i },
  { label: 'Projects', pattern: /\b(projects|project experience)\b/i },
  { label: 'Education', pattern: /\b(education|university|college|degree)\b/i },
  { label: 'Skills', pattern: /\b(skills|technical skills|technologies)\b/i }
];

function hasTerm(text, term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  return new RegExp(`(^|[^a-z0-9+#.])${escaped}([^a-z0-9+#.]|$)`, 'i').test(text);
}

export function analyzeResumeText(text, preferredRole = '') {
  const normalizedText = text.replace(/\s+/g, ' ').trim();
  if (normalizedText.length < 60) {
    throw new Error('Not enough readable text was found. Try a text-based PDF or DOCX rather than a scanned image.');
  }

  const careers = CAREER_PROFILES.map((career) => {
    const matched = career.keywords.filter((keyword) => hasTerm(normalizedText, keyword));
    const missing = career.keywords.filter((keyword) => !matched.includes(keyword));
    const match = Math.round(35 + (matched.length / career.keywords.length) * 65);
    return { title: career.title, match, matched, missing };
  }).sort((left, right) => right.match - left.match || left.title.localeCompare(right.title));
  const targetCareer = careers.find((career) => career.title.toLowerCase() === preferredRole.trim().toLowerCase()) || null;

  const sections = SECTION_PATTERNS
    .filter((section) => !section.pattern.test(normalizedText))
    .map((section) => section.label);
  const skills = SKILL_TERMS.filter((skill) => hasTerm(normalizedText, skill));
  const hasImpact = /\b(increased|improved|reduced|delivered|achieved|built|launched|saved|grew|automated)\b/i.test(normalizedText)
    && /\b\d+([.,]\d+)?\s*(%|percent|users|customers|hours|days|weeks|projects|teams|revenue)?\b/i.test(normalizedText);
  const suggestions = [];

  if (sections.length) suggestions.push(`Add a clearly labeled ${sections[0].toLowerCase()} section.`);
  if (!hasImpact) suggestions.push('Strengthen experience and project bullets with action verbs and measurable results (for example, time saved or users reached).');
  const suggestionCareer = targetCareer || careers[0];
  if (suggestionCareer.matched.length) {
    const gaps = suggestionCareer.missing.slice(0, 3);
    if (gaps.length) suggestions.push(`For ${suggestionCareer.title} roles, consider demonstrating relevant experience with: ${gaps.join(', ')}.`);
  } else {
    suggestions.push('Add specific tools, technologies, and role-related skills so your target career fit can be assessed more accurately.');
  }
  if (normalizedText.length < 1200) suggestions.push('Consider adding more detail to relevant projects, responsibilities, and outcomes.');

  return {
    preferredRole,
    score: Math.round((SECTION_PATTERNS.length - sections.length) / SECTION_PATTERNS.length * 100),
    careers: careers.slice(0, 3),
    targetCareer,
    skills,
    missingSections: sections,
    suggestions
  };
}

let pdfModulePromise;
let docxLibraryPromise;

async function loadPdfModule() {
  pdfModulePromise ||= import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs');
  return pdfModulePromise;
}

function loadDocxLibrary() {
  if (window.mammoth) return Promise.resolve(window.mammoth);
  docxLibraryPromise ||= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mammoth@1.9.0/mammoth.browser.min.js';
    script.onload = () => window.mammoth
      ? resolve(window.mammoth)
      : reject(new Error('The DOCX reader did not load. Check your internet connection or use PDF/TXT.'));
    script.onerror = () => reject(new Error('Could not load the DOCX reader. Check your internet connection or use PDF/TXT.'));
    document.head.appendChild(script);
  });
  return docxLibraryPromise;
}

export async function extractResumeText(file) {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension === 'txt') return file.text();

  if (extension === 'pdf') {
    const pdfjs = await loadPdfModule();
    pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
    const documentProxy = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
    const pages = [];
    for (let pageNumber = 1; pageNumber <= documentProxy.numPages; pageNumber += 1) {
      const page = await documentProxy.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => ('str' in item ? item.str : '')).join(' '));
    }
    return pages.join('\n');
  }

  if (extension === 'docx') {
    const mammoth = await loadDocxLibrary();
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value;
  }

  throw new Error('Choose a PDF, DOCX, or TXT resume.');
}
