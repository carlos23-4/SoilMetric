
import './style.css'

const app = document.querySelector('#app')

let currentPage = 'dashboard'

const navigation = [
  {
    heading: 'OVERVIEW',
    items: [
      ['dashboard', '▦', 'Dashboard'],
      ['samples', '◫', 'Sample Management']
    ]
  },
  {
    heading: 'ANALYSIS',
    items: [
      ['soil-analysis', '▤', 'Soil Analysis'],
      ['plant-analysis', '♧', 'Plant Analysis']
    ]
  },
  {
    heading: 'LABORATORY',
    items: [
      ['quality-control', '◈', 'Quality Control'],
      ['interpretation', '⌁', 'Interpretation'],
      ['reports', '▧', 'Reports & Exports']
    ]
  },
  {
    heading: 'SYSTEM',
    items: [
      ['settings', '⚙', 'Settings']
    ]
  }
]

const quickAccess = [
  ['soil-analysis', '▤', 'Soil Analysis'],
  ['plant-analysis', '♧', 'Plant Analysis'],
  ['samples', '◫', 'Register Sample'],
  ['reports', '▧', 'Reports & Exports']
]

const pageTitles = {
  dashboard: 'Dashboard',
  samples: 'Sample Management',
  'soil-analysis': 'Soil Analysis',
  'plant-analysis': 'Plant Analysis',
  'quality-control': 'Quality Control',
  interpretation: 'Interpretation',
  reports: 'Reports & Exports',
  settings: 'Settings'
}

function renderNavigation() {
  return navigation.map(group => `
    <div class="nav-group">
      <div class="nav-heading">${group.heading}</div>

      ${group.items.map(([id, icon, label]) => `
        <button
          class="nav-link ${currentPage === id ? 'active' : ''}"
          data-page="${id}"
          type="button">
          <span class="nav-icon">${icon}</span>
          <span>${label}</span>
        </button>
      `).join('')}
    </div>
  `).join('')
}

function renderQuickAccess() {
  return `
    <div class="sidebar-quick-access">
      <div class="nav-heading">QUICK ACCESS</div>

      ${quickAccess.map(([id, icon, label]) => `
        <button class="quick-sidebar-link" data-page="${id}" type="button">
          <span class="nav-icon">${icon}</span>
          <span>${label}</span>
        </button>
      `).join('')}
    </div>
  `
}

function dashboardContent() {
  return `
    <section class="welcome-section">
      <div>
        <div class="eyebrow">LABORATORY OVERVIEW</div>
        <h1>Dashboard</h1>
        <p>Monitor your laboratory samples, analyses and reports.</p>
      </div>

      <button class="primary-button" data-page="samples" type="button">
        ＋ New Sample
      </button>
    </section>

    <section class="stats-grid">
      <article class="stat-card">
        <div class="stat-top">
          <span class="stat-label">Total Samples</span>
          <span class="stat-icon blue">◫</span>
        </div>
        <div class="stat-value">0</div>
        <div class="stat-foot">Samples registered</div>
      </article>

      <article class="stat-card">
        <div class="stat-top">
          <span class="stat-label">Soil Analyses</span>
          <span class="stat-icon blue">▤</span>
        </div>
        <div class="stat-value">0</div>
        <div class="stat-foot">Soil analysis records</div>
      </article>

      <article class="stat-card">
        <div class="stat-top">
          <span class="stat-label">Plant Analyses</span>
          <span class="stat-icon orange">♧</span>
        </div>
        <div class="stat-value">0</div>
        <div class="stat-foot">Plant tissue records</div>
      </article>

      <article class="stat-card">
        <div class="stat-top">
          <span class="stat-label">Reports Generated</span>
          <span class="stat-icon purple">▧</span>
        </div>
        <div class="stat-value">0</div>
        <div class="stat-foot">Laboratory reports</div>
      </article>
    </section>

    <section class="content-grid">
      <article class="panel activity-panel">
        <div class="panel-header">
          <div>
            <h2>Recent Laboratory Activities</h2>
            <p>Your latest laboratory records will appear here.</p>
          </div>

          <button class="text-button" data-page="samples" type="button">
            View samples →
          </button>
        </div>

        <div class="empty-state">
          <div class="empty-icon">▤</div>
          <h3>No laboratory records yet</h3>
          <p>Register a sample to begin managing laboratory records.</p>

          <button class="primary-button" data-page="samples" type="button">
            Register your first sample
          </button>
        </div>
      </article>
    </section>

    <section class="panel modules-panel">
      <div class="panel-header">
        <div>
          <h2>Laboratory Analysis Parameters</h2>
          <p>Parameters available for the analytical workspace.</p>
        </div>
        <span class="module-count">15 PARAMETERS</span>
      </div>

      <div class="parameter-grid">
        ${[
          'Soil pH',
          'Organic Carbon',
          'Organic Matter',
          'Total Nitrogen',
          'Available Nitrogen',
          'Total Phosphorus',
          'Available Phosphorus',
          'CEC',
          'Exchangeable Calcium',
          'Exchangeable Magnesium',
          'Exchangeable Potassium',
          'Exchangeable Sodium',
          'Total Exchangeable Bases',
          'Exchangeable Acidity',
          'Base Saturation'
        ].map(parameter => `
          <div class="parameter-item">
            <span class="parameter-dot"></span>
            ${parameter}
          </div>
        `).join('')}
      </div>
    </section>
  `
}

function renderPage(page) {
  if (page === 'dashboard') return dashboardContent()

  const descriptions = {
    samples: 'Register, organise and track laboratory samples.',
    'soil-analysis': 'Analyse soil physical and chemical properties.',
    'plant-analysis': 'Manage plant tissue analytical measurements.',
    'quality-control': 'Monitor laboratory accuracy, precision and quality.',
    interpretation: 'Interpret laboratory results using appropriate reference systems.',
    reports: 'Generate and export laboratory reports.',
    settings: 'Configure your laboratory system.'
  }

  return `
    <section class="welcome-section">
      <div>
        <div class="eyebrow">SOILMETRIC LABORATORY</div>
        <h1>${pageTitles[page]}</h1>
        <p>${descriptions[page]}</p>
      </div>
    </section>

    <section class="panel coming-soon">
      <div class="empty-icon">⌁</div>
      <h2>${pageTitles[page]}</h2>
      <p>This module will be developed in the next stages of SoilMetric.</p>

      <button class="primary-button" data-page="dashboard" type="button">
        Return to Dashboard
      </button>
    </section>
  `
}

function renderApp() {
  app.innerHTML = `
    <div class="app-layout">

      <aside class="sidebar" id="sidebar">

        <div class="brand">
          <div class="brand-mark">S</div>
          <div>
            <div class="brand-name">SoilMetric</div>
            <div class="brand-caption">LABORATORY SYSTEM</div>
          </div>
        </div>

        <nav class="main-navigation">
          ${renderNavigation()}
        </nav>

        ${renderQuickAccess()}

        <div class="sidebar-bottom">
          <div class="system-status">
            <span class="status-dot"></span>
            <span>Workspace ready</span>
          </div>
          <div class="version-label">SoilMetric · Version 0.1.0</div>
        </div>

      </aside>

      <div class="main-area">

        <header class="topbar">

          <div class="topbar-left">
            <button class="menu-button" id="menu-toggle" type="button"
              aria-label="Toggle menu">☰</button>

            <span class="breadcrumb">
              SoilMetric <span>/</span>
              <strong id="breadcrumb-title">Dashboard</strong>
            </span>
          </div>

          <div class="topbar-right">

            <div class="workspace-control">
              <button class="workspace-button" id="workspace-toggle"
                type="button" aria-expanded="false">
                ▦ Workspace <span>⌄</span>
              </button>

              <div class="workspace-menu" id="workspace-menu" hidden>
                <div class="workspace-menu-title">WORKSPACE SHORTCUTS</div>

                <button data-page="dashboard" type="button">
                  Dashboard
                </button>

                <button data-page="samples" type="button">
                  Sample Management
                </button>

                <button data-page="soil-analysis" type="button">
                  Soil Analysis
                </button>

                <button data-page="plant-analysis" type="button">
                  Plant Analysis
                </button>
              </div>
            </div>

            <span class="date-label" id="current-date"></span>
            <div class="user-avatar">R</div>

          </div>

        </header>

        <main class="page-content" id="page-content">
          ${dashboardContent()}
        </main>

        <footer class="app-footer">
          <span>SoilMetric Laboratory Management System</span>
          <span>Built for scientific accuracy and better laboratory data management.</span>
        </footer>

      </div>
    </div>
  `

  document.querySelector('#current-date').textContent =
    new Intl.DateTimeFormat('en', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(new Date())
}

function navigate(page) {
  if (!pageTitles[page]) return

  currentPage = page

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page)
  })

  document.querySelector('#breadcrumb-title').textContent =
    pageTitles[page]

  document.querySelector('#page-content').innerHTML =
    renderPage(page)

  document.querySelector('#sidebar').classList.remove('sidebar-open')

  closeWorkspaceMenu()
}

function closeWorkspaceMenu() {
  const menu = document.querySelector('#workspace-menu')
  const button = document.querySelector('#workspace-toggle')

  menu.hidden = true
  button.setAttribute('aria-expanded', 'false')
}

app.addEventListener('click', event => {
  const pageButton = event.target.closest('[data-page]')

  if (pageButton) {
    navigate(pageButton.dataset.page)
    return
  }

  if (event.target.closest('#menu-toggle')) {
    document.querySelector('#sidebar').classList.toggle('sidebar-open')
    return
  }

  if (event.target.closest('#workspace-toggle')) {
    const menu = document.querySelector('#workspace-menu')
    const button = document.querySelector('#workspace-toggle')
    const isOpening = menu.hidden

    menu.hidden = !isOpening
    button.setAttribute('aria-expanded', String(isOpening))
    return
  }

  if (!event.target.closest('.workspace-control')) {
    closeWorkspaceMenu()
  }
})

renderApp()
