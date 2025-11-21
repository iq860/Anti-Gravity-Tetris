# 🌌 Anti-Gravity Tetris

![Version](https://img.shields.io/badge/version-1.0.0-blueviolet?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Docker](https://img.shields.io/badge/docker-ready-blue?style=for-the-badge&logo=docker)

> **A modern, physics-defying twist on the classic block-stacking game.**  
> Experience pixelated gravity clouds, time-bending zones, and a sleek, neon-infused aesthetic.

---

## 🎮 Features

### 🌩️ Dynamic Gravity Clouds
The game features **Pixelated Gravity Zones** that drift across the board like digital clouds. Each zone alters the laws of physics:

*   🔴 **REVERSE Zone**: Gravity flips! Blocks float *upwards*.
*   🟣 **HEAVY Zone**: Gravity intensifies! Blocks drop at **10x speed**.
*   🔵 **ZERO Zone**: Zero gravity! Blocks float in mid-air until you move them.
*   ☁️ **Pixelated Aesthetics**: Clouds are procedurally generated pixel clusters that merge and intertwine.
*   🎭 **Smart Masking**: Clouds only appear in empty space, never obscuring your stacked blocks.

### ✨ Modern Gameplay
*   **Smooth Controls**: Responsive movement with ghost piece guides.
*   **Hold Mechanism**: Swap pieces strategically.
*   **Hard Drop**: Instantly lock pieces (disabled inside special gravity zones!).
*   **Responsive Design**: Scales perfectly from desktop to mobile.

---

## 🚀 Getting Started

### 🐳 Run with Docker (Recommended)

The easiest way to play is using the pre-built Docker image.

```bash
# Pull and run the game
docker run -p 3000:3000 <your-username>/antigravity-tetris
```

Open **http://localhost:3000** in your browser.

### 🛠️ Manual Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/iq860/Anti-Gravity.git
    cd Anti-Gravity
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start the dev server**
    ```bash
    npm run dev
    ```

---

## 🕹️ Controls

| Key | Action |
| :--- | :--- |
| **← / →** | Move Left / Right |
| **↑** | Rotate Piece |
| **↓** | Soft Drop |
| **Space** | Hard Drop (Instant Lock) |
| **C** | Hold Piece |
| **P** | Pause Game |

---

## 🛠️ Tech Stack

*   **Core**: Vanilla JavaScript (ES6+)
*   **Rendering**: HTML5 Canvas API
*   **Styling**: CSS3 with Glassmorphism effects
*   **Fonts**: Google Fonts (Outfit)
*   **Build Tool**: Vite
*   **Containerization**: Docker

---

## 📸 Screenshots

*(Add your gameplay screenshots here)*

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

Made with ❤️ by **Hossam**
