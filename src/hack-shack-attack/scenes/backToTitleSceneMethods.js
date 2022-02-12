/* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
/* eslint-disable no-param-reassign */
function backToTitleSceneMethods(BackToTitle) {
  BackToTitle.init = function init(data) {
    this.gamepad = undefined;
    this.buttonPressed = false;
    this.stickPressed = false;
    this.startScene = false;

    this.height = this.game.config.height;
    this.width = this.game.config.width;

    this.selection = 'submit';
    this.score = data.score;
  };

  BackToTitle.create = function create() {
    this.countdown();
    this.createScene();
    this.createAnimations();
    this.keyboardInputs();
  };

  BackToTitle.update = function update() {
    if (this.input.gamepad.total > 0) {
      this.gamepad = this.input.gamepad.getPad(0);
    }
    if (this.startScene) {
      if (this.gamepad) {
        this.gamepadInputs();
      }
    }
  };

  BackToTitle.countdown = function countdown() {
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

  BackToTitle.keyboardInputs = function keyboardInputs() {
    this.leftInput = this.input.keyboard.on('keyup_LEFT', this.onChange, this);
    this.rightInput = this.input.keyboard.on(
      'keyup_RIGHT',
      this.onChange,
      this,
    );
    this.enterInput = this.input.keyboard.on(
      'keyup_ENTER',
      this.onSelect,
      this,
    );
  };

  BackToTitle.gamepadInputs = function gamepadInputs() {
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
    if (
      this.gamepad.leftStick.y <= -0.6 &&
      this.stickPressed === false &&
      this.selection !== 'submit'
    ) {
      this.stickPressed = true;
      this.onChange();
    } else if (
      this.gamepad.leftStick.y >= 0.6 &&
      this.stickPressed === false &&
      this.selection !== 'cancel'
    ) {
      this.stickPressed = true;
      this.onChange();
    }
    if (this.gamepad.leftStick.y === 0) {
      this.stickPressed = false;
    }
  };

  BackToTitle.createScene = function createScene() {
    // submit select box
    this.submitSelectionBox = this.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(this.width / 2 - 230, this.height / 2 - 40, 180, 70);

    // cancel select box
    this.cancelSelectionBox = this.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(this.width / 2 + 40, this.height / 2 - 40, 180, 70);
    this.cancelSelectionBox.visible = false;
    // submit and cancel buttons
    this.submitButton = this.add
      .text(this.width / 3 + 40, this.height / 2 - 28, 'Yes', {
        fontFamily: 'Kemco',
        fontSize: '40px',
      })
      .setTint(0x000000)
      .setInteractive();
    this.cancelButton = this.add
      .text(this.width / 2 + 95, this.height / 2 - 28, 'No', {
        fontFamily: 'Kemco',
        fontSize: '40px',
      })
      .setTint(0xffffff)
      .setInteractive();
    this.message1 = this.add.text(
      this.width / 2 - 300,
      this.height / 2 - 180,
      'Cancel submitting',
      { fontFamily: 'Kemco', fontSize: '42px' },
    );
    this.message2 = this.add.text(
      this.width / 2 - 200,
      this.height / 2 - 130,
      'your score?',
      { fontFamily: 'Kemco', fontSize: '42px' },
    );

    this.background = this.add
      .sprite(this.width / 2, this.height / 2 - 90, 'highscoreBG')
      .setScale(5.1, 5.2);
    this.eyes = this.add
      .sprite(this.width / 2, this.height / 2 - 120, 'highscoreEyes')
      .setScale(4);
  };

  BackToTitle.createAnimations = function createAnimations() {
    this.eyes.play('blink');
    this.background.anims.playReverse('closeMouth');
  };

  BackToTitle.onSelect = function onSelect() {
    if (this.selection === 'cancel') {
      this.startScene = false;
      this.background.play('closeMouth');
      this.background.on('animationcomplete', () => {
        this.scene.start('HighScore', { score: this.score });
      });
    } else {
      this.startScene = false;
      this.background.play('closeMouth');
      this.background.on('animationcomplete', () => {
        this.scene.start('Title');
      });
    }
  };

  BackToTitle.onChange = function onChange() {
    if (this.selection === 'submit') {
      this.cancelSelectionBox.visible = true;
      this.submitSelectionBox.visible = false;
      this.cancelButton.setTint(0x000000);
      this.submitButton.setTint(0xffffff);
      this.selection = 'cancel';
    } else {
      this.cancelSelectionBox.visible = false;
      this.submitSelectionBox.visible = true;
      this.cancelButton.setTint(0xffffff);
      this.submitButton.setTint(0x000000);
      this.selection = 'submit';
    }
  };

  return null;
}

export default backToTitleSceneMethods;
