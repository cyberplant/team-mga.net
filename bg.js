// Simulacion de fondo: particulas con gravedad, fusion, envejecimiento y explosiones
// + grid curvado por gravedad (pozo gravitacional)
(function() {
    var canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w, h;

    // --- Configuracion ---
    var INITIAL_COUNT = 120;
    var MIN_SIZE = 1.5;
    var MAX_SIZE = 28;          // umbral de explosion por tamanio
    var SIZE_AGE_THRESHOLD = 15;// a partir de este tamanio, la particula envejece
    var MAX_AGE = 30;           // segundos antes de explotar por vejez
    var G = 0.6;                // constante gravitacional
    var FRICTION = 1.0;         // sin friccion: se mueven siempre
    var BOUNCE = 0.85;          // rebote en bordes
    var EXPLOSION_PIECES = 14;
    var EXPLOSION_FORCE = 8;
    var MAX_PARTICLES = 250;    // limite para performance

    var particles = [];
    var explosions = [];
    var running = false;
    var rafId = null;

    function rand(a, b) { return a + Math.random() * (b - a); }

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    function createParticle(x, y, vx, vy, size, hue) {
        return {
            x: x, y: y,
            vx: vx, vy: vy,
            size: size,
            hue: hue !== undefined ? hue : (Math.random() < 0.7 ? 0 : 1),
            agingStartTime: null
        };
    }

    function resetSim() {
        particles = [];
        explosions = [];
        for (var i = 0; i < INITIAL_COUNT; i++) {
            particles.push(createParticle(
                rand(0, w), rand(0, h),
                rand(-2.5, 2.5), rand(-2.5, 2.5),
                rand(MIN_SIZE, 4),
                Math.random() < 0.7 ? 0 : 1
            ));
        }
    }

    function explode(p) {
        explosions.push({
            x: p.x, y: p.y,
            radius: p.size,
            maxRadius: p.size * 6,
            alpha: 1,
            hue: p.hue
        });

        var pieces = Math.min(EXPLOSION_PIECES, MAX_PARTICLES - particles.length);
        for (var i = 0; i < pieces; i++) {
            var angle = (Math.PI * 2 * i) / pieces + rand(-0.2, 0.2);
            var speed = rand(EXPLOSION_FORCE * 0.5, EXPLOSION_FORCE * 1.5);
            var fragSize = Math.max(MIN_SIZE, p.size / Math.sqrt(pieces) * rand(0.7, 1.3));
            particles.push(createParticle(
                p.x + Math.cos(angle) * p.size,
                p.y + Math.sin(angle) * p.size,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                fragSize,
                p.hue
            ));
        }
    }

    function merge(a, b) {
        var m1 = a.size * a.size;
        var m2 = b.size * b.size;
        var totalM = m1 + m2;
        var newSize = Math.sqrt(totalM);
        var newVx = (a.vx * m1 + b.vx * m2) / totalM;
        var newVy = (a.vy * m1 + b.vy * m2) / totalM;
        var newX = (a.x * m1 + b.x * m2) / totalM;
        var newY = (a.y * m1 + b.y * m2) / totalM;
        var newHue = m1 >= m2 ? a.hue : b.hue;

        a.x = newX; a.y = newY;
        a.vx = newVx; a.vy = newVy;
        a.size = newSize;
        a.hue = newHue;
        if (newSize > SIZE_AGE_THRESHOLD && a.agingStartTime === null) {
            a.agingStartTime = performance.now() / 1000;
        }
        b._dead = true;
    }

    function update() {
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            for (var j = i + 1; j < particles.length; j++) {
                var q = particles[j];
                if (q._dead || p._dead) continue;
                var dx = q.x - p.x;
                var dy = q.y - p.y;
                var distSq = dx * dx + dy * dy;
                var dist = Math.sqrt(distSq);
                var minDist = p.size + q.size;

                if (dist < minDist) {
                    merge(p, q);
                    continue;
                }

                if (dist < 400) {
                    var m1 = p.size * p.size;
                    var m2 = q.size * q.size;
                    var force = G * m1 * m2 / Math.max(distSq, 100);
                    var fx = (dx / dist) * force;
                    var fy = (dy / dist) * force;
                    p.vx += fx / m1;
                    p.vy += fy / m1;
                    q.vx -= fx / m2;
                    q.vy -= fy / m2;
                }
            }
        }

        var alive = [];
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            if (p._dead) continue;

            p.vx *= FRICTION;
            p.vy *= FRICTION;
            p.x += p.vx;
            p.y += p.vy;

            if (p.x - p.size < 0) { p.x = p.size; p.vx = -p.vx * BOUNCE; }
            if (p.x + p.size > w) { p.x = w - p.size; p.vx = -p.vx * BOUNCE; }
            if (p.y - p.size < 0) { p.y = p.size; p.vy = -p.vy * BOUNCE; }
            if (p.y + p.size > h) { p.y = h - p.size; p.vy = -p.vy * BOUNCE; }

            if (p.size >= MAX_SIZE) {
                explode(p);
                continue;
            }

            if (p.size > SIZE_AGE_THRESHOLD && p.agingStartTime === null) {
                p.agingStartTime = performance.now() / 1000;
            }

            if (p.agingStartTime !== null) {
                var age = (performance.now() / 1000) - p.agingStartTime;
                if (age >= MAX_AGE) {
                    explode(p);
                    continue;
                }
            }

            alive.push(p);
        }
        particles = alive;

        for (var i = explosions.length - 1; i >= 0; i--) {
            var e = explosions[i];
            e.radius += (e.maxRadius - e.radius) * 0.15;
            e.alpha *= 0.88;
            if (e.alpha < 0.02) explosions.splice(i, 1);
        }
    }

    function getColor(hue, alpha) {
        return hue === 0
            ? 'rgba(0, 200, 80, ' + alpha + ')'
            : 'rgba(100, 255, 150, ' + alpha + ')';
    }

    function getParticleColor(p, alpha) {
        if (p.agingStartTime === null) {
            return getColor(p.hue, alpha);
        }
        var age = (performance.now() / 1000) - p.agingStartTime;
        var ratio = Math.min(1, age / MAX_AGE);
        var baseR = 255, baseG = (p.hue === 0 ? 102 : 204), baseB = 0;

        if (ratio < 0.4) {
            return 'rgba(' + baseR + ',' + baseG + ',' + baseB + ',' + alpha + ')';
        } else if (ratio < 0.75) {
            var t = (ratio - 0.4) / 0.35;
            var r = Math.round(baseR - (baseR - 200) * t);
            var g = Math.round(baseG - (baseG - 20) * t);
            return 'rgba(' + r + ',' + g + ',0,' + alpha + ')';
        } else {
            var t = (ratio - 0.75) / 0.25;
            var r = Math.round(200 + (255 - 200) * t);
            var g = Math.round(20 + (240 - 20) * t);
            var b = Math.round(200 * t);
            return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
        }
    }

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, w, h);

        // Grid curvado por gravedad
        var gridSize = 40;
        var cols = Math.ceil(w / gridSize) + 1;
        var rows = Math.ceil(h / gridSize) + 1;
        var INFLUENCE_RADIUS = 350;

        var points = [];
        for (var gy = 0; gy < rows; gy++) {
            points[gy] = [];
            for (var gx = 0; gx < cols; gx++) {
                var baseX = gx * gridSize;
                var baseY = gy * gridSize;
                var dx = 0, dy = 0;

                for (var i = 0; i < particles.length; i++) {
                    var p = particles[i];
                    if (p.size < 4) continue;
                    var pdx = baseX - p.x;
                    var pdy = baseY - p.y;
                    var pdist = Math.sqrt(pdx * pdx + pdy * pdy);
                    if (pdist >= INFLUENCE_RADIUS) continue;
                    if (pdist < 3) pdist = 3;
                    var mass = p.size * p.size;
                    var falloff = 1 - (pdist / INFLUENCE_RADIUS);
                    var pull = mass * 0.6 * falloff;
                    pull = Math.min(pull, pdist * 0.7);
                    dx -= (pdx / pdist) * pull;
                    dy -= (pdy / pdist) * pull;
                }

                points[gy][gx] = { x: baseX + dx, y: baseY + dy };
            }
        }

        ctx.strokeStyle = 'rgba(0, 200, 80, 0.05)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (var gy = 0; gy < rows; gy++) {
            ctx.moveTo(points[gy][0].x, points[gy][0].y);
            for (var gx = 1; gx < cols; gx++) {
                ctx.lineTo(points[gy][gx].x, points[gy][gx].y);
            }
        }
        for (var gx = 0; gx < cols; gx++) {
            ctx.moveTo(points[0][gx].x, points[0][gx].y);
            for (var gy = 1; gy < rows; gy++) {
                ctx.lineTo(points[gy][gx].x, points[gy][gx].y);
            }
        }
        ctx.stroke();

        // Explosiones
        for (var i = 0; i < explosions.length; i++) {
            var e = explosions[i];
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
            ctx.strokeStyle = getColor(e.hue, e.alpha * 0.8);
            ctx.lineWidth = 2;
            ctx.stroke();
            var grad = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.radius);
            grad.addColorStop(0, getColor(e.hue, e.alpha * 0.3));
            grad.addColorStop(1, 'rgba(0, 200, 80, 0)');
            ctx.fillStyle = grad;
            ctx.fill();
        }

        // Particulas
        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            var alpha = Math.min(1, 0.3 + p.size / MAX_SIZE * 0.7);
            var pColor = getParticleColor(p, alpha);

            var glowR = p.size * 3;
            var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
            grad.addColorStop(0, getParticleColor(p, alpha * 0.6));
            grad.addColorStop(1, 'rgba(0, 200, 80, 0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = pColor;
            ctx.fill();

            if (p.size > MAX_SIZE * 0.6) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, ' + (alpha * 0.4) + ')';
                ctx.fill();
            }
        }

        // Lineas de conexion
        for (var i = 0; i < particles.length; i++) {
            for (var j = i + 1; j < particles.length; j++) {
                var dx = particles[i].x - particles[j].x;
                var dy = particles[i].y - particles[j].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = 'rgba(0, 200, 80, ' + (0.1 * (1 - dist / 100)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        if (!running) return;
        update();
        draw();
        rafId = requestAnimationFrame(animate);
    }

    // --- API publica para el toggle ---
    window.MGA_bg = {
        start: function() {
            if (running) return;
            running = true;
            if (particles.length === 0) resetSim();
            canvas.style.display = 'block';
            animate();
        },
        stop: function() {
            running = false;
            if (rafId) cancelAnimationFrame(rafId);
            rafId = null;
            canvas.style.display = 'none';
        },
        isRunning: function() { return running; }
    };

    // Click para crear particula (solo si esta corriendo)
    canvas.addEventListener('click', function(e) {
        if (!running) return;
        if (particles.length < MAX_PARTICLES) {
            particles.push(createParticle(
                e.clientX, e.clientY,
                rand(-2, 2), rand(-2, 2),
                rand(3, 8),
                Math.random() < 0.7 ? 0 : 1
            ));
        }
    });

    window.addEventListener('resize', function() {
        resize();
    });

    resize();
})();
