let currentZoom = 1.0;

// UNIK FAKTA FÖR VARJE GRUNDÄMNE
const elementFacts = {
    "H": "Väte är universums vanligaste ämne. Det utgör 75% av all synlig materia och är bränslet som får stjärnor att lysa.",
    "He": "Helium är den näst lättaste ädelgasen. Den används för att lyfta ballonger men också för att kyla supraledare i sjukhusens MR-kameror.",
    "Li": "Litium är en extremt lätt metall. Idag är den 'det vita guldet' som driver våra mobiler, datorer och elbilar genom kraftfulla batterier.",
    "C": "Kol är grunden för allt liv. Det kan vara mjukt som grafit i en blyertspenna eller världens hårdaste material i form av en diamant.",
    "O": "Syre är livsnödvändigt för andningen hos djur och människor. Det är också det vanligaste ämnet i jordskorpan och i våra hav.",
    "Fe": "Järn är metallen som format vår historia. Det är billigt, starkt och finns i allt från spikar till stora broar och skyskrapor.",
    "Au": "Guld är en ädelmetall som aldrig rostar eller tappar sin glans. Det har varit en symbol för rikedom och status i tusentals år.",
    "Cu": "Koppar leder elektricitet fantastiskt bra. Utan kopparledningar i våra väggar skulle vi varken ha ljus eller internet hemma.",
    "Ag": "Silver leder ström bäst av alla metaller. Det används flitigt i solceller, kretskort och exklusiva smycken."
};

const translations = {
    "overgangsmetall": "Övergångsmetall", "ickemetall": "Ickemetall", "adelgas": "Ädelgas",
    "alkalimetall": "Alkalimetall", "alkalisk-jordmetall": "Alkalisk jordmetall",
    "halvmetall": "Halvmetall", "halogen": "Halogen", "lantanid": "Lantanid",
    "aktinid": "Aktinid", "metall": "Metall"
};

// STARTA APPEN FRÅN PORTALEN
function startApp(mode) {
    document.getElementById('start-page').classList.add('hidden');
    document.getElementById('fixed-ui').classList.remove('hidden');
    document.getElementById('viewport').classList.remove('hidden');
    document.getElementById('current-mode').innerText = mode === 'study' ? 'Studera' : 'Quiz';
    renderTable();
}

function renderTable() {
    fetch('data.json').then(r => r.json()).then(data => {
        const container = document.getElementById('table-container');
        container.innerHTML = '';
        data.subjects[0].items.forEach(item => {
            const div = document.createElement('div');
            const cat = item.category.toLowerCase();
            div.className = `element ${cat}`;
            div.style.gridRow = item.pos[0];
            div.style.gridColumn = item.pos[1];
            
            // Kontrast för siffror
            const darkCats = ["alkalimetall", "aktinid", "overgangsmetall", "lantanid"];
            const numClass = darkCats.includes(cat) ? "num-light" : "num-dark";
            
            div.innerHTML = `<span class="number ${numClass}">${item.number}</span><span class="symbol">${item.symbol}</span>`;
            div.onclick = () => showInfo(item);
            container.appendChild(div);
        });
        updateZoom();
    });
}

// ZOOM-MOTOR
function updateZoom() {
    const table = document.getElementById('table-container');
    table.style.transform = `scale(${currentZoom})`;
    // Dynamisk storlek för att tillåta scroll
    table.style.width = `${(18 * 54) + 100}px`;
    table.style.height = `${(10 * 54) + 200}px`;
}

document.getElementById('zoom-in').onclick = () => { currentZoom += 0.2; updateZoom(); };
document.getElementById('zoom-out').onclick = () => { if(currentZoom > 0.4) currentZoom -= 0.2; updateZoom(); };
document.getElementById('reset-btn').onclick = () => { currentZoom = 1.0; updateZoom(); document.getElementById('viewport').scrollTo(0,0); };

// POPUP-HANTERING
function showInfo(item) {
    const overlay = document.getElementById('overlay');
    const cat = item.category.toLowerCase();
    
    // Färgteman
    const colors = { ickemetall: "#4ade80", adelgas: "#fde047", alkalimetall: "#f87171", overgangsmetall: "#cbd5e1", lantanid: "#f472b6", aktinid: "#fb7185" };
    const bgColor = colors[cat] || "#ffffff";
    const isDark = ["alkalimetall", "aktinid", "overgangsmetall", "lantanid"].includes(cat);
    const textClass = isDark ? "light-text" : "dark-text";

    const cardF = document.getElementById('card-f');
    const cardB = document.getElementById('card-b');

    [cardF, cardB].forEach(side => {
        side.style.backgroundColor = bgColor;
        side.className = side.id === 'card-f' ? `card-face card-front ${textClass}` : `card-face card-back ${textClass}`;
    });

    // Framsida innehåll
    document.getElementById('front-content').innerHTML = `
        <p style="font-size:55px; font-weight:900; margin:0;">${item.symbol}</p>
        <p style="font-size:20px; font-weight:700; margin:0; margin-bottom:10px;">${item.name}</p>
        <div class="card-info-box">
            <div class="info-item"><span>Atomnummer</span> <strong>${item.number}</strong></div>
            <div class="info-item"><span>Kategori</span> <strong>${translations[cat] || cat}</strong></div>
        </div>
    `;

    // Baksida innehåll (Unik fakta)
    document.getElementById('usage-text').innerText = elementFacts[item.symbol] || 
        `${item.name} är ett grundämne som spelar en viktig roll inom vetenskap och teknik. Dess atomnummer är ${item.number}.`;
    
    overlay.classList.remove('hidden');
    document.getElementById('card-inner').classList.remove('is-flipped');
}

// Stäng och vänd
document.querySelectorAll('.close-x').forEach(btn => btn.onclick = () => document.getElementById('overlay').classList.add('hidden'));
document.querySelectorAll('.flip-trigger').forEach(btn => btn.onclick = () => document.getElementById('card-inner').classList.toggle('is-flipped'));
