# Chai Tapri - Cozy Arcade Vertical Slice

A mobile-first web game built with Phaser 3, designed for landscape orientation.

## 🎮 Game Overview

Run your own chai tapri (tea stall) and serve customers! Cook chai, bun maska, and vada pav while managing inventory, maintaining customer satisfaction, and earning coins.

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- A local web server (for development)

### Installation & Running

1. **Using npm/http-server** (recommended):
   ```bash
   npm install
   npm start
   ```
   Then open `http://localhost:8080` in your browser.

2. **Using Python**:
   ```bash
   python -m http.server 8080
   ```
   Then open `http://localhost:8080` in your browser.

3. **Using VS Code Live Server**:
   - Install the "Live Server" extension
   - Right-click on `index.html` and select "Open with Live Server"

## 📱 Platform Requirements

- **Target**: Mobile Web (Landscape)
- **Resolution**: 1280 x 720
- **Orientation**: Landscape ONLY
- **Scale Mode**: FIT with auto-center

## 🎯 How to Play

1. **Cooking**:
   - Tap a cooking button (Chai, Bun Maska, Vada Pav) to start
   - For timing-based items (Chai, Vada Pav), tap again when the green ring aligns
   - Perfect timing = higher rewards and combo multiplier

2. **Serving Customers**:
   - Customers appear in the queue at the top
   - Cook the item they ordered and it will be served automatically
   - Watch their patience bar - if it runs out, they get angry!

3. **Inventory**:
   - Each recipe uses ingredients
   - When ingredients run low, use the "Restock" button
   - Restocking takes 6 seconds

4. **Day System**:
   - Each day lasts 120 seconds
   - Morning phase (0-60s): Normal spawn rate
   - Evening phase (60-120s): Faster spawn rate
   - Complete the day to unlock upgrades!

5. **Game Over**:
   - If 3 customers get angry, your tapri closes
   - Try to maximize coins and combo before closing!

## 🏗️ Project Structure

```
CHAI_TAPRI/
├── index.html              # Main HTML file
├── styles.css              # Global styles
├── package.json            # Project dependencies
├── js/
│   ├── main.js            # Phaser game initialization
│   ├── config/
│   │   ├── GameConfig.js  # Game constants and settings
│   │   └── UIConfig.js    # UI layout configuration
│   ├── managers/
│   │   ├── GameState.js   # Global game state
│   │   ├── CustomerManager.js
│   │   ├── CookingManager.js
│   │   ├── InventoryManager.js
│   │   └── DeliveryManager.js
│   └── scenes/
│       ├── BootScene.js
│       ├── GameScene.js   # Main game logic
│       ├── UIScene.js     # Overlay UI
│       ├── UpgradeScene.js
│       └── GameOverScene.js
```

## 🎨 Features

- ✅ Config-driven architecture (no hardcoded values)
- ✅ Modular manager system
- ✅ Customer queue with patience system
- ✅ Timing-based cooking mechanics
- ✅ Inventory management
- ✅ Delivery/restock system
- ✅ Day phase system (morning/evening)
- ✅ Combo multiplier system
- ✅ Upgrade system between days
- ✅ Responsive UI scaling

## 🔧 Configuration

All game values are configurable in `js/config/GameConfig.js`:
- Customer spawn rates
- Cooking timings
- Inventory capacities
- Reward formulas
- Day duration
- And more!

## 📝 Notes

- The game uses Phaser 3 CDN (no local installation needed)
- Currently uses simple shapes for MVP - sprites can be added later
- Audio system is prepared but not yet implemented
- All values are config-driven for easy tweaking

## 🐛 Troubleshooting

- **Game not loading**: Make sure you're using a local web server (not opening file:// directly)
- **Touch not working**: Check browser console for errors
- **Scaling issues**: Ensure viewport meta tag is correct in index.html

## 📄 License

MIT License
