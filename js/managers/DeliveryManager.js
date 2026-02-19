// Delivery Manager - Restock button, pill-shaped, timer overlay inside
class DeliveryManager {
    constructor(scene) {
        this.scene = scene;
        this.button = null;
        this.isDelivering = false;
        this.updateTimer = null;
    }
    
    create() {
        const config = UIConfig.deliveryButton;
        const w = config.width;
        const h = config.height;
        const r = config.radius;
        
        const g = this.scene.add.graphics();
        g.fillStyle(GameConfig.colors.warmYellow, 0.95);
        g.fillRoundedRect(config.x - w / 2, config.y - h / 2, w, h, r);
        g.lineStyle(2, GameConfig.colors.panelBorder, 0.4);
        g.strokeRoundedRect(config.x - w / 2, config.y - h / 2, w, h, r);
        g.setInteractive(new Phaser.Geom.Rectangle(config.x - w / 2, config.y - h / 2, w, h), Phaser.Geom.Rectangle.Contains);
        g.setScrollFactor(0);
        this.button = g;
        
        this.buttonText = this.scene.add.text(config.x, config.y, 'Restock', {
            fontSize: '20px',
            fill: '#3D2E26',
            fontFamily: 'Inter, sans-serif',
            fontStyle: '600'
        });
        this.buttonText.setOrigin(0.5);
        this.buttonText.setScrollFactor(0);
        
        this.timerOverlay = this.scene.add.graphics();
        this.timerOverlay.setScrollFactor(0);
        this.timerOverlay.setVisible(false);

        this.timerRing = this.scene.add.graphics();
        this.timerRing.setScrollFactor(0);
        this.timerRing.setVisible(false);
        
        g.on('pointerdown', () => {
            if (!this.isDelivering) this.startDelivery();
        });
    }
    
    startDelivery() {
        if (this.isDelivering) return;
        
        this.isDelivering = true;
        this.button.setAlpha(0.6);
        this.button.disableInteractive();
        
        const config = UIConfig.deliveryButton;
        const duration = GameConfig.delivery.duration;
        const startTime = Date.now();
        
        this.timerOverlay.setVisible(true);
        this.timerRing.setVisible(true);
        
        this.updateTimer = this.scene.time.addEvent({
            delay: 50,
            callback: () => {
                const elapsed = Date.now() - startTime;
                const pct = Math.min(elapsed / duration, 1);
                
                this.timerOverlay.clear();
                // Subtle dim overlay (keeps pill readable)
                this.timerOverlay.fillStyle(0x000000, 0.12);
                this.timerOverlay.fillRoundedRect(
                    config.x - config.width / 2, config.y - config.height / 2,
                    config.width, config.height, config.radius
                );

                // Circular countdown ring inside the button
                this.timerRing.clear();
                const ringR = Math.min(config.height, config.width) * 0.32;
                const startAng = -Math.PI / 2;
                const endAng = startAng + (Math.PI * 2 * pct);
                this.timerRing.lineStyle(5, GameConfig.colors.chaiBrown, 0.55);
                this.timerRing.beginPath();
                this.timerRing.arc(config.x, config.y, ringR, startAng, startAng + Math.PI * 2, false);
                this.timerRing.strokePath();

                this.timerRing.lineStyle(5, GameConfig.colors.perfect, 0.95);
                this.timerRing.beginPath();
                this.timerRing.arc(config.x, config.y, ringR, startAng, endAng, false);
                this.timerRing.strokePath();
                
                const secLeft = Math.ceil((duration - elapsed) / 1000);
                this.buttonText.setText(secLeft > 0 ? secLeft : 'Restock');
                
                if (pct >= 1) this.completeDelivery();
            },
            repeat: Math.ceil(duration / 50) + 1
        });
    }
    
    completeDelivery() {
        if (this.scene.inventoryManager) {
            this.scene.inventoryManager.refill();
        }
        
        this.isDelivering = false;
        this.button.setAlpha(1);
        const config = UIConfig.deliveryButton;
        this.button.setInteractive(new Phaser.Geom.Rectangle(config.x - config.width / 2, config.y - config.height / 2, config.width, config.height), Phaser.Geom.Rectangle.Contains);
        this.buttonText.setText('Restock');
        this.timerOverlay.setVisible(false);
        this.timerOverlay.clear();
        this.timerRing.setVisible(false);
        this.timerRing.clear();
        
        if (this.updateTimer) this.updateTimer.remove();
    }
}
