// Customer Manager - Handles customer spawning and queue
class CustomerManager {
    constructor(scene) {
        this.scene = scene;
        this.customers = [];
        this.spawnTimer = null;
        this.nextSpawnTime = 0;
    }
    
    start() {
        this.scheduleNextSpawn();
    }
    
    stop() {
        if (this.spawnTimer) {
            this.spawnTimer.remove();
            this.spawnTimer = null;
        }
    }
    
    scheduleNextSpawn() {
        if (this.customers.length >= GameConfig.customer.maxQueue) {
            // Queue full, try again soon
            this.spawnTimer = this.scene.time.delayedCall(1000, () => {
                this.scheduleNextSpawn();
            });
            return;
        }
        
        const interval = gameState.rushPhase === "morning" 
            ? GameConfig.customer.spawnIntervalMorning 
            : GameConfig.customer.spawnIntervalEvening;
        
        this.spawnTimer = this.scene.time.delayedCall(interval, () => {
            this.spawnCustomer();
            this.scheduleNextSpawn();
        });
    }
    
    spawnCustomer() {
        if (this.customers.length >= GameConfig.customer.maxQueue) return;
        
        const orders = ["chai", "bunMaska", "vadaPav"];
        const order = Phaser.Utils.Array.GetRandom(orders);
        
        const customer = {
            id: Phaser.Utils.String.UUID(),
            order: order,
            patience: GameConfig.customer.patience,
            maxPatience: GameConfig.customer.patience,
            state: "waiting", // "waiting", "served", "angry"
            sprite: null,
            patienceBar: null,
            startTime: Date.now()
        };
        
        this.customers.push(customer);
        this.createCustomerVisual(customer);
    }
    
    createCustomerVisual(customer) {
        const index = this.customers.indexOf(customer);
        const x = UIConfig.customerQueue.x - (index - 1) * UIConfig.customerQueue.spacing;
        const y = UIConfig.customerQueue.y;
        
        const color = customer.order === "chai" ? GameConfig.colors.warmYellow :
                     customer.order === "bunMaska" ? GameConfig.colors.softOrange : GameConfig.colors.chaiBrown;
        
        customer.sprite = this.scene.add.circle(x, y, 36, color);
        customer.sprite.setInteractive();
        customer.sprite.customerData = customer;
        
        const barWidth = 90;
        const barHeight = 8;
        customer.patienceBar = this.scene.add.rectangle(x - barWidth / 2, y + 48, barWidth, barHeight, GameConfig.colors.perfect);
        customer.patienceBar.setOrigin(0, 0.5);
        
        const orderLabel = customer.order === 'chai' ? 'Chai' : customer.order === 'bunMaska' ? 'Bun Maska' : 'Vada Pav';
        customer.orderText = this.scene.add.text(x, y - 36, orderLabel, {
            fontSize: '14px',
            fill: '#3D2E26',
            fontFamily: 'Inter, sans-serif',
            fontStyle: '500'
        }).setOrigin(0.5);
    }
    
    update() {
        gameState.updateRushPhase();
        
        const now = Date.now();
        this.customers.forEach((customer, index) => {
            if (customer.state !== "waiting") return;
            
            const elapsed = now - customer.startTime;
            const remaining = Math.max(0, customer.maxPatience - elapsed);
            const percentage = remaining / customer.maxPatience;
            
            // Update patience bar
            if (customer.patienceBar) {
                const barWidth = 100;
                customer.patienceBar.width = barWidth * percentage;
                
                // Change color based on patience
                if (percentage < GameConfig.customer.patienceWarningThreshold) {
                    customer.patienceBar.fillColor = 0xF44336; // Red
                } else {
                    customer.patienceBar.fillColor = 0x4CAF50; // Green
                }
            }
            
            // Check if patience expired
            if (remaining <= 0 && customer.state === "waiting") {
                this.makeCustomerAngry(customer);
            }
        });
    }
    
    makeCustomerAngry(customer) {
        customer.state = "angry";
        gameState.addAngryCustomer();
        gameState.loseReputation(GameConfig.customer.reputationLoss);
        
        // Visual feedback
        if (customer.sprite) {
            customer.sprite.fillColor = GameConfig.colors.burnt;
        }
        
        // Remove customer after a moment
        this.scene.time.delayedCall(1000, () => {
            this.removeCustomer(customer);
        });
    }
    
    serveCustomer(orderType) {
        const customer = this.customers.find(c => 
            c.state === "waiting" && c.order === orderType
        );
        
        if (customer) {
            customer.state = "served";
            this.removeCustomer(customer);
            return true;
        }
        
        return false;
    }
    
    removeCustomer(customer) {
        const index = this.customers.indexOf(customer);
        if (index === -1) return;
        
        // Remove visuals
        if (customer.sprite) customer.sprite.destroy();
        if (customer.patienceBar) customer.patienceBar.destroy();
        if (customer.orderText) customer.orderText.destroy();
        
        // Remove from array
        this.customers.splice(index, 1);
        
        const barWidth = 90;
        this.customers.forEach((c, i) => {
            if (c.sprite) {
                const x = UIConfig.customerQueue.x - (i - 1) * UIConfig.customerQueue.spacing;
                c.sprite.x = x;
                if (c.patienceBar) c.patienceBar.x = x - barWidth / 2;
                if (c.orderText) c.orderText.x = x;
            }
        });
    }
    
    getWaitingCustomers() {
        return this.customers.filter(c => c.state === "waiting");
    }
}
