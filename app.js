let currentData = [];

const translations = {
    "overgangsmetall": "Övergångsmetall", "ickemetall": "Ickemetall", "adelgas": "Ädelgas",
    "alkalimetall": "Alkalimetall", "alkalisk-jordmetall": "Alkalisk jordmetall",
    "halvmetall": "Halvmetall", "halogen": "Halogen", "lantanid": "Lantanid",
    "aktinid": "Aktinid", "metall": "Metall"
};

// 1. SMART SKALNINGSFUNKTION (Löser Punkt 2)
function autoScale() {
    const table = document.getElementById('periodic-table');
    const viewport = document.getElementById('table-viewport');
    
    // Systemets fasta storlek (18 kolumner á 60px + gap)
    const tableWidth = (18 * 60) + (17 * 4);
    const tableHeight = (10 * 60) + (9 * 4);
    
    // Tillgängligt utrymme
    const availW = viewport.clientWidth - 20;
    const availH = viewport.clientHeight - 20;
    
    // Räkna ut bästa skalningsfaktor
    const scale = Math.min(availW / tableWidth, availH / tableHeight);
    
    // Applicera skalning
    table.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', autoScale);

// 2. RENDERA DATA
fetch('data.json').then(r => r.json()).then(data => {
    currentData = data.subjects[0].items;
    const table = document.getElementById('periodic-table');
    
    currentData.forEach(item => {
        const div = document.createElement('div');
        const cat = item.category.toLowerCase();
        div.className = `element ${cat}`;
        div.style.gridRow = item.pos[0];
        div.style.gridColumn = item.pos[1];
        
        // Punkt 3: Kontrast på siffror
        const darkCats = ["alkalimetall", "aktinid", "overgangsmetall", "metall", "lantanid"];
        const numClass = darkCats.includes(cat) ? "num-light" : "num-dark";
        
        div.innerHTML = `<span class="number ${numClass}">${item.number}</span><span class="symbol">${item.symbol}</span>`;
        div.onclick = () => showInfo(item);
        table.appendChild(div);
    });
    
    autoScale(); // Kör skalning efter laddning
});

// 3. POPUP-LOGIK (Punkt 4, 5, 6)
function showInfo(item) {
    const overlay = document.getElementById('overlay');
    const cardF = document.getElementById('card-f');
    const cardB = document.getElementById('card-b');
    const cat = item.category.toLowerCase();
    
    // Färgtema
    const colors = {
        ickemetall: "#4ade80", adelgas: "#fde047", alkalimetall: "#f87171",
        overgangsmetall: "#cbd5e1", lantanid: "#f472b6", aktinid: "#fb7185"
    };
    const bgColor = colors[cat] || "#fff";
    const isDark = ["alkalimetall", "aktinid", "overgangsmetall"].includes(cat);
    const textClass = isDark ? "light-text" : "dark-text";

    [cardF, cardB].forEach(side => {
        side.style.backgroundColor = bgColor;
        side.className = side.id === 'card-f' ? `card-face card-front ${textClass}` : `card-face card-back ${textClass}`;
    });

    // Innehåll Punkt 5 (Centrerat)
    document.getElementById('front-content').innerHTML = `
        <p style="font-size:70px; font-weight:900; margin:0; text-align:center;">${item.symbol}</p>
        <p style="font-size:24px; font-weight:700; margin:0; text-align:center;">${item.name}</p>
        <div class="card-info-box">
            <div class="info-item"><span>Atomnummer</span> <strong>${item.number}</strong></div>
            <div class="info-item"><span>Kategori</span> <strong>${translations[cat] || cat}</strong></div>
        </div>
    `;

    // Innehåll Punkt 6 (Centrerad användning)
    document.getElementById('usage-text').innerText = "Viktigt grundämne i svensk industri.";
    
    overlay.classList.remove('hidden');
    document.getElementById('card-inner').classList.remove('is-flipped');
}

// Kontroller
document.querySelectorAll('.close-x').forEach(btn => {
    btn.onclick = () => document.getElementById('overlay').classList.add('hidden');
});

document.querySelectorAll('.flip-trigger').forEach(btn => {
    btn.onclick = () => document.getElementById('card-inner').classList.toggle('is-flipped');
});

document.getElementById('reset-view').onclick = () => {
    autoScale(); // Tvingar systemet att passa skärmen igen
};
