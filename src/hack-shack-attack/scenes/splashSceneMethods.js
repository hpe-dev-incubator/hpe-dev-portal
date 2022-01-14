/* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
/* eslint-disable no-param-reassign */
function thankYouSceneMethods(ThankYouScene) {
  ThankYouScene.init = function init() {
    this.startScene = false;
    this.buttonPressed = false;
    this.gamepad = undefined;
    this.height = this.game.config.height;
    this.width = this.game.config.width;
  };

  ThankYouScene.create = function create() {
    this.countdown();
    this.keyboardInputs();
    this.winnersSplash = this.add.sprite(
      this.width / 2,
      this.height / 2,
      'winners',
    );
    this.cameras.main.fadeIn(2000);
    this.time.addEvent({
      delay: 7000,
      callback: () => {
        this.cameras.main.fade(2000);
        this.cameras.main.on('camerafadeoutcomplete', () => {
          this.scene.start('AttractMode');
        });
      },
    });
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

  ThankYouScene.keyboardInputs = function keyboardInputs() {
    this.enterInput = this.input.keyboard.on('keyup_ENTER', this.onEnter, this);
  };

  ThankYouScene.onEnter = function onEnter() {
    this.startScene = false;
    this.scene.start('Title');
  };

  ThankYouScene.gamepadInputs = function gamepadInputs() {
    if (this.gamepad.A && this.buttonPressed === false) {
      this.buttonPressed = true;
      this.onEnter();
    }
    if (!this.gamepad.A) {
      this.buttonPressed = false;
    }
  };
  return null;
}

export default thankYouSceneMethods;
