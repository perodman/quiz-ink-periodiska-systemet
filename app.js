// --- KONFIGURATION & DATA ---
let currentData = [];
let currentMode = 'study';

// En liten databas med praktisk fakta (fyll gärna på med fler!)
const elementFacts = {
    "H": "Bränsle för stjärnor och framtidens miljövänliga bilar.",
    "He": "Används i ballonger och för att kyla supraledare till extremt låga temperaturer.",
    "Li": "Den viktigaste komponenten i moderna uppladdningsbara batterier.",
    "Be": "Används i rymdteleskop och flygplan för att det är lätt men extremt styvt.",
    "B": "Gör glas tåligt mot värme (Pyrex) och finns i tvättmedel.",
    "C": "Livets byggsten - finns i allt från diamanter till din frukostmacka.",
    "N": "Gör upp 78% av luften vi andas och är avgörande för gödsel.",
    "O": "Nödvändigt för allt mänskligt liv och förbränning av bränsle.",
    "F": "Finns i din tandkräm för att stärka emaljen och förhindra hål.",
    "Ne": "Känt för de lysande orange-röda skyltarna i storstäder.",
    "Na": "En del av vanligt bordssalt och livsviktigt för nervsignaler.",
    "Mg": "Ger det starka vita ljuset i fyrverkerier och används i lättviktslegeringar.",
    "Al": "Används i allt från läskburkar till flygplan tack vare sin låga vikt.",
    "Si": "Grunden i alla datorchips och solceller.",
    "P": "Finns i tändstickshuvuden och är en viktig del av vårt DNA.",
    "S": "Används för att vulkanisera gummi (göra bildäck hållbara).",
    "Cl": "Renar våra pooler från bakterier och ingår i koksalt.",
    "K": "Viktigt näringsämne i bananer som hjälper hjärtat att slå.",
    "Ca": "Bygger upp dina ben och tänder, och är huvudingrediens i cement.",
    "Ti": "Ett superstarkt material för kirurgiska implantat och jetmotorer.",
    "Fe": "Grunden i stål - finns i allt från skyskrapor till bilar.",
    "Cu": "Den bästa ledaren för elektricitet i våra elledningar.",
    "Ag": "Används i smycken och som den bästa ledaren för värme.",
    "Au": "Värdefull metall som aldrig rostar, perfekt för smycken och kontakter.",
    "Hg": "Den enda metallen som är flytande vid rumstemperatur.",
    "Pb": "Används som skydd mot röntgenstrålning på sjukhus.",
    "U": "Kraftfull energikälla i kärnkraftverk."
};

// --- INITIALISERING ---
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        currentData = data.subjects[0].items;
        renderGrid(currentData);
    });

// --- RENDERINGS-FUNKTIONER ---
function renderGrid(items) {
    const container = document.getElementById('main-container');
    container.innerHTML = '';
    
    items.forEach(item => {
        const div = document.createElement('div');
        // Använd kategorin från JSON, annars fallback till metall
        const cat = item.category ? item.category.toLowerCase() : 'overgangsmetall';
        div.className = `element ${cat}`;
        
        // Positionering i griddet
        div.style.gridRow = item.pos[0];
        div.style.gridColumn = item.pos[1];
        
        // HTML för elementet
        div.innerHTML = `
            <span class="number">${item.number}</span>
            <span class="symbol">${item.symbol}</span>
        `;
        
        div.onclick = () => showInfoCard(item);
        container.appendChild(div);
    });
}

// --- POPUP-LOGIK (INFO KORT) ---
function showInfoCard(item) {
    const overlay = document.getElementById('info-overlay');
    const cardInner = document.getElementById('card-inner');
    
    // Återställ kortet så det inte är vänt när man öppnar ett nytt
    cardInner.classList.remove('is-flipped');
    
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

    const catLabel = translations[item.category.toLowerCase()] || item.category;

    // Framsidan: Grundläggande info
    document.getElementById('info-content-front').innerHTML = `
        <p class="card-symbol">${item.symbol}</p>
        <p class="card-name">${item.name}</p>
        <div class="card-info-box">
            <div class="info-item"><span>Atomnummer</span> <strong>${item.number}</strong></div>
            <div class="info-item"><span>Kategori</span> <strong>${catLabel}</strong></div>
        </div>
    `;

    // Baksidan: Praktisk användning
    document.getElementById('usage-text').innerText = elementFacts[item.symbol] || "Detta grundämne används flitigt inom modern industri, kemisk forskning och för att skapa avancerade tekniska legeringar.";
    
    overlay.classList.remove('hidden');

    // Koppla Quiz-knappen i popupen
    document.getElementById('start-item-quiz').onclick = (e) => {
        e.stopPropagation();
        startQuiz(item);
    };
}

// --- EVENT LISTENERS FÖR KORT-VÄNDNING & STÄNGNING ---
document.getElementById('go-to-back').onclick = (e) => {
    e.stopPropagation();
    document.getElementById('card-inner').classList.add('is-flipped');
};

document.getElementById('go-to-front').onclick = (e) => {
    e.stopPropagation();
    document.getElementById('card-inner').classList.remove('is-flipped');
};

const closeOverlay = () => {
    document.getElementById('info-overlay').classList.add('hidden');
    document.getElementById('card-inner').classList.remove('is-flipped');
};

document.getElementById('close-info').onclick = closeOverlay;
document.getElementById('close-info-back').onclick = closeOverlay;

// Stäng om man klickar utanför kortet
document.getElementById('info-overlay').onclick = (e) => {
    if (e.target.id === 'info-overlay') closeOverlay();
};

// --- MODES (STUDERA / QUIZ) ---
document.getElementById('study-mode-btn').onclick = function() {
    currentMode = 'study';
    document.body.classList.remove('quiz-mode');
    this.classList.add('active');
    document.getElementById('quiz-mode-btn').classList.remove('active');
};

document.getElementById('quiz-mode-btn').onclick = function() {
    currentMode = 'quiz';
    document.body.classList.add('quiz-mode');
    this.classList.add('active');
    document.getElementById('study-mode-btn').classList.remove('active');
};

// --- QUIZ MOTOR ---
function startQuiz(targetItem) {
    document.getElementById('info-overlay').classList.add('hidden');
    const quizOverlay = document.getElementById('quiz-overlay');
    quizOverlay.classList.remove('hidden');
    
    // Slumpa frågetyp
    const types = ['name-to-symbol', 'symbol-to-name'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let questionText = (type === 'name-to-symbol') 
        ? `Vilken är symbolen för ${targetItem.name}?` 
        : `Vad heter grundämnet med symbolen "${targetItem.symbol}"?`;
        
    let correctAnswer = (type === 'name-to-symbol') ? targetItem.symbol : targetItem.name;

    document.getElementById('quiz-question').innerText = questionText;

    // Skapa svarsalternativ
    let options = [correctAnswer];
    while (options.length < 4) {
        let randomItem = currentData[Math.floor(Math.random() * currentData.length)];
        let val = (type === 'name-to-symbol') ? randomItem.symbol : randomItem.name;
        if (!options.includes(val)) options.push(val);
    }
    
    // Blanda alternativen
    options.sort(() => Math.random() - 0.5);

    const container = document.getElementById('quiz-options');
    container.innerHTML = '';
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => {
            if (opt === correctAnswer) {
                btn.classList.add('correct');
                // Vänta lite innan quizen stängs så man hinner se det gröna
                setTimeout(() => quizOverlay.classList.add('hidden'), 800);
            } else {
                btn.classList.add('wrong');
            }
        };
        container.appendChild(btn);
    });
}

document.getElementById('exit-quiz').onclick = () => {
    document.getElementById('quiz-overlay').classList.add('hidden');
};
