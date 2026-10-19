import { requireAuth } from './guards.js';
import { createSupabaseClient } from './supabase-client.js';
import { analyzeResumeText, extractResumeText } from './resume-analysis.js';

const RESUME_BUCKET = 'resumes';
const MAX_RESUME_SIZE = 5 * 1024 * 1024;

const demoStats = {
  skillsCompleted: 8,
  certificationsEarned: 2,
  mockInterviewsCompleted: 4,
  profileStrength: 82,
  skills: [
    { name: 'JavaScript', level: 87 },
    { name: 'HTML/CSS', level: 92 },
    { name: 'React', level: 74 },
    { name: 'SQL', level: 68 },
    { name: 'Problem Solving', level: 81 }
  ],
  careerPaths: [
    {
      title: 'Full-Stack Developer',
      description: 'Build user experiences and scalable backend systems.',
      match: 92,
      skills: ['JavaScript', 'API Design', 'Databases']
    },
    {
      title: 'Data Analyst',
      description: 'Turn business challenges into data-backed decisions.',
      match: 81,
      skills: ['SQL', 'Excel', 'Visualization']
    }
  ],
  drives: [
    {
      company: 'Infosys',
      title: 'Software Engineer Campus Drive',
      eligibility: 'B.Tech 2026',
      deadline: 'Oct 23',
      status: 'Open'
    },
    {
      company: 'Amazon',
      title: 'Cloud Associate Hiring',
      eligibility: 'CSE / IT',
      deadline: 'Oct 28',
      status: 'Upcoming'
    }
  ],
  resources: [
    { title: 'Advanced JavaScript Fundamentals', tag: 'Course', action: 'Continue Learning' },
    { title: 'Mock Interview: Technical Round', tag: 'Interview', action: 'Start Interview' }
  ]
};

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function createPill(label, className = 'neutral') {
  const span = document.createElement('span');
  span.className = `badge ${className}`;
  span.textContent = label;
  return span;
}

function renderCareerList(data = demoStats.careerPaths) {
  const list = document.getElementById('careerList');
  if (!list) return;
  list.innerHTML = '';

  data.forEach((job) => {
    const item = document.createElement('article');
    item.className = 'career-item';

    const title = document.createElement('strong');
    title.textContent = job.title;

    const meta = document.createElement('div');
    meta.className = 'meta-row';
    meta.appendChild(createPill(`${job.match ?? 85}% Match`, 'success'));
    meta.appendChild(document.createTextNode('Career Fit'));

    const desc = document.createElement('p');
    desc.className = 'text-muted';
    desc.style.margin = '12px 0 0';
    desc.textContent = job.description;

    const tags = document.createElement('div');
    tags.className = 'skill-tags';
    (job.skills || []).forEach((skill) => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.textContent = skill;
      tags.appendChild(tag);
    });

    const actions = document.createElement('div');
    actions.className = 'inline-actions';
    const viewBtn = document.createElement('button');
    viewBtn.type = 'button';
    viewBtn.className = 'btn btn-secondary';
    viewBtn.textContent = 'View Details';
    const exploreBtn = document.createElement('button');
    exploreBtn.type = 'button';
    exploreBtn.className = 'btn btn-ghost';
    exploreBtn.textContent = 'Explore Career';
    actions.append(viewBtn, exploreBtn);

    item.append(title, meta, desc, tags, actions);
    list.appendChild(item);
  });
}

function renderSkillList(skills = demoStats.skills) {
  const list = document.getElementById('skillList');
  if (!list) return;
  list.innerHTML = '';

  skills.forEach((skill) => {
    const row = document.createElement('div');
    row.className = 'skill-row';

    const name = document.createElement('strong');
    name.textContent = skill.name;

    const progressWrap = document.createElement('div');
    const progress = document.createElement('div');
    progress.className = 'progress';
    const bar = document.createElement('span');
    bar.className = 'progress-bar';
    bar.style.width = `${skill.level}%`;
    progress.appendChild(bar);
    progressWrap.appendChild(progress);

    const value = document.createElement('span');
    value.className = 'text-muted';
    value.textContent = `${skill.level}%`;

    row.append(name, progressWrap, value);
    list.appendChild(row);
  });
}

function renderDrives(drives = demoStats.drives) {
  const list = document.getElementById('driveList');
  if (!list) return;
  list.innerHTML = '';

  drives.forEach((drive) => {
    const item = document.createElement('article');
    item.className = 'drive-item';

    const left = document.createElement('div');
    const company = document.createElement('div');
    company.className = 'company-pill';
    company.textContent = drive.company;
    const title = document.createElement('strong');
    title.style.display = 'block';
    title.style.marginTop = '10px';
    title.textContent = drive.title;
    const meta = document.createElement('div');
    meta.className = 'meta-row';
    meta.appendChild(document.createTextNode(drive.eligibility));
    meta.appendChild(document.createTextNode(`Deadline: ${drive.deadline}`));
    left.append(company, title, meta);

    const right = document.createElement('div');
    right.appendChild(createPill(drive.status, drive.status === 'Open' ? 'success' : 'warning'));
    const actions = document.createElement('div');
    actions.className = 'inline-actions';
    actions.style.marginTop = '10px';
    const viewBtn = document.createElement('button');
    viewBtn.className = 'btn btn-secondary';
    viewBtn.type = 'button';
    viewBtn.textContent = 'View';
    const applyBtn = document.createElement('button');
    applyBtn.className = 'btn btn-primary';
    applyBtn.type = 'button';
    applyBtn.textContent = 'Apply';
    actions.append(viewBtn, applyBtn);
    right.appendChild(actions);

    item.append(left, right);
    list.appendChild(item);
  });
}

function renderResources(resources = demoStats.resources) {
  const list = document.getElementById('resourceList');
  if (!list) return;
  list.innerHTML = '';

  resources.forEach((resource) => {
    const item = document.createElement('article');
    item.className = 'resource-item';

    const info = document.createElement('div');
    info.className = 'resource-info';
    const title = document.createElement('strong');
    title.textContent = resource.title;
    const badges = document.createElement('div');
    badges.className = 'resource-badges';
    badges.appendChild(createPill(resource.tag, 'neutral'));
    info.append(title, badges);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-secondary';
    btn.textContent = resource.action;

    item.append(info, btn);
    list.appendChild(item);
  });
}

function appendResumeText(parent, tagName, text, className) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  parent.appendChild(element);
  return element;
}

function renderResumeAnalysis(record, preferredRoleOverride = '') {
  const container = document.getElementById('resumeAnalysis');
  if (!container) return;
  const target = document.getElementById('resumeTargetCareer');
  if (target) target.replaceChildren();
  container.replaceChildren();
  if (!record?.analysis) return;

  const analysis = record.analysis;
  const preferredRole = analysis.preferredRole || record.preferred_role || preferredRoleOverride;
  if (target && preferredRole) {
    const targetCareer = analysis.targetCareer;
    const heading = document.createElement('div');
    heading.className = 'resume-target-career-heading';
    appendResumeText(heading, 'strong', `Your preferred role: ${preferredRole}`);
    if (targetCareer) appendResumeText(heading, 'span', `${targetCareer.match}% keyword match`, 'badge neutral');
    target.appendChild(heading);
    const description = targetCareer
      ? targetCareer.matched.length
        ? `Your resume highlights ${targetCareer.matched.slice(0, 5).join(', ')}.`
        : 'Add relevant skills and projects to your resume to show your fit for this role.'
      : 'Upload your resume again to see a match tailored to this role.';
    appendResumeText(target, 'p', description);
  }

  const summary = document.createElement('div');
  summary.className = 'resume-analysis-summary';
  appendResumeText(summary, 'strong', record.file_name || 'Resume analysis');
  appendResumeText(summary, 'span', `Resume structure score: ${analysis.score}%`, 'badge success');
  container.appendChild(summary);

  if (analysis.careers?.length) {
    appendResumeText(container, 'h4', 'Career paths that match your resume');
    const careers = document.createElement('div');
    careers.className = 'resume-career-list';
    analysis.careers.forEach((career) => {
      const item = document.createElement('article');
      item.className = 'resume-career-item';
      appendResumeText(item, 'strong', career.title);
      appendResumeText(item, 'span', `${career.match}% keyword match`, 'badge neutral');
      if (career.matched?.length) {
        appendResumeText(item, 'p', `Skills found: ${career.matched.join(', ')}`);
      }
      careers.appendChild(item);
    });
    container.appendChild(careers);
    appendResumeText(container, 'p', 'Career matches are based on keywords in your resume, not a hiring or qualification guarantee.', 'text-muted resume-disclaimer');
  }

  if (analysis.skills?.length) {
    appendResumeText(container, 'h4', 'Skills detected');
    appendResumeText(container, 'p', analysis.skills.join(' · '), 'resume-skill-list');
  }

  if (analysis.suggestions?.length) {
    appendResumeText(container, 'h4', 'Suggestions to improve your resume');
    const suggestions = document.createElement('ul');
    suggestions.className = 'resume-suggestions';
    analysis.suggestions.forEach((suggestion) => appendResumeText(suggestions, 'li', suggestion));
    container.appendChild(suggestions);
  }
}

function setResumeStatus(message, isError = false) {
  const status = document.getElementById('resumeStatus');
  if (!status) return;
  const copy = status.querySelector('.resume-status-copy');
  if (copy) copy.textContent = message;
  else status.textContent = message;
  status.classList.toggle('resume-error', isError);
}

function updateResumeFileFeedback() {
  const input = document.getElementById('resumeFile');
  const fileName = document.getElementById('resumeFileName');
  const button = document.getElementById('analyzeResumeBtn');
  const file = input?.files?.[0];
  if (fileName) {
    fileName.textContent = file
      ? `${file.name} · ${(file.size / (1024 * 1024)).toFixed(2)} MB`
      : 'PDF, DOCX, or TXT · up to 5 MB';
    fileName.classList.toggle('has-file', Boolean(file));
  }
  if (button && !button.dataset.processing) button.disabled = !file;
  if (file) setResumeStatus('Ready when you are — your resume will stay private.');
}

function setupResumeDropzone() {
  const input = document.getElementById('resumeFile');
  const dropzone = document.getElementById('resumeDropzone');
  if (!input || !dropzone) return;

  input.addEventListener('change', updateResumeFileFeedback);
  for (const eventName of ['dragenter', 'dragover']) {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.add('is-dragover');
    });
  }
  for (const eventName of ['dragleave', 'drop']) {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.remove('is-dragover');
    });
  }
  dropzone.addEventListener('drop', (event) => {
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

async function loadLatestResume(user, preferredRole) {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('resume_analyses')
      .select('file_name, analysis, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (data) {
      renderResumeAnalysis(data, preferredRole);
      setResumeStatus(`Latest analyzed resume: ${data.file_name}`);
    }
  } catch (error) {
    console.error('Could not load the saved resume analysis.', error);
    setResumeStatus('Resume review setup is incomplete. Apply supabase/migrations/003_resume_analysis.sql in your Supabase project, then reload.', true);
  }
}

async function fetchPreferredRole(user) {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('profiles')
      .select('preferred_role')
      .eq('id', user.id)
      .maybeSingle();
    if (error) throw error;
    return data?.preferred_role || '';
  } catch (error) {
    console.error('Could not load the saved preferred role.', error);
    return '';
  }
}

function safeFileName(name) {
  return name.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120) || 'resume';
}

async function uploadAndAnalyzeResume(user, preferredRole) {
  const fileInput = document.getElementById('resumeFile');
  const file = fileInput?.files?.[0];
  if (!file) {
    setResumeStatus('Choose a resume file before starting the review.', true);
    return;
  }
  if (file.size > MAX_RESUME_SIZE) {
    setResumeStatus('This file is larger than 5 MB. Choose a smaller resume file.', true);
    return;
  }

  const button = document.getElementById('analyzeResumeBtn');
  if (button) {
    button.disabled = true;
    button.dataset.processing = 'true';
  }
  setResumeStatus('Reading and reviewing your resume…');
  let uploadedPath;
  let persistenceStarted = false;

  try {
    const text = await extractResumeText(file);
    const analysis = analyzeResumeText(text, preferredRole);
    const supabase = createSupabaseClient();
    const path = `${user.id}/${Date.now()}-${safeFileName(file.name)}`;
    persistenceStarted = true;
    const extension = file.name.split('.').pop()?.toLowerCase();
    const contentType = extension === 'pdf'
      ? 'application/pdf'
      : extension === 'docx'
        ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        : 'text/plain';
    const { error: uploadError } = await supabase.storage
      .from(RESUME_BUCKET)
      .upload(path, file, { contentType, upsert: false });
    if (uploadError) throw uploadError;
    uploadedPath = path;

    const { error: saveError } = await supabase.from('resume_analyses').insert({
      user_id: user.id,
      file_name: file.name,
      file_path: path,
      analysis
    });
    if (saveError) {
      const { error: cleanupError } = await supabase.storage.from(RESUME_BUCKET).remove([path]);
      if (cleanupError) {
        throw new Error(`Could not save the analysis (${saveError.message}); cleanup of the uploaded file also failed (${cleanupError.message}).`);
      }
      uploadedPath = undefined;
      throw saveError;
    }

    renderResumeAnalysis({ file_name: file.name, analysis });
    setResumeStatus(`Analysis complete. Your resume is stored privately in your account.`);
    if (fileInput) fileInput.value = '';
  } catch (error) {
    console.error('Resume upload and analysis failed.', error);
    const setupHint = persistenceStarted && !uploadedPath
      ? ' If upload is not configured, apply supabase/migrations/003_resume_analysis.sql in your Supabase project.'
      : '';
    setResumeStatus(`${error.message || 'Unable to review this resume.'}${setupHint}`, true);
  } finally {
    if (button) {
      delete button.dataset.processing;
      button.disabled = !fileInput?.files?.length;
    }
  }
}

async function fetchDashboardData(user) {
  try {
    const supabase = createSupabaseClient();
    const [profileResult, skillResult, recommendationResult, driveResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('user_skills').select('*').eq('user_id', user.id),
      supabase.from('career_recommendations').select('match_score, career_paths(title, description)').eq('user_id', user.id),
      supabase.from('placement_drives').select('*').eq('status', 'published').limit(2)
    ]);

    if (profileResult.error || skillResult.error || recommendationResult.error || driveResult.error) {
      throw new Error('Supabase query failed');
    }

    return {
      profile: profileResult.data || null,
      skills: (skillResult.data || []).map((skill) => ({
        name: skill.skill_name || 'Skill',
        level: skill.proficiency_level || 60
      })),
      careers: (recommendationResult.data || []).map((row) => ({
        title: row.career_paths?.title || 'Career Path',
        description: row.career_paths?.description || 'Recommended based on your profile.',
        match: row.match_score || 80,
        skills: ['JavaScript', 'Communication', 'Problem Solving']
      })),
      drives: (driveResult.data || []).map((drive) => ({
        company: drive.company_name || 'Company',
        title: drive.title || 'Drive',
        eligibility: drive.eligibility_criteria || 'Open to all eligible students',
        deadline: new Date(drive.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status: drive.status === 'published' ? 'Open' : 'Upcoming'
      }))
    };
  } catch (error) {
    console.warn('Using demo dashboard data:', error.message);
    return null;
  }
}

async function loadDashboard() {
  const user = await requireAuth();
  if (!user) return;

  setupResumeDropzone();
  const preferredRole = await fetchPreferredRole(user);
  await loadLatestResume(user, preferredRole);

  const dashboardData = await fetchDashboardData(user);
  const activeStats = dashboardData || demoStats;

  const name = user.user_metadata?.full_name || user.email?.split('@')[0] || activeStats.userName || 'Student';
  const goal = preferredRole
    || activeStats.profile?.preferred_role
    || user.user_metadata?.preferred_role
    || user.user_metadata?.career_goal
    || activeStats.careerGoal
    || demoStats.careerPaths[0].title;
  document.getElementById('analyzeResumeBtn')
    ?.addEventListener('click', () => uploadAndAnalyzeResume(user, goal));

  setText('userName', name);
  setText('welcomeName', name);
  setText('careerGoal', `Career Goal: ${goal}`);
  setText('skillsCompleted', String(activeStats.skillsCompleted ?? demoStats.skillsCompleted));
  setText('certificationsEarned', String(activeStats.certificationsEarned ?? demoStats.certificationsEarned));
  setText('mockInterviewsCompleted', String(activeStats.mockInterviewsCompleted ?? demoStats.mockInterviewsCompleted));
  setText('profileStrength', `${activeStats.profileStrength ?? demoStats.profileStrength}%`);

  const initials = name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
  const avatar = document.getElementById('userAvatar');
  if (avatar) avatar.textContent = initials || 'S';

  renderCareerList(activeStats.careerPaths || demoStats.careerPaths);
  renderSkillList(activeStats.skills || demoStats.skills);
  renderDrives(activeStats.drives || demoStats.drives);
  renderResources(activeStats.resources || demoStats.resources);
}

loadDashboard();
