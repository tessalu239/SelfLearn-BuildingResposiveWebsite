'use strict';

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = document.querySelector('.score').textContent;
let highscore = document.querySelector('.highscore').textContent;

//function for selecting the message element ad display the message
const displayMessage = message => {
  document.querySelector('.message').textContent = message;
};
//Take input from the user
document.querySelector('.check').addEventListener('click', () => {
  //converting the input into number
  const input = Number(document.querySelector('.guess').value);
  console.log(input, typeof input);

  //invalid input (empty, NaN)
  if (!input) {
    displayMessage('⛔ No number yet');
  } else {
    //if the input is valid
    if (input === secretNumber) {
      /*if number is matched*/
      displayMessage('🎉 Congratulation');
      //Release the secret number
      document.querySelector('.number').textContent = secretNumber;
      //change background if the number match
      document.querySelector('body').style.backgroundColor = '#60b347';
      document.querySelector('.number').style.width = '30rem';

      if (score > highscore) {
        highscore = score;
        document.querySelector('.highscore').textContent = highscore;
      }
    } else if (input !== secretNumber) {
      displayMessage(input > secretNumber ? '📈 Too high!' : '📉 Too low!');
      if (score > 1) {
        score--;
        document.querySelector('.score').textContent = score;
      } else {
        displayMessage('You lost the game 🥺');
      }
    }
  }
});

//Play again button;
document.querySelector('.again').addEventListener('click', () => {
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
  secretNumber = Math.trunc(Math.random() * 20) + 1;

  // console.log(secretNumber);
  document.querySelector('.guess').value = '';
  document.querySelector('.number').textContent = '?';

  // return to the intial max score
  document.querySelector('.score').textContent = '20';
  score = document.querySelector('.score').textContent;

  // update high score
  document.querySelector('.highscore').textContent = highscore;
});
