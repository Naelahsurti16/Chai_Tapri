// Game Over Scene - Soft overlay, centered card
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    create() {
        const cx = GameConfig.width / 2;
        const cy = GameConfig.height / 2;
        
        this.add.rectangle(cx, cy, GameConfig.width, GameConfig.height, 0x000000, 0.5)
            .setScrollFactor(0);
        
        const cardW = 400;
        const cardH = 320;
        const cardRadius = 16;
        
        const card = this.add.graphics();
        card.fillStyle(0xFFFFFF, 0.98);
        card.fillRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, cardRadius);
        card.lineStyle(1, 0xE0E0E0, 0.6);
        card.strokeRoundedRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, cardRadius);
        card.setScrollFactor(0);
        
        const title = this.add.text(cx, cy - 100, 'Tapri Closed for Today', {
            fontSize: '24px',
            fill: '#3D2E26',
            fontFamily: 'Inter, sans-serif',
            fontStyle: '600'
        });
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        
        const stats = this.add.text(cx, cy - 20,
            `Coins Earned: ${gameState.coins}\nBest Combo: ${gameState.combo.toFixed(1)}x\nDay Reached: ${gameState.day}`,
            {
                fontSize: '18px',
                fill: '#6B5344',
                fontFamily: 'Inter, sans-serif',
                align: 'center',
                lineSpacing: 8
            }
        );
        stats.setOrigin(0.5);
        stats.setScrollFactor(0);
        
        const restartW = 200;
        const restartH = 56;
        const restartY = cy + 80;
        
        const restartG = this.add.graphics();
        restartG.fillStyle(GameConfig.colors.chaiBrown, 0.95);
        restartG.fillRoundedRect(cx - restartW / 2, restartY - restartH / 2, restartW, restartH, 28);
        restartG.setInteractive(new Phaser.Geom.Rectangle(cx - restartW / 2, restartY - restartH / 2, restartW, restartH), Phaser.Geom.Rectangle.Contains);
        restartG.setScrollFactor(0);
        
        const restartText = this.add.text(cx, restartY, 'Restart', {
            fontSize: '20px',
            fill: '#FFFFFF',
            fontFamily: 'Inter, sans-serif',
            fontStyle: '600'
        });
        restartText.setOrigin(0.5);
        restartText.setScrollFactor(0);
        
        restartG.on('pointerdown', () => this.restartGame());
    }
    
    restartGame() {
        gameState.reset();
        this.scene.stop();
        this.scene.start('GameScene');
        this.scene.start('UIScene');
    }
}
