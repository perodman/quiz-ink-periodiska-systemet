let currentZoom = 0.7;
let currentMode = 'study';
let targetElement = null;
let currentItem = null;
let allElements = [];

const elementFacts = {
    "H": "Väte är universums vanligaste ämne. Det används som bränsle i rymdraketer och för att framställa ammoniak till konstgödsel.",
    "He": "Helium används för att kyla supraledande magneter i MR-kameror och för att få ballonger att sväva.",
    "Li": "Litium är ryggraden i elbilar och smartphones tack vare dess förmåga att lagra mycket energi i lätta batterier.",
    "Be": "Beryllium är extremt styvt och lätt. Det används i rymdteleskop, som James Webb-teleskopet, och i stridsflygplan.",
    "B": "Bor gör glas värmetåligt (Pyrex) och används i bromsvätskor samt som bekämpningsmedel mot myror.",
    "C": "Kol är livets fundament. Det finns i allt från mjuka blyertspennor till världens hårdaste diamant.",
    "N": "Kväve utgör 78% av luften. Flytande kväve används för att frysa mat blixtsnabbt och bevara biologiska prover.",
    "O": "Syre krävs för andning och eld. Det används industriellt för att rena järn till stål.",
    "F": "Fluor är superreaktivt. I form av fluorid stärker det tandemaljen och förhindrar karies i våra tänder.",
    "Ne": "Neon lyser starkt röd-orange när det strömsätts. Det är klassikern i lysande reklamskyltar i storstäder.",
    "Na": "Natrium är en mjuk metall som exploderar i vatten. Tillsammans med klor bildar det vanligt bordssalt.",
    "Mg": "Magnesium brinner med ett bländande vitt ljus. Det används i fyrverkerier och lätta bildelar.",
    "Al": "Aluminium rostar inte och väger lite. Det används i allt från folie och läskburkar till flygplansskrov.",
    "Si": "Kisel är hjärnan i all modern teknik. Utan kiselchips hade vi varken haft datorer eller mobiltelefoner.",
    "P": "Fosfor är livsviktigt för vårt DNA. Det används också i konstgödsel och på plån för tändstickor.",
    "S": "Svavel luktar som ruttna ägg vid förbränning. Det används för att vulkanisera gummi i bildäck.",
    "Cl": "Klor dödar bakterier och används för att hålla badvatten rent samt för att bleka papper.",
    "Ar": "Argon är en ädelgas som skyddar glödtråden i gamla lampor och används vid svetsning.",
    "K": "Kalium behövs för att kroppens nerver och muskler ska fungera. Det finns naturligt i bananer.",
    "Ca": "Kalcium bygger upp våra ben och tänder. Det är också en viktig ingrediens i cement och betong.",
    "Ti": "Titan är lika starkt som stål men mycket lättare. Det används ofta i medicinska implantat.",
    "Fe": "Järn är vår viktigaste industrimetall. Genom att tillsätta kol skapar vi stål.",
    "Ni": "Nickel används främst i rostfritt stål och i laddningsbara batterier.",
    "Cu": "Koppar leder ström fantastiskt bra. Det är den viktigaste metallen i världens elledningar.",
    "Zn": "Zink används för att galvanisera stål och är en viktig ingrediens i solkrämer.",
    "Ag": "Silver leder ström bäst av alla metaller. Det används i elektronik och smycken.",
    "Sn": "Tenn används för att löda komponenter och som skyddande lager i konservburkar.",
    "I": "Jod är livsviktigt för sköldkörteln. Det tillsätts ofta i bordssalt.",
    "W": "Volfram har den högsta smältpunkten av alla metaller och används i borrverktyg.",
    "Pt": "Platina är extremt sällsynt och används i katalysatorer för att rena bilavgaser.",
    "Au": "Guld korroderar aldrig. Det används som värdebevarare och i känslig elektronik.",
    "Hg": "Kvicksilver är flytande vid rumstemperatur. Det är mycket giftigt för miljön.",
    "Pb": "Bly är extremt tungt. Det används som skydd mot röntgenstrålning.",
    "U": "Uran är bränslet i våra kärnkraftverk och innehåller enorma mängder energi.",
    "Pu": "Plutonium är ett konstgjort ämne som används som bränsle i rymdsonder."
};

function startApp(mode) {
    currentMode = mode;
    document.getElementById('start-page').classList.add('hidden');
    document.getElementById('fixed-ui').classList.remove('hidden');
    document.getElementById('viewport').classList.remove('hidden');
    
    const container = document.getElementById('table-container');
    container.classList.remove('quiz-mode-active');
    
    // AKTIVERA UTGRÅNING FÖR QUIZ
    if(mode.includes('quiz')) {
        container.classList.add('quiz-mode-active');
    }

    document.getElementById('current-mode').innerText = 
        mode === 'study' ? "Studera" : 
        mode === 'quiz-symbol' ? "Hitta Symbol" : 
        mode === 'quiz-name' ? "Namnge" : "Snabb-Quiz";
    
    if(mode === 'quiz-symbol') document.getElementById('quiz-bar').classList.remove('hidden');
    else document.getElementById('quiz-bar').classList.add('hidden');

    renderTable();
}

function renderTable() {
    fetch('data.json').then(r => r.json()).then(data => {
        allElements = data.subjects[0].items;
        const container = document.getElementById('table-container');
        container.innerHTML = '';
        
        allElements.forEach(item => {
            const div = document.createElement('div');
            const cat = item.category.toLowerCase().replace(/\s/g, "-");
            div.className = `element ${cat}`;
            div.id = `el-${item.symbol}`;
            div.style.gridRow = item.pos[0];
            div.style.gridColumn = item.pos[1];
            
            let displaySymbol = (currentMode === 'quiz-name') ? '?' : item.symbol;
            
            div.innerHTML = `<span class="number">${item.number}</span><span class="symbol">${displaySymbol}</span>`;
            div.onclick = () => handleElementClick(item);
            container.appendChild(div);
        });

        if(currentMode === 'quiz-symbol') pickNewTarget();
        updateZoom();
    });
}

function handleElementClick(item) {
    if(currentMode === 'quiz-symbol') {
        if(item.symbol === targetElement.symbol) {
            document.getElementById(`el-${item.symbol}`).classList.add('completed');
            pickNewTarget();
        }
    } else {
        showInfo(item);
    }
}

function showInfo(item) {
    currentItem = item;
    const overlay = document.getElementById('overlay');
    const inputArea = document.getElementById('quiz-input-area');
    const multiArea = document.getElementById('multi-choice-area');
    const flipBtn = document.getElementById('flip-btn-text');
    
    overlay.classList.add('active'); // AKTIVERAR POPUP
    document.getElementById('success-overlay').classList.add('hidden');
    document.getElementById('card-inner').classList.remove('is-flipped');
    
    if(currentMode === 'quiz-multi') {
        inputArea.classList.add('hidden');
        multiArea.classList.remove('hidden');
        flipBtn.classList.add('hidden');
        generateChoices(item);
    } else if(currentMode === 'quiz-name') {
        inputArea.classList.remove('hidden');
        multiArea.classList.add('hidden');
        flipBtn.classList.remove('hidden');
    } else {
        inputArea.classList.add('hidden');
        multiArea.classList.add('hidden');
        flipBtn.classList.remove('hidden');
    }

    const cat = item.category.toLowerCase().replace(/\s/g, "-");
    const isDark = ["alkalimetall", "aktinid", "overgangsmetall", "lantanid", "ickemetall"].includes(cat);
    document.getElementById('card-inner').className = `card ${isDark ? "light-text" : "dark-text"}`;
    
    const colors = { ickemetall: "#4ade80", adelgas: "#fde047", alkalimetall: "#f87171", overgangsmetall: "#cbd5e1", halvmetall: "#7dd3fc", lantanid: "#f472b6", aktinid: "#fb7185" };
    document.getElementById('card-f').style.backgroundColor = colors[cat] || "#fff";
    document.getElementById('card-b').style.backgroundColor = colors[cat] || "#fff";

    document.getElementById('front-content').innerHTML = `
        <div class="content-center">
            <p style="font-size:14px; font-weight:800; opacity:0.6; margin:0;">Nr ${item.number}</p>
            <p style="font-size:60px; font-weight:900; margin:10px 0;">${currentMode === 'quiz-name' ? '?' : item.symbol}</p>
            <p style="font-size:22px; font-weight:800; margin:0;">${(currentMode === 'quiz-name' || currentMode === 'quiz-multi') ? '???' : item.name}</p>
        </div>
    `;

    document.getElementById('usage-text').innerText = elementFacts[item.symbol] || "Viktigt grundämne i det periodiska systemet.";
}

function checkGuess() {
    const val = document.getElementById('guest-input').value.trim().toLowerCase();
    if(val === currentItem.name.toLowerCase()) {
        document.getElementById('success-overlay').classList.remove('hidden');
        document.getElementById(`el-${currentItem.symbol}`).classList.add('completed');
        setTimeout(closePopup, 1200);
    }
}

function generateChoices(correctItem) {
    const area = document.getElementById('multi-choice-area');
    area.innerHTML = '';
    let choices = [correctItem.name];
    while(choices.length < 4) {
        let rand = allElements[Math.floor(Math.random() * allElements.length)].name;
        if(!choices.includes(rand)) choices.push(rand);
    }
    choices.sort(() => Math.random() - 0.5);
    choices.forEach(name => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.innerText = name;
        btn.onclick = () => {
            if(name === correctItem.name) {
                btn.classList.add('correct-choice');
                document.getElementById('success-overlay').classList.remove('hidden');
                document.getElementById(`el-${correctItem.symbol}`).classList.add('completed');
                setTimeout(() => { closePopup(); if(currentMode === 'quiz-multi') startMultiQuiz(); }, 1200);
            } else btn.classList.add('wrong-choice');
        };
        area.appendChild(btn);
    });
}

function startMultiQuiz() {
    const randomItem = allElements[Math.floor(Math.random() * allElements.length)];
    showInfo(randomItem);
}

function pickNewTarget() {
    targetElement = allElements[Math.floor(Math.random() * allElements.length)];
    document.getElementById('quiz-question').innerText = `Hitta: ${targetElement.name} (${targetElement.symbol})`;
}

function closePopup() { document.getElementById('overlay').classList.remove('active'); }
function updateZoom() { document.getElementById('table-container').style.transform = `scale(${currentZoom})`; }

document.getElementById('zoom-in').onclick = () => { currentZoom += 0.1; updateZoom(); };
document.getElementById('zoom-out').onclick = () => { if(currentZoom > 0.3) currentZoom -= 0.1; updateZoom(); };
document.getElementById('reset-btn').onclick = () => { currentZoom = 0.7; updateZoom(); };
document.querySelectorAll('.flip-trigger').forEach(btn => btn.onclick = () => document.getElementById('card-inner').classList.toggle('is-flipped'));
