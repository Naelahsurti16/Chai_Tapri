// Game Configuration - All game constants
const GameConfig = {
    // Resolution
    width: 1280,
    height: 720,
    
    // Scale Settings
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    
    // Day Settings
    day: {
        duration: 120000, // 120 seconds in milliseconds
        morningDuration: 60000, // 60 seconds
        eveningDuration: 60000 // 60 seconds
    },
    
    // Customer Settings
    customer: {
        spawnIntervalMorning: 4000, // 4 seconds
        spawnIntervalEvening: 2500, // 2.5 seconds
        maxQueue: 3,
        patience: 6000, // 6 seconds
        patienceWarningThreshold: 0.25, // 25%
        reputationLoss: 10,
        maxAngryCustomers: 3
    },
    
    // Cooking Settings
    cooking: {
        chai: {
            perfectWindow: 400, // milliseconds
            burnThreshold: 4500, // milliseconds
            baseReward: 10,
            ingredients: { milk: 1, tea: 1 }
        },
        bunMaska: {
            instant: true,
            baseReward: 5,
            ingredients: { bun: 1 }
        },
        vadaPav: {
            perfectWindow: 600,
            burnThreshold: 5000,
            baseReward: 15,
            ingredients: { bun: 1, oil: 1, potato: 1 }
        }
    },
    
    // Quality Multipliers
    qualityMultipliers: {
        perfect: 1.5,
        good: 1.0,
        burnt: 0
    },
    
    // Combo Settings
    combo: {
        incrementPerPerfect: 0.5,
        resetOnBurnt: true
    },
    
    // Inventory Settings
    inventory: {
        maxCapacity: {
            milk: 5,
            tea: 5,
            bun: 4,
            oil: 4,
            potato: 4
        },
        startingAmount: {
            milk: 5,
            tea: 5,
            bun: 4,
            oil: 4,
            potato: 4
        }
    },
    
    // Delivery Settings
    delivery: {
        duration: 6000, // 6 seconds
        cooldown: 0
    },
    
    // Upgrade Settings
    upgrades: {
        fasterBoil: {
            name: "Faster Boil",
            description: "Reduces cook time by 10%",
            cookTimeReduction: 0.1
        },
        largerStorage: {
            name: "Larger Storage",
            description: "+2 inventory capacity per item",
            capacityIncrease: 2
        }
    },
    
    // UI Settings
    ui: {
        buttonMinHeight: 120,
        buttonPadding: 20,
        panelBorderRadius: 15
    },
    
    // Colors - Hierarchy: background (softest) → panels → buttons → accents
    colors: {
        // Background
        bgCream: 0xF8F4EE,
        // Panels (slightly darker)
        panelBeige: 0xEDE4D8,
        panelBorder: 0x6B5344,
        // Buttons
        chaiBrown: 0x8B5E3C,
        cream: 0xF5E6D3,
        warmYellow: 0xFFB84C,
        softOrange: 0xFF8C42,
        // Text
        textDark: 0x3D2E26,
        textMuted: 0x6B5344,
        // States
        perfect: 0x5A9B5A,
        good: 0x8BC34A,
        burnt: 0xC45C4A,
        // Legacy (for compatibility)
        backgroundMorning: [0xF8F4EE, 0xFFE5CC],
        backgroundEvening: [0xFFE5CC, 0xFF8C42]
    }
};
