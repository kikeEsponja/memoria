let comenzar = document.getElementById('comenzar');
let juego = document.getElementById('carcasa');

let primeraCarta = null;
let segundaCarta = null;
let bloqueoMesa = false;

function start(){
    comenzar.addEventListener('click', ()=>{
        let texto = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];
        nuevoTexto = texto.sort(() => Math.random() - 0.5);

        for(let i = 0; i < 12; i++){

            let ficha = document.createElement('div');
            ficha.textContent = nuevoTexto[i];

            ficha.classList.add('ficha');
            ficha.dataset.value = nuevoTexto[i];
            ficha.id = i;
            
            ficha.addEventListener('click', handleCardClick);

            juego.appendChild(ficha);
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

    if(!primeraCarta){
        primeraCarta = card;
        return;
    }

    segundaCarta = card;

    validarCoincidencia();
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
    }

    reiniciar();
}

function cubrirCartas(){
    bloqueoMesa = true;

    setTimeout(() =>{
        primeraCarta.classList.remove('descubierta');
        segundaCarta.classList.remove('descubierta');

        reiniciar();
    }, 800);
}

function reiniciar(){
    [primeraCarta, segundaCarta, bloqueoMesa] = [null, null, false];
}

function clickSostenido(e){
    tocarCarta(e.currentTarget);
}

function ganador(){
    let aceptar = document.createElement('button');
    let ganador = document.createElement('h4');

    aceptar.addEventListener('click', ()=>{
        location.reload();
    });

    ganador.textContent = 'Has Ganado!';
    aceptar.textContent = 'Vamos de nuevo!';

    juego.appendChild(ganador);
    juego.appendChild(aceptar);
}