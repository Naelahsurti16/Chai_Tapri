// UI Utilities - Rounded panels, consistent styling
const UIUtils = {
    createRoundedPanel(scene, x, y, width, height, fillColor, fillAlpha, radius) {
        const g = scene.add.graphics();
        g.fillStyle(fillColor, fillAlpha ?? 0.95);
        g.fillRoundedRect(x - width / 2, y - height / 2, width, height, radius ?? 16);
        g.setScrollFactor(0);
        return g;
    },
    
    createRoundedRect(scene, x, y, width, height, fillColor, fillAlpha, radius) {
        const g = scene.add.graphics();
        g.fillStyle(fillColor, fillAlpha ?? 0.95);
        g.fillRoundedRect(x - width / 2, y - height / 2, width, height, radius ?? 16);
        g.setScrollFactor(0);
        return g;
    },
    
    createRoundedRectOrigin(scene, x, y, width, height, fillColor, fillAlpha, radius) {
        const g = scene.add.graphics();
        g.fillStyle(fillColor, fillAlpha ?? 0.95);
        g.fillRoundedRect(x, y, width, height, radius ?? 16);
        g.setScrollFactor(0);
        return g;
    }
};
