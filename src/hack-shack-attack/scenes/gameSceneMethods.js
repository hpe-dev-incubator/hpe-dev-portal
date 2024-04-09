/* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
/* eslint-disable object-shorthand */
/* eslint-disable no-param-reassign */

import {
  itBugMethods,
  itMonsterMethods,
  playerMethods,
  bulletMethods,
  powerUpMethods,
} from '../objects';

function gameSceneMethods(GameScene, Phaser) {
  const ItBug = Phaser.Class && new Phaser.Class(itBugMethods(Phaser));
  const ItMonster = Phaser.Class && new Phaser.Class(itMonsterMethods(Phaser));
  const Player = Phaser.Class && new Phaser.Class(playerMethods(Phaser));
  const Bullet = Phaser.Class && new Phaser.Class(bulletMethods(Phaser));
  const PowerUp = Phaser.Class && new Phaser.Class(powerUpMethods(Phaser));

  GameScene.init = function init() {
    this.gamepad = undefined;
    this.height = this.game.config.height;
    this.width = this.game.config.width;
    this.spawnTimerBug = 0;
    this.spawnTimerMonster = 0;
    this.bulletTimer = 0;
    this.collisionDamage = 1;
    this.spawnSide = ['left', 'right', 'bottom'];
    this.powerUpTimer = 0;
    this.powerUpCount = 0;
    this.dead = false;
    this.disableFire = false;
    this.score = 0;
    this.startRound = false;
    this.loading = false;
  };

  GameScene.create = function create() {
    this.map = this.add
      .sprite(this.width / 2, this.height / 2 - 90, 'map')
      .setScale(0.55);

    this.fireKeys = this.input.keyboard.createCursorKeys();
    this.moveKeys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    this.startText = this.add
      .text(this.width / 2, this.height / 2 - 200, '', {
        fontFamily: 'Kemco',
        fontSize: '60px',
      })
      .setTint(0xffffff)
      .setOrigin(0.5, 0.5);

    this.countdown();
    this.createWallsandBorders();
    this.createGroups();
    this.createPlayer();
    this.addCollisions();
    this.setupEvents();
    this.physics.world.setBounds(255, 120, this.width - 515, this.height - 322);
    this.playerAvatar = this.add
      .sprite(this.width - 465, 90, 'playerAvatar')
      .setScale(0.45)
      .setDepth(1);
    this.scoreText = this.add
      .text(290, 75, 'Score:0', {
        fontFamily: 'Kemco',
        fontSize: '26px',
      })
      .setTint(0xffffff)
      .setDepth(1);
    this.livesText = this.add
      .text(this.width - 435, 75, `Lives:${this.player.lives}`, {
        fontFamily: 'Kemco',
        fontSize: '26px',
      })
      .setTint(0xffffff)
      .setDepth(1);
  };

  GameScene.setupEvents = function setupEven() {
    this.events.on('gameover', () => this.gameOver());
    this.events.on('updateScore', (points) => {
      this.score += points;
      this.scoreText.setText(`Score:${this.score}`);
    });
    this.events.on('gotPowerUp', () => {
      this.powerUpCount = 0;
      this.disableFire = true;

      this.powerUpCollect = this.add
        .sprite(this.player.x, this.player.y, 'powerUpCollect')
        .setScale(0.4)
        .play('powerUpCollect');

      this.player.disableBody();
      this.player.setActive(false);
      this.player.setVisible(false);

      this.itMonsters.getChildren().map((child) => child.kill());
      this.itBugs.getChildren().map((child) => child.kill());

      this.powerUpCollect.on('animationcomplete', () => {
        this.disableFire = false;
        this.player.enableBody();
        this.player.setActive(true);
        this.player.setVisible(true);
      });
    });
  };

  GameScene.createWallsandBorders = function createWallsandBorders() {
    this.doorLeft = this.physics.add.sprite(this.width / 2 - 40, -150);
    this.physics.add.existing(this.doorLeft);
    this.doorLeft.body.setSize(10, 600).setImmovable(true);

    this.doorRight = this.physics.add.sprite(this.width / 2 + 40, -150);
    this.physics.add.existing(this.doorRight);
    this.doorRight.body.setSize(10, 600).setImmovable(true);

    this.borderDark = this.add
      .graphics()
      .fillStyle(0x11141a, 1)
      .fillRect(0, this.height / 2 - 280, 280, this.height - 100)
      .fillRect(this.width - 25, this.height / 2 - 280, -260, this.height - 100)
      .fillRect(this.width / 2 - 75, 0, 150, 75)
      .fillRect(0, this.height - 50, this.width, -190)
      .setDepth(2);
    this.borderLight = this.add
      .graphics()
      .fillStyle(0x11141a, 0.8)
      .fillRect(0, this.height / 2 - 280, 300, this.height - 100)
      .fillRect(this.width - 50, this.height / 2 - 280, -260, this.height - 100)
      .fillRect(this.width / 2 - 75, 0, 150, 100)
      .fillRect(0, this.height - 75, this.width, -180)
      .setDepth(2);
  };
  GameScene.createGroups = function createGroups() {
    this.itBugs = this.physics.add.group({ classType: ItBug });
    this.itMonsters = this.physics.add.group({ classType: ItMonster });
    this.bullets = this.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });
    this.powerUps = this.physics.add.group({ classType: PowerUp });
  };

  GameScene.addCollisions = function addCollisions() {
    this.physics.add.collider(this.itBugs, this.itBugs);
    this.physics.add.collider(this.itMonsters, this.itMonsters);
    this.physics.add.collider(this.itMonsters, this.itBugs);

    this.physics.add.collider(this.itMonsters, this.doorLeft);
    this.physics.add.collider(this.itMonsters, this.doorRight);

    this.physics.add.overlap(
      this.player,
      this.itBugs,
      () => this.player.onHit(this.collisionDamage, this.livesText),
      this.checkEnemyCollision,
      this,
    );
    this.physics.add.overlap(
      this.itBugs,
      this.bullets,
      this.bulletCollision,
      this.checkBulletCollision,
      this,
    );

    this.physics.add.overlap(
      this.player,
      this.itMonsters,
      () => this.player.onHit(this.collisionDamage, this.livesText),
      this.checkEnemyCollision,
      this,
    );
    this.physics.add.overlap(
      this.itMonsters,
      this.bullets,
      this.bulletCollision,
      this.checkBulletCollision,
      this,
    );

    this.physics.add.overlap(
      this.player,
      this.powerUps,
      this.powerUpCollision,
      this.checkEnemyCollision,
      this,
    );
  };

  GameScene.createPlayer = function createPlayer() {
    this.player = new Player(this, this.width / 2 - 5, this.height / 2);
    this.player
      .setCollideWorldBounds(true)
      .setSize(60, 80, true)
      .setOffset(10, 18);
  };

  GameScene.update = function update(time) {
    if (this.input.gamepad.total > 0 && !this.gamepad) {
      this.gamepad = this.input.gamepad.getPad(0);
    }
    if (this.startRound) {
      this.player.update(this.moveKeys, this.fireKeys, this.gamepad);
      if (!this.dead && !this.disableFire) {
        if (this.gamepad) {
          this.fireBulletsGamepad(time, this.gamepad);
        } else {
          this.fireBulletsKeyboard(time, this.fireKeys);
        }
      } else {
        this.bulletTimer = time;
      }
      this.spawnitBug(time);
      this.spawnitMonster(time);
      this.addPowerUp(time);

      Phaser.Utils.Array.Each(
        this.itBugs.getChildren(),
        this.physics.moveToObject,
        this.physics,
        this.player,
        150,
      );

      Phaser.Utils.Array.Each(
        this.itMonsters.getChildren(),
        this.physics.moveToObject,
        this.physics,
        this.player,
        100,
      );
    } else {
      this.spawnTimerBug = time;
      this.bulletTimer = time;
      this.powerUpTimer = time + 15000;
      this.spawnTimerMonster = time + 2500;
    }
  };
  GameScene.countdown = function countdown() {
    if (!this.startRound) {
      const startTimer = this.time.addEvent({
        delay: 1000,
        repeat: 4,
        callback: () => {
          this.startText.setText(`${startTimer.repeatCount - 1}`);
          if (startTimer.repeatCount === 1) {
            this.startText.setText('GO!').setX(this.width / 2 + 20);
            this.startRound = true;
          }
          if (startTimer.repeatCount === 0) {
            this.startText.setAlpha(0);
          }
        },
      });
    }
  };
  GameScene.fireBulletsGamepad = function fireBulletsGamepad(time, gamepad) {
    if (time > this.bulletTimer) {
      if (gamepad.A || gamepad.B || gamepad.X || gamepad.Y) {
        let bullet = this.bullets.getFirstDead(false);
        if (!bullet) {
          bullet = new Bullet(this, 0, 0);
          this.bullets.add(bullet);
        }
        if (bullet) {
          bullet.onFireGamepad(this.player.x, this.player.y, gamepad);
          this.bulletTimer += 200;
        }
      } else {
        this.bulletTimer += 200;
      }
    }
  };
  GameScene.fireBulletsKeyboard = function fireBulletsKeyboard(time, key) {
    if (time > this.bulletTimer) {
      if (
        key.up.isDown ||
        key.down.isDown ||
        key.right.isDown ||
        key.left.isDown
      ) {
        let bullet = this.bullets.getFirstDead(false);
        if (!bullet) {
          bullet = new Bullet(this, 0, 0);
          this.bullets.add(bullet);
        }
        if (bullet) {
          bullet.onFireKeyboard(this.player.x, this.player.y, key);
          this.bulletTimer += 200;
        }
      } else {
        this.bulletTimer += 200;
      }
    }
  };

  GameScene.gameOver = function gameOver() {
    this.dead = true;
    this.events.removeListener('gameover');
    this.events.removeListener('updateScore');
    this.events.removeListener('gotPowerUp');
    this.cameras.main.fade(2000);
    this.loading = true;
    this.getLeaderboard();
  };

  GameScene.spawnitBug = function spawnitBug(time) {
    if (time > this.spawnTimerBug) {
      let itBug = this.itBugs.getFirstDead(false);
      if (!itBug) {
        itBug = new ItBug(this, 0, 0);
        this.itBugs.add(itBug);
      }
      if (itBug) {
        const coords = this.getSpawnPos();
        itBug
          .setActive(true)
          .setVisible(true)
          .setScale(0.4)
          .enableBody()
          .setCircle(30, 18, 50)
          .spawn(coords.x, coords.y);
        const newTime = Phaser.Math.Between(600, 1000);
        this.spawnTimerBug = time + newTime;
      }
    }
  };

  GameScene.addPowerUp = function addPowerUp(time) {
    if (this.powerUpCount === 0) {
      if (time > this.powerUpTimer) {
        let powerUp = this.powerUps.getFirstDead(false);
        if (!powerUp) {
          powerUp = new PowerUp(this, 0, 0);
          this.powerUps.add(powerUp);
        }
        if (powerUp) {
          this.powerUpCount = 1;
          const x = Phaser.Math.Between(315, this.width - 330);
          const y = Phaser.Math.Between(135, this.height - 275);
          powerUp
            .setActive(true)
            .setVisible(true)
            .enableBody()
            .setScale(0.5)
            .setSize(75, 75, true)
            .setOffset(10, 15)
            .spawn(x, y);
          this.powerUpTimer += 35000;
        }
      }
    } else {
      this.powerUpTimer = time + 35000;
    }
  };

  GameScene.spawnitMonster = function spawnitMonster(time) {
    if (time > this.spawnTimerMonster) {
      let itMonster = this.itMonsters.getFirstDead(false);
      if (!itMonster) {
        itMonster = new ItMonster(this, 0, 0);
        this.itMonsters.add(itMonster);
      }
      if (itMonster) {
        itMonster
          .setActive(true)
          .setVisible(true)
          .setScale(0.65)
          .setSize(75, 80)
          .enableBody()
          .spawn(this.width / 2, 0);
        const newTime = Phaser.Math.Between(1800, 2800);
        this.spawnTimerMonster = time + newTime;
      }
    }
  };

  GameScene.getSpawnPos = function getSpawnPos() {
    const index = Math.floor(Math.random() * 3);
    let x;
    let y;
    switch (this.spawnSide[index]) {
      case 'left':
        x = Phaser.Math.Between(-100, -120);
        y = Phaser.Math.Between(100, this.height);
        return { x, y };
      case 'right':
        x = Phaser.Math.Between(this.width + 100, this.width + 120);
        y = Phaser.Math.Between(100, this.height);
        return { x, y };
      case 'bottom':
        x = Phaser.Math.Between(0, this.width);
        y = Phaser.Math.Between(this.height + 100, this.height + 120);
        return { x, y };
      default:
        return { x, y };
    }
  };

  GameScene.getLeaderboard = function getLeaderboard() {
    return fetch(`${process.env.GATSBY_NETLIFY_ENDPOINT}/getLeaderboard`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        if (this.score > data[9].score) {
          this.cameras.main.on('camerafadeoutcomplete', () => {
            this.scene.start('GameOver', { score: this.score });
          });
        } else {
          this.cameras.main.on('camerafadeoutcomplete', () => {
            this.scene.start('ThankYou');
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  GameScene.checkBulletCollision = function checkBulletCollision(
    bullet,
    enemy,
  ) {
    return bullet.active && enemy.active;
  };

  GameScene.checkEnemyCollision = function checkEnemyCollision(player, enemy) {
    return player.active && enemy.active;
  };

  GameScene.bulletCollision = function bulletCollision(enemy, bullet) {
    enemy.onHit(1);
    bullet.onHit();
  };

  GameScene.powerUpCollision = function powerUpCollision(player, powerUp) {
    powerUp.onHit(player, this.gamepad);
  };
  return null;
}

export default gameSceneMethods;
