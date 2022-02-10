/* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
/* eslint-disable no-param-reassign */
function thankYouSceneMethods(ThankYouScene) {
  ThankYouScene.init = function init() {
    this.gamepad = undefined;
    this.buttonPressed = false;
    this.startScene = undefined;
    this.height = this.game.config.height;
    this.width = this.game.config.width;
  };

  ThankYouScene.create = function create() {
    this.createThankYou();
    this.createAnimations();
    this.countdown();
    this.keyboardInputs();
  };

  ThankYouScene.update = function update() {
    if (this.input.gamepad.total > 0) {
      this.gamepad = this.input.gamepad.getPad(0);
    }
    if (this.startScene) {
      if (this.gamepad) {
        this.gamepadInputs();
      }
    }
  };

  ThankYouScene.createThankYou = function createThankYou() {
    this.add
      .text(this.width / 2 + 10, this.height / 2 - 150, 'THANKS FOR PLAYING!', {
        fontFamily: 'Kemco',
        fontSize: '42px',
      })
      .setTint(0xffffff)
      .setOrigin(0.5, 0.5);

    this.acceptText = this.add
      .text(
        this.width / 2 - 260,
        this.height / 2,
        'Press A or Enter to continue',
        { fontFamily: 'Kemco', fontSize: '24px' },
      )
      .setTint(0xffffff);

    this.background = this.add
      .sprite(this.width / 2, this.height / 2 - 90, 'highscoreBG')
      .setScale(5.1, 5.2);
    this.eyes = this.add
      .sprite(this.width / 2, this.height / 2 - 120, 'highscoreEyes')
      .setScale(4);
  };

  ThankYouScene.createAnimations = function createAnimations() {
    this.acceptTextFade = this.tweens.add({
      targets: this.acceptText,
      alpha: 0,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      duration: 1200,
    });

    this.eyes.play('blink');
    this.background.anims.playReverse('closeMouth');
  };

  ThankYouScene.keyboardInputs = function keyboardInputs() {
    this.enterInput = this.input.keyboard.on('keyup_ENTER', this.enter, this);
    this.enterInput = this.input.keyboard.on('keyup_A', this.enter, this);
  };

  ThankYouScene.gamepadInputs = function gamepadInputs() {
    // A button
    if (this.gamepad.id.indexOf('Pro Controller') !== -1) {
      if (this.gamepad.buttons[1].pressed) {
        this.buttonPressed = true;
        this.enter();
      }
      if (!this.gamepad.buttons[1].pressed) {
        this.buttonPressed = false;
      }
    } else {
      if (this.gamepad.A && this.buttonPressed === false) {
        this.buttonPressed = true;
        this.enter();
      }
      if (!this.gamepad.A) {
        this.buttonPressed = false;
      }
    }
  };

  ThankYouScene.countdown = function countdown() {
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

  ThankYouScene.enter = function enter() {
    this.startScene = false;
    this.background.play('closeMouth');
    this.background.on('animationcomplete', () => {
      this.scene.start('Title');
    });
  };
  return null;
}

export default thankYouSceneMethods;
