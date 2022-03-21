/* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
/* eslint-disable no-param-reassign */
function gameOverSceneMethods(GameOver) {
  GameOver.init = function init(data) {
    this.gamepad = undefined;
    this.buttonPressed = false;
    this.stickPressed = false;
    this.selection = 'submit';
    this.score = data.score || 0;
    this.startScene = false;

    this.height = this.game.config.height;
    this.width = this.game.config.width;
  };

  GameOver.create = function create() {
    this.countdown();
    this.keyboardInputs();

    this.gameOverText = this.add
      .text(this.width / 2, this.height / 2 - 250, 'GAME OVER', {
        fontFamily: 'Kemco',
        fontSize: '100px',
      })
      .setTint(0xffffff)
      .setOrigin(0.5, 0.5);
    this.scoreText = this.add
      .text(
        this.width / 2,
        this.height / 2 - 180,
        `You got ${this.score}pts!`,
        {
          fontFamily: 'Kemco',
          fontSize: '50px',
        },
      )
      .setTint(0xffffff)
      .setOrigin(0.5, 0.5);
    // submit select box
    this.submitSelectionBox = this.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(this.width / 2 - 260, this.height / 2 - 120, 220, 70);
    // cancel select box
    this.cancelSelectionBox = this.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRoundedRect(this.width / 2 + 40, this.height / 2 - 120, 220, 70);
    this.cancelSelectionBox.visible = false;
    // submit and cancel buttons
    this.submitButton = this.add
      .text(this.width / 3 - 15, this.height / 2 - 108, 'Submit', {
        fontFamily: 'Kemco',
        fontSize: '40px',
      })
      .setTint(0x000000)
      .setInteractive();
    this.cancelButton = this.add
      .text(this.width / 2 + 60, this.height / 2 - 108, 'Cancel', {
        fontFamily: 'Kemco',
        fontSize: '40px',
      })
      .setTint(0xffffff)
      .setInteractive();

    // sprites
    this.devGameOver = this.add
      .sprite(this.width / 2, this.height - 290, 'devGameOver')
      .setScale(2);
    this.dizzy = this.add
      .sprite(this.width / 2 + 10, this.height - 320, 'dizzyAnim')
      .setScale(3)
      .play('dizzy');
  };

  GameOver.update = function update() {
    if (this.input.gamepad.total > 0) {
      this.gamepad = this.input.gamepad.getPad(0);
    }
    if (this.startScene) {
      if (this.gamepad) {
        this.gamepadInputs();
      }
    }
  };

  GameOver.keyboardInputs = function keyboardInputs() {
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

  GameOver.countdown = function countdown() {
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

  GameOver.gamepadInputs = function gamepadInputs() {
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
      this.gamepad.leftStick.x <= -0.6 &&
      this.stickPressed === false &&
      this.selection !== 'submit'
    ) {
      this.stickPressed = true;
      this.onChange();
    } else if (
      this.gamepad.leftStick.x >= 0.6 &&
      this.stickPressed === false &&
      this.selection !== 'cancel'
    ) {
      this.stickPressed = true;
      this.onChange();
    }
    if (this.gamepad.leftStick.x === 0) {
      this.stickPressed = false;
    }
  };

  GameOver.onChange = function onChange() {
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

  GameOver.onSelect = function onSelect() {
    if (this.selection === 'submit') {
      this.startScene = false;
      this.scene.start('HighScore', { score: this.score });
    } else {
      this.startScene = false;
      this.scene.start('ThankYou');
    }
  };

  GameOver.centerObject = function centerObject(gameObject, offset = 0) {
    const { width, height } = this.cameras.main;
    gameObject.x = width / 2;
    gameObject.y = height / 2 - offset * 100;
  };
  return null;
}

export default gameOverSceneMethods;
