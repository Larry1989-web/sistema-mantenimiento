<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sistema Integral de Mantenimiento</title>

  <link rel="stylesheet" href="styles.css">
</head>

<body>

  <div class="sidebar">
    <h1>Sistema Integral de Mantenimiento</h1>

    <button onclick="showPanel('dashboard')">📊 Dashboard</button>
    <button onclick="showPanel('salidas')">📝 Registrar Salida</button>
    <button onclick="showPanel('historial')">📚 Historial</button>
    <button onclick="showPanel('reportes')">📄 Reportes</button>

    <div class="footer">
      <small>Formato original:</small><br>
      <a href="083.pdf" target="_blank">Ver PDF</a>
    </div>
  </div>

  <main class="content">

    <!-- DASHBOARD -->
    <section id="panel-dashboard" class="panel active">
      <h2>Dashboard General</h2>

      <div class="dash-grid">
        <div class="dashCard">
          <h3>Total de Salidas</h3>
          <p id="countSalidas" class="dashNum">0</p>
        </div>

        <div class="dashCard">
          <h3>Marítimas</h3>
          <p id="countMar" class="dashNum">0</p>
        </div>

        <div class="dashCard">
          <h3>Fluviales</h3>
          <p id="countFluvial" class="dashNum">0</p>
        </div>

        <div class="dashCard">
          <h3>Terrestres</h3>
          <p id="countTerrestre" class="dashNum">0</p>
        </div>
      </div>
    </section>

    <!-- REGISTRAR SALIDA -->
    <section id="panel-salidas" class="panel">

      <h2>Registrar Salida</h2>

      <label>Fecha</label>
      <input type="date" id="gen_fecha">

      <label>No. de salida</label>
      <input type="text" id="gen_numero">

      <label>Unidad</label>
      <input type="text" id="gen_unidad">

      <h3>Personal participante</h3>
      <div id="personalContainer"></div>

      <button id="btnAddPersonal">+ Agregar técnico</button>
      <button id="btnClearPersonal">Limpiar personal</button>

      <h3>Transporte</h3>
      <label>Tipo</label>
      <select id="transporte_tipo">
        <option value="maritima">Marítimo</option>
        <option value="fluvial">Fluvial</option>
        <option value="terrestre">Terrestre</option>
      </select>

      <label>Placa / Nombre</label>
      <input type="text" id="transporte_placa">

      <label>Combustible</label>
      <select id="combustible">
        <option>Gasolina</option>
        <option>ACPM</option>
      </select>

      <label>Cantidad</label>
      <input type="text" id="combustible_cant">

      <h3>Mantenimiento</h3>
      <label>Ayuda a la navegación</label>
      <input type="text" id="an_nombre">

      <label>Estado</label>
      <select id="an_estado">
        <option>Sin novedad</option>
        <option>Fuera de servicio</option>
        <option>Con limitación</option>
      </select>

      <label>Tipo</label>
      <select id="an_tipo">
        <option>Programado</option>
        <option>Imprevisto</option>
      </select>

      <label>Posición</label>
      <input type="text" id="an_posicion">

      <label>Descripción</label>
      <textarea id="descripcion_general"></textarea>

      <button id="btnGuardar" class="primary">Guardar salida</button>
      <button id="btnReset">Reset</button>

    </section>

    <!-- HISTORIAL -->
    <section id="panel-historial" class="panel">
      <h2>Historial de salidas</h2>
      <div id="lista-historial"></div>
    </section>

    <!-- REPORTES -->
    <section id="panel-reportes" class="panel">
      <h2>Reportes</h2>
      <button id="btnGenerar">Generar reporte</button>
      <button id="btnDescargar">Descargar .txt</button>
      <pre id="reporte"></pre>
    </section>

  </main>

  <script src="app.js"></script>
</body>
</html>

