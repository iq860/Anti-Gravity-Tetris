import './style.css';
import Game from './game/Game.js';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const nextCanvas = document.getElementById('next-canvas');
    const holdCanvas = document.getElementById('hold-canvas');

    // UI Elements
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const startBtn = document.getElementById('start-btn');
    const pauseOverlay = document.getElementById('pause-overlay');
    const pauseTitle = document.getElementById('pause-title');
    const resumeBtn = document.getElementById('resume-btn');
    const quitBtn = document.getElementById('quit-btn');

    const game = new Game(canvas, nextCanvas, holdCanvas, {
        onGameOver: (score) => {
            pauseTitle.innerText = 'GAME OVER';
            resumeBtn.innerText = 'TRY AGAIN';
            quitBtn.classList.remove('hidden');
            pauseOverlay.classList.remove('hidden');
        },
        onPause: () => {
            pauseTitle.innerText = 'PAUSED';
            resumeBtn.innerText = 'RESUME';
            quitBtn.classList.remove('hidden');
            pauseOverlay.classList.remove('hidden');
        },
        onResume: () => {
            pauseOverlay.classList.add('hidden');
        }
    });

    // Start Game
    // Start Game
    startBtn.addEventListener('click', () => {
        console.log('Start button clicked');
        try {
            console.log('Hiding start screen, showing game screen');
            startScreen.classList.add('hidden');
            gameScreen.classList.remove('hidden');
            console.log('Resizing game canvas...');
            game.resize();
            console.log('Starting game...');
            game.start();
            console.log('Game started');
        } catch (error) {
            console.error('Error starting game:', error);
            document.getElementById('error-log').innerText = 'Error: ' + error.message + '\n' + error.stack;
        }
    });

    // Resume / Try Again
    resumeBtn.addEventListener('click', () => {
        if (game.isGameOver) {
            game.reset();
            game.start();
            pauseOverlay.classList.add('hidden');
        } else {
            game.togglePause();
        }
    });

    // Quit to Main Menu
    quitBtn.addEventListener('click', () => {
        game.isPaused = false; // Ensure not paused logic remains
        game.isPlaying = false;
        gameScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
        pauseOverlay.classList.add('hidden');
    });

    // Expose game to window for debugging if needed
    window.game = game;
});
