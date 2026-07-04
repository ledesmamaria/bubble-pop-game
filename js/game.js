// Cuando la página termina de cargar, inicializamos el juego
window.addEventListener("load", iniciar, false);

const DURACION_PARTIDA = 30; // segundos

function iniciar() {
    const contenedor = document.createElement("div");
    contenedor.setAttribute("id", "contenedor");

    const titulo = document.createElement("h1");
    titulo.textContent = "🫧 Bubble Pop";

    const panelIzquierdo = document.createElement("div");
    panelIzquierdo.setAttribute("id", "panelIzquierdo");

    const instrucciones = document.createElement("p");
    instrucciones.setAttribute("class", "instrucciones");
    instrucciones.textContent = "Pincha las burbujas antes de que desaparezcan (2 segundos cada una).";

    const textoActual = document.createElement("p");
    textoActual.setAttribute("class", "marcador");
    const contenidoActual = document.createTextNode("Puntuación: 0");
    textoActual.appendChild(contenidoActual);

    const textoMaxima = document.createElement("p");
    textoMaxima.setAttribute("class", "marcador");
    let puntuacionMaxima = parseInt(localStorage.getItem("puntuacionMaxima"));
    if (isNaN(puntuacionMaxima)) {
        puntuacionMaxima = 0;
    }
    const contenidoMaxima = document.createTextNode("Récord: " + puntuacionMaxima);
    textoMaxima.appendChild(contenidoMaxima);

    const textoTiempo = document.createElement("p");
    textoTiempo.setAttribute("class", "temporizador");
    const contenidoTiempo = document.createTextNode(DURACION_PARTIDA + "s");
    textoTiempo.appendChild(contenidoTiempo);

    const botonInicio = document.createElement("button");
    botonInicio.textContent = "Comenzar juego";
    botonInicio.setAttribute("id", "btnInicio");

    panelIzquierdo.appendChild(instrucciones);
    panelIzquierdo.appendChild(textoTiempo);
    panelIzquierdo.appendChild(textoActual);
    panelIzquierdo.appendChild(textoMaxima);
    panelIzquierdo.appendChild(botonInicio);

    const zonaJuego = document.createElement("div");
    zonaJuego.setAttribute("id", "zonaJuego");

    contenedor.appendChild(panelIzquierdo);
    contenedor.appendChild(zonaJuego);

    document.body.appendChild(titulo);
    document.body.appendChild(contenedor);

    let puntuacionActual = 0;
    let segundosRestantes = DURACION_PARTIDA;
    let intervaloBurbujas;
    let intervaloTiempo;

    // Función cross-browser para registrar eventos (compatibilidad con navegadores antiguos)
    function crearEvento(elemento, tipoEvento, funcion) {
        if (elemento.addEventListener) {
            elemento.addEventListener(tipoEvento, funcion, false);
        } else if (elemento.attachEvent) {
            elemento.attachEvent("on" + tipoEvento, funcion);
        }
    }

    function iniciarJuego() {
        botonInicio.disabled = true;
        puntuacionActual = 0;
        segundosRestantes = DURACION_PARTIDA;
        contenidoActual.nodeValue = "Puntuación: " + puntuacionActual;
        contenidoTiempo.nodeValue = segundosRestantes + "s";

        crearBurbuja();
        intervaloBurbujas = setInterval(crearBurbuja, 1000);

        intervaloTiempo = setInterval(function () {
            segundosRestantes--;
            contenidoTiempo.nodeValue = segundosRestantes + "s";
            if (segundosRestantes <= 0) {
                terminarJuego();
            }
        }, 1000);
    }

    function crearBurbuja() {
        const burbuja = document.createElement("div");
        burbuja.setAttribute("class", "burbuja");

        const posicionX = Math.floor(Math.random() * (zonaJuego.clientWidth - 55));
        const posicionY = Math.floor(Math.random() * (zonaJuego.clientHeight - 55));

        const rojo = Math.floor(Math.random() * 256);
        const verde = Math.floor(Math.random() * 256);
        const azul = Math.floor(Math.random() * 256);

        burbuja.style.left = posicionX + "px";
        burbuja.style.top = posicionY + "px";
        burbuja.style.backgroundColor = "rgb(" + rojo + "," + verde + "," + azul + ")";

        crearEvento(burbuja, "click", function () {
            puntuacionActual++;
            contenidoActual.nodeValue = "Puntuación: " + puntuacionActual;
            reventarBurbuja(burbuja);
        });

        zonaJuego.appendChild(burbuja);

        setTimeout(function () {
            reventarBurbuja(burbuja);
        }, 2000);
    }

    // Aplica la animación de "reventar" y luego elimina la burbuja del DOM
    function reventarBurbuja(burbuja) {
        if (burbuja.parentNode !== zonaJuego) {
            return;
        }
        burbuja.setAttribute("class", "burbuja reventada");
        setTimeout(function () {
            if (burbuja.parentNode === zonaJuego) {
                zonaJuego.removeChild(burbuja);
            }
        }, 200);
    }

    function terminarJuego() {
        clearInterval(intervaloBurbujas);
        clearInterval(intervaloTiempo);

        while (zonaJuego.firstChild) {
            zonaJuego.removeChild(zonaJuego.firstChild);
        }

        const hayNuevoRecord = puntuacionActual > puntuacionMaxima;
        if (hayNuevoRecord) {
            puntuacionMaxima = puntuacionActual;
            localStorage.setItem("puntuacionMaxima", puntuacionMaxima);
            contenidoMaxima.nodeValue = "Récord: " + puntuacionMaxima;
        }

        mostrarPantallaFinal(hayNuevoRecord);
        botonInicio.disabled = false;
    }

    // Crea una pantalla superpuesta con el resultado final de la partida
    function mostrarPantallaFinal(hayNuevoRecord) {
        const overlay = document.createElement("div");
        overlay.setAttribute("class", "overlay");

        const mensaje = document.createElement("h2");
        mensaje.textContent = hayNuevoRecord ? "¡Nuevo récord! 🎉" : "¡Partida terminada!";

        const resultado = document.createElement("p");
        resultado.textContent = "Puntuación final: " + puntuacionActual;

        overlay.appendChild(mensaje);
        overlay.appendChild(resultado);
        zonaJuego.appendChild(overlay);

        setTimeout(function () {
            if (overlay.parentNode === zonaJuego) {
                zonaJuego.removeChild(overlay);
            }
        }, 2500);
    }

    crearEvento(botonInicio, "click", iniciarJuego);
}