// Global Game State Manager
class GameState {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.day = 1;
        this.coins = 0;
        this.reputation = 100;
        this.combo = 0;
        this.angryCustomers = 0;
        this.rushPhase = "morning"; // "morning" or "evening"
        this.dayStartTime = 0;
        this.inventory = {
            milk: GameConfig.inventory.startingAmount.milk,
            tea: GameConfig.inventory.startingAmount.tea,
            bun: GameConfig.inventory.startingAmount.bun,
            oil: GameConfig.inventory.startingAmount.oil,
            potato: GameConfig.inventory.startingAmount.potato
        };
        this.inventoryMax = { ...GameConfig.inventory.maxCapacity };
        this.upgrades = {
            fasterBoil: 0,
            largerStorage: 0
        };
    }
    
    startDay() {
        this.dayStartTime = Date.now();
        this.rushPhase = "morning";
        this.angryCustomers = 0;
    }
    
    getDayProgress() {
        if (!this.dayStartTime) return 0;
        const elapsed = Date.now() - this.dayStartTime;
        return Math.min(elapsed / GameConfig.day.duration, 1);
    }
    
    getDayTimeRemaining() {
        if (!this.dayStartTime) return GameConfig.day.duration;
        const elapsed = Date.now() - this.dayStartTime;
        return Math.max(GameConfig.day.duration - elapsed, 0);
    }
    
    updateRushPhase() {
        if (!this.dayStartTime) return;
        const elapsed = Date.now() - this.dayStartTime;
        if (elapsed >= GameConfig.day.morningDuration && this.rushPhase === "morning") {
            this.rushPhase = "evening";
        }
    }
    
    addCoins(amount) {
        this.coins += Math.floor(amount);
    }
    
    addCombo(increment) {
        this.combo += increment;
    }
    
    resetCombo() {
        this.combo = 0;
    }
    
    loseReputation(amount) {
        this.reputation = Math.max(0, this.reputation - amount);
    }
    
    addAngryCustomer() {
        this.angryCustomers++;
    }
    
    isGameOver() {
        return this.angryCustomers >= GameConfig.customer.maxAngryCustomers;
    }
    
    applyUpgrade(upgradeType) {
        if (upgradeType === "fasterBoil") {
            this.upgrades.fasterBoil++;
        } else if (upgradeType === "largerStorage") {
            this.upgrades.largerStorage++;
            // Increase max capacity for all items
            Object.keys(this.inventoryMax).forEach(item => {
                this.inventoryMax[item] += GameConfig.upgrades.largerStorage.capacityIncrease;
            });
            // Refill inventory to new max
            Object.keys(this.inventory).forEach(item => {
                this.inventory[item] = this.inventoryMax[item];
            });
        }
    }
    
    nextDay() {
        this.day++;
        this.startDay();
    }
}

// Global instance
const gameState = new GameState();
