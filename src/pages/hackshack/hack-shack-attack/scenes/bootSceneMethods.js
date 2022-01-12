/* eslint-disable no-param-reassign */
function boostSceneMethods(BootScene) {
  BootScene.create = function create() {
    this.scene.start('Preloader');
  };
}

export default boostSceneMethods;
