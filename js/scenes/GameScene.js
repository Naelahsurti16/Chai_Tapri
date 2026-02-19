// Game Scene - Main game logic
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    create() {
        // Create background first
        this.createBackground();
        
        // Order panel - rounded container for customer queue
        this.createOrderPanel();
        
        // Initialize managers
        this.customerManager = new CustomerManager(this);
        this.cookingManager = new CookingManager(this);
        this.inventoryManager = new InventoryManager(this);
        this.deliveryManager = new DeliveryManager(this);
        
        this.inventoryManager.create();
        this.deliveryManager.create();
        this.createCookingButtons();
        this.createDayTimer();
        
        gameState.startDay();
        this.customerManager.start();
    }
    
    createOrderPanel() {
        const p = UIConfig.orderPanel;
        const g = this.add.graphics();
        g.fillStyle(GameConfig.colors.panelBeige, 0.95);
        g.fillRoundedRect(p.x - p.width / 2, p.y - p.height / 2, p.width, p.height, p.radius);
        g.lineStyle(2, GameConfig.colors.panelBorder, 0.5);
        g.strokeRoundedRect(p.x - p.width / 2, p.y - p.height / 2, p.width, p.height, p.radius);
        g.setScrollFactor(0);
        
        const title = this.add.text(p.x, p.y - p.height / 2 + 24, 'Current Orders', {
            fontSize: '18px',
            fill: '#3D2E26',
            fontFamily: 'Inter, sans-serif',
            fontStyle: '600'
        }).setOrigin(0.5);
        title.setScrollFactor(0);
    }
    
    createBackground() {
        if (this.background) this.background.destroy();
        this.background = this.add.rectangle(
            GameConfig.width / 2, GameConfig.height / 2,
            GameConfig.width, GameConfig.height,
            GameConfig.colors.bgCream || GameConfig.colors.cream
        );
        this.background.setDepth(-100);
    }
    
    createCookingButtons() {
        const config = UIConfig.cookingArea;
        const size = config.buttonSize;
        const radius = config.radius || 16;
        const buttons = [
            { type: 'chai', label: 'Chai', x: config.x - config.buttonSpacing },
            { type: 'bunMaska', label: 'Bun Maska', x: config.x },
            { type: 'vadaPav', label: 'Vada Pav', x: config.x + config.buttonSpacing }
        ];
        
        this.cookingButtons = {};
        
        buttons.forEach(btn => {
            const g = this.add.graphics();
            g.fillStyle(GameConfig.colors.warmYellow, 0.95);
            g.fillRoundedRect(btn.x - size.width / 2, config.y - size.height / 2, size.width, size.height, radius);
            g.lineStyle(2, GameConfig.colors.panelBorder, 0.4);
            g.strokeRoundedRect(btn.x - size.width / 2, config.y - size.height / 2, size.width, size.height, radius);
            g.setInteractive(new Phaser.Geom.Rectangle(btn.x - size.width / 2, config.y - size.height / 2, size.width, size.height), Phaser.Geom.Rectangle.Contains);
            g.setScrollFactor(0);
            
            const icon = this.add.circle(btn.x, config.y - 24, 16, GameConfig.colors.chaiBrown, 0.6);
            icon.setScrollFactor(0);
            
            const label = this.add.text(btn.x, config.y + 20, btn.label, {
                fontSize: '18px',
                fill: '#3D2E26',
                fontFamily: 'Inter, sans-serif',
                fontStyle: '600'
            });
            label.setOrigin(0.5);
            label.setScrollFactor(0);
            
            g.on('pointerdown', () => this.handleCookingButton(btn.type));
            
            g.on('pointerover', () => { if (this.inventoryManager.canCook(btn.type)) g.setScale(1.05); });
            g.on('pointerout', () => g.setScale(1));
            
            this.cookingButtons[btn.type] = { button: g, label, icon };
        });
    }
    
    handleCookingButton(orderType) {
        if (this.cookingManager.isCooking()) {
            const result = this.cookingManager.stopCooking();
            if (result) this.completeCooking(result);
        } else {
            const result = this.cookingManager.startCooking(orderType);
            if (result && typeof result === 'object') {
                this.completeCooking(result);
            }
        }
    }
    
    completeCooking(result) {
        // Check if customer is waiting
        const served = this.customerManager.serveCustomer(result.orderType);
        
        if (served) {
            // Calculate reward
            const reward = this.cookingManager.calculateReward(result);
            gameState.addCoins(reward);
            
            // Visual feedback
            this.showRewardFeedback(result, reward);
        } else {
            // No customer waiting - waste food
            gameState.resetCombo();
        }
        
        // Update inventory display
        this.inventoryManager.updateDisplay();
    }
    
    showRewardFeedback(result, reward) {
        const x = UIConfig.cookingArea.x;
        const y = UIConfig.cookingArea.y - 100;
        
        // Quality text
        const qualityColor = result.quality === "perfect" ? GameConfig.colors.perfect :
                           result.quality === "good" ? GameConfig.colors.good :
                           GameConfig.colors.burnt;
        
        const qualityText = this.add.text(x, y, result.quality.toUpperCase(), {
            fontSize: '24px',
            fill: `#${qualityColor.toString(16).padStart(6, '0')}`,
            fontFamily: 'Arial',
            fontStyle: 'bold'
        });
        qualityText.setOrigin(0.5);
        
        // Coin reward
        const coinText = this.add.text(x, y + 40, `+${reward} coins`, {
            fontSize: '20px',
            fill: '#FFB84C',
            fontFamily: 'Arial'
        });
        coinText.setOrigin(0.5);
        
        // Animate
        this.tweens.add({
            targets: [qualityText, coinText],
            alpha: 0,
            y: y - 50,
            duration: 1500,
            onComplete: () => {
                qualityText.destroy();
                coinText.destroy();
            }
        });
        
        // Perfect glow effect
        if (result.quality === "perfect") {
            const glow = this.add.circle(x, y, 60, qualityColor, 0.3);
            this.tweens.add({
                targets: glow,
                scale: 2,
                alpha: 0,
                duration: 800,
                onComplete: () => glow.destroy()
            });
        }
    }
    
    createDayTimer() {
        const config = UIConfig.dayTimer;
        
        this.dayTimerBar = this.add.rectangle(
            config.x,
            config.y,
            config.width,
            config.height,
            GameConfig.colors.chaiBrown,
            0.3
        );
        this.dayTimerBar.setOrigin(0.5);
        this.dayTimerBar.setScrollFactor(0);
        
        this.dayTimerFill = this.add.graphics();
        this.dayTimerFill.setScrollFactor(0);
    }
    
    update() {
        // Update managers
        this.customerManager.update();
        
        const progress = gameState.getDayProgress();
        const config = UIConfig.dayTimer;
        this.dayTimerFill.clear();
        const fillW = Math.max(2, config.width * progress);
        this.dayTimerFill.fillStyle(GameConfig.colors.softOrange, 0.9);
        this.dayTimerFill.fillRoundedRect(config.x - config.width / 2, config.y - config.height / 2, fillW, config.height, Math.min(config.radius, fillW / 2));
        
        // Update background for evening phase
        if (gameState.rushPhase === "evening" && this.background) {
            this.background.fillColor = GameConfig.colors.softOrange;
        } else if (gameState.rushPhase === "morning" && this.background) {
            this.background.fillColor = GameConfig.colors.bgCream || GameConfig.colors.cream;
        }
        
        // Check day complete
        if (progress >= 1) {
            this.completeDay();
        }
        
        // Check game over
        if (gameState.isGameOver()) {
            this.gameOver();
        }
        
        // Update cooking button states
        this.updateCookingButtons();
    }
    
    updateCookingButtons() {
        const config = UIConfig.cookingArea;
        const size = config.buttonSize;
        const isCooking = this.cookingManager.isCooking();
        const buttons = [
            { type: 'chai', x: config.x - config.buttonSpacing },
            { type: 'bunMaska', x: config.x },
            { type: 'vadaPav', x: config.x + config.buttonSpacing }
        ];
        buttons.forEach(b => {
            const canCook = this.inventoryManager.canCook(b.type);
            const active = isCooking || canCook;
            const btn = this.cookingButtons[b.type];
            const targetAlpha = active ? 1 : 0.5;
            btn.button.setAlpha(targetAlpha);
            btn.label.setAlpha(targetAlpha);
            if (btn.icon) btn.icon.setAlpha(targetAlpha);
            if (active) {
                const rect = new Phaser.Geom.Rectangle(b.x - size.width / 2, config.y - size.height / 2, size.width, size.height);
                btn.button.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
            } else {
                btn.button.disableInteractive();
            }
        });
    }
    
    completeDay() {
        this.customerManager.stop();
        this.scene.pause();
        this.scene.launch('UpgradeScene');
    }
    
    gameOver() {
        this.customerManager.stop();
        this.scene.pause();
        this.scene.launch('GameOverScene');
    }
}
