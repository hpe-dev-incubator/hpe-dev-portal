/* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
/* eslint-disable no-param-reassign */
import '../../css/typography.css';

function titleSceneMethods(TitleScene, Phaser) {
  TitleScene.init = function init() {
    this.gamepad = undefined;
    this.buttonPressed = false;
    this.stickPressed = false;
    this.startScene = false;
    this.cursor = new Phaser.Math.Vector2();
    this.selection = ['start', 'controls', 'leaderboard'];
  };

  TitleScene.create = function create() {
    this.countdown();

    // logo
    this.gameLogo = this.add.sprite(0, 0, 'gameLogo').setScale(0.5);
    this.centerObject(this.gameLogo, 0, 1.65);
    this.hpeDevLogo = this.add.sprite(0, 0, 'hpeDevLogo').setScale(0.5);
    this.centerObject(this.hpeDevLogo, -1.6, 2.8);

    // start select box
    this.startSelectionBox = this.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(0, 0, 190, 55);
    this.centerObject(this.startSelectionBox, 0.9, 0.5);
    // start button
    this.startButton = this.add
      .text(0, 0, 'Start', {
        fontFamily: 'Kemco',
        fontSize: '30px',
      })
      .setTint(0x000000)
      .setInteractive();
    this.centerObject(this.startButton, 0.5, 0.38);

    // how to play select
    this.controlsSelectionBox = this.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(0, 0, 230, 55);
    this.controlsSelectionBox.visible = false;
    this.centerObject(this.controlsSelectionBox, 1.1, 0);
    // how to play button
    this.controlsButton = this.add
      .text(this.width / 2 + 60, this.height / 2 - 108, 'Controls', {
        fontFamily: 'Kemco',
        fontSize: '30px',
      })
      .setTint(0xffffff)
      .setInteractive();
    this.centerObject(this.controlsButton, 0.85, -0.12);

    // leaderboard select
    this.leaderboardSelectionBox = this.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(0, 0, 290, 55);
    this.leaderboardSelectionBox.visible = false;
    this.centerObject(this.leaderboardSelectionBox, 1.38, -0.5);
    // leaderboard button
    this.leaderboardButton = this.add
      .text(this.width / 2 + 60, this.height / 2 - 108, 'Leaderboard', {
        fontFamily: 'Kemco',
        fontSize: '30px',
      })
      .setTint(0xffffff)
      .setInteractive();
    this.centerObject(this.leaderboardButton, 1.2, -0.65);

    // Keyboard instructions
    this.keyboardInstructions = this.add
      .text(
        this.width / 2 + 60,
        this.height / 2 - 108,
        'Use Keyboard arrow keys to navigate and press enter to select',
        {
          fontFamily: 'Kemco',
          fontSize: '15px',
        },
      )
      .setTint(0xffffff);
    this.centerObject(this.keyboardInstructions, 3.5, -1.25);
    this.acceptTextFade = this.tweens.add({
      targets: this.keyboardInstructions,
      alpha: 0,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      duration: 1200,
    });

    this.keyboardInputs();
  };

  TitleScene.update = function update() {
    if (this.input.gamepad.total > 0) {
      this.gamepad = this.input.gamepad.getPad(0);
    }
    if (this.startScene) {
      if (this.gamepad) {
        this.gamepadInputs();
      }
    }
  };

  TitleScene.keyboardInputs = function keyboardInputs() {
    this.upInput = this.input.keyboard.on('keyup_UP', this.moveUp, this);
    this.downInput = this.input.keyboard.on('keyup_DOWN', this.moveDown, this);
    this.enterInput = this.input.keyboard.on(
      'keyup_ENTER',
      this.onSelect,
      this,
    );
  };

  TitleScene.countdown = function countdown() {
    if (!this.startScene) {
      const startTimer = this.time.addEvent({
        delay: 500,
        repeat: 1,
        callback: () => {
          if (startTimer.repeatCount === 1) {
            this.startScene = true;
          }
        },
      });
    }
  };

  TitleScene.gamepadInputs = function gamepadInputs() {
    // A button
    if (this.gamepad.id.indexOf('Pro Controller') !== -1) {
      if (this.gamepad.buttons[1].pressed) {
        this.buttonPressed = true;
        this.onSelect();
      }
      if (!this.gamepad.buttons[1].pressed) {
        this.buttonPressed = false;
      }
    } else {
      if (this.gamepad.A && this.buttonPressed === false) {
        this.buttonPressed = true;
        this.onSelect();
      }
      if (!this.gamepad.A) {
        this.buttonPressed = false;
      }
    }
    // joystick
    if (this.gamepad.leftStick.y <= -0.6 && this.stickPressed === false) {
      this.stickPressed = true;
      this.moveUp();
    } else if (this.gamepad.leftStick.y >= 0.6 && this.stickPressed === false) {
      this.stickPressed = true;
      this.moveDown();
    }
    if (this.gamepad.leftStick.y === 0) {
      this.stickPressed = false;
    }
  };

  TitleScene.onSelect = function onSelect() {
    const { x } = this.cursor;
    if (this.selection[x] === 'start') {
      this.startScene = false;
      this.scene.start('Game');
    }
    if (this.selection[x] === 'controls') {
      this.startScene = false;
      this.scene.start('HowToPlay');
    }
    if (this.selection[x] === 'leaderboard') {
      this.startScene = false;
      this.getLeaderboard();
    }
  };

  TitleScene.moveUp = function moveUp() {
    if (this.cursor.x === 0) {
      this.cursor.x = 2;
      this.startSelectionBox.visible = false;
      this.startButton.setTint(0xffffff);
      this.leaderboardSelectionBox.visible = true;
      this.leaderboardButton.setTint(0x000000);
      return;
    }
    if (this.cursor.x === 1) {
      this.cursor.x = 0;
      this.startSelectionBox.visible = true;
      this.startButton.setTint(0x000000);
      this.controlsSelectionBox.visible = false;
      this.controlsButton.setTint(0xffffff);
      return;
    }
    if (this.cursor.x === 2) {
      this.cursor.x = 1;
      this.controlsSelectionBox.visible = true;
      this.controlsButton.setTint(0x000000);
      this.leaderboardSelectionBox.visible = false;
      this.leaderboardButton.setTint(0xffffff);
    }
  };

  TitleScene.moveDown = function moveDown() {
    if (this.cursor.x === 0) {
      this.cursor.x = 1;
      this.startSelectionBox.visible = false;
      this.startButton.setTint(0xffffff);
      this.controlsSelectionBox.visible = true;
      this.controlsButton.setTint(0x000000);
      return;
    }
    if (this.cursor.x === 1) {
      this.cursor.x = 2;
      this.controlsSelectionBox.visible = false;
      this.controlsButton.setTint(0xffffff);
      this.leaderboardSelectionBox.visible = true;
      this.leaderboardButton.setTint(0x000000);
      return;
    }
    if (this.cursor.x === 2) {
      this.cursor.x = 0;
      this.startSelectionBox.visible = true;
      this.startButton.setTint(0x000000);
      this.leaderboardSelectionBox.visible = false;
      this.leaderboardButton.setTint(0xffffff);
    }
  };

  TitleScene.getLeaderboard = function getLeaderboard() {
    return fetch(`${process.env.GATSBY_NETLIFY_ENDPOINT}/getLeaderboard`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => this.scene.start('Leaderboard', { data }))
      .catch((err) => {
        console.log(err);
      });
  };

  TitleScene.centerObject = function centerObject(
    gameObject,
    offsetX = 0,
    offsetY = 0,
  ) {
    const { width, height } = this.cameras.main;
    gameObject.x = width / 2 - offsetX * 100;
    gameObject.y = height / 2 - offsetY * 100;
  };
  return null;
}

export default titleSceneMethods;
