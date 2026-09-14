// Base de datos simulada
const usuarios = [
    { correo: "jefe@torrecentral.cl", pass: "123456", nombre: "Roberto Gómez", rol: "Jefe de Mantenimiento" },
    { correo: "arrendatario@torrecentral.cl", pass: "123456", nombre: "Empresa TechCorp", rol: "Arrendatario" }
];

document.addEventListener("DOMContentLoaded", function () {
    configurarAuth();
    configurarFormularios();
});

// Login y registro
function cargarCredenciales(correo, pass) {
    if (document.getElementById("loginCorreo")) {
        document.getElementById("loginCorreo").value = correo;
        document.getElementById("loginPass").value = pass;
    }
}

function toggleAuthForms(mostrarRegistro) {
    document.getElementById("boxLogin")?.classList.toggle("d-none", mostrarRegistro);
    document.getElementById("boxRegistro")?.classList.toggle("d-none", !mostrarRegistro);
}

function configurarAuth() {
    const formLogin = document.getElementById("formLogin");
    
    if (formLogin) {
        formLogin.addEventListener("submit", function (e) {
            e.preventDefault();
            const correo = document.getElementById("loginCorreo").value.trim();
            const pass = document.getElementById("loginPass").value.trim();
            const msg = document.getElementById("msgLogin");
            const user = usuarios.find(u => u.correo === correo && u.pass === pass);
            
            if (user) {
                if (user.rol === "Jefe de Mantenimiento") {
                    window.location.href = "dashJefeMantenimiento.html";
                } else if (user.rol === "Arrendatario") {
                    window.location.href = "dashArrendatario.html";
                } else {
                    msg.textContent = "Rol sin vista asociada.";
                    msg.style.color = "#dc3545";
                }
            } else {
                msg.textContent = "Credenciales incorrectas.";
                msg.style.color = "#dc3545";
            }
        });
    }

    const formRegistro = document.getElementById("formRegistro");
    
    if (formRegistro) {
        formRegistro.addEventListener("submit", function (e) {
            e.preventDefault();
            const nombre = document.getElementById("regNombre").value.trim();
            const correo = document.getElementById("regCorreo").value.trim();
            const rol = document.getElementById("regRol").value;
            const pass = document.getElementById("regPass").value.trim();

            usuarios.push({ correo, pass, nombre, rol });
            const msgRegistro = document.getElementById("msgRegistro");
            msgRegistro.textContent = "Cuenta creada. Inicie sesión.";
            msgRegistro.style.color = "#198754";
            
            setTimeout(() => toggleAuthForms(false), 1200);
        });
    }
}

// Interacciones (menu Y formulario)
function mostrarSeccion(idSeccion, elLink) {
    document.querySelectorAll(".seccion-modulo").forEach(sec => sec.classList.add("d-none"));
    document.getElementById(idSeccion)?.classList.remove("d-none");

    document.querySelectorAll(".sidebar-link").forEach(link => link.classList.remove("active"));
    if (elLink) elLink.classList.add("active");
}

function toggleSidebar() {
    document.getElementById("sidebar")?.classList.toggle("cerrada");
}

function configurarFormularios() {
    const formSolicitud = document.getElementById("formSolicitud");
    
    if (formSolicitud) {
        formSolicitud.addEventListener("submit", function (e) {
            e.preventDefault();
            const msg = document.getElementById("solicitudMensaje");
            msg.textContent = "Solicitud ingresada correctamente con folio SOL-104.";
            msg.style.color = "#198754";
            
            this.reset();
            
            setTimeout(() => {
                msg.textContent = "";
            }, 4000);
        });
    }
}