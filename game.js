/**
 * Classe représentant le joueur.
 */
class Player {
    /**
     * @constructor
     * @param {string} color - Couleur du joueur.
     */
    constructor(canvas, ctx, color) {

        this.canvas = canvas;

        this.ctx = ctx;

        this.mass = 300;

        /**
         * Position en abscisse du joueur.
         * @type {number}
         */
        this.x = this.canvas.width / 2;

        /**
         * Position en ordonnée du joueur.
         * @type {number}
         */
        this.y = this.canvas.height / 2;

        /**
         * Couleur du joueur.
         * @type {string}
         */
        this.color = color;

        /**
         * Rayon du joueur.
         * @type {number}
         */
        this.radius = 20;

        /**
         * Rayon des tirs du joueur.
         * @type {number}
         */
        this.shootRadius = 10;

        /**
         * Masse des tirs du joueur.
         * @type {number}
         */
        this.shootMass = 10;

        this.shootSpeed = 1000;

        /**
         * Tableau contenant les informations sur les tirs du joueur.
         * @type {Array<object>}
         */
        this.shoots = [];
    }

    /**
     * Dessine le joueur à l'écran.
     * @param {number} deltaTime - Temps écoulé depuis la dernière frame.
     */
    draw(deltaTime) {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = this.color;
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
        this.updateShoots(deltaTime);
    }

    /**
  * Fait tirer le joueur dans une direction donnée.
  * @param {number} angle - Angle de tir en radians.
  */
    shoot(angle) {
        this.shoots.push({
            x: this.x,
            y: this.y,
            angle,
            mass: this.shootMass,
            speed: this.shootSpeed,
            radius: this.shootRadius,
            velocity: {
                x: this.shootSpeed * Math.cos(angle),
                y: this.shootSpeed * Math.sin(angle),
            },
        });
    }

    /**
     * Met à jour la position des tirs du joueur.
     * @param {number} deltaTime - Temps écoulé depuis la dernière frame.
     */
    updateShoots(deltaTime) {
        this.shoots.forEach((shoot, index) => {
            // Mettre à jour la position en utilisant la vélocité actuelle
            shoot.x += shoot.velocity.x * deltaTime;
            shoot.y += shoot.velocity.y * deltaTime;

            // Mettre à jour la vélocité en fonction de l'accélération
            const acceleration = shoot.speed / shoot.mass;
            shoot.velocity.x -= Math.cos(shoot.angle) * acceleration * deltaTime;
            shoot.velocity.y -= Math.sin(shoot.angle) * acceleration * deltaTime;

            this.drawShoot(shoot);

            if (this.isOutOfBounds(shoot)) {
                this.shoots.splice(index, 1);
            }
        });
    }

    /**
     * Dessine un tir du joueur à l'écran.
     * @param {object} shoot - Objet représentant un tir du joueur.
     */
    drawShoot(shoot) {
        this.ctx.beginPath();
        this.ctx.fillStyle = "blue";
        this.ctx.strokeStyle = "blue";
        this.ctx.arc(shoot.x, shoot.y, shoot.radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();
    }

    /**
     * Vérifie si un tir est hors des limites du this.canvas.
     * @param {object} shoot - Objet représentant un tir du joueur.
     * @returns {boolean} - True si le tir est hors des limites, sinon false.
     */
    isOutOfBounds(shoot) {
        return (
            shoot.x > this.canvas.width ||
            shoot.x < 0 ||
            shoot.y > this.canvas.height ||
            shoot.y < 0
        );
    }
}


/**
 * Classe représentant un ennemi.
 */
class Enemy {
    /**
     * @constructor
     * @param {string} color - Couleur de l'ennemi.
     */
    constructor(color, enemieRadius, enemieSpeed, enemieMass) {
        /**
         * Rayon de l'ennemi.
         * @type {number}
         */
        this.radius = enemieRadius;

        /**
         * Couleur de l'ennemi.
         * @type {string}
         */
        this.color = color;

        this.mass = enemieMass;

        /**
         * Vitesse de déplacement aléatoire de l'ennemi.
         * @type {number}
         */
        this.speed = enemieSpeed;

        // Appelle la méthode spawn pour initialiser la position de l'ennemi.
        this.spawn();
    }

    /**
     * Initialise la position de l'ennemi en fonction du côté du this.canvas.
     */
    spawn() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const margin = 2 * this.radius;

        const side = Math.floor(Math.random() * 4);
        switch (side) {
            case 0: this.x = Math.random() * screenWidth; this.y = -margin; break;
            case 1: this.x = Math.random() * screenWidth; this.y = screenHeight + margin; break;
            case 2: this.x = -margin; this.y = Math.random() * screenHeight; break;
            case 3: this.x = screenWidth + margin; this.y = Math.random() * screenHeight; break;
        }
    }

    /**
     * Dessine l'ennemi à l'écran.
     * @param {number} deltaTime - Temps écoulé depuis la dernière frame.
     */
    draw(deltaTime, player, ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        this.update(deltaTime, player);
    }

    /**
     * Met à jour la position de l'ennemi en direction du joueur.
     * @param {number} deltaTime - Temps écoulé depuis la dernière frame.
     */
    update(deltaTime, player) {

        const acceleration = this.speed / this.mass;

        this.speed += acceleration * deltaTime;

        const angle = Math.atan2(player.y - this.y, player.x - this.x);
        this.x += Math.cos(angle) * this.speed * deltaTime;
        this.y += Math.sin(angle) * this.speed * deltaTime;
    }
}


/**
 * Représente un jeu avec un joueur, des ennemis et divers éléments de jeu.
 * @param {Object} player - L'objet du joueur.
 * @param {number} [maxLife=Infinity] - La vie maximale du joueur.
 * @param {number} [maxEnemies=Infinity] - Le nombre maximum d'ennemis.
 */
class Game {
    constructor(canvas, ctx, startBtn, player, maxLife = Infinity, maxEnemies = Infinity) {

        this.canvas = canvas;

        this.ctx = ctx;

        this.startBtn = startBtn;

        /**
         * Le joueur du jeu.
         * @type {Object}
         */
        this.player = player;

        this.enemieSpeed = 1000;

        this.enemieMass = 1000;

        this.enemieRadius = 10;

        /**
         * Liste des ennemis présents dans le jeu.
         * @type {Array}
         */
        this.enemies = [];

        /**
         * Nombre maximum d'ennemis autorisé dans le jeu.
         * @type {number}
         */
        this.maxEnemies = maxEnemies;

        /**
         * Nombre total d'ennemis dans le jeu (initialement égal au maximum).
         * @type {number}
         */
        this.totalEnemies = maxEnemies;

        /**
         * Compteur d'ennemis actuellement présents dans le jeu.
         * @type {number}
         */
        this.currentCountEnemies = 0;

        /**
         * Score du joueur.
         * @type {number}
         */
        this.score = 0;


        /**
         * Vie maximale du joueur (par défaut à l'infini).
         * @type {number}
         */
        this.maxLife = maxLife;

        /**
         * Vie actuelle du joueur (initialement égale à la vie maximale).
         * @type {number}
         */
        this.life = this.maxLife;

        /**
         * Statut du jeu (gameOver indique si le jeu est terminé).
         * @type {boolean}
         */
        this.gameOver = true;

        /**
         * Délai entre l'apparition de deux ennemis successifs (en millisecondes).
         * @type {number}
         */
        this.timeEnemyAppearInMs = 1000;

        // Particules

        /**
         * Liste des particules utilisées pour les effets visuels.
         * @type {Array}
         */
        this.particles = [];

        /**
         * Rayon des particules.
         * @type {number}
         */
        this.particleRadius = 5;

        /**
         * Nombre maximal de particules autorisées.
         * @type {number}
         */
        this.maxParticules = 50;

        /**
         * Masse des particules.
         * @type {number}
         */
        this.particleMass = 8;

        this.particleRadiusRadiusAfterColid = 0.03;

        /**
         * Magnitude de la vitesse des particules.
         * @type {number}
         */
        this.velocityMagnitudeParticule = 0.5;

        /**
         * Valeur minimale pour la dispersion de l'angle.
         * @type {number}
         */
        this.minAngleSpread = 0.5;

        /**
         * Valeur maximale pour la dispersion de l'angle.
         * @type {number}
         */
        this.maxAngleSpread = 0.5;

        /**
         * Facteur pour réduire la vitesse initiale des particules.
         * @type {number}
         */
        this.velocityReductionFactor = 0.07;

        /**
         * Facteur de réduction du chevauchement pour les collisions.
         * @type {number}
         */
        this.overlapReductionFactor = 0.7;

        /**
         * Taille du texte affiché à l'écran.
         * @type {number}
         */
        this.textSize = 40;

        /**
         * Police du texte.
         * @type {string}
         */
        this.textFont = "serif";

        /**
         * Marge du texte par rapport aux bords de l'écran.
         * @type {number}
         */
        this.textMargin = 10;

        /**
         * Couleur du texte.
         * @type {string}
         */
        this.textColor = "white";

        /**
         * Identifiant de la requête d'animation pour la boucle de jeu.
         * @type {number}
         */
        this.requestId;

        /**
         * Temps actuel en millisecondes (utilisé pour calculer deltaTime).
         * @type {number}
         */
        this.now = Date.now();

        this.deltaTime = 0;

        this.elapsedTime = 0;

        this.slowMo = 1;

        // Liaison des événements et démarrage de la boucle de jeu
        this.bindEvent();
        this.update();
    }


    /**
     * Exécute la boucle de jeu en fonction du temps écoulé.
     * @param {number} deltaTime - Le temps écoulé depuis la dernière image.
     */
    run() {
        if (!this.gameOver) {
            this.play();
            this.elapsedTime += this.deltaTime;
            return;
        }

        this.startBtn.style.display = "block";
        this.player.draw(this.deltaTime);
        this.displayText();
    }

    /**
     * Lie divers gestionnaires d'événements pour l'entrée utilisateur et les actions de jeu.
     */
    bindEvent() {
        this.handleClick(this.player);
        this.handleStartBtn(this.startBtn);
        this.addEnemy();
    }

    /**
     * Exécute la logique du jeu pendant le gameplay actif.
     * @param {number} deltaTime - Le temps écoulé depuis la dernière image.
     */
    play() {
        this.player.draw(this.deltaTime);
        this.drawEnemies(this.ctx);
        this.checkCollisions();
        this.updateParticles(this.player, this.enemies);
        this.drawParticles();
        this.displayText();
    }

    /**
     * Dessine les ennemis en fonction du temps écoulé.
     * @param {number} deltaTime - Le temps écoulé depuis la dernière image.
     */
    drawEnemies() {
        for (const enemy of this.enemies) {
            enemy.draw(this.deltaTime, this.player, this.ctx);
        }
    }

    /**
     * Vérifie les collisions entre le joueur, les tirs et les ennemis.
     */
    checkCollisions() {
        this.enemies.forEach((enemy, enemyIndex) => {
            if (this.detectCollision(this.player, enemy)) {
                this.handlePlayerEnemyCollision(enemyIndex);
            }

            this.player.shoots.forEach((shoot, shootIndex) => {
                if (this.detectCollision(shoot, enemy)) {
                    this.handleShootEnemyCollision(shootIndex, enemyIndex);
                }
            });
        });
    }

    /**
     * Gère la collision entre le joueur et un ennemi.
     * @param {number} enemyIndex - L'indice de l'ennemi dans le tableau.
     */
    handlePlayerEnemyCollision(enemyIndex) {
        this.life -= 10;
        this.enemies.splice(enemyIndex, 1);
        this.totalEnemies--;

        if (this.life <= 0) {
            this.gameOver = true;
            this.life = 0;
            cancelAnimationFrame(this.requestId);
        }

        if (this.totalEnemies <= 0) {
            this.gameOver = true;
            cancelAnimationFrame(this.requestId);
        }
    }

    /**
     * Gère la collision entre un tir et un ennemi.
     * @param {number} shootIndex - L'indice du tir dans le tableau des tirs du joueur.
     * @param {number} enemyIndex - L'indice de l'ennemi dans le tableau.
     */
    handleShootEnemyCollision(shootIndex, enemyIndex) {
        const enemy = this.enemies[enemyIndex];
        const shoot = this.player.shoots[shootIndex];

        this.createParticule(shoot, enemy);

        this.enemies.splice(enemyIndex, 1);
        this.score++;
        this.totalEnemies--;

        if (this.totalEnemies <= 0) {
            this.gameOver = true;
            cancelAnimationFrame(this.requestId);

        }
    }

    /**
     * Crée des particules lorsqu'un ennemi est touché.
     * @param {Object} shoot - L'objet tir du joueur.
     * @param {Object} enemy - L'objet ennemi touché.
     */
    createParticule(shoot, enemy) {
        for (let i = 0; i < this.maxParticules; i++) {
            const angleWithSpread = this.minAngleSpread + Math.random() * (this.maxAngleSpread - this.minAngleSpread);

            this.particles.push({
                x: enemy.x,
                y: enemy.y,
                color: enemy.color,
                radius: this.particleRadius,
                mass: this.particleMass,
                velocity: {
                    x: Math.cos(angleWithSpread) * this.velocityMagnitudeParticule * this.velocityReductionFactor,
                    y: Math.sin(angleWithSpread) * this.velocityMagnitudeParticule * this.velocityReductionFactor,
                },
            });
        }
    }

    /**
     * Met à jour les particules en fonction du temps écoulé.
     * @param {number} deltaTime - Le temps écoulé depuis la dernière image.
     */
    updateParticles(player, enemie) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            // Collision avec le joueur
            this.handlePlayerCollision(particle, player);

            // Collision avec les autres particules
            this.handleOtherParticlesCollision(particle);

            // Collision avec les tirs du joueur
            this.handlePlayerShootsCollision(particle);

            this.isOutOfBoundsParticle(particle);

            this.handleEnemiesParticleCollision(particle, enemie);

            particle.x += particle.velocity.x * this.deltaTime;
            particle.y += particle.velocity.y * this.deltaTime;
            particle.radius -= this.particleRadiusRadiusAfterColid * this.deltaTime;

            if (particle.radius <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    handlePlayerCollision(particle, player) {
        if (this.detectCollision(player, particle)) {
            const angle = Math.atan2(particle.y - player.y, particle.x - player.x);
            const overlap = particle.radius + player.radius - this.distance(player, particle);

            // Correction de la position
            particle.x += Math.cos(angle) * overlap * this.overlapReductionFactor;
            particle.y += Math.sin(angle) * overlap * this.overlapReductionFactor;

            // Correction de la vitesse
            const speedAlongNormal = particle.velocity.x * Math.cos(angle) + particle.velocity.y * Math.sin(angle);

            if (speedAlongNormal < 0) {
                const impulse = (2 * particle.mass) / (particle.mass + player.mass) * speedAlongNormal;

                particle.velocity.x -= impulse * Math.cos(angle);
                particle.velocity.y -= impulse * Math.sin(angle);
            }
        }
    }


    handleOtherParticlesCollision(particle) {
        for (let j = 0; j < this.particles.length; j++) {
            if (particle !== this.particles[j]) {
                const otherParticle = this.particles[j];

                if (this.detectCollision(particle, otherParticle)) {
                    const angle = Math.atan2(particle.y - otherParticle.y, particle.x - otherParticle.x);

                    // Correction de la position
                    const overlap = particle.radius + otherParticle.radius - this.distance(particle, otherParticle);
                    particle.x += Math.cos(angle) * overlap * this.overlapReductionFactor;
                    particle.y += Math.sin(angle) * overlap * this.overlapReductionFactor;

                    particle.velocity.x += Math.cos(angle) * particle.mass;
                    particle.velocity.y += Math.sin(angle) * particle.mass;

                    otherParticle.velocity.x -= Math.cos(angle) * otherParticle.mass;
                    otherParticle.velocity.y -= Math.sin(angle) * otherParticle.mass;
                }
            }
        }
    }

    handlePlayerShootsCollision(particle) {
        for (let k = 0; k < this.player.shoots.length; k++) {
            const shoot = this.player.shoots[k];
            if (this.detectCollision(shoot, particle)) {
                const angle = Math.atan2(particle.y - shoot.y, particle.x - shoot.x);

                // Correction de la position
                const overlap = particle.radius + shoot.radius - this.distance(particle, shoot);
                particle.x += Math.cos(angle) * overlap * this.overlapReductionFactor;
                particle.y += Math.sin(angle) * overlap * this.overlapReductionFactor;

                // Correction de la vitesse en tenant compte de la masse du tir
                particle.velocity.x += Math.cos(angle) * shoot.mass;
                particle.velocity.y += Math.sin(angle) * shoot.mass;

                // shoot.x += Math.cos(angle) * particle.mass * this.deltaTime;
                // shoot.y += Math.sin(angle) * particle.mass * this.deltaTime;
                
                shoot.velocity.x += Math.cos(angle) * particle.mass * this.deltaTime;
                shoot.velocity.y += Math.sin(angle) * particle.mass * this.deltaTime;
            }
        }
    }


    handleEnemiesParticleCollision(particle, enemies) {
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            if (this.detectCollision(enemy, particle)) {
                const angle = Math.atan2(particle.y - enemy.y, particle.x - enemy.x);
                const overlap = particle.radius + enemy.radius - this.distance(enemy, particle);

                // Correction de la position
                particle.x += Math.cos(angle) * overlap * this.overlapReductionFactor;
                particle.y += Math.sin(angle) * overlap * this.overlapReductionFactor;

                // Correction de la vitesse en tenant compte de la masse de l'ennemi
                particle.velocity.x += Math.cos(angle) * enemy.mass;
                particle.velocity.y += Math.sin(angle) * enemy.mass;
            }
        }
    }

    distance(obj1, obj2) {
        const dx = obj1.x - obj2.x;
        const dy = obj1.y - obj2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }


    /**
    * Vérifie si une particule est hors des limites du canvas et ajuste sa vitesse en conséquence.
    * @param {Object} particle - La particule à vérifier.
    */
    isOutOfBoundsParticle(particle) {
        // Gestion des limites horizontales
        if (particle.x - particle.radius < 0) {
            particle.x = particle.radius;
            particle.velocity.x *= -this.velocityReductionFactor;
        }

        if (particle.x + particle.radius > this.canvas.width) {
            particle.x = this.canvas.width - particle.radius;
            particle.velocity.x *= -this.velocityReductionFactor;
        }

        // Gestion des limites verticales
        if (particle.y - particle.radius < 0) {
            particle.y = particle.radius;
            particle.velocity.y *= -this.velocityReductionFactor;
        }

        if (particle.y + particle.radius > this.canvas.height) {
            particle.y = this.canvas.height - particle.radius;
            particle.velocity.y *= -this.velocityReductionFactor;
        }
    }

    /**
     * Dessine les particules à l'écran.
     */
    drawParticles() {
        for (const particle of this.particles) {
            this.ctx.beginPath();
            this.ctx.fillStyle = particle.color;
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }

    /**
     * Détermine s'il y a une collision entre deux objets circulaires.
     * @param {Object} c1 - Le premier objet circulaire.
     * @param {Object} c2 - Le deuxième objet circulaire.
     * @returns {boolean} - True s'il y a collision, sinon False.
     */
    detectCollision(c1, c2) {
        const distX = c1.x - c2.x;
        const distY = c1.y - c2.y;
        const distance = Math.sqrt(distX * distX + distY * distY);
        return distance <= c1.radius + c2.radius;
    }

    /**
     * Gère l'événement de clic sur le canvas, permettant au joueur de tirer.
     */
    handleClick(player) {
        this.canvas.addEventListener('click', (e) => {
            if (!this.gameOver) {
                const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
                this.player.shoot(angle);
            }
        });
    }

    /**
     * Ajoute un ennemi au jeu à intervalles réguliers.
     */
    addEnemy() {
        if (!this.gameOver && this.currentCountEnemies < this.maxEnemies) {
            const h = Math.random() * 360;
            const s = 100;
            const l = 50;

            const color = `hsl(${h},${s}%, ${l}%)`;
            this.enemies.push(new Enemy(color, this.enemieRadius, this.enemieSpeed, this.enemieMass));
            this.currentCountEnemies++;
        }

        setTimeout(() => this.addEnemy(), this.timeEnemyAppearInMs * (2 - this.deltaTime));
    }

    /**
     * Gère l'événement de clic sur le bouton de démarrage, réinitialisant le jeu.
     */
    handleStartBtn(startBtn) {
        startBtn.addEventListener('click', () => {
            this.gameOver = false;
            this.resetGame();
            this.update();
        });
    }

    /**
     * Met à jour le jeu à chaque trame.
     */
    update() {
        this.requestId = requestAnimationFrame(() => this.update());
        const now = Date.now();
        const deltaTime = ((now - this.now) / 1000) * this.slowMo;
        this.ctx.fillStyle = "rgba(0,0,0,0.5)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.run();

        this.now = now;
        this.deltaTime = deltaTime;
    };

    /**
     * Affiche les informations textuelles à l'écran.
     */
    displayText() {
        this.text("Score: " + this.score, this.canvas.height - 50);
        this.text("Life: " + this.life, this.canvas.height - 100);
        this.text("Enemies: " + this.totalEnemies, this.canvas.height - 150);
        this.text("Time: " + Math.floor(this.elapsedTime) + " s", this.canvas.height - 200);
    }

    /**
     * Dessine un texte à l'écran.
     * @param {string} text - Le texte à afficher.
     * @param {number} posY - La position Y du texte à l'écran.
     */
    text(text, posY) {
        const posX = this.canvas.width - this.ctx.measureText(text).width - this.textMargin;
        this.ctx.beginPath();
        this.ctx.fillStyle = this.textColor;
        this.ctx.font = `${this.textSize}px ${this.textFont}`;
        this.ctx.fillText(text, posX, posY);
    }

    resetGame() {
        this.life = this.maxLife;
        this.currentCountEnemies = 0;
        this.particles = [];
        this.score = 0;
        this.enemies = [];
        this.totalEnemies = this.maxEnemies;
        this.elapsedTime = 0;
        this.startBtn.style.display = "none";
    }

    /***********************\
    |         SETTER         | 
    \***********************/

    /**
     * Définie le radius du player
     * @param {int} radius 
     */
    setPlayerRadius(radius) {
        this.player.radius = radius;
    }

    /**
    * Définie la masse des tirs du joueur.
    * @type {number}
    */
    setPlayerShootMass(mass) {
        this.player.shootMass = mass;
    }

    setPlayerShootSpeed(speed) {
        this.player.shootSpeed = speed;
    }

    /**
     * Définie le rayon des tirs du joueur.
     * @type {number}
     */
    setPlayerShootRadius(radius) {
        this.player.shootRadius = radius;
    }


    /**
     * Définie la vie du player
     * @param {int} life 
     */
    setPlayerMaxLife(maxLife) {

        if (maxLife === -1) {
            maxLife = Infinity;
        }

        this.maxLife = maxLife;
        this.life = maxLife;
    }

    /**
      * Définie le maximum d'ennemies
      * @param {int} 
      */
    setEnemieMaxEnemies(maxEnemies) {

        if (maxEnemies === -1) {
            maxEnemies = Infinity;
        }

        this.maxEnemies = maxEnemies;
        this.totalEnemies = maxEnemies;
    }

    /**
    *   Définie délai entre l'apparition de deux ennemis successifs (en millisecondes).
    *   @type {number}
    */
    setEnemietimeEnemyAppear(time) {
        this.timeEnemyAppearInMs = time
    }

    setEnemieMass(mass) {
        this.enemieMass = mass;
    }

    setEnemieSpeed(speed) {
        this.enemieSpeed = speed;
    }

    setEnemieRadius(radius) {
        this.enemieRadius = radius;
    }


    /**
     *  Définie le rayon des particules.
     * @type {number}
     */
    setParticleRadius(radius) {
        this.particleRadius = radius;
    }

    /**
     *  Définie le nombre maximal de particules autorisées.
     * @type {number}
     */
    setParticleMax(max) {
        this.maxParticules = max;
    }

    /**
     * Définie la masse des particules.
     * @type {number}
     */
    setParticleMass(mass) {
        this.particleMass = mass;
    }

    /**
     * Définie la magnitude de la vitesse des particules.
     * @type {number}
     */
    setParticleVelocityMagnitude(magnitude) {
        this.velocityMagnitudeParticle = magnitude;
    }


    /**
     * Définie le facteur pour réduire la vitesse initiale des particules.
     * @type {number}
     */
    setVelocityReductionFactor(velocityReductionFactor) {
        this.velocityReductionFactor = velocityReductionFactor;
    }

    /**
     * Définie le facteur de réduction du chevauchement pour les collisions.
     * @type {number}
     */
    setOverlapReductionFactor(overlapReductionFactor) {
        this.overlapReductionFactor = overlapReductionFactor;
    }

    setParticleRadiusAfterColid(radius) {
        this.particleRadiusRadiusAfterColid = radius;
    }

    setSlowMo(time) {
        this.slowMo = time;
    }

    /***********************\
    |         GETTER         | 
    \***********************/

    getPlayerRadius() {
        return this.player.radius;
    }
}

export { Game, Player };