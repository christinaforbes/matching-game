// Christina Forbes 11/30/2021

'use strict';

const numberOfUniqueCards = 12;
const numberOfTotalCards = numberOfUniqueCards * 2;
let moves = 0;
let bestScore = localStorage.getItem('bestScore');

if (!bestScore) {
  localStorage.setItem('bestScore', 0);
}

const startGame = function startGame() {
  let itemIndexes = [];
  moves = 0;

  $('.modal-container').addClass('modal-container-hidden');
  $('.end-screen').removeClass('end-screen-visible');
  $('.cards-container').empty();

  generateCardIndexList(itemIndexes);
}

$('.start-button').on('click', startGame);

const generateCardIndexList = function generateCardIndexList(itemIndexes) {
  const minInteger = 0;
  const maxInteger = 117;

  while (itemIndexes.length < numberOfUniqueCards) {
    const randomInteger = generateRandomInteger(minInteger, maxInteger);
    const isDuplicateInteger = itemIndexes.includes(randomInteger);

    if (!isDuplicateInteger) {
      itemIndexes.push(randomInteger);
    }
  }

  generateCardOrderList(itemIndexes);
}

const generateRandomInteger = function generateRandomInteger(minInteger, maxInteger) {
  return Math.floor(Math.random() * (maxInteger - minInteger + 1) + minInteger);
}

const generateCardOrderList = function generateCardOrderList(itemIndexes) {
  const itemIndexesCopy = [...itemIndexes];
  const itemIndexesMerged = [...itemIndexes, ...itemIndexesCopy];

  shuffleArray(itemIndexesMerged);
  createCards(itemIndexesMerged);
}

// Fisher-Yates algorithm
const shuffleArray = function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const createCards = function createCards(itemIndexesMerged) {
  const $cardsContainer = $('.cards-container');

  itemIndexesMerged.forEach((itemIndex) => {
    const elementAtomicNumber = elements[itemIndex].atomicNumber;
    const elementSymbolText = elements[itemIndex].symbol;
    const elementNameText = elements[itemIndex].name;

    const $card = $(`<div class="card card-back" data-id="${elementAtomicNumber}"></div>`);
    const $cardElementSymbol = $(`<p class="element-symbol">${elementSymbolText}</p>`);
    const $cardElementName = $(`<p class="element-name">${elementNameText}</p>`);

    $card.append($cardElementSymbol, $cardElementName);
    $cardsContainer.append($card);
  });

  $('.card').on('click', selectCard);
}

const selectCard = function selectCard() {
  const numberOfPreviouslySelectedCards = $('.card-front').length;
  let numberOfCurrentlySelectedCards = 0;

  if (numberOfPreviouslySelectedCards < 2) {
    $(this).removeClass('card-back');
    $(this).addClass('card-front');
    numberOfCurrentlySelectedCards = $('.card-front').length;
  }
  
  if (numberOfCurrentlySelectedCards === 2) {
    moves += 1;
    checkForMatch();
  }
}

const checkForMatch = function checkForMatch() {
  const $selectedCards = $('.card-front');
  const firstSelectedCardID = Number($($selectedCards[0]).attr('data-id'));
  const secondSelectedCardID = Number($($selectedCards[1]).attr('data-id'));

  if (firstSelectedCardID === secondSelectedCardID) {
    setTimeout(() => {
      hideMatchingCards($selectedCards);
    }, 1000);
  } else if (firstSelectedCardID !== secondSelectedCardID) {
    setTimeout(() => {
      flipDifferentCards($selectedCards);
    }, 1000);
  }
}

const hideMatchingCards = function hideMatchingCards($selectedCards) {
  $('.card-front').removeClass('card-front');
  $selectedCards.addClass('card-hidden');
  checkGameProgress();
}

const flipDifferentCards = function flipDifferentCards($selectedCards) {
  $selectedCards.removeClass('card-front');
  $selectedCards.addClass('card-back');
  checkGameProgress();
}

const checkGameProgress = function checkGameProgress() {
  const numberOfHiddenCards = $('.card-hidden').length;
  const numberOfRemainingCards = numberOfTotalCards - numberOfHiddenCards;

  if (numberOfRemainingCards === 0) {
    endGame();
  }
}

const endGame = function endGame() {
  const $bestScoreElement = $('.best-score');
  const currentScore = moves;
  bestScore = Number(localStorage.getItem('bestScore'));
  
  if ((bestScore === 0) || (currentScore < bestScore)) {
    localStorage.setItem('bestScore', currentScore);
    $bestScoreElement.text(currentScore);
  } else {
    $bestScoreElement.text(bestScore);
  }

  $('.score').text(currentScore);
  $('.end-screen').addClass('end-screen-visible');
  $('.start-screen-button').on('click', startGame);
}
