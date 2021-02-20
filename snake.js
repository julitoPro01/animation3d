const myCanvas =document.getElementById('myCanvas');
const context = myCanvas.getContext('2d');
const head = {x: 0, y: 0};
const body = [];


let food = null;

let dx = 0; // variables no hay movimientos(0)
let dy = 0; //no ocurre ninguna variacion en las variables(0)

let lastAxis; // 'y', 'X'
const SIZE = 20;

setInterval(main,200); // 1000ms =1s

function main(){ // main(principal)
   
    update(); // actualizar las variables del juego
    draw(); // dibujar todos los objetos del juego
}
function update(){ // actualizar(update)   
     const collisioDetected = checkSnakeCollision();
     if(collisioDetected){
         gameOver();
         return;
     }
     // salvar la posicion previa de la cabeza de la sepiente
     var prevX,prevY;
     if(body.length >= 1){
         prevX = body[body.length-1].x;
         prevY = body[body.length-1].y;
     } else{
         prevX = head.x;
         prevY = head.y;
     }
     
     // el cuerpo de la serpiente siga a la cabeza de la serpiente
     for(let i = body.length-1; i>=1; --i){
         body[i].x = body[i-1].x; // elem 1 <- elem 0
         body[i].y = body[i-1].y;// body[i] = body[i-1]
     }
     if(body.length >= 1){
         body[0].x = head.x;
         body[0].y = head.y;
     }     
     // actualizar las coordenadas de la cabeza de la serpiente
     head.x += dx;
     head.y += dy;
     if(dx !== 0){
         lastAxis = 'x';
     } else if(dy !== 0){
         lastAxis = 'y';
     }

     // detectar si el serpiente ha consumido el alimento
    
        if( food && head.x === food.x && head.y === food.y){
        food = null;
        // aumentar el tamaño de la serpiente
        increaseSnakeSize(prevX, prevY);
          }    
    
     if(!food){
        // food = {x:getRandomX(), y:getRandomY()};
        food = randomFoodPosition();
     }
}
function checkSnakeCollision(){
    for(let i=0; i<body.length; ++i){
       if(head.x == body[i].x && head.y == body[i].y){
        return true;
       }
    }
    // permitir que la serpiente no se salga de los limites permitidos
    const topCollision =(head.y < 0); // x: ? y: 0
    const bottomCollision =(head.y > 440); // x: ? ,y:
    const rightCollision =(head.x < 0);
    const leftCollision = (head.x >380);
    if(topCollision || bottomCollision || rightCollision || leftCollision){
       return true;
    }
    return false;
}
function gameOver(){
    console.log('gameOver fired');
     alert('Has perdido');
        head.x =0;
        head.y =0;
        dy = 0; dx = 0;
        body.length = 0;
}

 function increaseSnakeSize(prevX, prevY){
      body.push({
          x: prevX , 
          Y: prevY
      });
}
function randomFoodPosition(){
    let position;
    do {
         position = {x: getRandomX(), y:getRandomY()}
    }while(checkFoodCollision(position));
    return position;    
}
function checkFoodCollision(position){
    
    for(let i=0;i<body.length; ++i){
        if(position.x == body[i].x && position.y == body[i].y){
            return true;
        }
    }
    // comparar las coordenas del alimento generado por
    if(head.x == position.x && head.y == position.y){
        return true;
    }
    
    return false;
}
// function randomFoodPosition(){
//     let position;
//     do{
//         position = {x: getRandomX(), y: getRandomY() };
//     } while(checkFoodCollision(position));
//     return position;
// }
// function checkFoodCollision(position){
//      //comparar las coordenadas del alimento generado  con el cuerpo de la serpiente
//     for(let i=0; i<body.length; ++i){
//         if(position.x == body[i].x && position.y == body[i].y){
//          return true;
//         }
//      }                 
//      // comparar las coordenadas del alimento generado con la cabeza de la serpiente
//      if(position.x == head.x && position.y == head.y){
//          return true;
//      }
//     return false;
// }
function getRandomX(){
  // podemos obtener un valor aleatorio entre 0,20,40...380
  // tambien podemos multiplicarlos n° 0,1,2,3....19 *20 = 400 el ancho total
  return 20 * parseInt(Math.random()*20); // multiplicamos *20 por que el 0 no podemos contar

}
function getRandomY(){
// 0,10,20,30...440
// 0,1,2,3,4... *23 (multiplicado *23 = 460)
return 20 * parseInt(Math.random()*23);

}

function draw(){
     // definir un fondo negro
     context.fillStyle = 'black';
     context.fillRect(0, 0, myCanvas.width, myCanvas.height);
     // cabeza
     drawObjet(head,'lime');
     // cuerpo 
     
     body.forEach(
         elem => drawObjet(elem,'lime')
     );
     
     // alimento
     drawObjet(food,'white');
    
}

function drawObjet(obj,color){
    context.fillStyle=color;
    context.fillRect(obj.x, obj.y, SIZE, SIZE);
}


document.addEventListener('keydown', moveSnake);
function moveSnake(event){
    switch(event.key){
        case 'ArrowUp':
            
            if(lastAxis !== 'y'){
                 dx = 0; // si se presiona la flecha hacia arriba 
                 dy = -SIZE; // le damos un valor negativo su coorderna en y desminuya(la cabeza se mueve hacia arriba)
                 console.log('Mover hacia arriba');
             }
            break;
         case 'ArrowDown':
            
            if(lastAxis !== 'y'){
                 dx = 0; // no hay variacion hacia los constados
                 dy = +SIZE; // el valor(20)
                 console.log('Mover hacia abajo');
            }
            break;
         case 'ArrowRight':
             if(lastAxis !== 'x'){
                 dx = +SIZE; // signos se pueden omitir(mas explisitos)
                 dy = 0; // no hay variacion vertical
                 console.log('Mover hacia derecha');
             }
            
            break;
         case 'ArrowLeft':
             if(lastAxis !== 'x'){
                 dx = -SIZE; //  los sigos(para saber en que caso se da un aumento o disminuye)
                 dy = 0; // no hay varicion vertical
                 console.log('Mover hacia izquierda');
             }
            
            break;
    }
};
