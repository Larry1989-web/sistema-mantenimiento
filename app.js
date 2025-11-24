/* Sistema Integral de Mantenimiento - app.js */

// --- Storage ---
const STORAGE_KEY = "sim_salidas_v1";
let salidas = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
let personalCount = 0;

// --- Paneles ---
function showPanel(nombre) {
  document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
  document.getElementById("panel-" + nombre).classList.add("active");
  actualizarDashboard();
  renderHistorial();
}

// --- Personal dinámico ---
function addPersonal() {
  personalCount++;
  const cont = document.getElementById("personalContainer");

  const div = document.createElement("div");
  div.className = "personal-block";
  div.dataset.idx = personalCount;

  div.innerHTML = `
    <strong>Técnico #${personalCount}</strong>
    <label>Nombre</label>
    <input class="pers_nombre" />

    <label>Grado</label>
    <input class="pers_grado" />

    <label>Rol</label>
    <input class="pers_rol" />

    <button onclick="removePersonal(${personalCount})">Eliminar</button>
  `;

  cont.appendChild(div);
}

function removePersonal(idx) {
  const nodo = document.querySelector(`.personal-block[data-idx="${idx}"]`);
  if (nodo) nodo.remove();
}

function clearPersonal() {
  document.getElementById("personalContainer").innerHTML = "";
  personalCount = 0;
}

// --- Guardar salida ---
function guardarSalida() {
  const salida = {
    fecha: document.getElementById("gen_fecha").value,
    numero: document.getElementById("gen_numero").value,
    unidad: document.getElementById("gen_unidad").value,
    transporte: document.getElementById("transporte_tipo").value,
    placa: document.getElementById("transporte_placa").value,
    combustible: document.getElementById("combustible").value,
    combustibleCant: document.getElementById("combustible_cant").value,
    ayuda: document.getElementById("an_nombre").value,
    estado: document.getElementById("an_estado").value,
    tipo: document.getElementById("an_tipo").value,
    posicion: document.getElementById("an_posicion").value,
    descripcion: document.getElementById("descripcion_general").value,
    personal: []
  };

  // Personal
  document.querySelectorAll(".personal-block").forEach(b => {
    const p = {
      nombre: b.querySelector(".pers_nombre").value,
      grado: b.querySelector(".pers_grado").value,
      rol: b.querySelector(".pers_rol").value
    };
    salida.personal.push(p);
  });

  if (!salida.ayuda) {
    alert("Debes ingresar la ayuda a la navegación.");
    return;
  }

  salidas.push(salida);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(salidas));

  alert("Salida registrada correctamente.");
  renderHistorial();
  actualizarDashboard();
}

// --- Historial ---
function renderHistorial() {
  const cont = document.getElementById("lista-historial");
  cont.innerHTML = "";

  if (salidas.length === 0) {
    cont.innerHTML = "<p>No hay registros.</p>";
    return;
  }

  salidas.forEach((s, idx) => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <strong>Salida #${idx + 1}</strong><br>
      ${s.fecha} - ${s.transporte}<br>
      <strong>${s.ayuda}</strong><br>
      <small>${s.descripcion.substring(0, 50)}...</small>
    `;
    cont.appendChild(div);
  });
}

// --- Dashboard ---
function actualizarDashboard() {
  document.getElementById("countSalidas").innerText = salidas.length;
  document.getElementById("countMar").innerText = salidas.filter(s => s.transporte === "maritima").length;
  document.getElementById("countFluvial").innerText = salidas.filter(s => s.transporte === "fluvial").length;
  document.getElementById("countTerrestre").innerText = salidas.filter(s => s.transporte === "terrestre").length;
}

// --- Reportes ---
function generarReporte() {
  let r = "REPORTE DE SALIDAS\n\n";

  salidas.forEach((s, i) => {
    r += `Salida #${i + 1}\nFecha: ${s.fecha}\nAyuda: ${s.ayuda}\nDescripción: ${s.descripcion}\n\n`;
  });

  document.getElementById("reporte").innerText = r;
}

function descargarReporte() {
  const text = document.getElementById("reporte").innerText;
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "reporte.txt";
  link.click();
}

// --- Eventos ---
document.getElementById("btnAddPersonal").onclick = addPersonal;
document.getElementById("btnClearPersonal").onclick = clearPersonal;
document.getElementById("btnGuardar").onclick = guardarSalida;
document.getElementById("btnGenerar").onclick = generarReporte;
document.getElementById("btnDescargar").onclick = descargarReporte;

showPanel("dashboard");


