/* eslint-disable no-param-reassign */
function boostSceneMethods(BootScene) {
  BootScene.create = function create() {
    this.scene.start('Preloader');
  };
  return null;
}

export default boostSceneMethods;
