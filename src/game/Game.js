import Board from './Board.js';
import Tetromino, { SHAPES } from './Tetromino.js';
import Renderer from './Renderer.js';
import ZoneManager, { ZONE_TYPES } from './ZoneManager.js';

export default class Game {
    constructor(canvas, nextCanvas, holdCanvas, callbacks = {}) {
        this.board = new Board(10, 20);
        // Fix: Pass contexts, not canvas elements
        const ctx = canvas.getContext('2d');
        const nextCtx = nextCanvas.getContext('2d');
        const holdCtx = holdCanvas.getContext('2d');
        this.renderer = new Renderer(ctx, nextCtx, holdCtx);
        this.zoneManager = new ZoneManager(10, 20);
        this.callbacks = callbacks;

        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.isGameOver = false;
        this.isPlaying = false;
        this.isPaused = false;

        this.activePiece = null;
        this.nextPiece = null;
        this.holdPiece = null;
        this.canHold = true;

        this.dropInterval = 1000;
        this.lastTime = 0;
        this.dropCounter = 0;

        this.bindControls();
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    // ...

    gameOver() {
        this.isGameOver = true;
        this.isPlaying = false;
        if (this.callbacks.onGameOver) {
            this.callbacks.onGameOver(this.score);
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;

        if (this.isPaused) {
            if (this.callbacks.onPause) this.callbacks.onPause();
        } else {
            this.lastTime = performance.now();
            this.loop(performance.now());
            if (this.callbacks.onResume) this.callbacks.onResume();
        }
    }

    resize() {
        const canvas = this.renderer.ctx.canvas;
        const scale = Math.min(
            window.innerWidth / 400,
            window.innerHeight / 700
        );
        const width = 300;
        const height = 600;
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${width * Math.min(scale, 1)}px`;
        canvas.style.height = `${height * Math.min(scale, 1)}px`;

        if (this.isPlaying) {
            this.draw();
        }
    }

    start() {
        this.isPlaying = true;
        this.isGameOver = false;
        this.isPaused = false;
        this.nextPiece = this.randomPiece();
        this.spawnPiece();
        this.lastTime = performance.now();
        this.loop(performance.now());
    }

    spawnPiece() {
        this.activePiece = this.nextPiece || this.randomPiece();
        this.nextPiece = this.randomPiece();
        this.canHold = true;

        // Check for game over
        if (!this.board.isValidMove(this.activePiece, 0, 0)) {
            this.gameOver();
        }
    }

    randomPiece() {
        const shapes = Object.keys(SHAPES);
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        return new Tetromino(randomShape);
    }

    reset() {
        this.board.reset();
        this.zoneManager.reset();
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.dropInterval = 1000;
        this.dropCounter = 0;
        this.isGameOver = false;
        this.holdPiece = null;
        this.canHold = true;
        this.nextPiece = this.randomPiece();
        this.updateUI();
    }

    loop(time = 0) {
        if (!this.isPlaying || this.isGameOver || this.isPaused) return;

        const deltaTime = time - this.lastTime;
        this.lastTime = time;

        this.zoneManager.update(deltaTime);

        this.dropCounter += deltaTime;

        // Gravity Logic
        const gravityType = this.activePiece ? this.zoneManager.getGravityModifier(this.activePiece) : ZONE_TYPES.NORMAL;
        let currentInterval = this.dropInterval;

        if (gravityType === ZONE_TYPES.HEAVY) {
            currentInterval = 100; // Very fast drop
        } else if (gravityType === ZONE_TYPES.ZERO) {
            currentInterval = Infinity; // No automatic drop
        }

        if (this.dropCounter > currentInterval) {
            if (gravityType === ZONE_TYPES.REVERSE) {
                this.moveUp();
            } else {
                this.drop();
            }
        }

        this.draw();
        requestAnimationFrame((t) => this.loop(t));
    }

    drop() {
        if (this.board.isValidMove(this.activePiece, 0, 1)) {
            this.activePiece.y++;
            this.dropCounter = 0;
        } else {
            // Only lock if we are moving down (normal/heavy gravity)
            // If we are in reverse gravity, hitting bottom shouldn't happen naturally, 
            // but if we manually drop, we lock.
            this.lock();
        }
    }

    moveUp() {
        if (this.board.isValidMove(this.activePiece, 0, -1)) {
            this.activePiece.y--;
            this.dropCounter = 0;
        } else {
            // If we hit the ceiling or a block above in reverse gravity, we lock
            this.lock();
        }
    }

    hardDrop() {
        // Disable hard drop if in a special gravity zone
        const gravityType = this.zoneManager.getGravityModifier(this.activePiece);
        if (gravityType !== ZONE_TYPES.NORMAL) return;

        while (this.board.isValidMove(this.activePiece, 0, 1)) {
            this.activePiece.y++;
            this.score += 2; // Bonus for hard drop
        }
        this.lock();
        this.updateUI();
    }

    lock() {
        this.board.lockPiece(this.activePiece);
        const linesCleared = this.board.clearLines();
        this.updateScore(linesCleared);

        if (this.isGameOver) return; // Set in updateScore if needed, or check here?

        this.spawnPiece();
        this.draw();
    }

    updateScore(lines) {
        if (lines > 0) {
            const points = [0, 100, 300, 500, 800];
            this.score += points[lines] * this.level;
            this.lines += lines;
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
        }
        this.updateUI();
    }

    updateUI() {
        document.getElementById('score').innerText = this.score;
        document.getElementById('level').innerText = this.level;
        document.getElementById('lines').innerText = this.lines;
    }



    draw() {
        this.renderer.clear();
        this.renderer.drawZones(this.zoneManager.zones, this.board);
        this.renderer.drawGrid(this.board.grid);
        if (this.activePiece) {
            this.renderer.drawGhost(this.activePiece, this.board);
            this.renderer.drawTetromino(this.activePiece);
        }
        this.renderer.drawNext(this.nextPiece);
        this.renderer.drawHold(this.holdPiece);
    }

    move(dir) {
        if (this.board.isValidMove(this.activePiece, dir, 0)) {
            this.activePiece.x += dir;
            this.draw();
        }
    }

    rotate() {
        const newShape = this.activePiece.rotate();
        if (this.board.isValidMove(this.activePiece, 0, 0, newShape)) {
            this.activePiece.shape = newShape;
            this.draw();
        } else {
            // Wall kick attempt (simple)
            if (this.board.isValidMove(this.activePiece, 1, 0, newShape)) {
                this.activePiece.x += 1;
                this.activePiece.shape = newShape;
                this.draw();
            } else if (this.board.isValidMove(this.activePiece, -1, 0, newShape)) {
                this.activePiece.x -= 1;
                this.activePiece.shape = newShape;
                this.draw();
            }
        }
    }

    hold() {
        if (!this.canHold) return;

        if (!this.holdPiece) {
            this.holdPiece = new Tetromino(this.activePiece.shapeKey);
            this.spawnPiece();
        } else {
            const temp = this.holdPiece;
            this.holdPiece = new Tetromino(this.activePiece.shapeKey);
            this.activePiece = temp;
            this.activePiece.x = 3;
            this.activePiece.y = 0;
        }

        this.canHold = false;
        this.draw();
    }

    bindControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.isPlaying || this.isGameOver) return;

            switch (e.key) {
                case 'ArrowLeft':
                    this.move(-1);
                    break;
                case 'ArrowRight':
                    this.move(1);
                    break;
                case 'ArrowDown':
                    this.drop();
                    this.draw();
                    break;
                case 'ArrowUp':
                    this.rotate();
                    break;
                case ' ':
                    this.hardDrop();
                    break;
                case 'c':
                case 'C':
                    this.hold();
                    break;
                case 'p':
                case 'P':
                    this.togglePause();
                    break;
            }
        });
    }


}
