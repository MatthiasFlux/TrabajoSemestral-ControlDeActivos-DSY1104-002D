const regiones = {
    "Metropolitana": ["Renca", "Santiago", "Providencia", "Las Condes", "Maipú", "Quilicura"],
    "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué"],
    "Biobío": ["Concepción", "Talcahuano", "Los Ángeles"]
};

const activos = [
    { codigo: "ACT001", nombre: "Ascensor 1", tipo: "Ascensor", ubicacion: "Piso 1", estado: "Operativo" },
    { codigo: "ACT002", nombre: "Ascensor 2", tipo: "Ascensor", ubicacion: "Piso 1", estado: "En mantenimiento" },
    { codigo: "ACT003", nombre: "Sistema Climatización Principal", tipo: "Climatización", ubicacion: "Piso 8", estado: "Operativo" },
    { codigo: "ACT004", nombre: "Generador Eléctrico 1", tipo: "Generador", ubicacion: "Sótano", estado: "Operativo" },
    { codigo: "ACT005", nombre: "Sistema de Seguridad Cámaras", tipo: "Seguridad", ubicacion: "Todo el edificio", estado: "Operativo" }
];

const usuariosIniciales = [
    { run: "19011022K", nombre: "Administrador", apellidos: "Torre Central", correo: "admin@duoc.cl", password: "admin123", rol: "Administrador" },
    { run: "19011023K", nombre: "Jefe", apellidos: "Mantenimiento", correo: "jefe@duoc.cl", password: "jefe123", rol: "Jefe de Mantenimiento" },
    { run: "19011024K", nombre: "Tecnico", apellidos: "Mantenimiento", correo: "tecnico@duoc.cl", password: "tecnico123", rol: "Técnico" },
    { run: "19011025K", nombre: "Encargado", apellidos: "Activos", correo: "activos@duoc.cl", password: "activos123", rol: "Encargado de Activos" },
    { run: "19011026K", nombre: "Arrendatario", apellidos: "Empresa", correo: "cliente@gmail.com", password: "cliente123", rol: "Arrendatario" }
];

const solicitudesIniciales = [
    { id: "SOL-001", activo: "Ascensor 2", descripcion: "Falla en puerta principal", estado: "En revisión" },
    { id: "SOL-002", activo: "Generador Eléctrico 1", descripcion: "Revisión preventiva de niveles", estado: "Resuelto" }
];

if (!localStorage.getItem("usuarios")) {
    localStorage.setItem("usuarios", JSON.stringify(usuariosIniciales));
}

document.addEventListener("DOMContentLoaded", function () {
    cargarRegiones();

    document.getElementById("loginCorreo").addEventListener("input", function () {
        validarCampoGenerico("errorLoginCorreo", validarCorreo(this.value.trim()), "Correo no válido.");
    });

    document.getElementById("run").addEventListener("input", function () {
        validarCampoGenerico("errorRun", validarRun(this.value.trim()), "RUN inválido.");
    });
});

function cargarRegiones() {
    const regionSelect = document.getElementById("region");
    const comunaSelect = document.getElementById("comuna");

    for (let reg in regiones) {
        let option = document.createElement("option");
        option.value = reg;
        option.textContent = reg;
        regionSelect.appendChild(option);
    }

    regionSelect.addEventListener("change", function () {
        comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
        if (regiones[this.value]) {
            regiones[this.value].forEach(comuna => {
                let option = document.createElement("option");
                option.value = comuna;
                option.textContent = comuna;
                comunaSelect.appendChild(option);
            });
        }
    });
}

function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function mostrarLogin() {
    document.getElementById("loginView").classList.remove("oculto");
    document.getElementById("registroView").classList.add("oculto");
    document.getElementById("dashboardView").classList.add("oculto");
}

function mostrarRegistro() {
    document.getElementById("loginView").classList.add("oculto");
    document.getElementById("registroView").classList.remove("oculto");
    document.getElementById("dashboardView").classList.add("oculto");
}

function mostrarDashboard(usuario) {
    document.getElementById("loginView").classList.add("oculto");
    document.getElementById("registroView").classList.add("oculto");
    document.getElementById("dashboardView").classList.remove("oculto");

    document.getElementById("usuarioNombre").textContent = usuario.nombre + " | " + usuario.rol;
    document.getElementById("mensajeBienvenida").textContent = "Bienvenido/a " + usuario.nombre + ". Perfil: " + usuario.rol;

    configurarMenu(usuario.rol);
    cargarActivos();
    cargarUsuarios();
    cargarSolicitudes();
    mostrarSeccion("inicio");
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("cerrada");
}

function cerrarSesion() {
    mostrarLogin();
}

function configurarMenu(rol) {
    const menus = {
        solicitudes: document.getElementById("menuSolicitudes"),
        ordenes: document.getElementById("menuOrdenes"),
        activos: document.getElementById("menuActivos"),
        mantenimientos: document.getElementById("menuMantenimientos"),
        usuarios: document.getElementById("menuUsuarios"),
        reportes: document.getElementById("menuReportes"),
        falla: document.getElementById("menuFalla")
    };

    Object.values(menus).forEach(menu => menu.classList.add("oculto"));

    if (rol === "Administrador") {
        menus.solicitudes.classList.remove("oculto");
        menus.ordenes.classList.remove("oculto");
        menus.activos.classList.remove("oculto");
        menus.mantenimientos.classList.remove("oculto");
        menus.usuarios.classList.remove("oculto");
        menus.reportes.classList.remove("oculto");
    } else if (rol === "Jefe de Mantenimiento") {
        menus.solicitudes.classList.remove("oculto");
        menus.ordenes.classList.remove("oculto");
        menus.mantenimientos.classList.remove("oculto");
    } else if (rol === "Técnico") {
        menus.ordenes.classList.remove("oculto");
    } else if (rol === "Encargado de Activos") {
        menus.activos.classList.remove("oculto");
    } else if (rol === "Arrendatario") {
        menus.solicitudes.classList.remove("oculto");
        menus.falla.classList.remove("oculto");
    }
}

function mostrarSeccion(seccion) {
    const secciones = [
        "seccionInicio", "seccionSolicitudes", "seccionOrdenes",
        "seccionActivos", "seccionMantenimientos", "seccionUsuarios",
        "seccionReportes", "seccionReportar"
    ];

    secciones.forEach(id => document.getElementById(id).classList.add("oculto"));

    const mapa = {
        inicio: "seccionInicio",
        solicitudes: "seccionSolicitudes",
        ordenes: "seccionOrdenes",
        activos: "seccionActivos",
        mantenimientos: "seccionMantenimientos",
        usuarios: "seccionUsuarios",
        reportes: "seccionReportes",
        reportar: "seccionReportar"
    };

    if (mapa[seccion]) {
        document.getElementById(mapa[seccion]).classList.remove("oculto");
    }
}

function cargarActivos() {
    const tbody = document.getElementById("tablaActivos");
    tbody.innerHTML = "";
    activos.forEach(act => {
        let fila = `<tr>
            <td>${act.codigo}</td>
            <td>${act.nombre}</td>
            <td>${act.tipo}</td>
            <td>${act.ubicacion}</td>
            <td><span class="badge ${act.estado === 'Operativo' ? 'bg-success' : 'bg-warning text-dark'}">${act.estado}</span></td>
        </tr>`;
        tbody.innerHTML += fila;
    });
}

function cargarUsuarios() {
    const tbody = document.getElementById("tablaUsuarios");
    tbody.innerHTML = "";
    obtenerUsuarios().forEach(u => {
        let fila = `<tr>
            <td>${u.run}</td>
            <td>${u.nombre} ${u.apellidos || ''}</td>
            <td>${u.correo}</td>
            <td>${u.rol}</td>
        </tr>`;
        tbody.innerHTML += fila;
    });
}

function cargarSolicitudes() {
    const tbody = document.getElementById("tablaSolicitudes");
    tbody.innerHTML = "";
    solicitudesIniciales.forEach(s => {
        let fila = `<tr>
            <td>${s.id}</td>
            <td>${s.activo}</td>
            <td>${s.descripcion}</td>
            <td><span class="badge bg-info text-dark">${s.estado}</span></td>
        </tr>`;
        tbody.innerHTML += fila;
    });
}

function verDetalleOrden(codigo, activo, ubicacion, estado, descripcion) {
    document.getElementById("modalDetalleTitulo").textContent = codigo + " - " + activo;
    document.getElementById("modalDetalleUbicacion").textContent = ubicacion;
    document.getElementById("modalDetalleEstado").textContent = estado;
    document.getElementById("modalDetalleDescripcion").textContent = descripcion;

    const modalElement = document.getElementById("modalDetalleOrden");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function validarCorreo(correo) {
    const regex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
    return regex.test(correo);
}

function validarRun(run) {
    if (!/^[0-9]{7,8}[0-9Kk]$/.test(run)) return false;
    let cuerpo = run.slice(0, -1);
    let digito = run.slice(-1).toUpperCase();
    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * multiplicador;
        multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
    }

    let resultado = 11 - (suma % 11);
    let dv = resultado === 11 ? "0" : resultado === 10 ? "K" : resultado.toString();
    return dv === digito;
}

function validarCampoGenerico(idElemento, esValido, mensajeError) {
    const elem = document.getElementById(idElemento);
    if (!esValido) {
        elem.textContent = mensajeError;
    } else {
        elem.textContent = "";
    }
}

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const correo = document.getElementById("loginCorreo").value.trim();
    const password = document.getElementById("loginPassword").value;
    const errorCorreo = document.getElementById("errorLoginCorreo");
    const errorPassword = document.getElementById("errorLoginPassword");
    const mensaje = document.getElementById("loginMensaje");

    errorCorreo.textContent = "";
    errorPassword.textContent = "";
    mensaje.textContent = "";

    let valido = true;

    if (!correo) {
        errorCorreo.textContent = "El correo es obligatorio.";
        valido = false;
    } else if (!validarCorreo(correo)) {
        errorCorreo.textContent = "Dominio de correo no permitido.";
        valido = false;
    }

    if (!password) {
        errorPassword.textContent = "La contraseña es obligatoria.";
        valido = false;
    }

    if (valido) {
        const usuarioEncontrado = obtenerUsuarios().find(u => u.correo === correo && u.password === password);
        if (usuarioEncontrado) {
            mostrarDashboard(usuarioEncontrado);
        } else {
            mensaje.textContent = "Credenciales incorrectas.";
            mensaje.style.color = "#dc3545";
        }
    }
});

document.getElementById("registroForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const run = document.getElementById("run").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const apellidos = document.getElementById("apellidos").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("passwordRegistro").value;
    const confirmPassword = document.getElementById("confirmarPassword").value;

    let esValido = true;

    if (!validarRun(run)) {
        document.getElementById("errorRun").textContent = "RUN no válido.";
        esValido = false;
    }
    if (!nombre) {
        document.getElementById("errorNombre").textContent = "Nombre requerido.";
        esValido = false;
    }
    if (!validarCorreo(correo)) {
        document.getElementById("errorCorreo").textContent = "Correo inválido.";
        esValido = false;
    }
    if (password.length < 6) {
        document.getElementById("errorPasswordRegistro").textContent = "Mínimo 6 caracteres.";
        esValido = false;
    }
    if (password !== confirmPassword) {
        document.getElementById("errorConfirmarPassword").textContent = "Las contraseñas no coinciden.";
        esValido = false;
    }

    if (esValido) {
        const lista = obtenerUsuarios();
        lista.push({ run, nombre, apellidos, correo, password, rol: "Arrendatario" });
        localStorage.setItem("usuarios", JSON.stringify(lista));
        alert("Usuario registrado con éxito. Ahora puede iniciar sesión.");
        mostrarLogin();
    }
});

document.getElementById("formSolicitud").addEventListener("submit", function (event) {
    event.preventDefault();

    const activo = document.getElementById("activoSolicitud").value;
    const descripcion = document.getElementById("descripcionSolicitud").value.trim();
    const mensaje = document.getElementById("solicitudMensaje");

    if (!activo || !descripcion) {
        mensaje.textContent = "Complete todos los campos.";
        mensaje.style.color = "#dc3545";
        return;
    }

    solicitudesIniciales.push({
        id: "SOL-00" + (solicitudesIniciales.length + 1),
        activo,
        descripcion,
        estado: "En revisión"
    });

    mensaje.textContent = "Solicitud creada exitosamente.";
    mensaje.style.color = "#198754";

    document.getElementById("formSolicitud").reset();
    cargarSolicitudes();
});