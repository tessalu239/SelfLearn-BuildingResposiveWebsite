'use strict';

let secretNumber = Math.trunc(Math.random() * 20) + 1;
// console.log(secretNumber);

let score = document.querySelector('.score').textContent;

let highscore = document.querySelector('.highscore').textContent;
//Take input from the user
document.querySelector('.check').addEventListener('click', () => {
  //converting the input into number
  const input = Number(document.querySelector('.guess').value);
  console.log(input, typeof input);

  //invalid input (empty, NaN)
  if (!input) {
    document.querySelector('.message').textContent = '⛔ No number yet';
  } else {
    /*if number is valid*/
    /*if number is higher*/
    if (input > secretNumber) {
      document.querySelector('.message').textContent = '📈 Too high';
      if (score > 0) {
        score--;
        document.querySelector('.score').textContent = score;
      } else {
        document.querySelector('.message').textContent =
          'Sorry, you are lost 🥺';
      }
    } else if (input < secretNumber) {
      /*if number is lower*/
      document.querySelector('.message').textContent = '📉 Too low';
      if (score > 0) {
        score--;
        document.querySelector('.score').textContent = score;
      } else {
        document.querySelector('.message').textContent =
          'Sorry, you are lost 🥺';
      }
    } else if (input === secretNumber) {
      /*if number is matched*/
      document.querySelector('.message').textContent = '🎉 Congratulation';
      //Release the secret number
      document.querySelector('.number').textContent = secretNumber;
      //change background if the number match
      document.querySelector('body').style.backgroundColor = '#60b347';
      document.querySelector('.number').style.width = '30rem';

      if (score > highscore) {
        highscore = score;
        document.querySelector('.highscore').textContent = highscore;
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
