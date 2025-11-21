export default class Board {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.grid = this.createGrid();
    }

    createGrid() {
        return Array.from({ length: this.height }, () => Array(this.width).fill(0));
    }

    reset() {
        this.grid = this.createGrid();
    }

    isValidMove(tetromino, offsetX, offsetY, newShape = null) {
        const shape = newShape || tetromino.shape;
        for (let y = 0; y < shape.length; y++) {
            for (let x = 0; x < shape[y].length; x++) {
                if (shape[y][x]) {
                    const newX = tetromino.x + x + offsetX;
                    const newY = tetromino.y + y + offsetY;

                    // Check bounds
                    if (newX < 0 || newX >= this.width || newY >= this.height) {
                        return false;
                    }

                    // Check collision with locked pieces
                    // Ignore if newY < 0 (above board)
                    if (newY >= 0 && this.grid[newY][newX]) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    lockPiece(tetromino) {
        for (let y = 0; y < tetromino.shape.length; y++) {
            for (let x = 0; x < tetromino.shape[y].length; x++) {
                if (tetromino.shape[y][x]) {
                    const boardY = tetromino.y + y;
                    const boardX = tetromino.x + x;
                    // Only lock if inside the board (handle game over condition separately if needed)
                    if (boardY >= 0 && boardY < this.height) {
                        this.grid[boardY][boardX] = tetromino.color;
                    }
                }
            }
        }
    }

    clearLines() {
        let linesCleared = 0;

        // Filter out full lines
        const newGrid = this.grid.filter(row => {
            const isFull = row.every(cell => cell !== 0);
            if (isFull) linesCleared++;
            return !isFull;
        });

        // Add new empty lines at the top
        while (newGrid.length < this.height) {
            newGrid.unshift(Array(this.width).fill(0));
        }

        this.grid = newGrid;
        return linesCleared;
    }
}
