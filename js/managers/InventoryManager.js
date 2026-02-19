// Inventory Manager - Handles inventory display and checks
class InventoryManager {
    constructor(scene) {
        this.scene = scene;
        this.panel = null;
        this.items = {};
    }
    
    create() {
        const config = UIConfig.inventoryPanel;
        const cx = config.x + config.width / 2;
        const cy = config.y + config.height / 2;
        
        const g = this.scene.add.graphics();
        g.fillStyle(GameConfig.colors.panelBeige, 0.95);
        g.fillRoundedRect(config.x, config.y, config.width, config.height, config.radius);
        g.lineStyle(2, GameConfig.colors.panelBorder, 0.4);
        g.strokeRoundedRect(config.x, config.y, config.width, config.height, config.radius);
        g.setScrollFactor(0);
        this.panel = g;
        
        this.title = this.scene.add.text(config.x + 16, config.y + 12, 'Inventory', {
            fontSize: '16px',
            fill: '#3D2E26',
            fontFamily: 'Inter, sans-serif',
            fontStyle: '600'
        });
        this.title.setScrollFactor(0);
        
        this.updateDisplay();
    }
    
    updateDisplay() {
        Object.values(this.items).forEach(item => {
            if (item.text) item.text.destroy();
            if (item.barBg) item.barBg.destroy();
            if (item.barFill) item.barFill.destroy();
            if (item.valueText) item.valueText.destroy();
        });
        this.items = {};
        
        const config = UIConfig.inventoryPanel;
        const startX = config.x + 16;
        const startY = config.y + 36;
        const lineHeight = 18;
        const barWidth = 80;
        const barHeight = 6;
        
        Object.keys(gameState.inventory).forEach((item, index) => {
            const current = gameState.inventory[item];
            const max = gameState.inventoryMax[item];
            const pct = max > 0 ? current / max : 0;
            
            const y = startY + index * lineHeight;
            
            const label = item.charAt(0).toUpperCase() + item.slice(1);
            const text = this.scene.add.text(startX, y, label, {
                fontSize: '13px',
                fill: current === 0 ? '#C45C4A' : '#3D2E26',
                fontFamily: 'Inter, sans-serif'
            });
            text.setScrollFactor(0);
            text.setOrigin(0);
            
            const barX = startX + 70;
            const barBg = this.scene.add.rectangle(barX, y + 4, barWidth, barHeight, 0xDDDDDD, 0.6);
            barBg.setOrigin(0, 0.5);
            barBg.setScrollFactor(0);
            
            const barFill = this.scene.add.rectangle(barX, y + 4, barWidth * pct, barHeight,
                pct > 0.25 ? GameConfig.colors.perfect : GameConfig.colors.burnt, 0.9);
            barFill.setOrigin(0, 0.5);
            barFill.setScrollFactor(0);

            const valueText = this.scene.add.text(barX + barWidth + 10, y, `${current}/${max}`, {
                fontSize: '12px',
                fill: '#6B5344',
                fontFamily: 'Inter, sans-serif'
            });
            valueText.setScrollFactor(0);
            valueText.setOrigin(0, 0);
            
            this.items[item] = { text, barBg, barFill, valueText, current, max };
        });
    }
    
    canCook(orderType) {
        const recipe = GameConfig.cooking[orderType];
        if (!recipe) return false;
        for (const [item, amount] of Object.entries(recipe.ingredients)) {
            if (gameState.inventory[item] < amount) return false;
        }
        return true;
    }
    
    refill() {
        Object.keys(gameState.inventory).forEach(item => {
            gameState.inventory[item] = gameState.inventoryMax[item];
        });
        this.updateDisplay();
    }
}
