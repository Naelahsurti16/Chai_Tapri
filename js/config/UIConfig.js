// UI Configuration - 8px grid: margins 16, 24, 32
const UIConfig = {
    grid: 8,
    padding: { sm: 16, md: 24, lg: 32 },
    
    // Top Bar - 80px height, 20px padding
    topBar: {
        y: 16,
        height: 80,
        padding: 20,
        borderBottom: 2
    },
    
    // Order Panel (Customer Queue) - rounded container
    orderPanel: {
        x: 640,
        y: 220,
        width: 520,
        height: 180,
        radius: 16
    },
    
    // Customer Queue Area (inside order panel)
    customerQueue: {
        x: 640,
        y: 260,
        spacing: 160,
        maxVisible: 3
    },
    
    // Cooking Area
    cookingArea: {
        x: 640,
        y: 480,
        buttonSpacing: 180,
        buttonSize: { width: 140, height: 120 },
        radius: 16
    },
    
    // Bottom - Inventory + Restock grouped
    bottomPanel: {
        y: 600,
        height: 120,
        padding: 24
    },
    
    // Inventory Panel - card style
    inventoryPanel: {
        x: 24,
        y: 600,
        width: 520,
        height: 120,
        radius: 16
    },
    
    // Delivery Button - pill, next to inventory
    deliveryButton: {
        x: 580,
        y: 660,
        width: 180,
        height: 80,
        radius: 40
    },
    
    // Day Timer
    dayTimer: {
        x: 640,
        y: 680,
        width: 240,
        height: 24,
        radius: 12
    }
};
