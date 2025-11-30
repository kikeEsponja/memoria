let comenzar = document.getElementById('comenzar');

/* ****************************** BOTÓN DE REINICIO ************************************/
let repetir = document.getElementById('repetir');
repetir.addEventListener('click', ()=>{
    location.reload();
});

//********************************************************************************** */
let juego = document.getElementById('carcasa');

let primeraCarta = null;
let segundaCarta = null;
let bloqueoMesa = false;
let movimientos = 0;
let habilitado = true;

function start(){
    comenzar.addEventListener('click', ()=>{
        let texto = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
        let nuevoTexto = texto.sort(() => Math.random() - 0.5);

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

start();


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

function muevelo(){
    if(habilitado){
        movimientos++;
        let textoMovimientos = document.getElementById('movimientos');
        textoMovimientos.textContent = movimientos;
    }
}

function dejaloAsi(){
    habilitado = false;
}

function validarCoincidencia(){
    let coincide = primeraCarta.dataset.value === segundaCarta.dataset.value;

    if(coincide){
        inhabilitarCartas();
    }else{
        cubrirCartas();
    }
}

let aciertos = 0;
function inhabilitarCartas(){
    primeraCarta.removeEventListener('click', handleCardClick);
    segundaCarta.removeEventListener('click', handleCardClick);
    
    let textoAciertos = document.getElementById('aciertos');
    aciertos++;
    textoAciertos.textContent = aciertos;
    
    if(aciertos == 6){
        ganador();
        dejaloAsi();
    }

    reiniciar();
}

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

function reiniciar(){
    [primeraCarta, segundaCarta, bloqueoMesa] = [null, null, false];
}

function clickSostenido(e){
    tocarCarta(e.currentTarget);
}

function ganador(){
    let contenedor = document.createElement('div');
    let aceptar = document.createElement('button');
    let ganador = document.createElement('h4');
    let information = document.getElementById('information');

    for(let i = 0; i < 12; i++){
        let fichaFija = document.querySelector('.ficha');
        fichaFija.classList.remove('ficha');
    }

    aceptar.addEventListener('click', ()=>{
        location.reload();
    });

    ganador.textContent = 'Has Ganado!';
    aceptar.textContent = 'Vamos de nuevo!';

    information.appendChild(contenedor);
    contenedor.appendChild(ganador);
    contenedor.appendChild(aceptar);
}