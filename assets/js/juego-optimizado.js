/* La nomenclatura en el archivo de las images viene en ingles
  * 2C = two of clubs     (Treboles)
  * 2D = two of diamonds 
  * 2H = two of Hearts 
  * 2S = two of Spades
 */

/*
  Patrón módulo
  Estas son funciones anonimas auto invocadas, por eso lleva los (); después de la declaración.
  Basicamente lo que hacen ambos casos es crear un nuevo scope dentro de las {}, el cual no
  tiene una referencia por nombre por lo cual no es posible llamar el objeto directamente.

    (()=>{

    }) ();


    También se puede usar como una función normal
    (function(){

    }) ();

  */

const miModulo =(()=>{
    /*
       'use strict' 
       Activar el modo estricto.

       También es muy común encontrar el modo estricto y se recomienda mucho su uso al usar este patrón. 
       Lo que hace es que JavaScript se vuelve mas estricto al momento de evaluar el
       código, con esto JavaScipt nos ayuda y obliga que el código sea mas limpio.
    */

    'use strict' 

    let   deck       = [];
    const tipos      = ['C','D','H','S'],
          especiales = ['A','J','Q','K'];
    
    /*
     Se cambian por un arreglo.
     El ultimo jugador será la computadora

    let puntosJugador = 0,
        puntosCompu   = 0;]
    */
     let puntosJuadores = [];   

    //Referenccias del HTML
    const btnPedir           = document.querySelector('#btnPedir'),
          puntoSmall         = document.querySelectorAll('small'),
          btnDetener         = document.querySelector('#btnDetener'),
          btnNuevo           = document.querySelector('#btnNuevo'),
          divCartasJugadores = document.querySelectorAll('.divCartas');
    
     //Función para iniciar el juego     
     //Tiene valor por defecto de 2 jugadores (player y computadora)
     const inicializarJuego = ( numJugadores = 2)=>{
        
        crearDeck();

        console.log(deck);

        puntosJuadores = [];
        //Iterar la cantidad número de jugadores y agregarlos al arraglo con un puntaje de 0
        //El ultimo jugador siempre será la computadora.
        for (let i = 0; i < numJugadores; i++) {
            //puntosJuadores.push[0];
            puntosJuadores.push(0);
            
        }

        //Aquí es donde se reinicilizan los elementos y las variables.
        puntoSmall.forEach( element => element.innerText = 0); 
        //Quitar las cartas
        divCartasJugadores.forEach(element => element.innerHTML = '');

        btnPedir.disabled = false;
        btnDetener.disabled = false;


     };

    //Esta función crea un nuevo Deck
    const crearDeck = () =>{
    
        //Limpiar el deck para no hacerlo en el listener. 
        deck = [];

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
        /*
           Importamos la libreria underscore al index.html para poder usarla.
           Aqui usamos la libreria mendiante el _.
    
           Shuffle retorna un nuevo arreglo.
        */
        return _.shuffle(deck);;
    
    }
    
    //Esta función me permite tomar una carta
    const pedirCarta = () =>{
    
         //el pop mardaría error si ya no hay cartas.
        if(deck.length === 0){
           throw 'No hay más cartas en el deck.'
        }
    
        return deck.pop();;
    }
    
    //Función para valorar carta
    const valorCarta = (carta)=>{
        
        const valor = carta.substring(0, carta.length -1);

        return ( isNaN(valor)) 
               ? (valor === 'A') ? 11 : 10
               : valor * 1;  
    
    }
    
    //turnoJugador: 0 = primer juagaor y el último será la computadora
    const acumularPuntos = (turnoJugador, carta) =>{

        puntosJuadores[turnoJugador] = puntosJuadores[turnoJugador] + valorCarta(carta);
        //Hacer referencia a al small de la computadora
        puntoSmall[turnoJugador].innerText = puntosJuadores[turnoJugador];

        return puntosJuadores[turnoJugador];

    }

    const crearCarta = (carta , jugador)=>{

            //1. Crear el componente
            const imgCarta = document.createElement('img');
            //2. Definir la ruta de la imagen
            imgCarta.src = `assets/cartas/${carta}.png`;
            //3.Agregar el estilo a la imagen (para que salga en buen tamaño)
            imgCarta.classList.add('carta');
            //4. Agregar al HTML
            divCartasJugadores[jugador].append(imgCarta);

    }

    const determinarGanador = ()=>{

        //Se usa la destructuración de los arreglos para asignar los valores,
        //Asigna el valor de acuerdo la posición que tienen en el arreglo
        const [puntosMinimo, puntosCompu] = puntosJuadores;

         setTimeout(() => {
            if(puntosMinimo === puntosCompu){
                alert('Empate :/');
            }else if (puntosMinimo>21){
                alert('Eres un perdedor');
            }else if (puntosCompu>21){
                alert('Jugador Gana')  
            }else{
                alert('Perdedor!!');
            }
         }, 100);
    }

    //Logica de la IA (turno de la computadora).
    const turnocomputadora = (puntosMinimo) =>{
    
        let puntosCompu = 0;

        do{ 
            const carta = pedirCarta();
    
            puntosCompu = acumularPuntos(puntosJuadores.length-1, carta);
    
            crearCarta(carta,puntosJuadores.length-1);
    
        }while ((puntosCompu<puntosMinimo) && (puntosMinimo<=21));
    
        determinarGanador();

    }
    
    //valorCarta('JD');
    
    //Eventos
    //Los listener tienen dos argumentos:
    //1ro. Es el evento que queremos escuchar: click, dbclick (double click), focus, etc.
    //2do. Segunda función (callback: es una función que se coloca como un argumento a otra función 
    //-función que se manda como argumento-)
    btnPedir.addEventListener('click', ()=>{
    
        const carta = pedirCarta();

        //0 porque es el primer jugardor
        const puntosJugador = acumularPuntos(0,carta);

        crearCarta(carta,0);
    
        //Validar los puntos
    
        if(puntosJugador >21){
    
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnocomputadora(puntosJugador);
        }else if (puntosJugador === 21){
    
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
        turnocomputadora(puntosJuadores[0]);
    
    });
    
    btnNuevo.addEventListener('click', ()=>{
    
        inicializarJuego();
    
    });


    /*
        Esta siempre debe ser la ultima parte del modulo, porque es donde retornamos valores.
        Unicamente lo que aquí se retorne será publico y visible fuera de este modulo.
    */

    return {
       //Retornamos la función, pero que de manera externa se le conozca como nuevo juego
       //Es lo mismo de los objetos. Si queremos que sea el mismo nombre podriamos solo haber
       //dejado inicializarJuego
       nuevoJuego: inicializarJuego
    }


}) ();


