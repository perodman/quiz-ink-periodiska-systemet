let currentData = [];

// Faktadatabas med svenskt fokus
const elementFacts = {
    "H": "Väte är bränslet i våra stjärnor och kan lagra energi i framtidens bilar.",
    "He": "Helium används i ballonger och för att kyla supraledande magneter.",
    "Li": "Litium är en nyckelkomponent i batterier för mobiler och elbilar.",
    "Fe": "Järn är grunden i stål och en viktig del av vårt blod.",
    "Au": "Guld oxiderar aldrig och är en av de bästa ledarna för elektricitet.",
    "Cu": "Koppar används i nästan alla världens elledningar."
};

function adjustScale() {
    const container = document.getElementById('main-container');
    container.style.transform = "scale(1)";
    container.style.marginBottom = "0px";
    
    // Om vi är i liggande läge (Landscape)
    if (window.innerWidth > window.innerHeight) {
        const systemWidth = (18 * 55) + (17 * 4);
        const availableWidth = window.innerWidth - 60; // Mer marginal
        
        if (availableWidth < systemWidth) {
            const scale = availableWidth / systemWidth;
            container.style.transform = `scale(${scale})`;
            
            // Tvinga fram scroll-mån för bottenraderna
            const systemHeight = (10 * 55) + (9 * 4);
            const scaledHeight = systemHeight * scale;
            container.style.marginBottom = `-${systemHeight - scaledHeight + 50}px`;
        }
    }
}

window.addEventListener('resize', adjustScale);
window.addEventListener('orientationchange', () => setTimeout(adjustScale, 300));

fetch('data.json').then(r => r.json()).then(data => {
    currentData = data.subjects[0].items;
    const container = document.getElementById('main-container');
    
    currentData.forEach(item => {
        const div = document.createElement('div');
        const cat = item.category.toLowerCase();
        div.className = `element ${cat}`;
        div.style.gridRow = item.pos[0];
        div.style.gridColumn = item.pos[1];
        
        // Kontrast-logik
        const darkCats = ["alkalimetall", "aktinid", "overgangsmetall", "metall", "lantanid"];
        const numClass = darkCats.includes(cat) ? "num-light" : "num-dark";
        
        div.innerHTML = `<span class="number ${numClass}">${item.number}</span><span class="symbol">${item.symbol}</span>`;
        div.onclick = () => showInfoCard(item);
        container.appendChild(div);
    });
    adjustScale();
});

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

    // Översättningar med Å, Ä, Ö garanterat
    const translations = {
        "overgangsmetall": "Övergångsmetall",
        "ickemetall": "Ickemetall",
        "adelgas": "Ädelgas",
        "alkalimetall": "Alkalimetall",
        "alkalisk-jordmetall": "Alkalisk jordmetall",
        "halvmetall": "Halvmetall",
        "halogen": "Halogen",
        "lantanid": "Lantanid",
        "aktinid": "Aktinid",
        "metall": "Metall"
    };

    document.getElementById('info-content-front').innerHTML = `
        <p class="card-symbol" style="margin:0; text-align:center; font-size:60px; font-weight:900;">${item.symbol}</p>
        <p class="card-name" style="text-align:center; font-size:22px; margin-bottom:20px;">${item.name}</p>
        <div class="card-info-box">
            <div class="info-item"><span>Atomnummer</span> <strong>${item.number}</strong></div>
            <div class="info-item"><span>Kategori</span> <strong>${translations[cat] || cat}</strong></div>
        </div>
    `;

    document.getElementById('usage-text').innerText = elementFacts[item.symbol] || "Används flitigt inom svensk industri och vetenskaplig forskning.";
    document.getElementById('info-overlay').classList.remove('hidden');
    document.getElementById('card-inner').classList.remove('is-flipped');
}

// Event Listeners
document.getElementById('go-to-back').onclick = () => document.getElementById('card-inner').classList.add('is-flipped');
document.getElementById('go-to-front').onclick = () => document.getElementById('card-inner').classList.remove('is-flipped');
document.getElementById('close-info').onclick = () => document.getElementById('info-overlay').classList.add('hidden');
document.getElementById('close-info-back').onclick = () => document.getElementById('info-overlay').classList.add('hidden');

document.getElementById('reset-zoom').onclick = () => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    document.getElementById('grid-wrapper').scrollTo({top: 0, left: 0, behavior: 'smooth'});
    adjustScale();
};
