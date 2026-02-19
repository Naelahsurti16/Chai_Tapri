// Boot Scene - Loads assets
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }
    
    preload() {
        // Create loading text
        const loadingText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            'Loading...',
            {
                fontSize: '32px',
                fill: '#FFFFFF',
                fontFamily: 'Arial'
            }
        );
        loadingText.setOrigin(0.5);
        
        // For MVP, we'll use simple shapes instead of loading images
        // In production, load sprites here:
        // this.load.image('customer', 'assets/customer.png');
        // this.load.image('chai', 'assets/chai.png');
        // etc.
    }
    
    create() {
        // Start GameScene
        this.scene.start('GameScene');
        this.scene.start('UIScene');
    }
}
