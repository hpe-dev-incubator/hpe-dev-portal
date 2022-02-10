/* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
/* eslint-disable no-param-reassign */
function leaderboardSceneMethods(LeaderBoardScene, Phaser) {
  LeaderBoardScene.init = function init(data) {
    this.gamepad = undefined;
    this.loading = false;
    this.hiScores = data.data;
    this.buttonPressed = false;
    this.stickPressed = false;
    this.startScene = false;
    this.height = this.game.config.height;
    this.width = this.game.config.width;
  };

  LeaderBoardScene.create = function create() {
    this.countdown();
    this.titleText = this.add
      .text(
        this.width / 2 - 250,
        this.height / 2 - 290,
        'Hack Shack Hall of Fame',
        {
          fontFamily: 'Kemco',
          fontSize: '28px',
        },
      )
      .setTint(0xffffff);
    this.acceptText = this.add
      .text(
        this.width / 2 - 200,
        this.height / 2 + 100,
        'Press A or Enter to continue',
        { fontFamily: 'Kemco', fontSize: '18px' },
      )
      .setTint(0xffffff);

    this.acceptTextFade = this.tweens.add({
      targets: this.acceptText,
      alpha: 0,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      duration: 1200,
    });
    this.createLeaderboard();
    this.keyboardInputs();
  };

  LeaderBoardScene.update = function update() {
    if (this.input.gamepad.total > 0) {
      this.gamepad = this.input.gamepad.getPad(0);
    }
    if (this.startScene) {
      if (this.gamepad) {
        this.gamepadInputs();
      }
    }
  };

  LeaderBoardScene.keyboardInputs = function keyboardInputs() {
    this.enterInput = this.input.keyboard.on(
      'keyup_ENTER',
      this.onSelect,
      this,
    );
    this.enterInput = this.input.keyboard.on('keyup_A', this.onSelect, this);
  };

  LeaderBoardScene.countdown = function countdown() {
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

  LeaderBoardScene.gamepadInputs = function gamepadInputs() {
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
  };

  LeaderBoardScene.onSelect = function onSelect() {
    this.startScene = false;
    this.scene.start('Title');
  };

  LeaderBoardScene.createLeaderboard = function createLeaderboard() {
    this.first = this.add
      .text(
        this.width / 2 - 300,
        this.height / 2 - 210,
        `1st ${this.hiScores[0].initials} ${this.hiScores[0].score}`,
        {
          fontFamily: 'Kemco',
          fontSize: '28px',
        },
      )
      .setTint(0xffeb59);
    this.second = this.add
      .text(
        this.width / 2 - 300,
        this.height / 2 - 160,
        `2nd ${this.hiScores[1].initials} ${this.hiScores[1].score}`,
        {
          fontFamily: 'Kemco',
          fontSize: '28px',
        },
      )
      .setTint(0xffbc44);
    this.third = this.add
      .text(
        this.width / 2 - 300,
        this.height / 2 - 110,
        `3rd ${this.hiScores[2].initials} ${this.hiScores[2].score}`,
        {
          fontFamily: 'Kemco',
          fontSize: '28px',
        },
      )
      .setTint(0xff8300);
    this.fourth = this.add
      .text(
        this.width / 2 - 300,
        this.height / 2 - 60,
        `4th ${this.hiScores[3].initials} ${this.hiScores[3].score}`,
        {
          fontFamily: 'Kemco',
          fontSize: '28px',
        },
      )
      .setTint(0xfc6161);
    this.fifth = this.add
      .text(
        this.width / 2 - 300,
        this.height / 2 - 10,
        `5th ${this.hiScores[4].initials} ${this.hiScores[4].score}`,
        {
          fontFamily: 'Kemco',
          fontSize: '28px',
        },
      )
      .setTint(0xf740ff);
    this.sixth = this.add
      .text(
        this.width / 2 + 50,
        this.height / 2 - 210,
        `6th ${this.hiScores[5].initials} ${this.hiScores[5].score}`,
        {
          fontFamily: 'Kemco',
          fontSize: '28px',
        },
      )
      .setTint(0x7630ea);
    this.seventh = this.add
      .text(
        this.width / 2 + 50,
        this.height / 2 - 160,
        `7th ${this.hiScores[6].initials} ${this.hiScores[6].score}`,
        {
          fontFamily: 'Kemco',
          fontSize: '28px',
        },
      )
      .setTint(0x00e8cf);
    this.eighth = this.add
      .text(
        this.width / 2 + 50,
        this.height / 2 - 110,
        `8th ${this.hiScores[7].initials} ${this.hiScores[7].score}`,
        {
          fontFamily: 'Kemco',
          fontSize: '28px',
        },
      )
      .setTint(0x17eba0);
    this.ninth = this.add
      .text(
        this.width / 2 + 50,
        this.height / 2 - 60,
        `9th ${this.hiScores[8].initials} ${this.hiScores[8].score}`,
        {
          fontFamily: 'Kemco',
          fontSize: '28px',
        },
      )
      .setTint(0x01a982);
    this.tenth = this.add
      .text(
        this.width / 2 + 50,
        this.height / 2 - 10,
        `10th ${this.hiScores[9].initials} ${this.hiScores[9].score}`,
        {
          fontFamily: 'Kemco',
          fontSize: '28px',
        },
      )
      .setTint(0x00739d);
  };

  LeaderBoardScene.getRandomVertexColors = function getRandomVertexColors() {
    const { RandomRGB } = Phaser.Display.Color;
    return {
      topLeft: RandomRGB(),
      topRight: RandomRGB(),
      bottomLeft: RandomRGB(),
      bottomRight: RandomRGB(),
    };
  };

  LeaderBoardScene.centerObject = function centerObject(
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

export default leaderboardSceneMethods;
