const personaDetails = {
  strategist: {
    title: 'Strategist',
    focus: 'Crisp battle plans, risk mapping, and pathfinding.',
    rituals: ['Scenario trees', 'Go/No-Go flags', 'Fast red-team loops'],
  },
  researcher: {
    title: 'Researcher',
    focus: 'Source-driven synthesis and citation-heavy dives.',
    rituals: ['Source grading', 'Confidence ribbons', 'Traceable quotes'],
  },
  explainer: {
    title: 'Explainer',
    focus: 'Clarity, stories, and visual-first explanations.',
    rituals: ['Concept metaphors', 'Edge-case callouts', 'Stepwise walkthroughs'],
  },
  builder: {
    title: 'Builder',
    focus: 'Action bias and ship-ready guidance.',
    rituals: ['Work packages', 'Dependencies chart', 'Resource checklists'],
  }
};

const overlaySignals = [
  { icon: '⚡️', label: 'Acceleration', desc: 'Fast-lane reasoning and shortcuts.' },
  { icon: '🛡️', label: 'Rigor', desc: 'Citations, sources, and test coverage.' },
  { icon: '🛰️', label: 'Web intel', desc: 'Live pulls and outward-facing scans.' },
  { icon: '🌐', label: 'Offline safe', desc: 'Cached playbooks and self-contained insights.' },
  { icon: '🧭', label: 'Depth', desc: 'Adjustable layers from outline to blueprint.' },
];

const expertArchetypes = [
  { role: 'Principal Engineer', specialty: 'Systems architecture & resilience' },
  { role: 'Research Director', specialty: 'Signals intelligence & trend mapping' },
  { role: 'Product Strategist', specialty: 'Roadmaps, bets, and validation' },
  { role: 'Operations Chief', specialty: 'Execution, staffing, and risk burn-downs' },
  { role: 'Compliance Lead', specialty: 'Safety, policy, and governance' },
];

function safeParse(value, fallback) {
  try {
    return JSON.parse(value) || fallback;
  } catch {
    return fallback;
  }
}

function nowLabel() {
  return new Date().toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
}

function seedThreads() {
  return [
    {
      id: 'thread-1',
      title: 'Launch strategy with overlay',
      createdAt: Date.now(),
      persona: 'strategist',
      depth: 3,
      overlay: true,
      offline: false,
      messages: [
        { role: 'agent', meta: 'Agent 13 · Strategist · Online', text: 'Welcome back. Want me to gather a 30-year expert council or jump into a live lookup?', overlay: '🧭 Depth-ready · symbolic overlay' },
        { role: 'user', meta: 'You', text: 'Draft an ops plan with offline resilience.' },
        { role: 'agent', meta: 'Agent 13 · Researcher · Offline', text: 'Offline cache engaged. I’ll assemble cached checklists now and flag where live citations would normally appear.', overlay: 'Rigor overlay' },
      ],
    },
    {
      id: 'thread-2',
      title: 'Security audit - offline',
      createdAt: Date.now(),
      persona: 'researcher',
      depth: 2,
      overlay: false,
      offline: true,
      messages: [
        { role: 'agent', meta: 'Agent 13 · Researcher · Offline', text: 'Ready to inspect the cache-only audit playbook. Want symbolic overlays on evidence strength?' },
      ],
    },
  ];
}

const overlayGrid = document.getElementById('overlayGrid');
const workspaceOverlayGrid = document.getElementById('workspaceOverlayGrid');
const personaGrid = document.getElementById('personaGrid');
const teamGrid = document.getElementById('teamGrid');
const workspaceTeam = document.getElementById('workspaceTeam');
const depthControl = document.getElementById('depthControl');
const depthLabel = document.getElementById('depthLabel');
const workspaceDepth = document.getElementById('workspaceDepth');
const workspaceDepthLabel = document.getElementById('workspaceDepthLabel');
const modeToggle = document.getElementById('modeToggle');
const workspaceModeToggle = document.getElementById('workspaceMode');
const modeLabel = document.getElementById('modeLabel');
const workspaceModeLabel = document.getElementById('workspaceModeLabel');
const liveOutput = document.getElementById('liveOutput');

const personaSelect = document.getElementById('persona');
const personaWorkspace = document.getElementById('personaWorkspace');
const assembleButton = document.getElementById('assembleButton');
const liveLookupButton = document.getElementById('liveLookup');
const objectiveInput = document.getElementById('objective');
const overlayToggle = document.getElementById('overlayToggle');
const workspaceOverlayToggle = document.getElementById('workspaceOverlay');
const topNewChat = document.getElementById('topNewChat');

const chatStream = document.getElementById('chatStream');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const composerStatus = document.getElementById('composerStatus');
const newChatButton = document.getElementById('newChat');
const recentConvos = document.getElementById('recentConvos');

const mainGoogleButton = document.getElementById('mainGoogle');
const workspaceGoogleButton = document.getElementById('workspaceGoogle');
const mainUserPill = document.getElementById('mainUser');
const workspaceUserPill = document.getElementById('workspaceUser');
const apiKeyInput = document.getElementById('apiKey');
const saveApiKeyButton = document.getElementById('saveApiKey');
const apiStatusPill = document.getElementById('apiStatus');
const workspaceApiKeyInput = document.getElementById('workspaceApiKey');
const workspaceSaveApiKeyButton = document.getElementById('workspaceSaveApiKey');
const workspaceApiStatusPill = document.getElementById('workspaceApiStatus');

const STORAGE_KEYS = {
  threads: 'agent13-threads',
  active: 'agent13-active-thread',
  user: 'agent13-user',
  apiKey: 'agent13-openai-key',
};

let offlineMode = false;
let showOverlay = false;
let workspaceOffline = false;
let workspaceOverlayOn = false;
let threads = [];
let activeThreadId = null;
let authedUser = null;
let openAiKey = '';

function renderPersonaCards() {
  if (!personaGrid || !personaSelect) return;
  personaGrid.innerHTML = '';
  const selected = personaSelect.value;
  Object.entries(personaDetails).forEach(([key, persona]) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="pill${selected === key ? ' pill--bright' : ''}">${persona.title}</div>
      <h3>${persona.title}</h3>
      <p>${persona.focus}</p>
      <p><strong>Rituals:</strong> ${persona.rituals.join(' · ')}</p>
    `;
    personaGrid.appendChild(card);
  });
}

function renderOverlaySignals(target, overlayActive) {
  if (!target) return;
  target.innerHTML = '';
  overlaySignals.forEach(signal => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <div class="overlay-chip">
        <span>${signal.icon}</span>
        <div>
          <div><strong>${signal.label}</strong></div>
          <div>${signal.desc}</div>
        </div>
      </div>
    `;
    if (!overlayActive && ['⚡️', '🛰️', '🛡️'].includes(signal.icon)) {
      card.style.opacity = 0.35;
    }
    target.appendChild(card);
  });
}

function renderTeam(target, depthValue, objectiveValue, isOffline, overlayActive) {
  if (!target) return;
  const objective = (objectiveValue && objectiveValue.trim()) || 'Your chosen objective';
  const depthLevel = Number(depthValue || 3);
  target.innerHTML = '';

  expertArchetypes.forEach((expert, idx) => {
    const card = document.createElement('article');
    card.className = 'card';
    const depthHint = depthLevel >= 4 ? 'Blueprint-grade detail' : depthLevel >= 2 ? 'Tactical next steps' : 'Executive summary';
    card.innerHTML = `
      <h3>${expert.role}</h3>
      <p><strong>Experience:</strong> 30+ years</p>
      <p><strong>Specialty:</strong> ${expert.specialty}</p>
      <p><strong>For:</strong> ${objective}</p>
      <p><strong>Mode:</strong> ${isOffline ? 'Offline vault' : 'Web-connected reconnaissance'}</p>
      <p><strong>Depth:</strong> ${depthHint}</p>
    `;
    target.appendChild(card);

    if (overlayActive && idx === 0) {
      const badge = document.createElement('div');
      badge.className = 'pill pill--bright';
      badge.style.marginTop = '8px';
      badge.textContent = 'Lead facilitator · symbolic overlay active';
      card.appendChild(badge);
    }
  });
}

function updateDepthLabel() {
  if (depthLabel && depthControl) {
    depthLabel.textContent = `Level ${depthControl.value}`;
  }
  if (workspaceDepthLabel && workspaceDepth) {
    workspaceDepthLabel.textContent = `Level ${workspaceDepth.value}`;
  }
}

async function runLiveLookup() {
  liveOutput.textContent = 'Contacting the web...';
  if (offlineMode) {
    liveOutput.textContent = 'Offline mode enabled. Serving cached playbook: \n- Lookup: cached strategic checklist\n- Next: sync when online to refresh sources.';
    return;
  }

  try {
    const response = await fetch('https://api.github.com/zen');
    const text = await response.text();
    liveOutput.textContent = `Live pull succeeded:\n${text}`;
  } catch (error) {
    liveOutput.textContent = `Live pull failed. Staying resilient with cached context.\n${error}`;
  }
}

function appendMessage({ role, meta, text, overlay }) {
  if (!chatStream) return;
  const article = document.createElement('article');
  article.className = `message ${role === 'user' ? 'outbound' : 'inbound'}`;
  article.innerHTML = `
    <div class="message__meta">${meta}</div>
    <p>${text}</p>
  `;
  if (overlay) {
    const chip = document.createElement('div');
    chip.className = overlay.startsWith('🧭') ? 'overlay-chip' : 'pill';
    chip.textContent = overlay;
    article.appendChild(chip);
  }
  chatStream.appendChild(article);
  chatStream.scrollTop = chatStream.scrollHeight;
}

function persistThreads() {
  try {
    localStorage.setItem(STORAGE_KEYS.threads, JSON.stringify(threads));
    if (activeThreadId) localStorage.setItem(STORAGE_KEYS.active, activeThreadId);
  } catch {
    // Local persistence is best-effort.
  }
}

function loadThreads() {
  const stored = safeParse(localStorage.getItem(STORAGE_KEYS.threads), null);
  threads = Array.isArray(stored) && stored.length ? stored : seedThreads();
  activeThreadId = localStorage.getItem(STORAGE_KEYS.active) || threads[0]?.id || null;
}

function renderThreadList() {
  if (!recentConvos) return;
  recentConvos.innerHTML = '';
  threads
    .sort((a, b) => b.createdAt - a.createdAt)
    .forEach(thread => {
      const li = document.createElement('li');
      li.className = `sidebar__item${thread.id === activeThreadId ? ' active' : ''}`;
      li.dataset.threadId = thread.id;
      li.textContent = thread.title;
      recentConvos.appendChild(li);
    });
}

function renderThreadMessages(thread) {
  if (!chatStream || !thread) return;
  chatStream.innerHTML = '';
  thread.messages.forEach(message => appendMessage(message));
  chatStream.scrollTop = chatStream.scrollHeight;
}

function hydrateWorkspaceControls(thread) {
  if (!thread) return;
  if (personaWorkspace && thread.persona) personaWorkspace.value = thread.persona;
  if (workspaceDepth && thread.depth) workspaceDepth.value = thread.depth;
  if (workspaceOverlayToggle) workspaceOverlayToggle.checked = !!thread.overlay;
  if (workspaceModeToggle) workspaceModeToggle.checked = !!thread.offline;
  workspaceOverlayOn = !!thread.overlay;
  workspaceOffline = !!thread.offline;
  updateDepthLabel();
  updateWorkspaceStatus();
}

function setActiveThread(threadId) {
  const thread = threads.find(t => t.id === threadId) || threads[0];
  if (!thread) return;
  activeThreadId = thread.id;
  renderThreadList();
  hydrateWorkspaceControls(thread);
  renderThreadMessages(thread);
  persistThreads();
}

function createNewThread() {
  const id = `thread-${Date.now()}`;
  const thread = {
    id,
    title: `New chat · ${nowLabel()}`,
    createdAt: Date.now(),
    persona: personaWorkspace?.value || 'strategist',
    depth: Number(workspaceDepth?.value || 3),
    overlay: workspaceOverlayToggle?.checked || false,
    offline: workspaceModeToggle?.checked || false,
    messages: [
      { role: 'agent', meta: 'Agent 13 · Strategist · Ready', text: 'New thread. Set persona, depth, and overlay then brief me.' },
    ],
  };
  threads.push(thread);
  setActiveThread(id);
}

function recordMessageOnThread(message) {
  const thread = threads.find(t => t.id === activeThreadId);
  if (!thread) return;
  thread.persona = personaWorkspace?.value || thread.persona;
  thread.depth = Number(workspaceDepth?.value || thread.depth || 3);
  thread.overlay = workspaceOverlayToggle?.checked ?? thread.overlay;
  thread.offline = workspaceModeToggle?.checked ?? thread.offline;
  thread.messages.push(message);
  persistThreads();
}

function syncThreadStateFromControls() {
  const thread = threads.find(t => t.id === activeThreadId);
  if (!thread) return;
  thread.persona = personaWorkspace?.value || thread.persona;
  thread.depth = Number(workspaceDepth?.value || thread.depth || 3);
  thread.overlay = workspaceOverlayToggle?.checked ?? thread.overlay;
  thread.offline = workspaceModeToggle?.checked ?? thread.offline;
  persistThreads();
}

function loadUser() {
  authedUser = safeParse(localStorage.getItem(STORAGE_KEYS.user), null);
}

function persistUser() {
  try {
    if (authedUser) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(authedUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.user);
    }
  } catch {
    // Non-blocking if localStorage is unavailable.
  }
}

function renderAuth() {
  const label = authedUser?.name || authedUser?.email || 'Signed out';
  if (mainUserPill) mainUserPill.textContent = label;
  if (workspaceUserPill) workspaceUserPill.textContent = label;
}

function loadApiKey() {
  openAiKey = localStorage.getItem(STORAGE_KEYS.apiKey) || '';
}

function persistApiKey() {
  try {
    if (openAiKey) {
      localStorage.setItem(STORAGE_KEYS.apiKey, openAiKey);
    } else {
      localStorage.removeItem(STORAGE_KEYS.apiKey);
    }
  } catch {
    // Best-effort; static hosting may block storage.
  }
}

function renderApiStatus() {
  const status = openAiKey ? 'OpenAI ready' : 'API key needed';
  if (apiStatusPill) apiStatusPill.textContent = status;
  if (workspaceApiStatusPill) workspaceApiStatusPill.textContent = status;
  if (apiKeyInput) apiKeyInput.value = '';
  if (workspaceApiKeyInput) workspaceApiKeyInput.value = '';
}

function attachApiKeyFromInput(input) {
  if (!input) return;
  const candidate = input.value.trim();
  if (!candidate) {
    openAiKey = '';
    persistApiKey();
    renderApiStatus();
    updateWorkspaceStatus();
    return;
  }
  openAiKey = candidate;
  persistApiKey();
  renderApiStatus();
  updateWorkspaceStatus();
}

async function startGoogleSignIn() {
  // Prefer Google Identity Services if available, otherwise fall back to a quick prompt.
  if (window.google?.accounts?.id) {
    try {
      window.google.accounts.id.prompt(notification => {
        if (notification?.isNotDisplayed()) {
          // fallback prompt
        }
      });
    } catch {
      // Ignore and fall through to prompt.
    }
  }

  const email = window.prompt('Google sign-in: enter your email to continue');
  if (!email) return;
  const name = email.split('@')[0];
  authedUser = { name, email, provider: 'Google' };
  persistUser();
  renderAuth();
}

async function respondInWorkspace(message) {
  if (!chatStream) return;
  const persona = personaWorkspace ? personaWorkspace.value : 'strategist';
  const depth = workspaceDepth ? Number(workspaceDepth.value) : 3;
  const depthHint = depth >= 4 ? 'Blueprint-level' : depth >= 3 ? 'Tactical' : 'Lightweight';
  const overlayLabel = workspaceOverlayOn ? '🧭 Symbolic overlay active' : 'Overlay muted';
  const meta = `Agent 13 · ${personaDetails[persona]?.title || 'Adaptive'} · ${workspaceOffline ? 'Offline' : 'Online'}`;

  if (workspaceOffline) {
    const agentMessage = {
      role: 'agent',
      meta,
      text: `Offline cache engaged. ${depthHint} response queued with cached rituals. I will mark where live citations normally appear.`,
      overlay: overlayLabel,
    };
    appendMessage(agentMessage);
    recordMessageOnThread(agentMessage);
    return;
  }

  if (!openAiKey) {
    const agentMessage = {
      role: 'agent',
      meta,
      text: 'Live responses need your OpenAI API key. Paste it into the Attach API field to enable web-grade replies.',
      overlay: overlayLabel,
    };
    appendMessage(agentMessage);
    recordMessageOnThread(agentMessage);
    return;
  }

  if (composerStatus) composerStatus.textContent = 'Contacting OpenAI...';
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.7,
        messages: [
          {
            role: 'system',
            content: `You are Agent 13, an adaptive AI. Persona: ${persona}. Depth: ${depthHint}. Overlay: ${overlayLabel}. Provide concise, actionable answers.`,
          },
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI error ${response.status}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content?.trim();
    const agentMessage = {
      role: 'agent',
      meta,
      text: content || 'OpenAI responded without content. Try again with a brief objective.',
      overlay: overlayLabel,
    };
    appendMessage(agentMessage);
    recordMessageOnThread(agentMessage);
  } catch (err) {
    const agentMessage = {
      role: 'agent',
      meta,
      text: `Live call failed. Reason: ${err?.message || 'Unknown error'}. I can keep working offline or you can retry.`,
      overlay: overlayLabel,
    };
    appendMessage(agentMessage);
    recordMessageOnThread(agentMessage);
  } finally {
    updateWorkspaceStatus();
  }
}

async function handleChatSubmit(event) {
  if (!chatForm || !chatInput) return;
  event.preventDefault();
  const message = chatInput.value.trim();
  if (!message) return;
  const userMessage = { role: 'user', meta: authedUser ? authedUser.name || 'You' : 'You', text: message };
  appendMessage(userMessage);
  recordMessageOnThread(userMessage);
  chatInput.value = '';
  await respondInWorkspace(message);
}

function resetChat() {
  if (!chatStream) return;
  createNewThread();
}

function updateWorkspaceStatus() {
  if (workspaceModeLabel) {
    workspaceModeLabel.textContent = workspaceOffline ? 'Offline' : 'Online';
    workspaceModeLabel.classList.toggle('pill--bright', !workspaceOffline);
  }
  if (composerStatus) {
    if (workspaceOffline) {
      composerStatus.textContent = 'Offline · using cached playbooks';
    } else if (openAiKey) {
      composerStatus.textContent = 'Online · OpenAI connected';
    } else {
      composerStatus.textContent = 'Online · add OpenAI API key for live calls';
    }
  }
  renderOverlaySignals(workspaceOverlayGrid, workspaceOverlayOn);
  const workspaceObjective = (chatInput && chatInput.value) || 'Workspace objective';
  renderTeam(workspaceTeam, workspaceDepth?.value, workspaceObjective, workspaceOffline, workspaceOverlayOn);
  syncThreadStateFromControls();
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').catch(() => {
      // Service workers are best-effort here.
    });
  }
}

function init() {
  loadUser();
  renderAuth();
  loadApiKey();
  renderApiStatus();
  loadThreads();
  renderPersonaCards();
  renderOverlaySignals(overlayGrid, showOverlay);
  renderOverlaySignals(workspaceOverlayGrid, workspaceOverlayOn);
  renderTeam(teamGrid, depthControl?.value, objectiveInput?.value, offlineMode, showOverlay);
  renderTeam(workspaceTeam, workspaceDepth?.value, chatInput?.value, workspaceOffline, workspaceOverlayOn);
  registerServiceWorker();

  if (chatStream && threads.length) {
    setActiveThread(activeThreadId || threads[0].id);
  }

  if (personaSelect) {
    personaSelect.addEventListener('change', renderPersonaCards);
  }
  if (depthControl) {
    depthControl.addEventListener('input', () => {
      updateDepthLabel();
      renderTeam(teamGrid, depthControl.value, objectiveInput?.value, offlineMode, showOverlay);
    });
  }
  if (workspaceDepth) {
    workspaceDepth.addEventListener('input', () => {
      updateDepthLabel();
      updateWorkspaceStatus();
    });
  }
  if (personaWorkspace) {
    personaWorkspace.addEventListener('change', () => {
      syncThreadStateFromControls();
      renderTeam(workspaceTeam, workspaceDepth?.value, chatInput?.value, workspaceOffline, workspaceOverlayOn);
    });
  }
  if (modeToggle && modeLabel) {
    modeToggle.addEventListener('change', () => {
      offlineMode = modeToggle.checked;
      modeLabel.textContent = offlineMode ? 'Offline' : 'Online';
      modeLabel.classList.toggle('pill--bright', !offlineMode);
      renderTeam(teamGrid, depthControl?.value, objectiveInput?.value, offlineMode, showOverlay);
    });
  }
  if (workspaceModeToggle) {
    workspaceModeToggle.addEventListener('change', () => {
      workspaceOffline = workspaceModeToggle.checked;
      updateWorkspaceStatus();
    });
  }
  if (overlayToggle) {
    overlayToggle.addEventListener('change', () => {
      showOverlay = overlayToggle.checked;
      renderOverlaySignals(overlayGrid, showOverlay);
      renderTeam(teamGrid, depthControl?.value, objectiveInput?.value, offlineMode, showOverlay);
    });
  }
  if (workspaceOverlayToggle) {
    workspaceOverlayToggle.addEventListener('change', () => {
      workspaceOverlayOn = workspaceOverlayToggle.checked;
      updateWorkspaceStatus();
    });
  }
  if (assembleButton) {
    assembleButton.addEventListener('click', () => renderTeam(teamGrid, depthControl?.value, objectiveInput?.value, offlineMode, showOverlay));
  }
  if (liveLookupButton && liveOutput) {
    liveLookupButton.addEventListener('click', runLiveLookup);
  }
  if (objectiveInput) {
    objectiveInput.addEventListener('input', () => renderTeam(teamGrid, depthControl?.value, objectiveInput.value, offlineMode, showOverlay));
  }
  if (chatForm) {
    chatForm.addEventListener('submit', handleChatSubmit);
  }
  if (newChatButton) {
    newChatButton.addEventListener('click', () => {
      resetChat();
    });
  }
  if (recentConvos) {
    recentConvos.addEventListener('click', event => {
      const li = event.target.closest('li');
      if (!li || !li.dataset.threadId) return;
      setActiveThread(li.dataset.threadId);
    });
  }
  if (mainGoogleButton) {
    mainGoogleButton.addEventListener('click', startGoogleSignIn);
  }
  if (workspaceGoogleButton) {
    workspaceGoogleButton.addEventListener('click', startGoogleSignIn);
  }
  if (saveApiKeyButton) {
    saveApiKeyButton.addEventListener('click', () => attachApiKeyFromInput(apiKeyInput));
  }
  if (workspaceSaveApiKeyButton) {
    workspaceSaveApiKeyButton.addEventListener('click', () => attachApiKeyFromInput(workspaceApiKeyInput));
  }
  const suggestionButtons = document.querySelectorAll('.composer__suggestions .pill');
  if (suggestionButtons.length) {
    suggestionButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (chatInput) {
          chatInput.value = btn.textContent;
          chatInput.focus();
        }
      });
    });
  }
  if (topNewChat) {
    topNewChat.addEventListener('click', () => {
      window.location.href = './workspace.html';
    });
  }

  updateDepthLabel();
  updateWorkspaceStatus();
}

document.addEventListener('DOMContentLoaded', init);
