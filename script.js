// script.js - index page
async function loadApps(){
  try{
    const res = await fetch('apps.json');
    const apps = await res.json();
    renderList(apps);

    const search = document.getElementById('search');
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      const filtered = apps.filter(a => a.nombre.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q));
      renderList(filtered);
    });
  } catch(err){
    console.error('Error cargando apps:', err);
    document.getElementById('app-list').innerHTML = '<p>Error cargando aplicaciones.</p>';
  }
}

function renderList(apps){
  const container = document.getElementById('app-list');
  if(!apps.length){
    container.innerHTML = '<p>No se encontraron aplicaciones.</p>';
    return;
  }
  container.innerHTML = apps.map(a => `
    <article class="app-card">
      <img class="icon" src="${a.img}" alt="${a.nombre}">
      <div class="app-title">${a.nombre}</div>
      <div class="app-desc">${a.desc}</div>
      <div>
        <a class="btn detail-link" href="app.html?id=${a.id}">Ver</a>
        <a class="btn" href="${a.archivo}" download>Descargar APK</a>
      </div>
    </article>
  `).join('');
}

document.addEventListener('DOMContentLoaded', loadApps);