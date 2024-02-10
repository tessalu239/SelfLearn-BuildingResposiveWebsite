'use strict';
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const btnNew = document.querySelector('.btn--new');

const dice = document.querySelector('.dice');
const scoreP0 = document.querySelector('#score--0');
const scoreP1 = document.querySelector('#score--1');
const p0 = document.querySelector('.player--0');
const p1 = document.querySelector('.player--1');
const currentP0 = document.querySelector('#current--0');
const currentP1 = document.querySelector('#current--1');

let scores, activeP, sumCurrent, play;
//Starting condition
const init = () => {
  scores = [0, 0];
  sumCurrent = 0;
  activeP = 0;
  play = true;

  scoreP0.textContent = 0;
  scoreP1.textContent = 0;
  currentP0.textContent = 0;
  currentP1.textContent = 0;

  dice.classList.add('hidden');
  p0.classList.remove('player--winner');
  p1.classList.remove('player--winner');
  p0.classList.add('player--active');
  p1.classList.remove('player--active');
};
init();

const switchP = () => {
  sumCurrent = 0;
  document.querySelector(`#current--${activeP}`).textContent = 0;
  activeP = activeP === 0 ? 1 : 0;
  p0.classList.toggle('player--active');
  p1.classList.toggle('player--active');
};

//Rolling btn functionality
btnRoll.addEventListener('click', () => {
  if (play) {
    dice.classList.remove('hidden');
    // 1.generate a random dice roll
    let randomNumber = Math.trunc(Math.random() * 6) + 1;
    // 2.display the dice
    dice.src = `/dice-${randomNumber}.png`;
    // 3. check for rolled 1, switch to the other player
    if (randomNumber !== 1) {
      sumCurrent += randomNumber;
      document.querySelector(`#current--${activeP}`).textContent = sumCurrent;
    } else {
      switchP();
    }
  }
});

//Hold btn functionality
btnHold.addEventListener('click', () => {
  if (play) {
    scores[activeP] += sumCurrent;
    document.querySelector(`#score--${activeP}`).textContent = scores[activeP];
    if (scores[activeP] >= 20) {
      play = false;
      document
        .querySelector(`.player--${activeP}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activeP}`)
        .classList.remove('player--active');
      dice.classList.add('hidden');
    } else {
      switchP();
    }
  }
});
//New game btn functionality
btnNew.addEventListener('click', init);

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnOpenModal = document.querySelector('.how-to-play');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnOpenModal.addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  // console.log(e.key);

  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
