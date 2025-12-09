// app.js - página detalle
function getQueryParam(name){
  const params = new URLSearchParams(location.search);
  return params.get(name);
}

async function showDetail(){
  const id = Number(getQueryParam('id'));
  if(!id){
    document.getElementById('detail-container').innerHTML = '<p>ID de app inválido.</p>';
    return;
  }

  try{
    const res = await fetch('apps.json');
    const apps = await res.json();
    const app = apps.find(a => a.id === id);
    if(!app){
      document.getElementById('detail-container').innerHTML = '<p>Aplicación no encontrada.</p>';
      return;
    }

    document.getElementById('detail-container').innerHTML = `
      <section style="display:flex;gap:20px;align-items:center;flex-wrap:wrap;">
        <img src="${app.img}" alt="${app.nombre}" style="width:140px;height:140px;border-radius:22px;object-fit:cover">
        <div style="flex:1;min-width:220px">
          <h2 style="margin:0 0 6px">${app.nombre}</h2>
          <p style="margin:0 0 8px;color:var(--muted)">${app.desc}</p>
          <p style="margin:6px 0;color:var(--muted)">Versión: ${app.version} • Tamaño: ${app.tam}</p>
          <p style="margin-top:12px">
            <a class="btn" href="${app.archivo}" download>Descargar APK</a>
          </p>
        </div>
      </section>
      <hr style="margin:20px 0">
      <section>
        <h3>Más información</h3>
        <p style="color:var(--muted)">Recuerda que nuestras aplicaciones .</p>
      </section>
    `;
  } catch(err){
    console.error(err);
    document.getElementById('detail-container').innerHTML = '<p>Error cargando la aplicación.</p>';
  }
}

document.addEventListener('DOMContentLoaded', showDetail);