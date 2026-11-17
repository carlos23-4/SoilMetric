
import './style.css'

const app = document.querySelector('#app')

let currentPage = 'dashboard'
let samples = loadSamples()
let expandedSampleId = null

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
    items: [['settings', '⚙', 'Settings']]
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

function loadSamples() {
  try {
    return JSON.parse(localStorage.getItem('soilmetric_samples')) || []
  } catch {
    return []
  }
}

function saveSamples() {
  localStorage.setItem('soilmetric_samples', JSON.stringify(samples))
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char])
}

function generateSampleId() {
  const date = new Date().toISOString().slice(0, 10).replaceAll('-', '')
  const prefix = `SM-${date}-`

  const numbers = samples
    .filter(sample => sample.id.startsWith(prefix))
    .map(sample => Number(sample.id.slice(prefix.length)))
    .filter(Number.isFinite)

  return `${prefix}${String(Math.max(0, ...numbers) + 1).padStart(3, '0')}`
}

function formatDate(date) {
  if (!date) return '—'

  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return date

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(parsed)
}

function renderNavigation() {
  return navigation.map(group => `
    <div class="nav-group">
      <div class="nav-heading">${group.heading}</div>
      ${group.items.map(([id, icon, label]) => `
        <button class="nav-link ${currentPage === id ? 'active' : ''}"
          data-page="${id}" type="button">
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
  const soilCount = samples.filter(s => s.type === 'Soil').length
  const plantCount = samples.filter(s => s.type === 'Plant').length

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
      ${[
        ['Total Samples', samples.length, 'Samples registered', '◫', 'blue'],
        ['Soil Samples', soilCount, 'Soil samples registered', '▤', 'blue'],
        ['Plant Samples', plantCount, 'Plant samples registered', '♧', 'orange'],
        ['Reports Generated', 0, 'Laboratory reports', '▧', 'purple']
      ].map(([label, value, foot, icon, colour]) => `
        <article class="stat-card">
          <div class="stat-top">
            <span class="stat-label">${label}</span>
            <span class="stat-icon ${colour}">${icon}</span>
          </div>
          <div class="stat-value">${value}</div>
          <div class="stat-foot">${foot}</div>
        </article>
      `).join('')}
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

        ${samples.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">▤</div>
            <h3>No laboratory records yet</h3>
            <p>Register a sample to begin managing laboratory records.</p>
            <button class="primary-button" data-page="samples" type="button">
              Register your first sample
            </button>
          </div>
        ` : `
          <div class="recent-samples">
            ${[...samples].reverse().slice(0, 5).map(sample => `
              <div class="recent-sample-row">
                <div>
                  <strong>${escapeHTML(sample.id)}</strong>
                  <span>${escapeHTML(sample.name)}</span>
                </div>
                <span class="sample-type-badge">${escapeHTML(sample.type)}</span>
              </div>
            `).join('')}
          </div>
        `}
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
          'Soil pH', 'Organic Carbon', 'Organic Matter',
          'Total Nitrogen', 'Available Nitrogen',
          'Total Phosphorus', 'Available Phosphorus', 'CEC',
          'Exchangeable Calcium', 'Exchangeable Magnesium',
          'Exchangeable Potassium', 'Exchangeable Sodium',
          'Total Exchangeable Bases', 'Exchangeable Acidity',
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

function samplesContent() {
  return `
    <section class="welcome-section">
      <div>
        <div class="eyebrow">LABORATORY WORKSPACE</div>
        <h1>Sample Management</h1>
        <p>Register, organise and track laboratory samples.</p>
      </div>
      <button class="primary-button" id="show-sample-form" type="button">
        ＋ Register Sample
      </button>
    </section>

    <section class="panel sample-form-panel" id="sample-form-panel" hidden>
      <div class="panel-header">
        <div>
          <h2>Register a New Sample</h2>
          <p>Enter the sample information below.</p>
        </div>
        <button class="text-button" id="close-sample-form" type="button">
          Close ✕
        </button>
      </div>

      <form id="sample-form" class="sample-form">
        <div class="form-grid">
          <label class="form-field">
            <span>Sample type <b>*</b></span>
            <select name="type" id="sample-type" required>
              <option value="Soil">Soil</option>
              <option value="Plant">Plant</option>
            </select>
          </label>

          <label class="form-field">
            <span>Sample name / description <b>*</b></span>
            <input name="name" required maxlength="100"
              placeholder="e.g. Farm A - Plot 1">
          </label>

          <label class="form-field">
            <span>Sampling location <b>*</b></span>
            <input name="location" required maxlength="120"
              placeholder="e.g. Keta, Volta Region">
          </label>

          <label class="form-field">
            <span>Collection date <b>*</b></span>
            <input name="date" type="date" required
              value="${new Date().toISOString().slice(0, 10)}">
          </label>

          <label class="form-field" id="depth-field">
            <span>Sampling depth</span>
            <input name="depth" maxlength="50" placeholder="e.g. 0–20 cm">
          </label>

          <label class="form-field" id="plant-details-field" hidden>
            <span>Crop / plant part</span>
            <input name="plantDetails" maxlength="100"
              placeholder="e.g. Maize leaf">
          </label>

          <label class="form-field">
            <span>Collected by</span>
            <input name="collectedBy" maxlength="100"
              placeholder="Name of sampler">
          </label>

          <label class="form-field full-width">
            <span>Notes</span>
            <textarea name="notes" rows="3" maxlength="1000"
              placeholder="Additional sample information..."></textarea>
          </label>
        </div>

        <div class="form-actions">
          <button class="secondary-button" id="cancel-sample-form"
            type="button">Cancel</button>
          <button class="primary-button" type="submit">Save Sample</button>
        </div>
      </form>
    </section>

    <section class="panel sample-list-panel">
      <div class="panel-header">
        <div>
          <h2>Registered Samples</h2>
          <p>All samples recorded in this workspace.</p>
        </div>
        <span class="module-count" id="sample-count"></span>
      </div>

      <div class="sample-toolbar">
        <input id="sample-search" type="search"
          placeholder="Search by ID, name or location..."
          aria-label="Search samples">
        <select id="sample-filter" aria-label="Filter by sample type">
          <option value="All">All sample types</option>
          <option value="Soil">Soil</option>
          <option value="Plant">Plant</option>
        </select>
      </div>

      <div class="table-wrapper">
        <table class="sample-table">
          <thead>
            <tr>
              <th>Sample ID</th>
              <th>Sample name</th>
              <th>Type</th>
              <th>Location</th>
              <th>Collection date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="sample-table-body"></tbody>
        </table>
      </div>
    </section>
  `
}

function sampleTableRows() {
  const search = document.querySelector('#sample-search')?.value.toLowerCase() || ''
  const filter = document.querySelector('#sample-filter')?.value || 'All'

  const filtered = [...samples].reverse().filter(sample => {
    const matchesType = filter === 'All' || sample.type === filter
    const text = [
      sample.id, sample.name, sample.type,
      sample.location, sample.collectedBy
    ].join(' ').toLowerCase()

    return matchesType && text.includes(search)
  })

  const count = document.querySelector('#sample-count')
  const body = document.querySelector('#sample-table-body')

  if (!count || !body) return

  count.textContent = `${filtered.length} sample${filtered.length === 1 ? '' : 's'}`

  if (!filtered.length) {
    body.innerHTML = `
      <tr>
        <td colspan="6" class="table-empty">
          ${samples.length
            ? 'No samples match your search.'
            : 'No samples registered yet. Register your first sample above.'}
        </td>
      </tr>
    `
    return
  }

  body.innerHTML = filtered.map(sample => `
    <tr>
      <td><strong class="sample-id">${escapeHTML(sample.id)}</strong></td>
      <td><strong>${escapeHTML(sample.name)}</strong></td>
      <td>
        <span class="sample-type-badge ${sample.type.toLowerCase()}">
          ${escapeHTML(sample.type)}
        </span>
      </td>
      <td>${escapeHTML(sample.location)}</td>
      <td>${formatDate(sample.date)}</td>
      <td>
        <div class="sample-actions">
          <button class="small-action-button"
            data-view-sample="${escapeHTML(sample.id)}" type="button">View</button>
          <button class="small-action-button delete"
            data-delete-sample="${escapeHTML(sample.id)}" type="button">Delete</button>
        </div>
      </td>
    </tr>

    ${expandedSampleId === sample.id ? `
      <tr class="sample-detail-row">
        <td colspan="6">
          <div class="sample-detail-content">
            <div><strong>Sample ID:</strong> ${escapeHTML(sample.id)}</div>
            <div><strong>Type:</strong> ${escapeHTML(sample.type)}</div>
            <div><strong>Location:</strong> ${escapeHTML(sample.location)}</div>
            <div><strong>Collection date:</strong> ${formatDate(sample.date)}</div>
            <div><strong>Depth:</strong> ${escapeHTML(sample.depth || 'Not specified')}</div>
            <div><strong>Crop / plant part:</strong> ${escapeHTML(sample.plantDetails || 'Not applicable')}</div>
            <div><strong>Collected by:</strong> ${escapeHTML(sample.collectedBy || 'Not specified')}</div>
            <div><strong>Notes:</strong> ${escapeHTML(sample.notes || 'None')}</div>
          </div>
        </td>
      </tr>
    ` : ''}
  `).join('')
}

function renderPage(page) {
  if (page === 'dashboard') return dashboardContent()
  if (page === 'samples') return samplesContent()

  const descriptions = {
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

function closeWorkspaceMenu() {
  const menu = document.querySelector('#workspace-menu')
  const button = document.querySelector('#workspace-toggle')

  if (!menu || !button) return

  menu.hidden = true
  button.setAttribute('aria-expanded', 'false')
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
            <button class="menu-button" id="menu-toggle"
              type="button" aria-label="Toggle menu">☰</button>
            <span class="breadcrumb">
              SoilMetric <span>/</span>
              <strong id="breadcrumb-title">${pageTitles[currentPage]}</strong>
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
                <button data-page="dashboard" type="button">Dashboard</button>
                <button data-page="samples" type="button">Sample Management</button>
                <button data-page="soil-analysis" type="button">Soil Analysis</button>
                <button data-page="plant-analysis" type="button">Plant Analysis</button>
              </div>
            </div>
            <span class="date-label" id="current-date"></span>
            <div class="user-avatar">R</div>
          </div>
        </header>

        <main class="page-content" id="page-content">
          ${renderPage(currentPage)}
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

  if (currentPage === 'samples') sampleTableRows()
}

function navigate(page) {
  if (!pageTitles[page]) return

  currentPage = page

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page)
  })

  document.querySelector('#breadcrumb-title').textContent = pageTitles[page]
  document.querySelector('#page-content').innerHTML = renderPage(page)
  document.querySelector('#sidebar').classList.remove('sidebar-open')

  closeWorkspaceMenu()

  if (page === 'samples') sampleTableRows()
}

function toggleSampleForm(show) {
  const panel = document.querySelector('#sample-form-panel')
  if (!panel) return

  panel.hidden = !show

  if (show) {
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' })
    panel.querySelector('input[name="name"]').focus()
  }
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
    const opening = menu.hidden

    menu.hidden = !opening
    button.setAttribute('aria-expanded', String(opening))
    return
  }

  if (event.target.closest('#show-sample-form')) {
    toggleSampleForm(true)
    return
  }

  if (
    event.target.closest('#close-sample-form') ||
    event.target.closest('#cancel-sample-form')
  ) {
    toggleSampleForm(false)
    return
  }

  const viewButton = event.target.closest('[data-view-sample]')

  if (viewButton) {
    const id = viewButton.dataset.viewSample
    expandedSampleId = expandedSampleId === id ? null : id
    sampleTableRows()
    return
  }

  const deleteButton = event.target.closest('[data-delete-sample]')

  if (deleteButton) {
    const id = deleteButton.dataset.deleteSample
    const sample = samples.find(item => item.id === id)

    if (sample && confirm(`Delete sample ${sample.id}? This cannot be undone.`)) {
      samples = samples.filter(item => item.id !== id)
      expandedSampleId = null
      saveSamples()
      navigate('samples')
    }
    return
  }

  if (!event.target.closest('.workspace-control')) {
    closeWorkspaceMenu()
  }
})

app.addEventListener('submit', event => {
  if (event.target.id !== 'sample-form') return

  event.preventDefault()

  const data = new FormData(event.target)

  const sample = {
    id: generateSampleId(),
    type: String(data.get('type') || ''),
    name: String(data.get('name') || '').trim(),
    location: String(data.get('location') || '').trim(),
    date: String(data.get('date') || ''),
    depth: String(data.get('depth') || '').trim(),
    plantDetails: String(data.get('plantDetails') || '').trim(),
    collectedBy: String(data.get('collectedBy') || '').trim(),
    notes: String(data.get('notes') || '').trim(),
    registeredAt: new Date().toISOString()
  }

  if (!sample.name || !sample.location || !sample.date) {
    alert('Please complete all required fields.')
    return
  }

  samples.push(sample)
  saveSamples()
  expandedSampleId = null
  navigate('samples')
})

app.addEventListener('input', event => {
  if (event.target.id === 'sample-search') sampleTableRows()
})

app.addEventListener('change', event => {
  if (event.target.id === 'sample-filter') sampleTableRows()

  if (event.target.id === 'sample-type') {
    const isPlant = event.target.value === 'Plant'
    document.querySelector('#depth-field').hidden = isPlant
    document.querySelector('#plant-details-field').hidden = !isPlant
  }
})

document.addEventListener('click', event => {
  if (!event.target.closest('.workspace-control')) {
    closeWorkspaceMenu()
  }
})

renderApp()
