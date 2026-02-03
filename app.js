let currentData = [];

// Faktadatabas
const elementFacts = {
    "H": "Bränsle för stjärnor och framtidens bilar.",
    "He": "Används i ballonger och lasersvetsning.",
    "Li": "Hjärtat i batterier för mobiler och elbilar.",
    "Fe": "Huvudbeståndsdelen i stål och vårt blod.",
    "Au": "En ädelmetall som aldrig korroderar.",
    "Cu": "Används i alla våra elkablar för sin ledningsförmåga."
};

// 1. SMART SKALNING & POSITIONERING
function adjustScale() {
    const container = document.getElementById('main-container');
    const wrapper = document.getElementById('grid-wrapper');
    
    // Nollställ för beräkning
    container.style.transform = "scale(1)";
    container.style.width = "fit-content";
    
    // Endast i LIGGANDE läge (Landscape)
    if (window.innerHeight < window.innerWidth) {
        const systemWidth = (18 * 55) + (17 * 4);
        const availableWidth = window.innerWidth - 40; // Marginal
        
        if (availableWidth < systemWidth) {
            const scale = availableWidth / systemWidth;
            container.style.transform = `scale(${scale})`;
            
            // Justera wrapperns scrollbara höjd eftersom scale inte ändrar layout-space
            const systemHeight = (10 * 55) + (9 * 4);
            container.style.marginBottom = `-${systemHeight * (1 - scale)}px`;
            container.style.marginRight = `-${systemWidth * (1 - scale)}px`;
        }
    } else {
        // I STÅENDE läge: nollställ allt
        container.style.transform = "scale(1)";
        container.style.marginBottom = "0px";
        container.style.marginRight = "0px";
    }
}

window.addEventListener('resize', adjustScale);
window.addEventListener('orientationchange', () => setTimeout(adjustScale, 300));

// 2. RENDERA SYSTEMET
fetch('data.json').then(r => r.json()).then(data => {
    currentData = data.subjects[0].items;
    const container = document.getElementById('main-container');
    
    currentData.forEach(item => {
        const div = document.createElement('div');
        const cat = item.category.toLowerCase();
        div.className = `element ${cat}`;
        div.style.gridRow = item.pos[0];
        div.style.gridColumn = item.pos[1];
        
        // Bestäm färg på atomnumret för kontrast
        // Vi använder mörka nummer på ljusa rutor och ljusa nummer på mörka rutor
        const darkCats = ["alkalimetall", "aktinid", "overgangsmetall", "metall"];
        const numClass = darkCats.includes(cat) ? "num-light" : "num-dark";
        
        div.innerHTML = `<span class="number ${numClass}">${item.number}</span><span class="symbol">${item.symbol}</span>`;
        div.onclick = () => showInfoCard(item);
        container.appendChild(div);
    });
    adjustScale();
});

// 3. POPUP FUNKTIONER
function showInfoCard(item) {
    const cardF = document.getElementById('card-f');
    const cardB = document.getElementById('card-b');
    const cat = item.category.toLowerCase();
    
    const colors = {
        ickemetall: "#4ade80", adelgas: "#fde047", alkalimetall: "#f87171",
        "alkalisk-jordmetall": "#fb923c", halvmetall: "#93c5fd", halogen: "#c084fc",
        overgangsmetall: "#cbd5e1", metall: "#94a3b8", lantanid: "#f472b6", aktinid: "#fb7185"
    };
    
    const bgColor = colors[cat] || "#ffffff";
    const isDark = ["alkalimetall", "aktinid", "metall", "overgangsmetall"].includes(cat);
    const textColor = isDark ? "light-text" : "dark-text";

    [cardF, cardB].forEach(side => {
        side.style.backgroundColor = bgColor;
        side.className = side.className.replace(/light-text|dark-text/g, "") + " " + textColor;
    });

    document.getElementById('info-content-front').innerHTML = `
        <p class="card-symbol" style="margin:0; text-align:center; font-size:64px; font-weight:900;">${item.symbol}</p>
        <p class="card-name" style="text-align:center; font-size:22px; margin-bottom:20px;">${item.name}</p>
        <div class="card-info-box">
            <div class="info-item"><span>Atomnummer</span> <strong>${item.number}</strong></div>
            <div class="info-item"><span>Kategori</span> <strong style="text-transform:capitalize;">${cat.replace(/-/g, ' ')}</strong></div>
        </div>
    `;

    document.getElementById('usage-text').innerText = elementFacts[item.symbol] || "Används flitigt inom svensk industri och teknisk utveckling.";
    document.getElementById('info-overlay').classList.remove('hidden');
    document.getElementById('card-inner').classList.remove('is-flipped');
}

// 4. EVENT LISTENERS
document.getElementById('go-to-back').onclick = () => document.getElementById('card-inner').classList.add('is-flipped');
document.getElementById('go-to-front').onclick = () => document.getElementById('card-inner').classList.remove('is-flipped');
document.getElementById('close-info').onclick = () => document.getElementById('info-overlay').classList.add('hidden');
document.getElementById('close-info-back').onclick = () => document.getElementById('info-overlay').classList.add('hidden');

// Återställ Zoom-knapp
document.getElementById('reset-zoom').onclick = () => {
    window.scrollTo(0,0);
    adjustScale();
};

// Mode Switchers
document.getElementById('quiz-mode-btn').onclick = function() {
    document.body.classList.add('quiz-mode');
    this.classList.add('active');
    document.getElementById('study-mode-btn').classList.remove('active');
};
document.getElementById('study-mode-btn').onclick = function() {
    document.body.classList.remove('quiz-mode');
    this.classList.add('active');
    document.getElementById('quiz-mode-btn').classList.remove('active');
};
