// --- Carga dinámica desde data.json + búsqueda, filtros y lightbox ---

async function loadGallery() {
  const container = document.getElementById('gallery');
  if (!container) return;

  try {
    const res = await fetch('data.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    container.innerHTML = '';

    data.forEach((item) => {
      const article = document.createElement('article');
      article.className = 'card';
      article.dataset.type = item.type || '';
      article.dataset.title = item.title || '';
      article.dataset.tags = (item.tags || []).join(',');
      article.dataset.kicker = item.kicker || '';

      article.innerHTML = `
        <div class="thumb">
          <img loading="lazy" src="${item.image}" alt="${item.title || 'Proyecto'}" />
          <span class="badge">${item.type ? (item.type.charAt(0).toUpperCase() + item.type.slice(1)) : ''}</span>
        </div>
        <div class="body">
          <div class="kicker">${item.kicker || ''}</div>
          <div class="h3">${item.title || ''}</div>
        </div>
        <div class="tags">
          ${(item.tags || []).map((t) => `<span class="tag">${t}</span>`).join('')}
        </div>
        <div class="cta">
          <a class="btn brand" href="${item.demoUrl || '#'}" target="_blank" rel="noopener">Ver demo</a>
        </div>
      `;
      container.appendChild(article);
    });
  } catch (err) {
    console.error('No se pudo cargar data.json:', err);
    const warn = document.createElement('p');
    warn.className = 'footer';
    warn.textContent = '⚠️ No se pudo cargar data.json. Sirve el sitio con Live Server o GitHub Pages.';
    container.appendChild(warn);
  }
}

function applyFilters() {
  const search = document.getElementById('search');
  const q = (search?.value || '').trim().toLowerCase();
  const active = document.querySelector('.chip.active')?.dataset.filter || 'all';

  const cards = document.querySelectorAll('.card');
  cards.forEach((card) => {
    const type = card.dataset.type || '';
    const text = (
      (card.dataset.title || '') +
      ' ' +
      (card.dataset.tags || '') +
      ' ' +
      (card.dataset.kicker || '')
    ).toLowerCase();
    const passType = active === 'all' || type === active;
    const passQuery = !q || text.includes(q);
    card.classList.toggle('hide', !(passType && passQuery));
  });
}

function setupUI() {
  const search = document.getElementById('search');
  const chips = document.querySelectorAll('.chip');

  chips.forEach((c) => {
    c.addEventListener('click', () => {
      chips.forEach((x) => x.classList.remove('active'));
      c.classList.add('active');
      applyFilters();
    });
  });

  search?.addEventListener('input', applyFilters);

  // Lightbox (delegación)
  const dlg = document.getElementById('lightbox');
  const dlgImg = dlg?.querySelector('.lightbox-img');
  const gallery = document.getElementById('gallery');

  if (gallery && dlg && dlgImg) {
    gallery.addEventListener('click', (e) => {
      const img = e.target.closest('img');
      if (!img) return;
      dlgImg.src = img.currentSrc || img.src;
      dlg.showModal();
    });

    dlg.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-close')) dlg.close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dlg.open) dlg.close();
    });
  }
}

// Init
(async function init() {
  setupUI();
  await loadGallery();
  applyFilters(); // aplicar filtros tras renderizar las tarjetas
})();