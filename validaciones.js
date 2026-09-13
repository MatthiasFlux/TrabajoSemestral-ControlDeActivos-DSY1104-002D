const regiones = {
    "Metropolitana": [
        "Renca",
        "Santiago",
        "Providencia",
        "Las Condes",
        "Maipú",
        "Quilicura"
    ],
    "Valparaíso": [
        "Valparaíso",
        "Viña del Mar",
        "Quilpué"
    ],
    "Biobío": [
        "Concepción",
        "Talcahuano",
        "Los Ángeles"
    ]
};

const activos = [
    {
        codigo: "ACT001",
        nombre: "Ascensor 1",
        tipo: "Ascensor",
        ubicacion: "Piso 1",
        estado: "Operativo"
    },
    {
        codigo: "ACT002",
        nombre: "Ascensor 2",
        tipo: "Ascensor",
        ubicacion: "Piso 1",
        estado: "En mantenimiento"
    },
    {
        codigo: "ACT003",
        nombre: "Sistema Climatización Principal",
        tipo: "Climatización",
        ubicacion: "Piso 8",
        estado: "Operativo"
    },
    {
        codigo: "ACT004",
        nombre: "Generador Eléctrico 1",
        tipo: "Generador",
        ubicacion: "Sótano",
        estado: "Operativo"
    },
    {
        codigo: "ACT005",
        nombre: "Sistema de Seguridad Cámaras",
        tipo: "Seguridad",
        ubicacion: "Todo el edificio",
        estado: "Operativo"
    }
];

const usuariosIniciales = [
    {
        run: "19011022K",
        nombre: "Administrador",
        apellidos: "Torre Central",
        correo: "admin@duoc.cl",
        password: "admin123",
        rol: "Administrador"
    },
    {
        run: "19011023K",
        nombre: "Jefe",
        apellidos: "Mantenimiento",
        correo: "jefe@duoc.cl",
        password: "jefe123",
        rol: "Jefe de Mantenimiento"
    },
    {
        run: "19011024K",
        nombre: "Tecnico",
        apellidos: "Mantenimiento",
        correo: "tecnico@duoc.cl",
        password: "tecnico123",
        rol: "Técnico"
    },
    {
        run: "19011025K",
        nombre: "Encargado",
        apellidos: "Activos",
        correo: "activos@duoc.cl",
        password: "activos123",
        rol: "Encargado de Activos"
    },
    {
        run: "19011026K",
        nombre: "Arrendatario",
        apellidos: "Empresa",
        correo: "cliente@gmail.com",
        password: "cliente123",
        rol: "Arrendatario"
    }
];

if (!localStorage.getItem("usuarios")) {
    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuariosIniciales)
    );
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

    document.getElementById("usuarioNombre").textContent =
        usuario.nombre + " | " + usuario.rol;

    document.getElementById("mensajeBienvenida").textContent =
        "Bienvenido/a " + usuario.nombre + ". Perfil: " + usuario.rol;

    configurarMenu(usuario.rol);

    cargarActivos();
    cargarUsuarios();
    cargarSolicitudes();

    mostrarSeccion("inicio");
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

    Object.values(menus).forEach(menu => {
        menu.classList.add("oculto");
    });

    if (rol === "Administrador") {

        menus.solicitudes.classList.remove("oculto");
        menus.ordenes.classList.remove("oculto");
        menus.activos.classList.remove("oculto");
        menus.mantenimientos.classList.remove("oculto");
        menus.usuarios.classList.remove("oculto");
        menus.reportes.classList.remove("oculto");

    }

    if (rol === "Jefe de Mantenimiento") {

        menus.solicitudes.classList.remove("oculto");
        menus.ordenes.classList.remove("oculto");
        menus.mantenimientos.classList.remove("oculto");

    }

    if (rol === "Técnico") {

        menus.ordenes.classList.remove("oculto");

    }

    if (rol === "Encargado de Activos") {

        menus.activos.classList.remove("oculto");

    }

    if (rol === "Arrendatario") {

        menus.solicitudes.classList.remove("oculto");
        menus.falla.classList.remove("oculto");

    }
}

function mostrarSeccion(seccion) {

    const secciones = [
        "seccionInicio",
        "seccionSolicitudes",
        "seccionOrdenes",
        "seccionActivos",
        "seccionMantenimientos",
        "seccionUsuarios",
        "seccionReportes",
        "seccionReportar"
    ];

    secciones.forEach(id => {
        document.getElementById(id).classList.add("oculto");
    });

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

function validarCorreo(correo) {

    const regex =
        /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;

    return regex.test(correo);
}

function validarRun(run) {

    if (!/^[0-9]{7,8}[0-9Kk]$/.test(run)) {
        return false;
    }

    let cuerpo = run.slice(0, -1);
    let digito = run.slice(-1).toUpperCase();

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {

        suma += Number(cuerpo[i]) * multiplicador;

        multiplicador++;

        if (multiplicador > 7) {
            multiplicador = 2;
        }
    }

    let resultado = 11 - (suma % 11);

    let dv;

    if (resultado === 11) {
        dv = "0";
    } else if (resultado === 10) {
        dv = "K";
    } else {
        dv = resultado.toString();
    }

    return dv === digito;
}

function limpiarErroresRegistro() {

    document.querySelectorAll("#registroForm .error").forEach(
        elemento => elemento.textContent = ""
    );
}

document.getElementById("loginForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const correo =
            document.getElementById("loginCorreo").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const errorCorreo =
            document.getElementById("errorLoginCorreo");

        const errorPassword =
            document.getElementById("errorLoginPassword");

        const mensaje =
            document.getElementById("loginMensaje");

        errorCorreo.textContent = "";
        errorPassword.textContent = "";
        mensaje.textContent = "";

        let valido = true;

        if (correo === "") {
            errorCorreo.textContent =
                "El correo es obligatorio.";
            valido = false;
        } else if (correo.length > 100) {
            errorCorreo.textContent =
                "El correo no puede superar los 100 caracteres.";
            valido = false;
        } else if (!validarCorreo(correo)) {
            errorCorreo.textContent =
                "Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
            valido = false;
        }

        if (password === "") {
            errorPassword.textContent =
                "La contraseña es obligatoria.";
            valido = false;
        } else if (password.length < 4 || password.length > 10) {
            errorPassword.textContent =
                "La contraseña debe tener entre 4 y 10 caracteres.";
            valido = false;
        }

        if (!valido) {
            return;
        }

        const usuarios = obtenerUsuarios();

        const usuario = usuarios.find(
            usuario =>
                usuario.correo.toLowerCase() === correo.toLowerCase() &&
                usuario.password === password
        );

        if (!usuario) {

            mensaje.textContent =
                "Correo o contraseña incorrectos.";

            mensaje.style.color = "#dc3545";

            return;
        }

        localStorage.setItem(
            "usuarioActual",
            JSON.stringify(usuario)
        );

        mostrarDashboard(usuario);
    }
);


document.getElementById("registroForm").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        limpiarErroresRegistro();

        const run =
            document.getElementById("run").value.trim();

        const nombre =
            document.getElementById("nombre").value.trim();

        const apellidos =
            document.getElementById("apellidos").value.trim();

        const correo =
            document.getElementById("correo").value.trim();

        const direccion =
            document.getElementById("direccion").value.trim();

        const password =
            document.getElementById("passwordRegistro").value;

        const confirmar =
            document.getElementById("confirmarPassword").value;

        let valido = true;

        if (run === "") {
            document.getElementById("errorRun").textContent =
                "El RUN es obligatorio.";
            valido = false;
        } else if (!validarRun(run)) {
            document.getElementById("errorRun").textContent =
                "El RUN no es válido. Use formato sin puntos ni guion.";
            valido = false;
        }

        if (nombre === "") {
            document.getElementById("errorNombre").textContent =
                "El nombre es obligatorio.";
            valido = false;
        }

        if (apellidos === "") {
            document.getElementById("errorApellidos").textContent =
                "Los apellidos son obligatorios.";
            valido = false;
        }

        if (correo === "") {
            document.getElementById("errorCorreo").textContent =
                "El correo es obligatorio.";
            valido = false;
        } else if (correo.length > 100) {
            document.getElementById("errorCorreo").textContent =
                "Máximo 100 caracteres.";
            valido = false;
        } else if (!validarCorreo(correo)) {
            document.getElementById("errorCorreo").textContent =
                "Correo no permitido.";
            valido = false;
        }

        if (direccion === "") {
            document.getElementById("errorDireccion").textContent =
                "La dirección es obligatoria.";
            valido = false;
        }

        if (password.length < 4 || password.length > 10) {
            document.getElementById("errorPasswordRegistro").textContent =
                "La contraseña debe tener entre 4 y 10 caracteres.";
            valido = false;
        }

        if (password !== confirmar) {
            document.getElementById("errorConfirmarPassword").textContent =
                "Las contraseñas no coinciden.";
            valido = false;
        }

        if (!valido) {
            return;
        }

        const usuarios = obtenerUsuarios();

        const existe = usuarios.some(
            usuario =>
                usuario.correo.toLowerCase() === correo.toLowerCase()
        );

        if (existe) {

            document.getElementById("errorCorreo").textContent =
                "Este correo ya está registrado.";

            return;
        }

        const nuevoUsuario = {
            run: run.toUpperCase(),
            nombre: nombre,
            apellidos: apellidos,
            correo: correo,
            password: password,
            fechaNacimiento:
                document.getElementById("fechaNacimiento").value,
            region:
                document.getElementById("region").value,
            comuna:
                document.getElementById("comuna").value,
            direccion: direccion,
            rol: "Arrendatario"
        };

        usuarios.push(nuevoUsuario);

        localStorage.setItem(
            "usuarios",
            JSON.stringify(usuarios)
        );

        const mensaje =
            document.getElementById("registroMensaje");

        mensaje.textContent =
            "Registro exitoso. Ahora puedes iniciar sesión.";

        mensaje.style.color = "#198754";

        document.getElementById("registroForm").reset();

        setTimeout(() => {
            mostrarLogin();
        }, 1500);
    }
);


const regionSelect =
    document.getElementById("region");

const comunaSelect =
    document.getElementById("comuna");

Object.keys(regiones).forEach(region => {

    const option =
        document.createElement("option");

    option.value = region;
    option.textContent = region;

    regionSelect.appendChild(option);
});


regionSelect.addEventListener(
    "change",
    function() {

        comunaSelect.innerHTML =
            '<option value="">Seleccione una comuna</option>';

        const comunas =
            regiones[this.value] || [];

        comunas.forEach(comuna => {

            const option =
                document.createElement("option");

            option.value = comuna;
            option.textContent = comuna;

            comunaSelect.appendChild(option);
        });
    }
);


function cargarActivos() {

    const tabla =
        document.getElementById("tablaActivos");

    tabla.innerHTML = "";

    activos.forEach(activo => {

        const fila =
            document.createElement("tr");

        fila.innerHTML = `
            <td>${activo.codigo}</td>
            <td>${activo.nombre}</td>
            <td>${activo.tipo}</td>
            <td>${activo.ubicacion}</td>
            <td>${activo.estado}</td>
        `;

        tabla.appendChild(fila);
    });
}


function cargarUsuarios() {

    const tabla =
        document.getElementById("tablaUsuarios");

    tabla.innerHTML = "";

    const usuarios =
        obtenerUsuarios();

    usuarios.forEach(usuario => {

        const fila =
            document.createElement("tr");

        fila.innerHTML = `
            <td>${usuario.run}</td>
            <td>${usuario.nombre} ${usuario.apellidos}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.rol}</td>
        `;

        tabla.appendChild(fila);
    });
}


function cargarSolicitudes() {

    const tabla =
        document.getElementById("tablaSolicitudes");

    const solicitudes =
        JSON.parse(localStorage.getItem("solicitudes")) || [];

    tabla.innerHTML = "";

    if (solicitudes.length === 0) {

        tabla.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">
                    No existen solicitudes registradas.
                </td>
            </tr>
        `;

        return;
    }

    solicitudes.forEach(solicitud => {

        const fila =
            document.createElement("tr");

        fila.innerHTML = `
            <td>${solicitud.id}</td>
            <td>${solicitud.activo}</td>
            <td>${solicitud.descripcion}</td>
            <td>
                <span class="badge bg-warning">
                    ${solicitud.estado}
                </span>
            </td>
        `;

        tabla.appendChild(fila);
    });
}


document.getElementById("formSolicitud").addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const activo =
            document.getElementById("activoSolicitud").value;

        const descripcion =
            document.getElementById("descripcionSolicitud").value.trim();

        const mensaje =
            document.getElementById("solicitudMensaje");

        if (activo === "") {

            mensaje.textContent =
                "Debe seleccionar un activo.";

            mensaje.style.color = "#dc3545";

            return;
        }

        if (descripcion === "") {

            mensaje.textContent =
                "Debe ingresar una descripción.";

            mensaje.style.color = "#dc3545";

            return;
        }

        if (descripcion.length > 500) {

            mensaje.textContent =
                "La descripción no puede superar los 500 caracteres.";

            mensaje.style.color = "#dc3545";

            return;
        }

        const solicitudes =
            JSON.parse(localStorage.getItem("solicitudes")) || [];

        const nuevaSolicitud = {

            id: "SOL-" +
                String(solicitudes.length + 1).padStart(3, "0"),

            activo: activo,

            descripcion: descripcion,

            estado: "Reportada"
        };

        solicitudes.push(nuevaSolicitud);

        localStorage.setItem(
            "solicitudes",
            JSON.stringify(solicitudes)
        );

        mensaje.textContent =
            "Solicitud enviada correctamente.";

        mensaje.style.color = "#198754";

        document.getElementById("formSolicitud").reset();

        cargarSolicitudes();
    }
);


function cerrarSesion() {

    localStorage.removeItem("usuarioActual");

    mostrarLogin();

    document.getElementById("loginForm").reset();
}


function toggleSidebar() {

    const sidebar =
        document.getElementById("sidebar");

    if (sidebar.style.display === "none") {
        sidebar.style.display = "block";
    } else {
        sidebar.style.display = "none";
    }
}


window.addEventListener("load", function() {

    const usuarioGuardado =
        localStorage.getItem("usuarioActual");

    if (usuarioGuardado) {

        const usuario =
            JSON.parse(usuarioGuardado);

        mostrarDashboard(usuario);

    } else {

        mostrarLogin();
    }
});