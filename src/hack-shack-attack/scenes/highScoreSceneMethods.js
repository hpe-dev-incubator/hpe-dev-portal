/* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
/* eslint-disable no-param-reassign */
function highScoreSceneMethods(HighScoreScene, Phaser) {
  HighScoreScene.init = function init(data = 300) {
    this.gamepad = undefined;
    this.animationTimer = undefined;
    this.buttonPressed = false;
    this.stickPressed = false;
    this.startScene = false;
    this.loading = false;

    this.chars = [
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
      ['U', 'V', 'W', 'X', 'Y', 'Z', '.', '@', 'DEL', 'SUB'],
    ];
    this.score = data.score;
    this.text = undefined;
    this.block = undefined;
    this.initialsCursor = undefined;
    this.nameCursor = undefined;
    this.cursor = new Phaser.Math.Vector2();

    this.height = this.game.config.height;
    this.width = this.game.config.width;

    this.initials = '';
    this.name = '';
    this.initLimit = 3;
    this.nameLimit = 45;

    this.initialText = undefined;
    this.nameText = undefined;

    this.submitSuccess = false;
  };

  HighScoreScene.create = function create() {
    this.countdown();
    this.createHighScoreMenu();
    this.createAnimations();
    this.keyboardInputs();
    this.addEventListeners();
  };

  HighScoreScene.update = function update() {
    if (this.input.gamepad.total === 0) {
      return;
    }
    this.gamepad = this.input.gamepad.getPad(0);
    if (this.startScene) {
      this.gamepadInputs();
    }
  };

  HighScoreScene.countdown = function countdown() {
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

  HighScoreScene.gamepadInputs = function gamepadInputs() {
    if (this.loading === false) {
      // A and B button
      if (this.gamepad.id.indexOf('Pro Controller') !== -1) {
        if (this.gamepad.buttons[1].pressed && this.buttonPressed === false) {
          this.buttonPressed = true;
          this.enter();
        }
        if (this.gamepad.buttons[0].pressed && this.buttonPressed === false) {
          this.buttonPressed = true;
          this.backspace();
        }
        if (
          !this.gamepad.buttons[1].pressed &&
          !this.gamepad.buttons[0].pressed
        ) {
          this.buttonPressed = false;
        }
      } else {
        if (this.gamepad.A && this.buttonPressed === false) {
          this.buttonPressed = true;
          this.enter();
        }
        if (this.gamepad.B && this.buttonPressed === false) {
          this.buttonPressed = true;
          this.backspace();
        }
        if (!this.gamepad.A && !this.gamepad.B) {
          this.buttonPressed = false;
        }
      }
      // joystick
      if (this.gamepad.leftStick.y <= -0.6 && this.stickPressed === false) {
        this.stickPressed = true;
        this.moveUp();
      } else if (
        this.gamepad.leftStick.y >= 0.6 &&
        this.stickPressed === false
      ) {
        this.stickPressed = true;
        this.moveDown();
      }
      if (this.gamepad.leftStick.x <= -0.6 && this.stickPressed === false) {
        this.stickPressed = true;
        this.moveLeft();
      } else if (
        this.gamepad.leftStick.x >= 0.6 &&
        this.stickPressed === false
      ) {
        this.stickPressed = true;
        this.moveRight();
      }
      if (this.gamepad.leftStick.y === 0 && this.gamepad.leftStick.x === 0) {
        this.stickPressed = false;
      }
    }
  };

  HighScoreScene.resetScene = function resetScene() {
    this.submitSuccess = '';
    this.initials = '';
    this.name = '';
    this.startScene = false;
    this.loading = false;
    this.events.removeListener('updateInitials');
    this.events.removeListener('updateName');
    this.events.removeListener('submitUserData');
  };

  HighScoreScene.createHighScoreMenu = function createHighScoreMenu() {
    const inputText =
      'A B C D E F G H I J\n\nK L M N O P Q R S T\n\nU V W X Y Z . @';
    this.text = this.add
      .text(this.width / 2, this.height / 2 - 140, inputText, {
        fontFamily: 'Kemco',
        fontSize: '42px',
      })
      .setOrigin(0.5, 0.5)
      .setInteractive();

    this.add.text(this.text.x + 205, this.text.y + 74, 'DEL', {
      fontFamily: 'Kemco',
      fontSize: '20px',
    });
    this.add.text(this.text.x + 270, this.text.y + 74, 'SUB', {
      fontFamily: 'Kemco',
      fontSize: '20px',
    });

    this.block = this.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRect(this.text.x / 2 + 25, this.text.y / 2 + 68, 38, 6);

    this.add
      .text(300, 360, 'Initials', {
        fontFamily: 'Kemco',
        fontSize: '20px',
      })
      .setTint(0xff1fdc83);
    this.add
      .text(300, 420, 'Name', {
        fontFamily: 'Kemco',
        fontSize: '20px',
      })
      .setTint(0xff1fdc83);

    this.initialText = this.add
      .text(315, 385, '', { fontFamily: 'Kemco', fontSize: '22px' })
      .setTint(0xffffff);
    this.nameText = this.add
      .text(315, 445, '', { fontFamily: 'Kemco', fontSize: '22px' })
      .setTint(0xffffff);

    this.initialsCursor = this.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRect(this.initialText.x, this.initialText.y + 20, 16, 3);

    this.nameCursor = this.add
      .graphics()
      .fillStyle(0xffffff, 1)
      .fillRect(this.nameText.x, this.nameText.y + 20, 16, 3);
    this.nameCursor.visible = false;

    this.background = this.add
      .sprite(this.width / 2, this.height / 2 - 90, 'highscoreBG')
      .setScale(5.1, 5.2);
    this.eyes = this.add
      .sprite(this.width / 2, this.height / 2 - 120, 'highscoreEyes')
      .setScale(4);
  };

  HighScoreScene.createAnimations = function createAnimations() {
    this.tweens.add({
      targets: this.block,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      duration: 350,
    });
    this.tweens.add({
      targets: this.initialsCursor,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      duration: 350,
    });
    this.tweens.add({
      targets: this.nameCursor,
      alpha: 0.2,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      duration: 350,
    });
    this.eyes.play('blink');
    this.background.anims.playReverse('closeMouth');
  };

  HighScoreScene.addEventListeners = function addEventListeners() {
    this.events.on('updateInitials', this.updateInitials, this);
    this.events.on('updateName', this.updateName, this);
    this.events.on('submitUserData', this.submitUserData, this);
  };

  HighScoreScene.keyboardInputs = function keyboardInputs() {
    this.leftInput = this.input.keyboard.on('keyup_LEFT', this.moveLeft, this);
    this.rightInput = this.input.keyboard.on(
      'keyup_RIGHT',
      this.moveRight,
      this,
    );
    this.upInput = this.input.keyboard.on('keyup_UP', this.moveUp, this);
    this.downInput = this.input.keyboard.on('keyup_DOWN', this.moveDown, this);
    this.deleteInput = this.input.keyboard.on(
      'keyup_BACKSPACE',
      this.backspace,
      this,
    );
    this.enterInput = this.input.keyboard.on('keyup_ENTER', this.enter, this);
  };

  HighScoreScene.moveLeft = function moveLeft() {
    if (this.cursor.x > 0) {
      this.cursor.x -= 1;
      this.block.x -= 65.5;
    } else {
      this.cursor.x = 9;
      this.block.x += 65.5 * 9;
    }
  };

  HighScoreScene.moveRight = function moveRight() {
    if (this.cursor.x < 9) {
      this.cursor.x += 1;
      this.block.x += 65.5;
    } else {
      this.cursor.x = 0;
      this.block.x -= 65.5 * 9;
    }
  };

  HighScoreScene.moveUp = function moveUp() {
    if (this.cursor.y > 0) {
      this.cursor.y -= 1;
      this.block.y -= 76;
    } else {
      this.cursor.y = 2;
      this.block.y += 76 * 2;
    }
  };

  HighScoreScene.moveDown = function moveDown() {
    if (this.cursor.y < 2) {
      this.cursor.y += 1;
      this.block.y += 76;
    } else {
      this.cursor.y = 0;
      this.block.y -= 76 * 2;
    }
  };

  HighScoreScene.updateInitials = function updateInitials(initials) {
    this.initialText.setText(initials);
  };

  HighScoreScene.updateName = function updateName(name) {
    this.nameText.setText(name);
  };

  HighScoreScene.submitUserData = function submitUserData(
    initials,
    name,
    score,
  ) {
    this.loading = true;
    const data = { initials, name, score };
    return fetch(`${process.env.GATSBY_NETLIFY_ENDPOINT}/postLeaderboard`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status === 200) {
          this.resetScene();
          this.background.play('closeMouth');
          this.background.on('animationcomplete', () => {
            this.scene.start('ThankYou');
          });
        }
        if (res.status === 403) {
          this.resetScene();
          this.background.play('closeMouth');
          this.background.on('animationcomplete', () => {
            this.scene.start('ProfanityError', { score: this.score });
          });
        }
        if (res.status === 404) {
          this.resetScene();
          this.background.play('closeMouth');
          this.background.on('animationcomplete', () => {
            this.scene.start('Error', { score: this.score });
          });
        }
        if (res.status === 400) {
          this.resetScene();
          this.background.play('closeMouth');
          this.background.on('animationcomplete', () => {
            this.scene.start('Error', { score: this.score });
          });
        }
      })
      .catch(() => {
        this.resetScene();
        this.background.play('closeMouth');
        this.background.on('animationcomplete', () => {
          this.scene.start('Error', { score: this.score });
        });
      });
  };

  HighScoreScene.backspace = function backspace() {
    const initialLength = this.initials.length;
    const nameLength = this.name.length;

    if (initialLength > 0 && nameLength === 0 && initialLength !== 0) {
      this.initials = this.initials.substr(0, initialLength - 1);
      this.nameCursor.visible = false;
      this.initialsCursor.visible = true;
      this.events.emit('updateInitials', this.initials);
      this.initialsCursor.x -= 17.2;
    } else if (initialLength > 0 && nameLength > 0) {
      this.name = this.name.substr(0, nameLength - 1);
      this.events.emit('updateName', this.name);
      this.nameCursor.x -= 17.2;
    } else if (initialLength === 0) {
      this.resetScene();
      this.background.play('closeMouth');
      this.background.on('animationcomplete', () => {
        this.scene.start('BackToTitle', { score: this.score });
      });
    }
  };

  HighScoreScene.enter = function enter() {
    const { x, y } = this.cursor;
    const initialLength = this.initials.length;
    const nameLength = this.name.length;

    if (x === 9 && y === 2 && initialLength > 0 && nameLength > 0) {
      this.events.emit('submitUserData', this.initials, this.name, this.score);
    } else if (
      x === 8 &&
      y === 2 &&
      initialLength > 0 &&
      nameLength === 0 &&
      initialLength !== 0
    ) {
      this.nameCursor.visible = false;
      this.initialsCursor.visible = true;
      this.initialsCursor.x -= 17.2;
      this.initials = this.initials.substr(0, initialLength - 1);
      this.events.emit('updateInitials', this.initials);
    } else if (x === 8 && y === 2 && initialLength > 0 && nameLength > 0) {
      this.nameCursor.x -= 17.2;
      this.name = this.name.substr(0, nameLength - 1);
      this.events.emit('updateName', this.name);
    } else if (initialLength < this.initLimit) {
      this.nameCursor.visible = false;
      this.initialsCursor.visible = true;
      if (this.chars[y][x] !== 'DEL' && this.chars[y][x] !== 'SUB') {
        this.initials = this.initials.concat(this.chars[y][x]);
        this.initialsCursor.x += 17.2;
        this.events.emit('updateInitials', this.initials);
      }
    } else if (
      initialLength === this.initLimit &&
      nameLength < this.nameLimit
    ) {
      this.nameCursor.visible = true;
      this.initialsCursor.visible = false;
      if (this.chars[y][x] !== 'DEL' && this.chars[y][x] !== 'SUB') {
        this.name = this.name.concat(this.chars[y][x]);
        this.nameCursor.x += 17.2;
        this.events.emit('updateName', this.name);
      }
    }
  };
  return null;
}

export default highScoreSceneMethods;
