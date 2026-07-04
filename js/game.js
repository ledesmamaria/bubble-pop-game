// Cuando la página termina de cargar, inicializamos el juego
window.addEventListener("load", iniciar, false);

function iniciar() {
    const contenedor = document.createElement("div");
    contenedor.setAttribute("id", "contenedor");

    const titulo = document.createElement("h1");
    titulo.textContent = "🫧 Bubble Pop";

    const panelIzquierdo = document.createElement("div");
    panelIzquierdo.setAttribute("id", "panelIzquierdo");

    const instrucciones = document.createElement("p");
    instrucciones.setAttribute("class", "instrucciones");
    instrucciones.textContent = "Pincha las burbujas antes de que desaparezcan. ¡Tienes 30 segundos!";

    const textoActual = document.createElement("p");
    const contenidoActual = document.createTextNode("Puntuación actual: 0");
    textoActual.appendChild(contenidoActual);

    const textoMaxima = document.createElement("p");
    let puntuacionMaxima = parseInt(localStorage.getItem("puntuacionMaxima"));
    if (isNaN(puntuacionMaxima)) {
        puntuacionMaxima = 0;
    }
    const contenidoMaxima = document.createTextNode("Récord: " + puntuacionMaxima);
    textoMaxima.appendChild(contenidoMaxima);

    const botonInicio = document.createElement("button");
    botonInicio.textContent = "Comenzar juego";
    botonInicio.setAttribute("id", "btnInicio");

    panelIzquierdo.appendChild(instrucciones);
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
    let intervaloBurbujas;

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
        contenidoActual.nodeValue = "Puntuación actual: " + puntuacionActual;

        crearBurbuja();
        intervaloBurbujas = setInterval(crearBurbuja, 1000);
        setTimeout(terminarJuego, 30000);
    }

    function crearBurbuja() {
        const burbuja = document.createElement("div");
        burbuja.setAttribute("class", "burbuja");

        const posicionX = Math.floor(Math.random() * 500);
        const posicionY = Math.floor(Math.random() * 500);

        const rojo = Math.floor(Math.random() * 256);
        const verde = Math.floor(Math.random() * 256);
        const azul = Math.floor(Math.random() * 256);

        burbuja.style.left = posicionX + "px";
        burbuja.style.top = posicionY + "px";
        burbuja.style.backgroundColor = "rgb(" + rojo + "," + verde + "," + azul + ")";

        crearEvento(burbuja, "click", function () {
            puntuacionActual++;
            contenidoActual.nodeValue = "Puntuación actual: " + puntuacionActual;
            if (burbuja.parentNode === zonaJuego) {
                zonaJuego.removeChild(burbuja);
            }
        });

        zonaJuego.appendChild(burbuja);

        setTimeout(function () {
            if (burbuja.parentNode === zonaJuego) {
                zonaJuego.removeChild(burbuja);
            }
        }, 2000);
    }

    function terminarJuego() {
        clearInterval(intervaloBurbujas);

        while (zonaJuego.firstChild) {
            zonaJuego.removeChild(zonaJuego.firstChild);
        }

        if (puntuacionActual > puntuacionMaxima) {
            puntuacionMaxima = puntuacionActual;
            localStorage.setItem("puntuacionMaxima", puntuacionMaxima);
            contenidoMaxima.nodeValue = "Récord: " + puntuacionMaxima;
        }

        botonInicio.disabled = false;
    }

    crearEvento(botonInicio, "click", iniciarJuego);
}