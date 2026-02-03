let currentZoom = 1.0;
let currentMode = 'study';
let targetElement = null;
let currentItem = null;

// Punkt 2: Specifika beskrivningar för varje grundämne
const elementFacts = {
    "H": "Väte är universums bränsle. Det används i bränsleceller för att skapa ren energi och är en viktig del i produktionen av ammoniak.",
    "He": "Helium är inte bara för ballonger; det är kritiskt för att kyla supraledande magneter i MR-skannrar på sjukhus.",
    "Li": "Litium är hjärtat i den gröna omställningen, som den huvudsakliga komponenten i batterier för elbilar och telefoner.",
    "Be": "Beryllium är lättare än aluminium men starkare än stål. Det används i rymdteleskop som James Webb.",
    "B": "Bor används för att göra glas tåligt mot värme (Pyrex) och är en viktig ingrediens i tvättmedel.",
    "C": "Kol är grunden för allt liv. I industrin används det som allt från stålförstärkning till aktiva filter.",
    "N": "Kväve används för att kyla mat under transport och är den viktigaste komponenten i konstgödsel.",
    "O": "Syre används inom sjukvård för andningshjälp och inom stålindustrin för att bränna bort föroreningar.",
    "F": "Fluor är mest känt för att skydda våra tänder, men används också i tillverkningen av teflonpannor.",
    "Ne": "Neon används främst i belysning och som kylmedel i högspänningsutrustning.",
    "Si": "Kisel är ryggraden i hela datorindustrin. Utan kisel, inga mikrochip eller processorer.",
    "Fe": "Järn är vår absolut vanligaste konstruktionsmetall. Det bygger allt från bilar till skyskrapor."
};

function startApp(mode) {
    currentMode = mode;
    document.getElementById('start-page').classList.add('hidden');
    document.getElementById('fixed-ui').classList.remove('hidden');
    document.getElementById('viewport').classList.remove('hidden');
    
    if(mode === 'quiz-symbol') {
        document.getElementById('quiz-bar').classList.remove('hidden');
        pickNewTarget();
    } else {
        document.getElementById('quiz-bar').classList.add('hidden');
    }
    renderTable();
}

function pickNewTarget() {
    fetch('data.json').then(r => r.json()).then(data => {
        const items = data.subjects[0].items;
        targetElement = items[Math.floor(Math.random() * items.length)];
        document.getElementById('quiz-question').innerText = `Klicka på: ${targetElement.name} (${targetElement.symbol})`;
    });
}

function renderTable() {
    fetch('data.json').then(r => r.json()).then(data => {
        const container = document.getElementById('table-container');
        container.innerHTML = '';
        data.subjects[0].items.forEach(item => {
            const div = document.createElement('div');
            const cat = item.category.toLowerCase().replace(" ", "-");
            div.className = `element ${cat}`;
            div.id = `el-${item.symbol}`;
            div.style.gridRow = item.pos[0];
            div.style.gridColumn = item.pos[1];
            
            let content = `<span class="number">${item.number}</span>`;
            if(currentMode === 'quiz-name') {
                content += `<span class="symbol">?</span>`;
            } else {
                content += `<span class="symbol">${item.symbol}</span>`;
            }
            
            div.innerHTML = content;
            div.onclick = () => handleElementClick(item);
            container.appendChild(div);
        });
        updateZoom();
    });
}

function handleElementClick(item) {
    if(currentMode === 'quiz-symbol') {
        if(item.symbol === targetElement.symbol) {
            document.getElementById(`el-${item.symbol}`).classList.add('correct');
            setTimeout(pickNewTarget, 1000);
        } else {
            document.getElementById(`el-${item.symbol}`).classList.add('wrong');
        }
    } else {
        showInfo(item);
    }
}

function showInfo(item) {
    currentItem = item;
    const overlay = document.getElementById('overlay');
    const inputArea = document.getElementById('quiz-input-area');
    const flipBtn = document.getElementById('flip-btn-text');
    
    if(currentMode === 'quiz-name') {
        inputArea.classList.remove('hidden');
        flipBtn.innerText = "Tjuvkika ➔";
    } else {
        inputArea.classList.add('hidden');
        flipBtn.innerText = "Mer information ➔";
    }

    const cat = item.category.toLowerCase().replace(" ", "-");
    const colors = { ickemetall: "#4ade80", adelgas: "#fde047", alkalimetall: "#f87171", overgangsmetall: "#cbd5e1", halvmetall: "#7dd3fc" };
    const bgColor = colors[cat] || "#ffffff";

    document.getElementById('card-f').style.backgroundColor = bgColor;
    document.getElementById('card-b').style.backgroundColor = bgColor;

    document.getElementById('front-content').innerHTML = `
        <p style="font-size:60px; font-weight:900; margin:0;">${currentMode === 'quiz-name' ? '?' : item.symbol}</p>
        <p style="font-size:22px; font-weight:700; margin:0;">${currentMode === 'quiz-name' ? '???' : item.name}</p>
    `;

    document.getElementById('usage-text').innerHTML = `
        <strong>${item.name} (${item.symbol})</strong><br><br>
        ${elementFacts[item.symbol] || "Används flitigt inom svensk industri och teknisk utveckling."}
    `;
    
    overlay.classList.remove('hidden');
    document.getElementById('card-inner').classList.remove('is-flipped');
}

function checkGuess() {
    const val = document.getElementById('guest-input').value.trim().toLowerCase();
    const el = document.getElementById(`el-${currentItem.symbol}`);
    if(val === currentItem.name.toLowerCase()) {
        el.classList.add('correct');
        el.querySelector('.symbol').innerText = currentItem.symbol;
        document.getElementById('overlay').classList.add('hidden');
        document.getElementById('guest-input').value = "";
    } else {
        alert("Fel svar, försök igen!");
    }
}

function updateZoom() {
    const table = document.getElementById('table-container');
    table.style.transform = `scale(${currentZoom})`;
}

document.getElementById('zoom-in').onclick = () => { currentZoom += 0.1; updateZoom(); };
document.getElementById('zoom-out').onclick = () => { if(currentZoom > 0.5) currentZoom -= 0.1; updateZoom(); };
document.getElementById('reset-btn').onclick = () => { currentZoom = 1.0; updateZoom(); };
document.querySelectorAll('.close-x').forEach(btn => btn.onclick = () => document.getElementById('overlay').classList.add('hidden'));
document.querySelectorAll('.flip-trigger').forEach(btn => btn.onclick = () => document.getElementById('card-inner').classList.toggle('is-flipped'));
