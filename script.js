//playBoard É a tela ou tabuleiro.
const playBoard = document.querySelector(".play-board");
//placar atual.
const scoreElement = document.querySelector(".score");
//Recorde (maior pontuação).
const highScoreElement = document.querySelector(".high-score");
//Controle de movimento.
/*Seleciona elementos <i> icones Botões para Devices Mobiles*/
const controls = document.querySelectorAll(".controls i");

//Cadastro de variaveis .

/* Variavel Boleana que indica se o jogo terminou  */
let gameOver = false;
//Variavel para armazenar as coordenadas x e y da comida.
let foodX, foodY;
//Armazena as coordenadas X e Y da cabeça da cobra (posição inicial de 5).
let snakeX = 5, snakeY = 5;
//variavel para armazenar a velocidade nas direções x e y, inicialmente em 0.
let velocityX = 0, velocityY = 0;
//uma array para armazenar as coordenadas de cada segmento do corpo, primeiro elemento é a cabeça.
let snakeBody = [];
//variavel para aumentar o ID do intervalo que será usado para atualizar o jogo em um determinado ritmo.
let setIntervalId;
//uma variavel para manter o controle da pontuação atual do jogador.
let score = 0;


//Obtenha pontuação alta do armazenamento local.
/* Tenta recuperar o valor associado à chave "high-score do armazenamento local do navegador"*/
let highScore = localStorage.getItem("high-score") || 0;
/* Se o localStorage retornar NULL (caso não exista), a variavel highscore será definida como 0 */

// posição aleatoria entre 1 e 30 para a comida 
/* Gera Coordenadas aleatórias para a nova posição da comida */
const updateFoodPosition = () => {
  //Math.floor() = retorna um numero de ponto flutuante pseudoaleatório entre 0 e 1
  //* 30: Multiplica o número aleatório por 30 para obter um valor entre 0 e quase 30
  //Math.floor():  Arredonda o resultado para o número inteiro mais proximo (entre 0 e 29)
  // + 1: adiciona 1 para garantir que as coordenadas da comida estejam entre 1 e 30. 
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
}
//Função para lidar com o fim do jogo
/* função handleGameOver = quando a cobre colide consigo mesma ou com as paredes do tabuleiro*/

const handleGameOver = () => {
  clearInterval(setIntervalId);
  alert("Game Over! Selecione OK para reiniciar e jogar novamente... ");
  location.reload();
}

//Função para Mudar a direção da cobrinha 
const changeDirection = e => {
  if (e.key === "ArrowUp" && velocityY != 1) {
    velocityX = 0;
    velocityY = -1;

  } else if (e.key === "ArrowDown" && velocityY != -1) {
    velocityX = 0;
    velocityY = 1;

  } else if (e.key === "ArrowLeft" && velocityX != 1) {
    velocityX = -1;
    velocityY = 0;

  } else if (e.key === "ArrowRight" && velocityX != -1) {
    velocityX = 1;
    velocityY = 0;
  }
}

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

//Inicializar a Game = init game
const initGame = () => {
  if (gameOver) return handleGameOver();
  let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  //Quando a cobra come
  if (snakeX === foodX && snakeY === foodY) {
    updateFoodPosition();
    snakeBody.push([foodY, foodX]);
    score++;
    highScore = score >= highScore ? score : highScore


    localStorage.setItem("high-score", highScore);
    scoreElement.innerHTML = `Score: ${score}`;
    highScoreElement.innerHTML = `High Score: ${highScore}`;
  }

  snakeX += velocityX;
  snakeY += velocityY;

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i -1];
  }

  snakeBody[0] = [snakeX, snakeY];

  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    return gameOver = true;
  }
  
  //add div para cada parte do corpo da cobra 
  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    
    // verifica se a cabeça da cobra atingiu ou colidiu com o corpo
    if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
      gameOver = true;
    }
    playBoard.innerHTML = html;
  }
  

}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);