let currentData = [];
let currentMode = 'study';

const elementFacts = {
    "H": "Bränsle för stjärnor och framtidens miljövänliga bilar.",
    "He": "Används i ballonger och för att kyla supraledare.",
    "Li": "Den viktigaste komponenten i moderna uppladdningsbara batterier.",
    "B": "Används i värmetåligt glas och i kontrollstavar i kärnkraftverk.",
    "C": "Livets byggsten - finns i allt från diamanter till din kropp.",
    "Fe": "Grunden i stål - finns i allt från skyskrapor till bilar.",
    "Au": "Värdefull metall som aldrig rostar, perfekt för smycken.",
    "Ti": "Ett superstarkt material för kirurgiska implantat och flygplan.",
    "Cu": "Den bästa ledaren för elektricitet i våra elledningar."
};

// 1. SMART SKALNING
function adjustScale() {
    const container = document.getElementById('main-container');
    const systemWidth = (18 * 55) + (17 * 4) + 40; // Total bredd + padding
    const availableWidth = window.innerWidth;
    
    if (availableWidth < systemWidth) {
        const scale = availableWidth / systemWidth;
        container.style.transform = `scale(${scale})`;
    } else {
        container.style.transform = `scale(1)`;
    }
}

window.addEventListener('resize', adjustScale);

// 2. RENDERA GRID
fetch('data.json').then(r => r.json()).then(data => {
    currentData = data.subjects[0].items;
    const container = document.getElementById('main-container');
    currentData.forEach(item => {
        const div = document.createElement('div');
        div.className = `element ${item.category.toLowerCase()}`;
        div.style.gridRow = item.pos[0];
        div.style.gridColumn = item.pos[1];
        div.innerHTML = `<span class="number">${item.number}</span><span class="symbol">${item.symbol}</span>`;
        div.onclick = () => showInfoCard(item);
        container.appendChild(div);
    });
    adjustScale();
});

// 3. DYNAMISKT FÄRGAT KORT
function showInfoCard(item) {
    const cardF = document.getElementById('card-f');
    const cardB = document.getElementById('card-b');
    const cat = item.category.toLowerCase();
    
    // Hämta färg baserat på kategori
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

    const translations = { "overgangsmetall": "Övergångsmetall", "ickemetall": "Ickemetall", "adelgas": "Ädelgas" };
    const catLabel = translations[cat] || item.category;

    document.getElementById('info-content-front').innerHTML = `
        <p class="card-symbol">${item.symbol}</p>
        <p class="card-name">${item.name}</p>
        <div class="card-info-box">
            <div class="info-item"><span>Atomnummer</span> <strong>${item.number}</strong></div>
            <div class="info-item"><span>Kategori</span> <strong>${catLabel}</strong></div>
        </div>
    `;

    document.getElementById('usage-text').innerText = elementFacts[item.symbol] || "Används inom industri och modern forskning.";
    document.getElementById('info-overlay').classList.remove('hidden');
    document.getElementById('card-inner').classList.remove('is-flipped');
}

// 4. KONTROLLER
document.getElementById('go-to-back').onclick = () => document.getElementById('card-inner').classList.add('is-flipped');
document.getElementById('go-to-front').onclick = () => document.getElementById('card-inner').classList.remove('is-flipped');
const closeAll = () => document.getElementById('info-overlay').classList.add('hidden');
document.getElementById('close-info').onclick = closeAll;
document.getElementById('close-info-back').onclick = closeAll;

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
