// /* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
// /* eslint-disable func-names */
// /* eslint-disable object-shorthand */
// function itBugMethods(Phaser) {
//   return {
//     Extends: Phaser.Physics && Phaser.Physics.Arcade.Sprite,

//     initialize: function ItBug(scene, x, y) {
//       Phaser.Physics.Arcade.Sprite.call(this, scene, x, y, 'itBug');
//       this.scene = scene;
//       this.hp = 0;
//       this.points = 1;
//       this.scene.physics.world.enable(this);
//       this.scene.add.existing(this);
//     },

//     spawn: function (x, y) {
//       this.hp = 2;
//       this.setPosition(x, y);
//       this.play('bounce');
//     },

//     onHit: function (damage) {
//       this.hp -= damage;
//       if (this.hp <= 0) {
//         this.death = this.scene.add
//           .sprite(this.x, this.y, 'monsterDeath')
//           .setScale(1.2)
//           .play('death');
//         this.setActive(false);
//         this.setVisible(false);
//         this.disableBody();
//         this.scene.events.emit('updateScore', this.points);
//       }
//     },

//     kill: function () {
//       this.death = this.scene.add
//         .sprite(this.x, this.y, 'monsterDeath')
//         .setScale(1.2)
//         .play('death');
//       this.setActive(false);
//       this.setVisible(false);
//       this.disableBody();
//     },
//   };
// }

// export default itBugMethods;
