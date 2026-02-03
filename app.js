let currentZoom = 0.7;
let currentMode = 'study';
let targetElement = null;
let currentItem = null;
let allElements = [];

const elementFacts = {
    "H": "Väte är universums vanligaste ämne. Det används som bränsle i rymdraketer och är avgörande för produktion av ammoniak till konstgödsel.",
    "He": "Helium används för att kyla supraledande magneter i MR-kameror på sjukhus, tack vare dess extremt låga kokpunkt.",
    "Li": "Litium är ryggraden i modern bärbar teknik och elbilar tack vare dess förmåga att lagra energi i lätta batterier.",
    "Be": "Beryllium är lättare än aluminium men styvare än stål. Det används i rymdteleskop och stridsflygplan.",
    "B": "Bor gör glas värmetåligt (Pyrex) och är en viktig ingrediens i tvättmedel och neutronabsorbenter.",
    "C": "Kol är livets byggsten. Det bildar allt från mjuka grafitstift i pennor till världens hårdaste diamant.",
    "N": "Kväve utgör 78% av luften vi andas. I flytande form används det för att frysa mat snabbt och för att bevara biologiska prover.",
    "O": "Syre krävs för förbränning och för nästan allt liv. Inom industrin används det för att tillverka stål och plast.",
    "F": "Fluor är det mest reaktiva grundämnet. Det skyddar våra tänder i form av fluorid och används i non-stick beläggningar.",
    "Ne": "Neon ger ett karaktäristiskt röd-orange ljus i urladdningsrör. Det används främst i reklamskyltar.",
    "Na": "Natrium är en mjuk metall som reagerar våldsamt med vatten. Det är en av komponenterna i vanligt bordssalt.",
    "Mg": "Magnesium brinner med ett extremt starkt vitt ljus. Det används i lättviktslegeringar för bilar och flygplan.",
    "Al": "Aluminium är känt för sin låga vikt och korrosionsbeständighet. Det används i allt från läskburkar till flygplansskrov.",
    "Si": "Kisel är fundamentet för modern elektronik. Halvledare gjorda av kisel utgör hjärtat i varje smartphone.",
    "Ti": "Titan är lika starkt som stål men 45% lättare. Det används ofta i medicinska implantat och flygplan.",
    "Fe": "Järn är vår viktigaste metall. Genom att blanda det med kol skapas stål, som bygger upp hela vår infrastruktur.",
    "Cu": "Koppar leder elektricitet fantastiskt bra och är den viktigaste metallen för elledningar.",
    "Au": "Guld oxiderar aldrig och leder ström bra, vilket gör det oumbärligt för tillförlitliga kontakter i datorer.",
    "Pb": "Bly är mycket tätt. Det används som skydd mot röntgenstrålning och i bilbatterier.",
    "U": "Uran är det tyngsta naturliga grundämnet och används som bränsle i kärnkraftverk."
};

function startApp(mode) {
    currentMode = mode;
    document.getElementById('start-page').classList.add('hidden');
    document.getElementById('fixed-ui').classList.remove('hidden');
    document.getElementById('viewport').classList.remove('hidden');
    
    // Punkt 1: Återställ layout (ingen utgråning)
    document.getElementById('table-container').classList.remove('quiz-mode-active');
    document.getElementById('current-mode').innerText = mode === 'study' ? "Studera" : "Quiz";
    
    if(mode === 'quiz-symbol') {
        document.getElementById('quiz-bar').classList.remove('hidden');
        pickNewTarget();
    } else if(mode === 'quiz-multi') {
        document.getElementById('quiz-bar').classList.add('hidden');
        renderTable(); 
        setTimeout(startMultiQuiz, 300);
    } else {
        document.getElementById('quiz-bar').classList.add('hidden');
    }
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
            
            let content = `<span class="number">${item.number}</span>`;
            // I Namnge Ämnet döljer vi symbolen, annars visas den (Hitta Symbolen)
            content += `<span class="symbol">${currentMode === 'quiz-name' ? '?' : item.symbol}</span>`;
            
            div.innerHTML = content;
            div.onclick = () => handleElementClick(item);
            container.appendChild(div);
        });
        updateZoom();
    });
}

function pickNewTarget() {
    targetElement = allElements[Math.floor(Math.random() * allElements.length)];
    document.getElementById('quiz-question').innerText = `Hitta: ${targetElement.name} (${targetElement.symbol})`;
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
    
    document.getElementById('success-overlay').classList.add('hidden');
    document.getElementById('guest-input').value = "";
    
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
    const colors = { ickemetall: "#4ade80", adelgas: "#fde047", alkalimetall: "#f87171", overgangsmetall: "#cbd5e1", halvmetall: "#7dd3fc", lantanid: "#f472b6", aktinid: "#fb7185" };
    const bgColor = colors[cat] || "#ffffff";
    const isDark = ["alkalimetall", "aktinid", "overgangsmetall", "lantanid", "ickemetall"].includes(cat);
    
    document.getElementById('card-f').style.backgroundColor = bgColor;
    document.getElementById('card-b').style.backgroundColor = bgColor;
    document.getElementById('card-inner').className = `card ${isDark ? "light-text" : "dark-text"}`;

    // Punkt 4: Symmetrisk centrerad framsida
    document.getElementById('front-content').innerHTML = `
        <div class="content-center">
            <p style="font-size:14px; font-weight:800; opacity:0.6; margin:0;">Nr ${item.number}</p>
            <p style="font-size:65px; font-weight:900; margin:10px 0;">${currentMode === 'quiz-name' ? '?' : item.symbol}</p>
            <p style="font-size:22px; font-weight:800; margin:0;">${(currentMode === 'quiz-name' || currentMode === 'quiz-multi') ? '???' : item.name}</p>
        </div>
    `;

    document.getElementById('usage-text').innerHTML = `
        <div style="font-weight:900; font-size:18px; margin-bottom:10px;">${item.name}</div>
        ${elementFacts[item.symbol] || "Används inom modern industri och forskning."}
    `;
    
    overlay.classList.add('active'); // Punkt 6: Mjuk animation in
    document.getElementById('card-inner').classList.remove('is-flipped');
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
                btn.classList.add('correct-choice'); // Punkt 5: Grön vid rätt
                document.getElementById('success-overlay').classList.remove('hidden');
                document.getElementById(`el-${correctItem.symbol}`).classList.add('completed');
                setTimeout(() => { closePopup(); startMultiQuiz(); }, 1200);
            } else {
                btn.classList.add('wrong-choice'); // Punkt 5: Röd vid fel
            }
        };
        area.appendChild(btn);
    });
}

function checkGuess() {
    const val = document.getElementById('guest-input').value.trim().toLowerCase();
    const el = document.getElementById(`el-${currentItem.symbol}`);
    if(val === currentItem.name.toLowerCase()) {
        document.getElementById('success-overlay').classList.remove('hidden');
        el.classList.add('completed');
        if(currentMode === 'quiz-name') el.querySelector('.symbol').innerText = currentItem.symbol;
        setTimeout(closePopup, 1200);
    } else {
        document.getElementById('guest-input').style.borderColor = "#ef4444";
        setTimeout(() => document.getElementById('guest-input').style.borderColor = "rgba(0,0,0,0.1)", 1000);
    }
}

function startMultiQuiz() {
    const randomItem = allElements[Math.floor(Math.random() * allElements.length)];
    showInfo(randomItem);
}

function closePopup() {
    const overlay = document.getElementById('overlay');
    overlay.classList.remove('active'); // Punkt 6: Mjuk animation ut
}

function updateZoom() {
    document.getElementById('table-container').style.transform = `scale(${currentZoom})`;
}

document.getElementById('zoom-in').onclick = () => { currentZoom += 0.1; updateZoom(); };
document.getElementById('zoom-out').onclick = () => { if(currentZoom > 0.3) currentZoom -= 0.1; updateZoom(); };
document.getElementById('reset-btn').onclick = () => { currentZoom = 0.7; updateZoom(); };
document.querySelectorAll('.flip-trigger').forEach(btn => btn.onclick = () => document.getElementById('card-inner').classList.toggle('is-flipped'));
