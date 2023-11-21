import { Game, Player } from "./game.js";

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const startBtn = document.querySelector('#startBtn');

const btnSetPlayerRadius = document.querySelector("#btnSetPlayerRadius");
const btnSetPlayerMaxLife = document.querySelector("#btnSetPlayerMaxLife");
const btnSetEnemieMaxEnemies = document.querySelector("#btnSetEnemieMaxEnemies");
const btnSetPlayerShootMass = document.querySelector("#btnSetPlayerShootMass");
const btnSetPlayerShootRadius = document.querySelector("#btnSetPlayerShootRadius");
const btnSetEnemietimeEnemyAppear = document.querySelector("#btnSetEnemietimeEnemyAppear");
const btnSetParticuleRadius = document.querySelector("#btnSetParticuleRadius");
const btnSetParticuleMax = document.querySelector("#btnSetParticuleMax");
const btnSetParticleMass = document.querySelector("#btnSetParticleMass");
const btnSetParticleVelocityMagnitude = document.querySelector("#btnSetParticleVelocityMagnitude");
const btnSetMinAngleSpread = document.querySelector("#btnSetMinAngleSpread");
const btnSetMaxAngleSpread = document.querySelector("#btnSetMaxAngleSpread");
const btnSetVelocityReductionFactor = document.querySelector("#btnSetVelocityReductionFactor");
const btnSetDampingFactor = document.querySelector("#btnSetDampingFactor");
const btnSetOverlapReductionFactor = document.querySelector("#btnSetOverlapReductionFactor");


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


const player = new Player(canvas, ctx, "white");
const game = new Game(canvas, ctx, startBtn, player);

game.run();

const setParameterChange = (button) => {
    button.addEventListener("change", (e) => {
        if (!isNaN(e.target.value)) {

            const buttonId = e.target.id;

            const methode = buttonId.split('btn')[1];

            const methodeName = methode.charAt(0).toLowerCase() + methode.slice(1);

            game[methodeName](e.target.value);
        }
    });
};

setParameterChange(btnSetPlayerRadius);
setParameterChange(btnSetPlayerMaxLife);
setParameterChange(btnSetEnemieMaxEnemies);
setParameterChange(btnSetPlayerShootMass);
setParameterChange(btnSetPlayerShootRadius);
setParameterChange(btnSetEnemietimeEnemyAppear);
setParameterChange(btnSetParticuleRadius);
setParameterChange(btnSetParticuleMax);
setParameterChange(btnSetParticleMass);
setParameterChange(btnSetParticleVelocityMagnitude);
setParameterChange(btnSetMinAngleSpread);
setParameterChange(btnSetMaxAngleSpread);
setParameterChange(btnSetVelocityReductionFactor);
setParameterChange(btnSetDampingFactor);
setParameterChange(btnSetOverlapReductionFactor);


