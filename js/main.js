// Main entry point
const config = {
    type: Phaser.AUTO,
    width: GameConfig.width,
    height: GameConfig.height,
    parent: 'game-container',
    backgroundColor: GameConfig.colors.chaiBrown,
    scale: GameConfig.scale,
    scene: [
        BootScene,
        GameScene,
        UIScene,
        UpgradeScene,
        GameOverScene
    ],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
