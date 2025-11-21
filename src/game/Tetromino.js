export const SHAPES = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ]
};

export const COLORS = {
    I: '#06b6d4', // cyan-500
    J: '#3b82f6', // blue-500
    L: '#f97316', // orange-500
    O: '#eab308', // yellow-500
    S: '#22c55e', // green-500
    T: '#a855f7', // purple-500
    Z: '#ef4444'  // red-500
};

export default class Tetromino {
    constructor(shapeKey) {
        this.shapeKey = shapeKey;
        this.shape = SHAPES[shapeKey].map(row => [...row]); // Deep copy
        this.color = COLORS[shapeKey];
        this.x = 3; // Start in the middle
        this.y = 0;
    }

    rotate() {
        const N = this.shape.length;
        const newShape = Array.from({ length: N }, () => Array(N).fill(0));

        for (let y = 0; y < N; y++) {
            for (let x = 0; x < N; x++) {
                newShape[x][N - 1 - y] = this.shape[y][x];
            }
        }

        // Basic wall kick / bounds check should be handled by the Board or Game class
        // For now, we just return the new shape to be validated
        return newShape;
    }
}
