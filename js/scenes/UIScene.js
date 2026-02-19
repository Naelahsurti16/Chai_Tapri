// UI Scene - Overlay UI elements
class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene' });
    }
    
    create() {
        this.prevCombo = 0;
        this.createTopBar();
        
        this.updateTimer = this.time.addEvent({
            delay: 100,
            callback: this.updateUI,
            callbackScope: this,
            loop: true
        });
    }
    
    createTopBar() {
        const config = UIConfig.topBar;
        const barHeight = config.height;
        const padding = config.padding;
        const cx = GameConfig.width / 2;
        
        // Background bar
        this.topBar = this.add.rectangle(
            cx, config.y + barHeight / 2,
            GameConfig.width, barHeight,
            GameConfig.colors.chaiBrown, 0.95
        );
        this.topBar.setScrollFactor(0);
        this.topBar.setDepth(100);
        
        // Bottom border - darker
        this.topBarBorder = this.add.rectangle(
            cx, config.y + barHeight,
            GameConfig.width, config.borderBottom || 2,
            0x6B5344, 1
        );
        this.topBarBorder.setOrigin(0.5, 0);
        this.topBarBorder.setScrollFactor(0);
        this.topBarBorder.setDepth(100);
        
        // Coins (left) - smaller font
        this.coinsText = this.add.text(
            padding,
            config.y + barHeight / 2,
            'Coins: 0',
            {
                fontSize: '18px',
                fill: '#EDE4D8',
                fontFamily: 'Inter, sans-serif',
                fontStyle: '500'
            }
        );
        this.coinsText.setOrigin(0, 0.5);
        this.coinsText.setScrollFactor(0);
        this.coinsText.setDepth(101);
        
        // Combo (center) - bigger, gold, emphasis
        this.comboText = this.add.text(
            cx,
            config.y + barHeight / 2,
            'COMBO x0.0',
            {
                fontSize: '28px',
                fill: '#FFB84C',
                fontFamily: 'Inter, sans-serif',
                fontStyle: '600'
            }
        );
        this.comboText.setOrigin(0.5);
        this.comboText.setScrollFactor(0);
        this.comboText.setDepth(101);
        
        // Reputation (right) - smaller
        this.reputationText = this.add.text(
            GameConfig.width - padding,
            config.y + barHeight / 2,
            'Rep: 100',
            {
                fontSize: '18px',
                fill: '#EDE4D8',
                fontFamily: 'Inter, sans-serif',
                fontStyle: '500'
            }
        );
        this.reputationText.setOrigin(1, 0.5);
        this.reputationText.setScrollFactor(0);
        this.reputationText.setDepth(101);
    }
    
    updateUI() {
        this.coinsText.setText(`Coins: ${gameState.coins}`);
        
        const comboValue = gameState.combo.toFixed(1);
        this.comboText.setText(`COMBO x${comboValue}`);
        
        // Combo scale animation on increase
        if (gameState.combo > this.prevCombo && gameState.combo > 0) {
            this.tweens.add({
                targets: this.comboText,
                scale: 1.15,
                duration: 100,
                yoyo: true,
                ease: 'Power2'
            });
        }
        this.prevCombo = gameState.combo;
        
        this.reputationText.setText(`Rep: ${gameState.reputation}`);
        
        if (gameState.reputation < 50) {
            this.reputationText.setColor('#C45C4A');
        } else if (gameState.reputation < 75) {
            this.reputationText.setColor('#FFB84C');
        } else {
            this.reputationText.setColor('#EDE4D8');
        }
    }
}
