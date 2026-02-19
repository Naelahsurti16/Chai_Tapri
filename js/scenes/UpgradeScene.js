// Upgrade Scene - Between-day upgrades
class UpgradeScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UpgradeScene' });
    }
    
    create() {
        // Background
        this.add.rectangle(
            GameConfig.width / 2,
            GameConfig.height / 2,
            GameConfig.width,
            GameConfig.height,
            GameConfig.colors.chaiBrown,
            0.95
        );
        
        // Title
        const title = this.add.text(
            GameConfig.width / 2,
            120,
            `Day ${gameState.day} Complete`,
            {
                fontSize: '28px',
                fill: '#FFFFFF',
                fontFamily: 'Inter, sans-serif',
                fontStyle: '600'
            }
        );
        title.setOrigin(0.5);
        
        const subtitle = this.add.text(
            GameConfig.width / 2,
            165,
            'Upgrade Your Tapri',
            {
                fontSize: '18px',
                fill: '#EDE4D8',
                fontFamily: 'Inter, sans-serif'
            }
        );
        subtitle.setOrigin(0.5);
        
        const buttonY = GameConfig.height / 2;
        const buttonSpacing = 280;
        
        this.createUpgradeButton(
            GameConfig.width / 2 - buttonSpacing / 2,
            buttonY,
            'Faster Boil',
            'Reduces cook time by 10%',
            'fasterBoil'
        );
        
        this.createUpgradeButton(
            GameConfig.width / 2 + buttonSpacing / 2,
            buttonY,
            'Larger Storage',
            '+2 inventory capacity',
            'largerStorage'
        );
        
        this.add.text(
            GameConfig.width / 2,
            GameConfig.height - 80,
            `Coins: ${gameState.coins}  •  Combo: ${gameState.combo.toFixed(1)}x`,
            {
                fontSize: '16px',
                fill: '#EDE4D8',
                fontFamily: 'Inter, sans-serif'
            }
        ).setOrigin(0.5);
    }
    
    createUpgradeButton(x, y, title, description, upgradeType) {
        const w = 220;
        const h = 140;
        const radius = 16;
        
        const g = this.add.graphics();
        g.fillStyle(GameConfig.colors.panelBeige, 0.98);
        g.fillRoundedRect(x - w / 2, y - h / 2, w, h, radius);
        g.lineStyle(2, GameConfig.colors.panelBorder, 0.4);
        g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, radius);
        g.setInteractive(new Phaser.Geom.Rectangle(x - w / 2, y - h / 2, w, h), Phaser.Geom.Rectangle.Contains);
        
        const titleText = this.add.text(x, y - 36, title, {
            fontSize: '20px',
            fill: '#3D2E26',
            fontFamily: 'Inter, sans-serif',
            fontStyle: '600'
        });
        titleText.setOrigin(0.5);
        
        const descText = this.add.text(x, y + 16, description, {
            fontSize: '14px',
            fill: '#6B5344',
            fontFamily: 'Inter, sans-serif',
            align: 'center',
            wordWrap: { width: 200 }
        });
        descText.setOrigin(0.5);
        
        g.on('pointerdown', () => this.selectUpgrade(upgradeType));
        g.on('pointerover', () => g.setScale(1.03));
        g.on('pointerout', () => g.setScale(1));
    }
    
    selectUpgrade(upgradeType) {
        gameState.applyUpgrade(upgradeType);
        gameState.nextDay();
        
        // Return to game - clean restart (avoid leaving paused scenes around)
        this.scene.stop('UpgradeScene');
        this.scene.stop('UIScene');
        this.scene.stop('GameScene');
        this.scene.start('GameScene');
        this.scene.start('UIScene');
    }
}
