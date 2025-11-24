/* Sistema Integral de Mantenimiento - app.js
   Funcionalidad:
   - Manejo de paneles
   - Agregar/Eliminar técnicos
   - Guardar salidas en localStorage (persistencia)
   - Renderizar dashboard e historial
   - Generar y descargar reportes
*/

const STORAGE_KEY = 'sim_salidas_v1';
let salidas = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
let personalCount = 0;

const panels = {
  dashboard: document.getElementById('panel-dashboard'),
  salidas: document.getElementById('panel-salidas'),
  historial: document.getElementById('panel-historial'),
  reportes: document.getElementById('panel-reportes')
};
const navButtons = {
  dashboard: document.getElementById('nav-dashboard'),
  salidas: document.getElementById('nav-salidas'),
  historial: document.getElementById('nav-historial'),
  reportes: document.getElementById('nav-reportes')
};

function showPanel(name){
  Object.values(panels).forEach(p => p.style.display = 'none');
  Object.values(navButtons).forEach(b => b.classList.remove('active'));
  panels[name].style.display = 'block';
  navButtons[name].classList.add('active');
  actualizarDashboard();
  renderHistorial();
}

navButtons.dashboard.addEventListener('click', ()=> showPanel('dashboard'));
navButtons.salidas.addEventListener('click', ()=> showPanel('salidas'));
navButtons.historial.addEventListener('click', ()=> showPanel('historial'));
navButtons.reportes.addEventListener('click', ()=> showPanel('reportes'));

function addPersonal(){
  personalCount++;
  const container = document.getElementById('personalContainer');
  const block = document.createElement('div');
  block.className = 'personal-block';
  block.dataset.idx = personalCount;
  block.innerHTML = `
    <div style="display:flex;gap:8px;align-items:center">
      <strong>Técnico ${personalCount}</strong>
      <button style="margin-left:auto" class="mini" data-action="remove" data-idx="${personalCount}">Eliminar</button>
    </div>
    <label>Nombre y Apellido
      <input class="pers_nombre" placeholder="Nombre completo">
    </label>
    <label>Grado
      <input class="pers_grado">
    </label>
    <label>Rol
      <input class="pers_rol">
    </label>
  `;
  container.appendChild(block);
}

function removePersonalByIdx(idx){
  const container = document.getElementById('personalContainer');
  const node = container.querySelector(`div[data-idx="${idx}"]`);
  if(node) node.remove();
}

document.getElementById('btnAddPersonal').addEventListener('click', addPersonal);
document.getElementById('btnClearPersonal').addEventListener('click', ()=>{
  document.getElementById('personalContainer').innerHTML = '';
  personalCount = 0;
});

document.getElementById('personalContainer').addEventListener('click', (e)=>{
  const btn = e.target.closest('button[data-action="remove"]');
  if(btn){
    const idx = btn.getAttribute('data-idx');
    removePersonalByIdx(idx);
  }
});

document.getElementById('formSalida').addEventListener('submit', function(ev){
  ev.preventDefault();
  guardarSalida();
});

document.getElementById('btnReset').addEventListener('click', ()=>{
  if(confirm('Limpiar formulario?')){
    document.getElementById('formSalida').reset();
    document.getElementById('personalContainer').innerHTML = '';
    personalCount = 0;
  }
});

function guardarSalida(){
  const salida = {
    fecha: document.getElementById('gen_fecha').value || new Date().toLocaleDateString(),
    numero: document.getElementById('gen_numero').value || '',
    unidad: document.getElementById('gen_unidad').value || '',
    transporte: document.getElementById('transporte_tipo').value || 'maritima',
    placa: document.getElementById('transporte_placa').value || '',
    combustible: document.getElementById('combustible').value || '',
    combustibleCant: document.getElementById('combustible_cant').value || '',
    ayuda: document.getElementById('an_nombre').value || '',
    estado: document.getElementById('an_estado').value || '',
    posicion: document.getElementById('an_posicion').value || '',
    tipoMantenimiento: document.getElementById('an_tipo').value || '',
    descripcion: document.getElementById('descripcion_general').value || '',
    personal: []
  };

  document.querySelectorAll('#personalContainer .personal-block').forEach(block=>{
    const nombre = block.querySelector('.pers_nombre')?.value || '';
    const grado = block.querySelector('.pers_grado')?.value || '';
    const rol = block.querySelector('.pers_rol')?.value || '';
    if(nombre || grado || rol) salida.personal.push({nombre, grado, rol});
  });

  if(!salida.ayuda){
    alert('Completa el campo: Nombre de la Ayuda a la Navegación');
    return;
  }

  salidas.push(salida);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(salidas));

  document.getElementById('formSalida').reset();
  document.getElementById('personalContainer').innerHTML = '';
  personalCount = 0;

  actualizarDashboard();
  renderHistorial();
  alert('Salida registrada correctamente');
}

function renderHistorial(){
  const cont = document.getElementById('lista-historial');
  cont.innerHTML = '';
  if(salidas.length===0){
    cont.innerHTML = '<div class="muted">No hay registros.</div>';
    return;
  }
  salidas.slice().reverse().forEach((s, i)=>{
    const card = document.createElement('div');
    card.className = 'card';
    const idx = salidas.length - i;
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div><strong>${escapeHtml(s.ayuda || '—')}</strong><div class="muted">${escapeHtml(s.fecha)} · ${escapeHtml(s.transporte)}</div></div>
        <div class="muted">Salida #${escapeHtml(s.numero || idx)}</div>
      </div>
      <div style="margin-top:8px">${escapeHtml(s.descripcion || 'Sin descripción')}</div>
      <div style="margin-top:8px;font-size:14px"><strong>Personal:</strong> ${s.personal.map(p=>escapeHtml(p.nombre||'—')).join(', ') || '—'}</div>
    `;
    cont.appendChild(card);
  });
}

function actualizarDashboard(){
  document.getElementById('countSalidas').innerText = salidas.length;
  document.getElementById('countMar').innerText = salidas.filter(s=>s.transporte==='maritima').length;
  document.getElementById('countFluvial').innerText = salidas.filter(s=>s.transporte==='fluvial').length;
  document.getElementById('countTerrestre').innerText = salidas.filter(s=>s.transporte==='terrestre').length;
}

function generarReporte(){
  let texto = 'REPORTE MENSUAL DE SALIDAS\\n========================\\n';
  salidas.forEach((s, idx)=>{
    texto += `\\nSalida #${idx+1} — Fecha: ${s.fecha}\\nAyuda: ${s.ayuda}\\nTipo: ${s.transporte}\\nPosición: ${s.posicion}\\nDescripción: ${s.descripcion}\\nPersonal:\\n`;
    s.personal.forEach(p=> texto += ` - ${p.nombre} | ${p.grado} | ${p.rol}\\n`);
    texto += '-----------------------------\\n';
  });
  document.getElementById('reporte').innerText = texto;
}

function descargarReporte(){
  const text = document.getElementById('reporte').innerText;
  const blob = new Blob([text], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'reporte_salidas.txt';
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function exportJson(){
  const data = JSON.stringify(salidas, null, 2);
  const blob = new Blob([data], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'salidas.json';
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, function(tag){
    const chars = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"};
    return chars[tag] || tag;
  });
}

document.getElementById('btnGenerar').addEventListener('click', generarReporte);
document.getElementById('btnDescargar').addEventListener('click', descargarReporte);
document.getElementById('btnExportJson').addEventListener('click', exportJson);

actualizarDashboard();
renderHistorial();
showPanel('dashboard');
