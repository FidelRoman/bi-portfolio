// --- Búsqueda y filtros ---
const search = document.getElementById('search');
const chips = document.querySelectorAll('.chip');
const cards = [...document.querySelectorAll('.card')];

function applyFilters(){
  const q = (search.value || '').trim().toLowerCase();
  const active = document.querySelector('.chip.active')?.dataset.filter || 'all';

  cards.forEach(card=>{
    const type = card.dataset.type;
    const text = (card.dataset.title + ' ' + card.dataset.tags).toLowerCase();
    const passType = active==='all' || type===active;
    const passQuery = !q || text.includes(q);
    card.classList.toggle('hide', !(passType && passQuery));
  });
}

chips.forEach(c=>{
  c.addEventListener('click', ()=>{
    chips.forEach(x=>x.classList.remove('active'));
    c.classList.add('active');
    applyFilters();
  });
});

search.addEventListener('input', applyFilters);

// --- Lightbox (click en imagen) ---
const dlg = document.getElementById('lightbox');
const dlgImg = dlg.querySelector('.lightbox-img');

document.getElementById('gallery').addEventListener('click', e=>{
  const img = e.target.closest('img');
  if(!img) return;
  dlgImg.src = img.currentSrc || img.src;
  dlg.showModal();
});

dlg.addEventListener('click', (e)=>{ if(e.target.hasAttribute('data-close')) dlg.close(); });

// --- Tecla ESC para cerrar ---
document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && dlg.open) dlg.close(); });

// Inicial
applyFilters();