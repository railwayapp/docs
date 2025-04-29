const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

// 📌 Base de datos SQLite
const db = new sqlite3.Database("./empresas.db", err => {
    if (err) console.error("❌ Error abriendo BD", err);
    else db.run("CREATE TABLE IF NOT EXISTS empresas (id INTEGER PRIMARY KEY, nombre TEXT, direccion TEXT, responsable TEXT, correo TEXT, telefono TEXT, horario1 TEXT, horario2 TEXT, horario3 TEXT)");
});

// 📌 API para registrar empresas
app.post("/guardarEmpresa", (req, res) => {
    const { nombre, direccion, responsable, correo, telefono, horario1, horario2, horario3 } = req.body;
    db.run("INSERT INTO empresas (nombre, direccion, responsable, correo, telefono, horario1, horario2, horario3) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
        [nombre, direccion, responsable, correo, telefono, horario1, horario2, horario3], 
        err => {
            if (err) res.status(500).json({ error: "❌ Error al guardar" });
            else res.json({ mensaje: "✅ Empresa guardada" });
    });
});

// 📌 API para obtener empresas
app.get("/empresas", (req, res) => {
    db.all("SELECT * FROM empresas", [], (err, rows) => {
        if (err) res.status(500).json({ error: "❌ Error al obtener empresas" });
        else res.json(rows);
    });
});

// 📌 Envío de correos automáticos
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: "TU_CORREO@gmail.com", pass: "TU_PASSWORD" }
});

function enviarCorreo(destinatario, mensaje) {
    transporter.sendMail({
        from: "TU_CORREO@gmail.com",
        to: destinatario,
        subject: "📌 Notificación de Empresa",
        text: mensaje
    }, (err, info) => {
        if (err) console.error("❌ Error enviando correo:", err);
        else console.log("📩 Correo enviado:", info.response);
    });
}

// 📌 Cron job para enviar alertas en horarios específicos (24/7)
cron.schedule("* * * * *", () => {  // 🚀 Ejecuta cada minuto (ajústalo según necesidad)
    db.all("SELECT * FROM empresas", [], (err, empresas) => {
        if (err) return console.error("❌ Error obteniendo empresas", err);

        let horaActual = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

        empresas.forEach(empresa => {
            if ([empresa.horario1, empresa.horario2, empresa.horario3].includes(horaActual)) {
                enviarCorreo(empresa.correo, `⚠️ La empresa '${empresa.nombre}' tiene una notificación programada ahora.`);
            }
        });
    });
});

// 📌 Servir el frontend en la misma aplicación
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Gestión de Empresas</title>
            <script>
                async function registrarEmpresa() {
                    const empresa = {
                        nombre: document.getElementById("nombre").value,
                        direccion: document.getElementById("direccion").value,
                        responsable: document.getElementById("responsable").value,
                        correo: document.getElementById("correo").value,
                        telefono: document.getElementById("telefono").value,
                        horario1: document.getElementById("hora1").value,
                        horario2: document.getElementById("hora2").value,
                        horario3: document.getElementById("hora3").value
                    };

                    let respuesta = await fetch("/guardarEmpresa", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(empresa)
                    });

                    let resultado = await respuesta.json();
                    alert(resultado.mensaje);
                    obtenerEmpresas();
                }

                async function obtenerEmpresas() {
                    let respuesta = await fetch("/empresas");
                    let empresas = await respuesta.json();
                    let contenido = "<h2>Empresas Registradas</h2>";
                    empresas.forEach(emp => contenido += `<p>${emp.nombre} - ${emp.responsable} - ${emp.horario1}, ${emp.horario2}, ${emp.horario3}</p>`);
                    document.getElementById("empresas").innerHTML = contenido;
                }

                obtenerEmpresas();
            </script>
        </head>
        <body>
            <h1>Registro de Empresas</h1>
            <input type="text" id="nombre" placeholder="Nombre">
            <input type="text" id="direccion" placeholder="Dirección">
            <input type="text" id="responsable" placeholder="Responsable">
            <input type="email" id="correo" placeholder="Correo">
            <input type="tel" id="telefono" placeholder="Teléfono">
            <h3>Horarios de Notificación</h3>
            <input type="time" id="hora1"><input type="time" id="hora2"><input type="time" id="hora3">
            <button onclick="registrarEmpresa()">Guardar Empresa</button>
            <div id="empresas"></div>
        </body>
        </html>
    `);
});

app.listen(PORT, () => console.log(`✅ Servidor activo en http://localhost:${PORT}`));
