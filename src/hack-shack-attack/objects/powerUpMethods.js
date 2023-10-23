// /* (C) Copyright 2019 Hewlett Packard Enterprise Development LP. */
// /* eslint-disable func-names */
// /* eslint-disable object-shorthand */
// function powerUpMethods(Phaser) {
//   return {
//     Extends: Phaser.Physics && Phaser.Physics.Arcade.Sprite,

//     initialize: function PowerUp(scene, x, y) {
//       Phaser.Physics.Arcade.Sprite.call(this, scene, x, y, 'devPowerUp');
//       this.scene = scene;

//       this.scene.physics.world.enable(this);
//       this.scene.add.existing(this);
//     },
//     spawn: function (x, y) {
//       this.setPosition(x, y);
//       this.play('powerUpFloat');
//     },

//     onHit: function () {
//       this.setActive(false);
//       this.setVisible(false);
//       this.disableBody();

//       this.scene.events.emit('gotPowerUp');
//     },
//   };
// }

// export default powerUpMethods;
