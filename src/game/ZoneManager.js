export const ZONE_TYPES = {
    NORMAL: 'NORMAL',
    REVERSE: 'REVERSE', // Gravity goes up
    HEAVY: 'HEAVY',     // Gravity is strong (fast drop)
    ZERO: 'ZERO'        // No gravity (float)
};

export default class ZoneManager {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.zones = [];
        this.timer = 0;
        this.spawnInterval = 10000; // Spawn new zone every 10 seconds
    }

    update(deltaTime) {
        this.timer += deltaTime;

        // Spawn new zones if we have fewer than 2
        if (this.timer > this.spawnInterval && this.zones.length < 2) {
            this.spawnZone();
            this.timer = 0;
        }

        // Update existing zones
        this.zones.forEach(zone => {
            zone.life -= deltaTime;

            // Move zones (vertical and horizontal drift)
            zone.y += zone.speedY * (deltaTime / 1000);
            zone.x += zone.speedX * (deltaTime / 1000);

            // Bounce off vertical walls
            if (zone.y < -2 || zone.y + zone.height > this.height + 2) {
                zone.speedY *= -1;
            }

            // Bounce off horizontal walls
            if (zone.x < -2 || zone.x + zone.width > this.width + 2) {
                zone.speedX *= -1;
            }
        });

        // Remove expired zones
        this.zones = this.zones.filter(zone => zone.life > 0);
    }

    spawnZone() {
        const types = [ZONE_TYPES.REVERSE, ZONE_TYPES.HEAVY, ZONE_TYPES.ZERO];
        const type = types[Math.floor(Math.random() * types.length)];

        // Generate a pixelated cloud shape
        const shape = this.generateCloudShape();
        const zoneWidth = shape.width;
        const zoneHeight = shape.height;

        const x = Math.floor(Math.random() * (this.width - zoneWidth));
        const y = Math.floor(Math.random() * (this.height - zoneHeight));

        // Random behavior: Static or Drifting
        const isStatic = Math.random() > 0.5;
        const speedY = isStatic ? 0 : (Math.random() - 0.5) * 1.5;
        const speedX = isStatic ? 0 : (Math.random() - 0.5) * 1.0;

        this.zones.push({
            type: type,
            x: x,
            y: y,
            width: zoneWidth,
            height: zoneHeight,
            blocks: shape.blocks, // Array of {x, y} relative offsets
            life: 20000,
            speedY: speedY,
            speedX: speedX
        });
    }

    generateCloudShape() {
        const blocks = [];
        const w = Math.floor(Math.random() * 3) + 4; // 4-6 width
        const h = Math.floor(Math.random() * 3) + 3; // 3-5 height

        // Cellular automata-ish generation
        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                // Higher chance of block in center, lower at edges
                const distX = Math.abs(x - w / 2);
                const distY = Math.abs(y - h / 2);
                const prob = 1.0 - (distX / w + distY / h) * 0.8;

                if (Math.random() < prob) {
                    blocks.push({ x, y });
                }
            }
        }
        return { blocks, width: w, height: h };
    }

    getGravityModifier(piece) {
        // Check precise block overlap
        // piece.x/y are grid coordinates. zone.x/y are float coordinates.

        for (const zone of this.zones) {
            // Optimization: Check bounding box first
            if (piece.x + piece.shape[0].length < zone.x || piece.x > zone.x + zone.width ||
                piece.y + piece.shape.length < zone.y || piece.y > zone.y + zone.height) {
                continue;
            }

            // Check individual blocks
            for (let py = 0; py < piece.shape.length; py++) {
                for (let px = 0; px < piece.shape[py].length; px++) {
                    if (piece.shape[py][px]) {
                        const pieceAbsX = piece.x + px;
                        const pieceAbsY = piece.y + py;

                        // Check against all zone blocks
                        for (const zb of zone.blocks) {
                            const zoneAbsX = Math.floor(zone.x + zb.x);
                            const zoneAbsY = Math.floor(zone.y + zb.y);

                            if (pieceAbsX === zoneAbsX && pieceAbsY === zoneAbsY) {
                                return zone.type;
                            }
                        }
                    }
                }
            }
        }
        return ZONE_TYPES.NORMAL;
    }

    reset() {
        this.zones = [];
        this.timer = 0;
    }
}
