/* La nomenclatura en el archivo de las images viene en ingles
  * 2C = two of clubs     (Treboles)
  * 2D = two of diamonds 
  * 2H = two of Hearts 
  * 2S = two of Spades
 */

let deck         = [];
const tipos      = ['C','D','H','S'];
const especiales = ['A','J','Q','K'];

let puntosJugador = 0;
let puntosCompu   = 0;
//Referenccias del HTML
const btnPedir   = document.querySelector('#btnPedir');
const puntoSmall = document.querySelectorAll('small');
const divCartasJugador = document.querySelector('#jugador-cartas');
//Referencia HTML para la computadora
const divcartasCompu = document.querySelector('#Computadora-cartas');
const btnDetener     = document.querySelector('#btnDetener');

const btnNuevo       = document.querySelector('#btnNuevo');

//Esta función crea un nuevo Deck
const crearDeck = () =>{

    for(let i=2 ; i<=10 ; i++){
        //Recordar: Este for itera los elementos y el valor que
        //retorna se lo agrega a la variable
        for (let tipo of tipos){
            //Agregar al arreglo
            deck.push(i + tipo);
        }
    }

    //Agregar las cartas que no tienen número
    for(let tipo of tipos){
        for (let especial of especiales){
            //Agregar al arreglo
            deck.push(especial + tipo);
        }
    }

    //console.log(deck);
    /*
       Importamos la libreria underscore al index.html para poder usarla.
       Aqui usamos la libreria mendiante el _.

       Shuffle retorna un nuevo arreglo.
    */
    deck = _.shuffle(deck);
    console.log(deck);

    return deck;

}

crearDeck();

//Esta función me permite tomar una carta
const pedirCarta = () =>{

     //el pop mardaría error si ya no hay cartas.
    if(deck.length == 0){
       throw 'No hay más cartas en el deck.'
    }

    const cartaNueva = deck.pop();
    
    return cartaNueva;
}

//Función para valorar carta

const valorCarta = (carta)=>{

     let puntos = 0;   
    //En JavaScript todos los string se puede tratar como si fueran arreglos
    //const valor = carta[0]; // retorna la primera letra de la variable carta

    //Como existen los 10D,10H, 10C, etc. No se puede usar la forma anterior,
    //se utiliza el substring para quitar el ultimo carácter que corresponde a la letra.
    const valor = carta.substring(0, carta.length - 1);

    //Validar si el valor de la carta es un número, para eso se usa el isNaN
    //is Not a Number
    if(isNaN(valor)){
        console.log('No es número');

        //Aquí no se multiplica por 1 porque el return ya es como número
        puntos = ( valor === 'A' ) ? 11 : 10;    


    }else{
        //Es un número
        console.log('Es número');
        
        /* 
          Cuando en la consola el valor se muestra color gris es porque es un String, 
          cuando es morado es un número (El color depende del navegador)
        */
        //Se debe tranformar el valor a un número para poder ir acumulnado el valor, sino estaria concatenando Strings. 
        //La forma más sencilla es multiplicar el string o valor por 1

        puntos = valor * 1;
    }


    /*
    
    Forma abreviada de la función, deje la forma completa por los comentarios.
    return ( isNaN(valor)) 
           ? (valor === 'A') ? 11 : 10
           : valor * 1;  

    */
    return puntos;

}

//Logica de la IA (turno de la computadora).
//Este turno se va disparar en dos posibles ocaciones; 
//cuando el jugador pierde o gana, y/o cuando se presiones el botón Detener.
//Los puntos minumos hacen referencia a los que obtuvo el jugador, la computadora
//debe cuando menos ser igual a ese puntaje
const turnocomputadora = (puntosMinimo) =>{

    do{ 
        const carta = pedirCarta();

        puntosCompu = puntosCompu + valorCarta(carta);
        //Hacer referencia a al small de la computadora
        puntoSmall[1].innerText = puntosCompu ;

        //Agregar la imagen de la carta
        //<img class="carta" src="assets/cartas/10S.png" alt="">
        //1. Crear el componente
        const imgCarta = document.createElement('img');
        //2. Definir la ruta de la imagen
        imgCarta.src = `assets/cartas/${carta}.png`;
        //3.Agregar el estilo a la imagen (para que salga en buen tamaño)
        imgCarta.classList.add('carta');
        //4. Agregar al HTML
        divcartasCompu.append(imgCarta);

        //Si lo puntos del jugador son mayor a 21, conque se saque una sola carta 
        //esta bien y salimos del ciclo
        if(puntosMinimo>21){
            break;
        }

    }while ((puntosCompu<puntosMinimo) && (puntosMinimo<=21));

   
     //De momento JavaScript no es multi hilo, para simular esto utilizamos la función
     //setTimeout que es propia de JavaScript. Esta función permite ejecutar el callback
     //en una x cantidad de milisegundos. En estee ejemplo le decimos que se ejecute pasados
     //10 milisegundos

     setTimeout(() => {
        if(puntosJugador === puntosCompu){
            alert('Empate :/');
        }else if (puntosMinimo>21){
            alert('Eres un perdedor');
        }else if (puntosCompu>21){
            alert('Jugador Gana')  
        }else{
            alert('Perdedor!!');
        }
     }, 10);
}


//valorCarta('JD');

//Eventos
//Los listener tienen dos argumentos:
//1ro. Es el evento que queremos escuchar: click, dbclick (double click), focus, etc.
//2do. Segunda función (callback: es una función que se coloca como un argumento a otra función 
//-función que se manda como argumento-)
btnPedir.addEventListener('click', ()=>{

    const carta = pedirCarta();

    puntosJugador = puntosJugador + valorCarta(carta);
    //Hacer referencia a cual small
    puntoSmall[0].innerText = puntosJugador ;

    //Agregar la imagen de la carta
    //<img class="carta" src="assets/cartas/10S.png" alt="">
    //1. Crear el componente
    const imgCarta = document.createElement('img');
    //2. Definir la ruta de la imagen
    imgCarta.src = `assets/cartas/${carta}.png`;
    //3.Agregar el estilo a la imagen (para que salga en buen tamaño)
    imgCarta.classList.add('carta');
    //4. Agregar al HTML
    divCartasJugador.append(imgCarta);

    //Validar los puntos

    if(puntosJugador >21){
        console.warn('Lo siento perdedor');
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnocomputadora(puntosJugador);
    }else if (puntosJugador === 21){
        console.warn('21, Genial!!');
        btnPedir.disabled = true;
        btnDetener.disabled = true;
        turnocomputadora(puntosJugador);
    }

});

//turnocomputadora(17);

btnDetener.addEventListener('click', ()=>{

    btnPedir.disabled   = true;
    btnDetener.disabled = true;
    btnNuevo.disabled   = false;
    turnocomputadora(puntosJugador);

});

btnNuevo.addEventListener('click', ()=>{

    //Limpiar puntos
    puntosJugador = 0;
    puntosCompu   = 0;

    //Mostrar las etiquetas de los puntos a 0
    puntoSmall[0].innerText = puntosJugador ;
    puntoSmall[1].innerText = puntosCompu ;

    //Activar/Desactivar botones
    btnPedir.disabled   = false;
    btnDetener.disabled = false;
    btnNuevo.disabled   = true;

    //Limpiar Divs de las cartas
    divCartasJugador.innerHTML = '';
    divcartasCompu.innerHTML   = '';
    
    console.clear();

    //Limpiar Deck y volver a crearlo
    deck =[];
    crearDeck();


});