import { Game, Player } from './game.js';

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });

const startBtn = document.querySelector('#startBtn');
const setBtns = document.querySelectorAll('[id*=set]');

const menuItem = document.querySelector('.menu-item');
const menuOpen = document.querySelector('#menu-btn');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

const player = new Player(canvas, ctx, 'white');
const game = new Game(canvas, ctx, startBtn, player);

game.run();

/**
 * Ecoute le changement de valeur sur un button 
 * @param {object} button 
 */
const setParameterChange = (button) => {

    const resultNode = document.getElementById(button.id + "Results");
    resultNode.innerHTML = button.value;

    button.addEventListener('change', (e) => {
        if (!isNaN(e.target.value)) {
            const methode = e.target.id;
            const value = parseFloat(e.target.value);
            game[methode](value);
            resultNode.innerHTML = value;
        }
    });
};

for (const button of setBtns) {
    const result = document.createElement("div");
    result.setAttribute("id", button.id + "Results");
    result.style.border = "2px solid black";
    result.style.backgroundColor = "white";
    result.style.color = "black";
    result.style.borderRadius = "10px"
    button.parentNode.insertBefore(result, button.nextSibling);
    setParameterChange(button);
}

menuOpen.addEventListener('click', () => {
    const computedStyle = window.getComputedStyle(menuItem);
    const isBlock = computedStyle.display === 'block';

    menuItem.style.display = isBlock ? 'none' : 'block';
    menuOpen.innerHTML = isBlock ? 'Ouvrir' : 'Fermer';
    menuOpen.style.backgroundColor = isBlock ? 'white' : 'black';
    menuOpen.style.color = isBlock ? 'black' : 'white';
});




