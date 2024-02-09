'use strict';
const dice = document.querySelector('.dice');
const rollBtn = document.querySelector('.btn--roll');
const active = document.querySelector('.player--active');
const player1 = document.querySelector('.player--0');
const player2 = document.querySelector('.player--1');
const player = document.querySelectorAll('.player');
const currentScore = document.querySelectorAll('.current-score');
const holdBtn = document.querySelector('.btn--hold');
const score = document.querySelectorAll('.score');
let sumCurrent = 0;

//Rolling the dice functionality
rollBtn.addEventListener('click', () => {
  const randomNumber = Math.trunc(Math.random() * 6 + 1);
  dice.src = `dice-${randomNumber}.png`;
  //processing purpose
  console.log(randomNumber);

  //checking which user is playing and add points
  if (dice.classList.contains('hidden')) dice.classList.remove('hidden');
  for (let i = 0; i < player.length; i++) {
    if (player[i].classList.contains('player--active')) {
      if (randomNumber !== 1) {
        sumCurrent += randomNumber;
        currentScore[i].textContent = sumCurrent;
      } else {
        sumCurrent = 0;
        currentScore[i].textContent = sumCurrent;
        player[i].classList.remove('player--active');
        //switching player if 1 is rolled
        player[i === 0 ? 1 : 0].classList.add('player--active');
        break;
      }
    }
  }
});

//Hold button functionality
// holdBtn.addEventListener('click', () => {
//   for (let i = 0; i < player.length; i++) {
//     if (player[i].classList.contains('player--active')) {
//       let valueScore = Number(score[i].textContent);
//       valueScore += Number(currentScore[i].textContent);

//       score[i].textContent = valueScore;
//       currentScore[i].textContent = 0;
//       // sumCurrent = 0;
//       player[i].classList.remove('player--active');
//       player[i === 0 ? 1 : 0].classList.add('player--active');
//       break;
//     }
//   }
// });
