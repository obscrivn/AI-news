document.addEventListener('DOMContentLoaded', () => {
  fetchData();
});

async function fetchData() {
  try {
    const response = await fetch('./data.json');
    if (!response.ok) {
      throw new Error(`Failed to load data: ${response.statusText}`);
    }
    const data = await response.json();
    renderPage(data);
  } catch (error) {
    console.error('Error fetching daily summaries:', error);
    showErrorState(error.message);
  }
}

function renderPage(data) {
  // 1. Last Updated Badge
  const lastUpdatedEl = document.getElementById('last-updated');
  if (data.lastUpdated) {
    const dateObj = new Date(data.lastUpdated);
    const localTime = dateObj.toLocaleDateString(undefined, {
      dateStyle: 'medium'
    }) + ' at ' + dateObj.toLocaleTimeString(undefined, {
      timeStyle: 'short'
    });
    lastUpdatedEl.textContent = `Last Updated: ${localTime}`;
  } else {
    lastUpdatedEl.textContent = 'Last Updated: N/A';
  }

  // 2. Render Highlights Briefing
  const highlightsList = document.getElementById('highlights-list');
  highlightsList.innerHTML = '';
  if (data.highlights && data.highlights.length > 0) {
    data.highlights.forEach(hl => {
      const li = document.createElement('li');
      li.textContent = hl;
      highlightsList.appendChild(li);
    });
  } else {
    highlightsList.innerHTML = '<li>No specific briefing notes compiled for today. Check feed cards.</li>';
  }

  // 3. Render categories
  renderFeedCategory('agents', data.agents);
  renderFeedCategory('models', data.models);
  renderFeedCategory('tools', data.tools);
  renderFeedCategory('companies', data.companies);
  renderFeedCategory('learning', data.learning);
}

function renderFeedCategory(id, items) {
  const container = document.getElementById(`${id}-feed`);
  if (!container) return;
  container.innerHTML = '';

  if (!items || items.length === 0) {
    container.innerHTML = `<p class="loading-placeholder">No developments reported in this category today.</p>`;
    return;
  }

  // Render top 3 items
  items.slice(0, 3).forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'news-item';
    
    const titleLink = document.createElement('a');
    titleLink.className = 'news-title-link';
    titleLink.href = item.link;
    titleLink.target = '_blank';
    titleLink.rel = 'noopener noreferrer';
    titleLink.textContent = item.title;

    const summaryEl = document.createElement('p');
    summaryEl.className = 'news-summary';
    summaryEl.textContent = item.summary || 'Summary unavailable.';

    const metaEl = document.createElement('div');
    metaEl.className = 'news-meta';
    
    const sourceEl = document.createElement('span');
    sourceEl.className = 'source-tag';
    sourceEl.textContent = item.source || 'Unknown';

    metaEl.appendChild(sourceEl);

    itemEl.appendChild(titleLink);
    itemEl.appendChild(summaryEl);
    itemEl.appendChild(metaEl);

    container.appendChild(itemEl);
  });
}

function showErrorState(message) {
  const lastUpdatedEl = document.getElementById('last-updated');
  lastUpdatedEl.textContent = 'Error loading updates';
  lastUpdatedEl.style.borderColor = 'rgba(239, 68, 68, 0.4)';
  lastUpdatedEl.style.background = 'rgba(239, 68, 68, 0.1)';
  lastUpdatedEl.style.color = '#fca5a5';

  const placeholders = document.querySelectorAll('.card-content, #highlights-list');
  placeholders.forEach(el => {
    el.innerHTML = `
      <p style="color: #fca5a5; font-size: 0.85rem; font-style: italic;">
        ⚠️ Failed to display data. Ensure that data.json exists and contains valid JSON.
      </p>
    `;
  });
}
