let currentData = [];

// Faktadatabas
const elementFacts = {
    "H": "Väte är universums vanligaste ämne och bränslet i våra stjärnor.",
    "He": "Helium används i allt från festballonger till att kyla magnetröntgen.",
    "Li": "Litium är motorn i den gröna omställningen genom sina batterier.",
    "C": "Kol är grunden för allt liv och finns i både diamanter och grafit.",
    "O": "Syre är livsnödvändigt för andning och utgör en stor del av jordskorpan.",
    "Fe": "Järn har byggt vår civilisation, från vikingatid till moderna skyskrapor."
};

const translations = {
    "overgangsmetall": "Övergångsmetall", "ickemetall": "Ickemetall", "adelgas": "Ädelgas",
    "alkalimetall": "Alkalimetall", "alkalisk-jordmetall": "Alkalisk jordmetall",
    "halvmetall": "Halvmetall", "halogen": "Halogen", "lantanid": "Lantanid",
    "aktinid": "Aktinid", "metall": "Metall"
};

// Ladda in data
fetch('data.json').then(r => r.json()).then(data => {
    currentData = data.subjects[0].items;
    const container = document.getElementById('main-container');
    
    currentData.forEach(item => {
        const div = document.createElement('div');
        const cat = item.category.toLowerCase();
        div.className = `element ${cat}`;
        div.style.gridRow = item.pos[0];
        div.style.gridColumn = item.pos[1];
        
        const darkCats = ["alkalimetall", "aktinid", "overgangsmetall", "metall", "lantanid"];
        const numClass = darkCats.includes(cat) ? "num-light" : "num-dark";
        
        div.innerHTML = `<span class="number ${numClass}">${item.number}</span><span class="symbol">${item.symbol}</span>`;
        div.onclick = () => showInfoCard(item);
        container.appendChild(div);
    });
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
    
    const bgColor = colors[cat] || "#fff";
    const isDark = ["alkalimetall", "aktinid", "metall", "overgangsmetall"].includes(cat);
    const textClass = isDark ? "light-text" : "dark-text";

    [cardF, cardB].forEach(side => {
        side.style.backgroundColor = bgColor;
        side.className = side.id === 'card-f' ? `card-front ${textClass}` : `card-back ${textClass}`;
    });

    // Framsida
    document.getElementById('info-content-front').innerHTML = `
        <p style="font-size:70px; font-weight:900; margin:0; text-align:center;">${item.symbol}</p>
        <p style="font-size:24px; font-weight:700; margin:0; text-align:center;">${item.name}</p>
        <div class="card-info-box">
            <div class="info-item"><span>Atomnummer</span> <strong>${item.number}</strong></div>
            <div class="info-item"><span>Kategori</span> <strong>${translations[cat] || cat}</strong></div>
        </div>
    `;

    // Baksida
    document.getElementById('usage-text').innerText = elementFacts[item.symbol] || "Används flitigt inom modern industri och teknisk utveckling.";
    
    document.getElementById('info-overlay').classList.remove('hidden');
    document.getElementById('card-inner').classList.remove('is-flipped');
}

// RESET-FUNKTION (PUNKT 3)
document.getElementById('reset-zoom').onclick = () => {
    // 1. Återställ scrollposition
    document.getElementById('scroll-viewport').scrollTo({top: 0, left: 0, behavior: 'smooth'});
    
    // 2. Tvinga webbläsaren att nollställa sin hårdvaru-zoom
    const viewport = document.querySelector('meta[name="viewport"]');
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    
    // 3. Släpp begränsningen efter en kort stund så användaren kan zooma igen
    setTimeout(() => {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
    }, 300);
};

// Navigering i popup
document.getElementById('close-info').onclick = () => document.getElementById('info-overlay').classList.add('hidden');
document.getElementById('close-info-back').onclick = () => document.getElementById('info-overlay').classList.add('hidden');
document.getElementById('go-to-back').onclick = () => document.getElementById('card-inner').classList.add('is-flipped');
document.getElementById('go-to-front').onclick = () => document.getElementById('card-inner').classList.remove('is-flipped');
