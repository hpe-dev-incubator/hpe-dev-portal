// /* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
// /* eslint-disable func-names */
// /* eslint-disable object-shorthand */
// function itMonsterMethods(Phaser) {
//   return {
//     Extends: Phaser.Physics && Phaser.Physics.Arcade.Sprite,

//     initialize: function ItMonster(scene, x, y) {
//       Phaser.Physics.Arcade.Sprite.call(this, scene, x, y, 'itMonster');
//       this.scene = scene;
//       this.hp = 0;
//       this.points = 3;
//       this.scene.physics.world.enable(this);
//       this.scene.add.existing(this);
//     },

//     spawn: function (x, y) {
//       this.hp = 3;
//       this.setPosition(x, y);
//       this.play('walk');
//     },

//     onHit: function (damage) {
//       this.hp -= damage;
//       if (this.hp <= 0) {
//         this.kill();
//       }
//     },

//     kill: function () {
//       this.poof = this.scene.add
//         .sprite(this.x, this.y, 'itMonsterPoof')
//         .setScale(1.2)
//         .play('poof');
//       this.setActive(false);
//       this.setVisible(false);
//       this.disableBody();
//       this.scene.events.emit('updateScore', this.points);
//     },
//   };
// }

// export default itMonsterMethods;
