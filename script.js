// ==========================
// CONFIGURAÇÕES GERAIS
// (não modificado)
// ==========================
const path = document.getElementById('wave-path');
const headerElement = document.querySelector('.main-header');
const cursor = document.querySelector('.custom-cursor');
const logoContainer = document.querySelector('.logo-container');

let waveMouseX = -100, waveCurrentX = -100, amplitude = 0, targetAmplitude = 0;
const speed = 0.15, waveWidth = 35, maxAmplitude = 16;

let cursorMouseX = window.innerWidth / 2, cursorMouseY = window.innerHeight / 2;
let cursorCurrentX = cursorMouseX, cursorCurrentY = cursorMouseY;
const speedCursor = 0.30;

// ==========================
// SISTEMA DE ONDA
// (não modificado)
// ==========================
headerElement.addEventListener('mousemove', (e) => {
    const rect = headerElement.getBoundingClientRect();
    waveMouseX = ((e.clientX - rect.left) / rect.width) * 1000;
    targetAmplitude = maxAmplitude;
});

headerElement.addEventListener('mouseleave', () => {
    targetAmplitude = 0;
});

function animateWave() {
    waveCurrentX += (waveMouseX - waveCurrentX) * speed;
    amplitude += (targetAmplitude - amplitude) * speed;
   
    let points = [];
    let clipPoints = ["0% 0%", "100% 0%", "100% 100%"];

    for (let x = 1000; x >= 0; x -= 1) { 
        let dist = Math.abs(x - waveCurrentX);
        let offset = amplitude > 0.01 ? amplitude * Math.exp(-Math.pow(dist / (waveWidth / 4), 2)) : 0;
        points.push(`${x},${50 - offset}`);
        let h = headerElement.offsetHeight;
        let yPerc = ((h - (offset * 0.8) + 1) / h) * 100;
        clipPoints.push(`${x/10}% ${yPerc}%`);
    }
    clipPoints.push("0% 100%");

    path.setAttribute('d', `M ${points.join(' L ')}`);
    headerElement.style.clipPath = `polygon(${clipPoints.join(', ')})`;
    
    updateCursorHoverState();
    requestAnimationFrame(animateWave);
}

// ==========================
// CURSOR E COMPONENTES
// (não modificado)
// ==========================
document.addEventListener('mousemove', (e) => {
    cursorMouseX = e.clientX;
    cursorMouseY = e.clientY;
});

function updateCursorHoverState() {
    const rect = headerElement.getBoundingClientRect();
    const mouseYInHeader = cursorMouseY - rect.top;
    const isOverInteractive = document.querySelector('.is-hovering');
    const isNearWaveLine = (mouseYInHeader > rect.height - 30 && mouseYInHeader < rect.height + 60);
    const isOverHeader = headerElement.matches(':hover');

    if (isOverInteractive || (isOverHeader && isNearWaveLine && amplitude > 5)) {
        cursor.classList.add('hover');
    } else {
        cursor.classList.remove('hover');
    }
}

function setupComponentHovers() {
    const elements = document.querySelectorAll('.nav-item, .circle-icon, .btn-small, .btn-link, .logo-box, .logo-container, .contato-email, .job-link, .log-link, .registry-link, .card-os');
    elements.forEach(el => {
        el.addEventListener('mouseenter', () => el.classList.add('is-hovering'));
        el.addEventListener('mouseleave', () => el.classList.remove('is-hovering'));
    });
}

function animateCursor() {
    if (!cursor) return;
    cursorCurrentX += (cursorMouseX - cursorCurrentX) * speedCursor;
    cursorCurrentY += (cursorMouseY - cursorCurrentY) * speedCursor;
    cursor.style.left = `${cursorCurrentX}px`;
    cursor.style.top = `${cursorCurrentY}px`;
    requestAnimationFrame(animateCursor);
}

// ==========================
// BOOT SEQUENCE — novo
// Anima a barra de progresso e troca mensagens de status
// ==========================
function runBootSequence() {
    const overlay = document.getElementById('bootOverlay');
    const progress = document.getElementById('bootProgress');
    const status = document.getElementById('bootStatus');

    const messages = [
        'Initializing kernel...',
        'Loading research modules...',
        'Mounting /VAR/PUBLICATIONS...',
        'Connecting do UFPE node...',
        'Boot complete, WELCOME!',
    ];

    let pct = 0;
    let msgIndex = 0;

    const interval = setInterval(() => {
        pct += Math.random() * 18 + 6;
        if (pct > 100) pct = 100;

        progress.style.width = pct + '%';

        const msgIdx = Math.min(Math.floor((pct / 100) * messages.length), messages.length - 1);
        if (msgIdx !== msgIndex) {
            msgIndex = msgIdx;
            status.textContent = messages[msgIndex];
        }

        if (pct >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                overlay.classList.add('hidden');
                // revelar hero após boot
                document.querySelector('.hero-center').classList.add('visible');
                revealHeroLines();
            }, 500);
        }
    }, 80);
}

// ==========================
// HERO LINES — novo
// Faz as linhas do título aparecerem uma a uma
// ==========================
function revealHeroLines() {
    const lines = document.querySelectorAll('.hero-title-line');
    lines.forEach((line, i) => {
        setTimeout(() => {
            line.classList.add('visible');
        }, i * 160);
    });
}

// ==========================
// CLOCK AO VIVO — novo
// Atualiza o relógio no hero e no footer a cada segundo
// ==========================
function startClock() {
    const sysClockEl = document.getElementById('sysClock');
    const footerClockEl = document.getElementById('footerClock');

    function tick() {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        const time = `${hh}:${mm}:${ss}`;
        const timeShort = `${hh}:${mm}`;

        if (sysClockEl) sysClockEl.textContent = time;
        if (footerClockEl) footerClockEl.textContent = timeShort;
    }

    tick();
    setInterval(tick, 1000);
}

// ==========================
// SCROLL REVEALS — novo
// Elementos com .fade-in aparecem ao entrar na viewport
// ==========================
function setupScrollReveals() {
    // adiciona a classe fade-in nos painéis e seções
    const targets = document.querySelectorAll(
        '.os-panel, .job-card, .param-row, .process-row, .log-entry, .activity-entry, .metric-block, .registry-entry'
    );

    targets.forEach((el, i) => {
        el.classList.add('fade-in');
        // stagger leve por índice dentro do mesmo pai
        el.style.transitionDelay = `${(i % 6) * 0.07}s`;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    targets.forEach(el => observer.observe(el));
}

// ==========================
// CONTADORES ANIMADOS — novo
// Os números nas métricas contam até o valor alvo
// ==========================
function animateCounters() {
    const counters = document.querySelectorAll('.metric-num[data-target]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            const duration = 1200;
            const start = performance.now();

            function step(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // easing out quart
                const eased = 1 - Math.pow(1 - progress, 4);
                el.textContent = String(Math.round(eased * target)).padStart(el.textContent.length, '0');
                if (progress < 1) requestAnimationFrame(step);
            }

            requestAnimationFrame(step);
            observer.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
}

// ==========================
// GSAP LOGO ANIMATION
// (não modificado)
// ==========================
if (logoContainer) {
    gsap.set('.n-arrow-moving', { y: 120 });
    gsap.set('.u-arrow-moving', { y: -120 });

    const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.inOut" }
    });

    tl.to('.n-negative-start, .u-negative-start', { scale: 0, duration: 0.35 });
    tl.to('.n-arrow-moving', { y: -40, duration: 0.6, ease: "back.out(1.2)" }, "-=0.1");
    tl.to('.u-arrow-moving', { y: 40, duration: 0.6, ease: "back.out(1.2)" }, "<");

    logoContainer.addEventListener('mouseenter', () => tl.play());
    logoContainer.addEventListener('mouseleave', () => tl.reverse());
}

// ==========================
// INIT — inicializa tudo
// ==========================
setupComponentHovers();
animateWave();
animateCursor();
startClock();
runBootSequence();

// scroll reveals e contadores após o DOM estar pronto
window.addEventListener('load', () => {
    setupScrollReveals();
    animateCounters();
});

//===========
// CARD voador
//============

const makeDraggable = (element) => {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        // Posição inicial do mouse
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
        element.style.transition = "none";
    }

    function elementDrag(e) {
        e.preventDefault();
        // Calcula o deslocamento
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // Define a nova posição do card
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // Para de mover quando o mouse é solto
        document.onmouseup = null;
        document.onmousemove = null;
        element.style.transition = "box-shadow 0.3s ease, transform 0.3s ease";
    }
}

// Inicializa o arraste no seu card
makeDraggable(document.getElementById("card1"));
// Ativa o movimento para o card da frente
makeDraggable(document.getElementById("card2"));

// DICA EXTRA: Para um card passar à frente do outro ao clicar
const cards = document.querySelectorAll('.card-os');
cards.forEach(card => {
    card.addEventListener('mousedown', () => {
        cards.forEach(c => c.style.zIndex = "10");
        card.style.zIndex = "100";
    });
});
