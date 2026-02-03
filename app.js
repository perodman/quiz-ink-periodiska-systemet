let currentData = [];
let currentZoom = 1.0;

const translations = {
    "overgangsmetall": "Övergångsmetall", "ickemetall": "Ickemetall", "adelgas": "Ädelgas",
    "alkalimetall": "Alkalimetall", "alkalisk-jordmetall": "Alkalisk jordmetall",
    "halvmetall": "Halvmetall", "halogen": "Halogen", "lantanid": "Lantanid",
    "aktinid": "Aktinid", "metall": "Metall"
};

// 1. ZOOM-LOGIK
function updateZoom() {
    const container = document.getElementById('table-container');
    container.style.transform = `scale(${currentZoom})`;
    
    // Gör containern större för att möjliggöra scroll (Punkt 2)
    const baseWidth = (18 * 60) + (17 * 4);
    const baseHeight = (10 * 60) + (9 * 4);
    container.style.width = `${baseWidth}px`;
    container.style.height = `${baseHeight}px`;
}

document.getElementById('zoom-in').onclick = () => {
    currentZoom += 0.2;
    updateZoom();
};

document.getElementById('zoom-out').onclick = () => {
    if(currentZoom > 0.4) currentZoom -= 0.2;
    updateZoom();
};

document.getElementById('reset-btn').onclick = () => {
    currentZoom = 1.0;
    updateZoom();
    document.getElementById('viewport').scrollTo(0,0);
};

// 2. RENDERA SYSTEMET
fetch('data.json').then(r => r.json()).then(data => {
    currentData = data.subjects[0].items;
    const table = document.getElementById('table-container');
    
    currentData.forEach(item => {
        const div = document.createElement('div');
        const cat = item.category.toLowerCase();
        div.className = `element ${cat}`;
        div.style.gridRow = item.pos[0];
        div.style.gridColumn = item.pos[1];
        
        const darkCats = ["alkalimetall", "aktinid", "overgangsmetall", "metall", "lantanid"];
        const numClass = darkCats.includes(cat) ? "num-light" : "num-dark";
        
        div.innerHTML = `<span class="number ${numClass}">${item.number}</span><span class="symbol">${item.symbol}</span>`;
        div.onclick = () => showInfo(item);
        table.appendChild(div);
    });
    updateZoom();
});

// 3. POPUP (Punkt 4, 5, 6)
function showInfo(item) {
    const overlay = document.getElementById('overlay');
    const cat = item.category.toLowerCase();
    
    const colors = { ickemetall: "#4ade80", adelgas: "#fde047", alkalimetall: "#f87171", overgangsmetall: "#cbd5e1", lantanid: "#f472b6", aktinid: "#fb7185" };
    const bgColor = colors[cat] || "#fff";
    const isDark = ["alkalimetall", "aktinid", "overgangsmetall"].includes(cat);
    const textClass = isDark ? "light-text" : "dark-text";

    const cardF = document.getElementById('card-f');
    const cardB = document.getElementById('card-b');
    [cardF, cardB].forEach(side => {
        side.style.backgroundColor = bgColor;
        side.className = side.id === 'card-f' ? `card-face card-front ${textClass}` : `card-face card-back ${textClass}`;
    });

    document.getElementById('front-content').innerHTML = `
        <p style="font-size:70px; font-weight:900; margin:0; text-align:center;">${item.symbol}</p>
        <p style="font-size:24px; font-weight:700; margin:0; text-align:center;">${item.name}</p>
        <div class="card-info-box">
            <div class="info-item"><span>Atomnummer</span> <strong>${item.number}</strong></div>
            <div class="info-item"><span>Kategori</span> <strong>${translations[cat] || cat}</strong></div>
        </div>
    `;

    document.getElementById('usage-text').innerText = "Viktigt grundämne för svensk industri och forskning.";
    overlay.classList.remove('hidden');
    document.getElementById('card-inner').classList.remove('is-flipped');
}

// Event-hantering
document.querySelectorAll('.close-x').forEach(btn => btn.onclick = () => document.getElementById('overlay').classList.add('hidden'));
document.querySelectorAll('.flip-trigger').forEach(btn => btn.onclick = () => document.getElementById('card-inner').classList.toggle('is-flipped'));
