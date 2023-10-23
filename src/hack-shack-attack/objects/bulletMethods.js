// /* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
// /* eslint-disable func-names */
// /* eslint-disable object-shorthand */
// function bulletMethods(Phaser) {
//   return {
//     Extends: Phaser.Physics && Phaser.Physics.Arcade.Sprite,

//     initialize: function Bullet(scene, x, y) {
//       Phaser.Physics.Arcade.Sprite.call(this, scene, x, y, 'bullet');
//       this.scene = scene;
//       this.gameWidth = this.scene.game.config.width;
//       this.gameHeight = this.scene.game.config.height;

//       this.scene.physics.world.enable(this);
//       this.scene.add.existing(this);

//       this.setScale(0.8);
//     },

//     update: function () {
//       if (this.x > this.gameWidth + 100 || this.x < -100) {
//         this.onHit();
//       }
//       if (this.y > this.gameHeight + 100 || this.y < -100) {
//         this.onHit();
//       }
//     },

//     fireBullet: function (x, y, direction) {
//       this.enableBody(true);
//       this.setActive(true);
//       this.setVisible(true);

//       switch (direction) {
//         case 'up':
//           this.setPosition(x + 15, y);
//           this.setVelocityY(-550);
//           break;
//         case 'down':
//           this.setPosition(x - 15, y);
//           this.setVelocityY(550);
//           break;
//         case 'left':
//           this.setPosition(x, y + 12);
//           this.setVelocityX(-550);
//           break;
//         case 'right':
//           this.setPosition(x, y + 12);
//           this.setVelocityX(550);
//           break;
//         default:
//           break;
//       }
//     },

//     // eslint-disable-next-line consistent-return
//     onFireGamepad: function (x, y, gamepad) {
//       if (
//         gamepad.id.indexOf('Xbox Wireless Controller') !== -1 ||
//         gamepad.id.indexOf('Wireless Controller') !== -1
//       ) {
//         if (gamepad.buttons[3].pressed) {
//           this.fireBullet(x, y, 'up');
//         } else if (gamepad.A) {
//           return this.fireBullet(x, y, 'down');
//         }
//         if (gamepad.buttons[2].pressed) {
//           this.fireBullet(x, y, 'left');
//         } else if (gamepad.B) {
//           return this.fireBullet(x, y, 'right');
//         }
//       } else if (gamepad.id.indexOf('Pro Controller') !== -1) {
//         if (gamepad.buttons[3].pressed) {
//           this.fireBullet(x, y, 'up');
//         } else if (gamepad.buttons[0].pressed) {
//           return this.fireBullet(x, y, 'down');
//         }
//         if (gamepad.buttons[2].pressed) {
//           this.fireBullet(x, y, 'left');
//         } else if (gamepad.buttons[1].pressed) {
//           return this.fireBullet(x, y, 'right');
//         }
//       } else {
//         if (gamepad.buttons[4].pressed) {
//           this.fireBullet(x, y, 'up');
//         } else if (gamepad.A) {
//           return this.fireBullet(x, y, 'down');
//         }
//         if (gamepad.buttons[3].pressed) {
//           this.fireBullet(x, y, 'left');
//         } else if (gamepad.B) {
//           this.fireBullet(x, y, 'right');
//         }
//       }
//     },

//     onFireKeyboard: function (x, y, fireKeys) {
//       if (fireKeys.up.isDown) {
//         this.fireBullet(x, y, 'up');
//       } else if (fireKeys.down.isDown) {
//         this.fireBullet(x, y, 'down');
//       }
//       if (fireKeys.left.isDown) {
//         this.fireBullet(x, y, 'left');
//       } else if (fireKeys.right.isDown) {
//         this.fireBullet(x, y, 'right');
//       }
//     },

//     onHit: function () {
//       this.explosion = this.scene.add
//         .sprite(this.x, this.y, 'explosion')
//         .setScale(0.6)
//         .play('explode');
//       this.disableBody();
//       this.setActive(false);
//       this.setVisible(false);
//       this.setVelocity(0);
//     },
//   };
// }

// export default bulletMethods;
