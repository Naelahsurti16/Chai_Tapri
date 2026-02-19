// Cooking Manager - Handles cooking mechanics
class CookingManager {
    constructor(scene) {
        this.scene = scene;
        this.currentCooking = null;
        this.cookingTimer = null;
        this.timingRing = null;
    }

    getCookSpeedMultiplier() {
        const level = gameState.upgrades?.fasterBoil ?? 0;
        const perLevel = GameConfig.upgrades.fasterBoil.cookTimeReduction;
        // Each level speeds cooking up; clamp so it never goes crazy-fast.
        return Math.max(0.5, 1 - level * perLevel);
    }

    getAdjustedTimings(recipe) {
        const m = this.getCookSpeedMultiplier();
        return {
            perfectWindow: Math.max(120, Math.round(recipe.perfectWindow * m)),
            burnThreshold: Math.max(800, Math.round(recipe.burnThreshold * m))
        };
    }
    
    startCooking(orderType) {
        if (this.currentCooking) return false; // Already cooking
        
        const recipe = GameConfig.cooking[orderType];
        if (!recipe) return false;
        
        // Check inventory
        if (!this.checkIngredients(recipe.ingredients)) {
            return false;
        }
        
        // Instant items (bun maska)
        if (recipe.instant) {
            return this.completeInstantCooking(orderType, recipe);
        }
        
        // Start timing-based cooking
        this.currentCooking = {
            orderType: orderType,
            recipe: recipe,
            startTime: Date.now(),
            stopped: false
        };
        
        // Deduct ingredients
        this.deductIngredients(recipe.ingredients);
        
        // Create timing ring visual
        this.createTimingRing(orderType, recipe);
        
        return true;
    }
    
    stopCooking() {
        if (!this.currentCooking || this.currentCooking.stopped) return null;
        
        this.currentCooking.stopped = true;
        const elapsed = Date.now() - this.currentCooking.startTime;
        const recipe = this.currentCooking.recipe;
        const timings = this.getAdjustedTimings(recipe);
        
        // Calculate quality
        let quality = "burnt";
        if (elapsed <= timings.burnThreshold) {
            const diff = Math.abs(elapsed - timings.perfectWindow);
            if (diff <= timings.perfectWindow * 0.5) {
                quality = "perfect";
            } else {
                quality = "good";
            }
        }
        
        const result = {
            orderType: this.currentCooking.orderType,
            quality: quality,
            elapsed: elapsed
        };
        
        // Clean up
        this.cleanupCooking();
        
        return result;
    }
    
    completeInstantCooking(orderType, recipe) {
        this.deductIngredients(recipe.ingredients);
        return {
            orderType: orderType,
            quality: "perfect",
            elapsed: 0
        };
    }
    
    createTimingRing(orderType, recipe) {
        const x = UIConfig.cookingArea.x;
        const y = UIConfig.cookingArea.y;
        const timings = this.getAdjustedTimings(recipe);
        
        // Outer ring (burn threshold)
        const outerRadius = 80;
        this.timingRing = this.scene.add.circle(x, y, outerRadius);
        this.timingRing.setStrokeStyle(4, GameConfig.colors.burnt, 0.3);
        this.timingRing.setFillStyle(0x000000, 0);
        
        // Inner ring (perfect window) - will animate
        const perfectRadius = 30;
        this.perfectRing = this.scene.add.circle(x, y, perfectRadius);
        this.perfectRing.setStrokeStyle(4, GameConfig.colors.perfect, 1);
        this.perfectRing.setFillStyle(0x000000, 0);
        
        // Animate perfect ring
        this.scene.tweens.add({
            targets: this.perfectRing,
            scaleX: { from: 0.5, to: 1.5 },
            scaleY: { from: 0.5, to: 1.5 },
            duration: timings.perfectWindow,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
        
        // Burn timer
        this.scene.time.delayedCall(timings.burnThreshold, () => {
            if (this.currentCooking && !this.currentCooking.stopped) {
                // Visual feedback for burn
                this.scene.cameras.main.shake(200, 0.01);
            }
        });
    }
    
    cleanupCooking() {
        if (this.timingRing) {
            this.timingRing.destroy();
            this.timingRing = null;
        }
        if (this.perfectRing) {
            this.perfectRing.destroy();
            this.perfectRing = null;
        }
        this.currentCooking = null;
    }
    
    checkIngredients(ingredients) {
        for (const [item, amount] of Object.entries(ingredients)) {
            if (gameState.inventory[item] < amount) {
                return false;
            }
        }
        return true;
    }
    
    deductIngredients(ingredients) {
        for (const [item, amount] of Object.entries(ingredients)) {
            gameState.inventory[item] = Math.max(0, gameState.inventory[item] - amount);
        }
    }
    
    calculateReward(result) {
        const recipe = GameConfig.cooking[result.orderType];
        const qualityMultiplier = GameConfig.qualityMultipliers[result.quality];
        const comboMultiplier = 1 + (gameState.combo * 0.1);
        
        let reward = recipe.baseReward * qualityMultiplier * comboMultiplier;
        
        // Update combo
        if (result.quality === "perfect") {
            gameState.addCombo(GameConfig.combo.incrementPerPerfect);
        } else if (result.quality === "burnt" && GameConfig.combo.resetOnBurnt) {
            gameState.resetCombo();
        }
        
        return Math.floor(reward);
    }
    
    isCooking() {
        return this.currentCooking !== null;
    }
}
