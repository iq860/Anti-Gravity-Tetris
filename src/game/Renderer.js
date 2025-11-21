export default class Renderer {
    constructor(ctx, nextCtx, holdCtx) {
        this.ctx = ctx;
        this.nextCtx = nextCtx;
        this.holdCtx = holdCtx;
        this.blockSize = 30; // Default, will be responsive
    }

    resize(width, height) {
        this.ctx.canvas.width = width;
        this.ctx.canvas.height = height;
        this.blockSize = Math.floor(width / 10);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    drawGrid(grid) {
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x]) {
                    this.drawBlock(this.ctx, x, y, grid[y][x]);
                }
            }
        }
    }

    drawTetromino(tetromino) {
        for (let y = 0; y < tetromino.shape.length; y++) {
            for (let x = 0; x < tetromino.shape[y].length; x++) {
                if (tetromino.shape[y][x]) {
                    this.drawBlock(this.ctx, tetromino.x + x, tetromino.y + y, tetromino.color);
                }
            }
        }
    }

    drawGhost(tetromino, board) {
        let ghostY = tetromino.y;
        while (board.isValidMove(tetromino, 0, ghostY - tetromino.y + 1)) {
            ghostY++;
        }

        this.ctx.globalAlpha = 0.2;
        for (let y = 0; y < tetromino.shape.length; y++) {
            for (let x = 0; x < tetromino.shape[y].length; x++) {
                if (tetromino.shape[y][x]) {
                    this.drawBlock(this.ctx, tetromino.x + x, ghostY + y, tetromino.color);
                }
            }
        }
        this.ctx.globalAlpha = 1.0;
    }

    drawBlock(ctx, x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize, this.blockSize);

        // Add simple bevel effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(x * this.blockSize, y * this.blockSize, this.blockSize, 4);
        ctx.fillRect(x * this.blockSize, y * this.blockSize, 4, this.blockSize);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(x * this.blockSize + this.blockSize - 4, y * this.blockSize, 4, this.blockSize);
        ctx.fillRect(x * this.blockSize, y * this.blockSize + this.blockSize - 4, this.blockSize, 4);
    }

    drawNext(tetromino) {
        this.nextCtx.clearRect(0, 0, this.nextCtx.canvas.width, this.nextCtx.canvas.height);
        if (!tetromino) return;

        const offsetX = (this.nextCtx.canvas.width - tetromino.shape[0].length * this.blockSize) / 2;
        const offsetY = (this.nextCtx.canvas.height - tetromino.shape.length * this.blockSize) / 2;

        this.nextCtx.save();
        this.nextCtx.translate(offsetX, offsetY);

        for (let y = 0; y < tetromino.shape.length; y++) {
            for (let x = 0; x < tetromino.shape[y].length; x++) {
                if (tetromino.shape[y][x]) {
                    this.drawBlock(this.nextCtx, x, y, tetromino.color);
                }
            }
        }
        this.nextCtx.restore();
    }

    drawHold(tetromino) {
        this.holdCtx.clearRect(0, 0, this.holdCtx.canvas.width, this.holdCtx.canvas.height);
        if (!tetromino) return;

        const offsetX = (this.holdCtx.canvas.width - tetromino.shape[0].length * this.blockSize) / 2;
        const offsetY = (this.holdCtx.canvas.height - tetromino.shape.length * this.blockSize) / 2;

        this.holdCtx.save();
        this.holdCtx.translate(offsetX, offsetY);

        for (let y = 0; y < tetromino.shape.length; y++) {
            for (let x = 0; x < tetromino.shape[y].length; x++) {
                if (tetromino.shape[y][x]) {
                    this.drawBlock(this.holdCtx, x, y, tetromino.color);
                }
            }
        }
        this.holdCtx.restore();
    }
    drawZones(zones, board) {
        zones.forEach(zone => {
            let color, borderColor;
            switch (zone.type) {
                case 'REVERSE':
                    color = 'rgba(244, 63, 94, 0.4)';
                    borderColor = 'rgba(244, 63, 94, 0.8)';
                    break;
                case 'HEAVY':
                    color = 'rgba(147, 51, 234, 0.4)';
                    borderColor = 'rgba(147, 51, 234, 0.8)';
                    break;
                case 'ZERO':
                    color = 'rgba(6, 182, 212, 0.4)';
                    borderColor = 'rgba(6, 182, 212, 0.8)';
                    break;
                default:
                    color = 'rgba(255, 255, 255, 0.2)';
                    borderColor = 'rgba(255, 255, 255, 0.4)';
            }

            this.ctx.fillStyle = color;
            this.ctx.strokeStyle = borderColor;
            this.ctx.lineWidth = 2;

            // Draw individual blocks of the cloud
            zone.blocks.forEach(block => {
                const absX = Math.floor(zone.x + block.x);
                const absY = Math.floor(zone.y + block.y);

                // Masking: Only draw if the board cell is empty
                // Check bounds first
                if (absX >= 0 && absX < 10 && absY >= 0 && absY < 20) {
                    if (!board.grid[absY][absX]) {
                        const drawX = (zone.x + block.x) * this.blockSize;
                        const drawY = (zone.y + block.y) * this.blockSize;

                        this.ctx.fillRect(drawX, drawY, this.blockSize, this.blockSize);
                        this.ctx.strokeRect(drawX, drawY, this.blockSize, this.blockSize);
                    }
                }
            });

            // Add label (centered on the bounding box)
            const labelX = (zone.x + zone.width / 2) * this.blockSize;
            const labelY = (zone.y + zone.height / 2) * this.blockSize;

            this.ctx.font = 'bold 12px Outfit';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';

            const textWidth = this.ctx.measureText(zone.type).width;
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            this.ctx.beginPath();
            this.ctx.roundRect(labelX - textWidth / 2 - 4, labelY - 8, textWidth + 8, 16, 4);
            this.ctx.fill();

            this.ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            this.ctx.fillText(zone.type, labelX, labelY);
        });
    }
}
