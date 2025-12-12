let comenzar = document.getElementById('comenzar'); // captura del botón "comenzar"

/* ****************************** BOTÓN DE REINICIO ************************************/
let repetir = document.getElementById('repetir');
repetir.addEventListener('click', ()=>{
    location.reload();
});
/* ****************************** BOTÓN PARA IR A INDEX ************************************/
let inicio = document.getElementById('inicio');
inicio.addEventListener('click', ()=>{
    window.location.href = '../index.html';
});

//********************************************************************************** */
let juego = document.getElementById('carcasa'); //captura de "div" contenedor del tablero de juego

//*****************************VARIABLES GLOBALES********************************* */
const sonidoAcierto = new Audio('../assets/sonidos/Rizz_sounds.mp3');
const sonidoPerder = new Audio('../assets/sonidos/Spongebob.mp3');
const sonidoGanador = new Audio('../assets/sonidos/ganador.mp3');
let primeraCarta = null;
let segundaCarta = null;
let bloqueoMesa = false;
let movimientos = 24;
let puntos = 0;
const PUNTOS_POR_ACIERTO = 100;
let moves = document.getElementById('movimientos');
moves.textContent = movimientos;
let habilitado = true;

/* ****************************** FUNCIÓN PARA ANIMACIÓN DE PUNTOS ************************************/
function mostrarBonus(cantidad){
    const bonus = document.createElement('div');
    bonus.className = 'bonus-pop';
    bonus.textContent = `+${cantidad}`;

    document.body.appendChild(bonus);

    void bonus.offsetWidth;

    bonus.style.opacity = 1;
    bonus.style.transform = 'translate(-50%, -50%) scale(1.2)';

    setTimeout(() => {
       bonus.remove() 
    }, 2500);
}

/* ****************************** FUNCIÓN QUE INICIA EL JUEGO ************************************/
function start(){
    comenzar.addEventListener('click', ()=>{
        let texto = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
        let nuevoTexto = texto.sort(() => Math.random() - 0.5);
        
        // BUCLE PARA DIBUJAR LAS CARTAS
        for(let i = 0; i < 12; i++){
            let contenedorFicha = document.createElement('div');
            let ficha = document.createElement('div');
            let dato = document.createElement('div');
            //ficha.textContent = nuevoTexto[i];

            contenedorFicha.classList.add('contenedor-ficha');
            ficha.classList.add('ficha');
            //ficha.dataset.value = nuevoTexto[i];
            //ficha.id = i;
            dato.classList.add('dato');
            dato.classList.add('invisible');
            dato.textContent = nuevoTexto[i];
            dato.dataset.value = nuevoTexto[i];
            dato.id = i;
            
            dato.addEventListener('click', handleCardClick);
            dato.addEventListener('click', muevelo);

            juego.appendChild(contenedorFicha);
            contenedorFicha.appendChild(ficha);
            ficha.appendChild(dato);
        }
        comenzar.disabled = true;
    });
}

start(); // INICIA EL JUEGO

//FUNCIÓN PARA CONTROLAR EL MOVIMIENTO DE LAS CARTAS
function handleCardClick(e){
    let card = e.currentTarget;

    if(bloqueoMesa) return;
    if(card === primeraCarta) return;

    card.classList.add('descubierta');
    card.classList.remove('invisible');

    if(!primeraCarta){
        primeraCarta = card;
        return;
    }

    segundaCarta = card;

    validarCoincidencia();
}

// FUNCIÓN PARA LA DISMINUCIÓN DE LOS MOVIMIENTOS DISPONIBLES
function muevelo(){
    if(habilitado){
        movimientos--;
        let textoMovimientos = document.getElementById('movimientos');
        textoMovimientos.textContent = movimientos;
        if(movimientos === 0){
            perdiste();
        }
    }
}

function dejaloAsi(){
    habilitado = false;
}

// FUNCIÓN QUE VALIDA LA COINCIDENCIA DE LOS VALORES DE LAS CARTAS
function validarCoincidencia(){
    let coincide = primeraCarta.dataset.value === segundaCarta.dataset.value;

    if(coincide){
        inhabilitarCartas();
    }else{
        cubrirCartas();
    }
}

//CONTADOR DE ACIERTOS
let aciertos = 0;
function inhabilitarCartas(){
    primeraCarta.removeEventListener('click', handleCardClick);
    segundaCarta.removeEventListener('click', handleCardClick);
    
    let textoAciertos = document.getElementById('aciertos');
    aciertos++;
    textoAciertos.textContent = aciertos;

    let puntaje = document.getElementById('puntos');
    puntos += PUNTOS_POR_ACIERTO;
    puntaje.textContent = puntos;

    sonidoAcierto.currentTime = 0;
    sonidoAcierto.play();

    mostrarBonus(PUNTOS_POR_ACIERTO);

    if(aciertos == 6){
        ganador();
        dejaloAsi();
    }

    reiniciar();
}

//FUNCIÓN PARA CUBRIR EL PA DE CARTAS QUE NO COINCIDEN
function cubrirCartas(){
    bloqueoMesa = true;

    setTimeout(() =>{
        primeraCarta.classList.remove('descubierta');
        segundaCarta.classList.remove('descubierta');
        primeraCarta.classList.add('invisible');
        segundaCarta.classList.add('invisible');

        reiniciar();
    }, 1000);
}

// FUNCIÓN PARA REINICIAR LOS VALORES INICIALES
function reiniciar(){
    [primeraCarta, segundaCarta, bloqueoMesa] = [null, null, false];
}

function clickSostenido(e){
    tocarCarta(e.currentTarget);
}

// FUNCIÓN PARA MOSTRAR OBJETIVO LOGRADO
function ganador(){
    let contenedor = document.createElement('div');
    let aceptar = document.createElement('button');
    let ganador = document.createElement('h1');
    let information = document.getElementById('information');
    let emoji = document.getElementById('ganador');
    //NIVEL 2
    let nivel2 = document.createElement('button');

    for(let i = 0; i < 12; i++){
        let fichaFija = document.querySelector('.ficha');
        fichaFija.classList.remove('ficha');
    }

    aceptar.addEventListener('click', ()=>{
        location.reload();
    });

    ganador.textContent = 'Has Ganado!';
    ganador.style.color = '#ff0';
    aceptar.textContent = 'Vamos de nuevo!';
    aceptar.classList.add('botones');

    //NIVEL 2
    nivel2.textContent = 'Nivel 2';
    nivel2.classList.add('botones');

    nivel2.addEventListener('click', () =>{
        window.location.href = '../vistas/memoria2.html';
    });

    information.appendChild(contenedor);
    contenedor.appendChild(ganador);
    contenedor.appendChild(aceptar);
    emoji.style.display = 'block';
    emoji.style.opacity = '0';
    emoji.style.transition = 'opacity 2s ease';
    contenedor.appendChild(nivel2);

    sonidoGanador.currentTime = 0;
    setTimeout(() => {
        sonidoGanador.play();
    }, 1000);

    setTimeout(() =>{
        emoji.style.opacity = '1';
    }, 50);
}

// FUNCIÓN PARA MOSTRAR OBJETIVO NO LOGRADO
function perdiste(){
    let contenedor = document.createElement('div');
    let aceptar = document.createElement('button');
    let perdedor = document.createElement('h1');
    let information = document.getElementById('information');
    let emojiLost = document.getElementById('perdedor');

    for(let i = 0; i < 12; i++){
        let fichaFija = document.querySelector('.ficha');
        fichaFija.classList.remove('ficha');
    }

    aceptar.addEventListener('click', ()=>{
        location.reload();
    });

    perdedor.textContent = 'Has Perdido!';
    perdedor.style.color = '#f60';
    aceptar.classList.add('botones');
    aceptar.textContent = 'Vamos de nuevo!';

    information.appendChild(contenedor);
    contenedor.appendChild(perdedor);
    contenedor.appendChild(aceptar);
    emojiLost.style.display = 'block';
    emojiLost.style.opacity = '0';
    emojiLost.style.transition = 'opacity 2s ease';
    sonidoPerder.currentTime = 0;
    sonidoPerder.play();

    setTimeout(() =>{
        emojiLost.style.opacity = '1';
    }, 50);
}