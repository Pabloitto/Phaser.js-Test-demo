(function() {

    "use strict";

    var Start = function(pGame) {
        this.game = pGame;
    };

    Start.prototype = {
        singleBulletPattern: null,
        game: null,
        hero: null,
        bullets: null,
        shootTimer: 0,
        heroSpeed: 2,
        delayBetweenShoots : 400,
        preload: function() {
            this.game.stage.backgroundColor = '#FFF';
            this.game.load.spritesheet('hero', 'core/images/hero.png', 32, 32);
            this.game.forceSingleUpdate = true;
        },
        create: function() {
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.createHero();
            this.createSingleBulletPattern();
            this.createBullets();
        },
        update: function() {
            this.hero.rotation = this.game.physics.arcade.angleToPointer(this.hero);
            this.evaluateEvents();
        },
        shoot: function() {
            this.hero.animations.play('shoot');
            if (this.game.time.now > this.shootTimer && this.bullets.countDead() > 0) {
                this.shootTimer = this.game.time.now + this.delayBetweenShoots;
                var bullet = this.bullets.getFirstDead();
                bullet.anchor.setTo(0.5);
                bullet.reset(this.hero.x, this.hero.y);
                bullet.rotation = this.game.physics.arcade.angleToPointer(bullet);
                this.game.physics.arcade.moveToPointer(bullet, 300);
            }
        },
        createHero: function() {
            this.hero = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'hero');
            this.game.physics.arcade.enable(this.hero);
            this.hero.enableBody = true;
            this.hero.physicsBodyType = Phaser.Physics.ARCADE;
            this.hero.frame = 1;
            this.hero.anchor.setTo(0.5);
            this.hero.animations.add('walk', [1, 2, 3], 5, true);
            this.hero.animations.add('shoot', [0, 1], 5, false);
            this.hero.body.collideWorldBounds = true;
            this.game.input.keyboard.addKey(Phaser.Keyboard.onDown);
        },
        evaluateEvents: function() {
            
        	var isShooting = this.handleHeroShooting();
            var isWalking = this.handleHeroWalk();

            if (isWalking && !isShooting) {
                this.hero.animations.play('walk');
            } else {
                this.hero.animations.stop('walk');
                if (!isShooting) {
                    this.hero.frame = 1;
                }
            }
        },
        handleHeroShooting : function(){
        	var isShooting = false;

            if (this.game.input.activePointer.isDown) {
                this.shoot();
                isShooting = true;
            }

            return isShooting;
        },
        handleHeroWalk : function(){
        	var isWalking = false;

			if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                this.hero.position.x -= this.heroSpeed;
                isWalking = true;
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                this.hero.x += this.heroSpeed;
                isWalking = true;
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                this.hero.y -= this.heroSpeed;
                isWalking = true;
            }

            if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                this.hero.y += this.heroSpeed;
                isWalking = true;
            }

            return isWalking;
        },
        createSingleBulletPattern: function() {
            this.singleBulletPattern = this.game.add.bitmapData(30, 30);
            this.singleBulletPattern.ctx.fillStyle = '#CC181E';
            this.singleBulletPattern.ctx.beginPath();
            this.singleBulletPattern.ctx.arc(10, 10, 5, 0, Math.PI * 2, true);
            this.singleBulletPattern.ctx.closePath();
            this.singleBulletPattern.ctx.fill();
        },
        createBullets: function() {
            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
            this.bullets.createMultiple(50, this.singleBulletPattern);
            this.bullets.setAll('checkWorldBounds', true);
            this.bullets.setAll('outOfBoundsKill', true);
        }
    };

    $main.states.start.core = new Start($main.game);
}());