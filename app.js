let currentZoom = 1.0;
let currentMode = 'study';

const elementFacts = {
    "H": "Väte är universums vanligaste ämne. Det utgör 75% av all materia och fungerar som bränsle i stjärnor.",
    "He": "Helium används för att kyla supraledare i MR-kameror och för att få ballonger att flyva.",
    "Li": "Litium driver den moderna världen genom batterier i våra mobiler och elbilar.",
    "C": "Kol finns i allt levande, från diamanter till grafiten i din penna.",
    "O": "Syre krävs för cellandning hos djur och människor och utgör en stor del av vatten.",
    "Fe": "Järn är vår viktigaste konstruktionsmetall och finns i vårt blod för att frakta syre.",
    "Au": "Guld oxiderar aldrig och är därför perfekt för elektronik och smycken.",
    "Si": "Kisel är en halvmetall som är grunden för alla datorchip och modern elektronik."
};

function startApp(mode) {
    currentMode = mode;
    document.getElementById('start-page').classList.add('hidden');
    document.getElementById('fixed-ui').classList.remove('hidden');
    document.getElementById('viewport').classList.remove('hidden');
    
    let label = "Studera";
    if(mode === 'quiz-symbol') label = "Hitta Symbolen";
    if(mode === 'quiz-name') label = "Namnge Ämnet";
    document.getElementById('current-mode').innerText = label;
    
    renderTable();
}

function renderTable() {
    fetch('data.json').then(r => r.json()).then(data => {
        const container = document.getElementById('table-container');
        container.innerHTML = '';
        data.subjects[0].items.forEach(item => {
            const div = document.createElement('div');
            const cat = item.category.toLowerCase().replace(" ", "-");
            div.className = `element ${cat}`;
            div.style.gridRow = item.pos[0];
            div.style.gridColumn = item.pos[1];
            
            const isDark = ["alkalimetall", "aktinid", "overgangsmetall", "lantanid", "ickemetall"].includes(cat);
            const numClass = isDark ? "num-light" : "num-dark";
            
            // Punkt 6: Quiz-logik (döljer symbolen om det är namnge-quiz)
            let content = `<span class="number ${numClass}">${item.number}</span>`;
            if(currentMode !== 'quiz-name') {
                content += `<span class="symbol">${item.symbol}</span>`;
            } else {
                content += `<span class="symbol">?</span>`;
            }
            
            div.innerHTML = content;
            div.onclick = () => showInfo(item);
            container.appendChild(div);
        });
        updateZoom();
    });
}

function updateZoom() {
    const table = document.getElementById('table-container');
    table.style.transform = `scale(${currentZoom})`;
    table.style.width = `${(18 * 55) + 100}px`;
    table.style.height = `${(10 * 55) + 200}px`;
}

document.getElementById('zoom-in').onclick = () => { currentZoom += 0.2; updateZoom(); };
document.getElementById('zoom-out').onclick = () => { if(currentZoom > 0.4) currentZoom -= 0.2; updateZoom(); };
document.getElementById('reset-btn').onclick = () => { currentZoom = 1.0; updateZoom(); };

function showInfo(item) {
    const overlay = document.getElementById('overlay');
    const cat = item.category.toLowerCase().replace(" ", "-");
    const colors = { ickemetall: "#4ade80", adelgas: "#fde047", alkalimetall: "#f87171", overgangsmetall: "#cbd5e1", halvmetall: "#7dd3fc", lantanid: "#f472b6", aktinid: "#fb7185" };
    
    const bgColor = colors[cat] || "#ffffff";
    const isDark = ["alkalimetall", "aktinid", "overgangsmetall", "lantanid", "ickemetall"].includes(cat);
    const textClass = isDark ? "light-text" : "dark-text";

    const cardF = document.getElementById('card-f');
    const cardB = document.getElementById('card-b');
    [cardF, cardB].forEach(side => {
        side.style.backgroundColor = bgColor;
        side.className = `card-face ${side.id === 'card-f' ? 'card-front' : 'card-back'} ${textClass}`;
    });

    document.getElementById('front-content').innerHTML = `
        <p style="font-size:60px; font-weight:900; margin:0;">${item.symbol}</p>
        <p style="font-size:22px; font-weight:700; margin:0;">${item.name}</p>
        <div class="card-info-box" style="background: rgba(${isDark ? '255,255,255' : '0,0,0'}, 0.1)">
            <div class="info-item"><span>Atomnummer</span> <strong>${item.number}</strong></div>
        </div>
    `;

    document.getElementById('usage-text').innerText = elementFacts[item.symbol] || `${item.name} används i många olika industriella processer.`;
    
    overlay.classList.remove('hidden');
    document.getElementById('card-inner').classList.remove('is-flipped');
}

document.querySelectorAll('.close-x').forEach(btn => btn.onclick = () => document.getElementById('overlay').classList.add('hidden'));
document.querySelectorAll('.flip-trigger').forEach(btn => btn.onclick = () => document.getElementById('card-inner').classList.toggle('is-flipped'));
