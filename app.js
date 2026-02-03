let currentZoom = 0.75;
let currentMode = 'study';
let targetElement = null;
let currentItem = null;
let allElements = [];

// DEN KOMPLETTA LISTAN - ÅTERSTÄLLD
const elementFacts = {
    "H": "Väte är universums vanligaste grundämne (ca 75%). Det är bränslet i stjärnor och används här på jorden i allt från raketbränsle till att producera ammoniak för konstgödsel.",
    "He": "Helium är den näst lättaste gasen. Den används för att kyla supraledande magneter i MR-kameror och för att fylla ballonger eftersom den är lättare än luft men inte brandfarlig.",
    "Li": "Litium är en mjuk, silvervit metall. Den är mest känd idag för sin roll i uppladdningsbara litiumjonbatterier som driver våra telefoner, bärbara datorer och elbilar.",
    "Be": "Beryllium är en grå, stark och mycket lätt metall. Den används i rymdteleskop (som James Webb) och i flygplan på grund av sin extrema styvhet och stabilitet.",
    "B": "Bor är ett halvmetalliskt grundämne. Det används i borosilikatglas (som Pyrex) för att göra det värmetåligt, och i tvättmedel samt som bekämpningsmedel.",
    "C": "Kol är grundstenen för allt liv på jorden. Det finns som den mjuka grafiten i din blyertspenna, men också som världens hårdaste naturliga material: diamant.",
    "N": "Kväve utgör 78% av jordens atmosfär. Flytande kväve används för att frysa mat och medicinska prover blixtsnabbt, och kväve är livsviktigt i gödningsmedel.",
    "O": "Syre utgör ca 21% av luften. Vi behöver det för att andas, och det krävs för all form av förbränning. I rymden används flytande syre som oxidationsmedel för bränsle.",
    "F": "Fluor är det mest reaktiva av alla grundämnen. Vi möter det oftast som fluorider i tandkräm, där det hjälper till att stärka emaljen och förebygga karies.",
    "Ne": "Neon är en ädelgas som lyser starkt röd-orange när den utsätts för en elektrisk urladdning. Det är den klassiska gasen i neonskyltar.",
    "Na": "Natrium är en extremt mjuk metall som reagerar våldsamt med vatten. Tillsammans med klor bildar den natriumklorid – helt vanligt bordssalt.",
    "Mg": "Magnesium brinner med ett intensivt vitt ljus och används därför i fyrverkerier och nödbloss. Det är också en viktig lättviktiga metall i bildelar.",
    "Al": "Aluminium är den vanligaste metallen i jordskorpan. Den är lätt, stark och rostar inte lätt, vilket gör den perfekt för läskburkar, folie och flygplan.",
    "Si": "Kisel är fundamentet i den moderna digitala världen. Det är en halvledare som används för att tillverka de chips och processorer som finns i all elektronik.",
    "P": "Fosfor finns i tre former: vit, röd och svart. Den röda formen finns på plån på tändsticksaskar. Det är också livsviktigt för att bygga upp vårt DNA.",
    "S": "Svavel är ett gult ickemetalliskt ämne. Det används vid tillverkning av svavelsyra, för att vulkanisera gummi (göra det hårdare) och i krut.",
    "Cl": "Klor är en giftig gulgrön gas i ren form. Det används för att rena dricksvatten och pooler från bakterier, samt som blekmedel i industrin.",
    "Ar": "Argon är en ädelgas som inte reagerar med något. Den används som skyddsgas vid svetsning och inuti glödlampor för att förhindra att glödtråden brinner upp.",
    "K": "Kalium är en metall som är livsviktig för kroppens nervsystem och vätskebalans. Det finns mycket av det i bananer och används i stora mängder som gödsel.",
    "Ca": "Kalcium är den viktigaste metallen för att bygga upp skelett och tänder. Det finns i mjölkprodukter och är en huvudkomponent i cement och gips.",
    "Ti": "Titan är lika starkt som stål men 45% lättare. Det tål korrosion extremt bra och används i jetmotorer, rymdskepp och medicinska implantat.",
    "Fe": "Järn är vår absolut viktigaste metall. Genom att blanda järn med lite kol skapar vi stål, som är ryggraden i alla våra byggnader och maskiner.",
    "Cu": "Koppar har extremt bra elektrisk ledningsförmåga. Därför är det den metall som finns i nästan alla världens elkablar och elmotorer.",
    "Zn": "Zink används främst för att skydda stål mot rost genom galvanisering. Det finns också i våra kroppar och är viktigt för immunförsvaret.",
    "Ag": "Silver leder elektricitet bäst av alla grundämnen. Det används i elektronik, smycken och förr i tiden i fotografisk film.",
    "Au": "Guld är den mest formbara metallen och reagerar nästan aldrig med andra ämnen. Det används som värdebevarare, i smycken och i känslig elektronik.",
    "Hg": "Kvicksilver är den enda metallen som är flytande vid rumstemperatur. Den är mycket giftig och har använts i termometrar och lysrör.",
    "Pb": "Bly är en tung och mjuk metall som stoppar röntgenstrålning effektivt. Det har använts i batterier och ammunition i hundratals år.",
    "U": "Uran är ett tungt, radioaktivt ämne. Det används som bränsle i kärnkraftverk eftersom en liten mängd uran innehåller enorma mängder energi."
};

function startApp(mode) {
    currentMode = mode;
    document.getElementById('start-page').classList.add('hidden');
    document.getElementById('fixed-ui').classList.remove('hidden');
    document.getElementById('viewport').classList.remove('hidden');
    
    const container = document.getElementById('table-container');
    container.classList.remove('quiz-mode');
    
    // Aktivera dimning för alla quiz-lägen så att framsteg syns
    if(mode.startsWith('quiz')) {
        container.classList.add('quiz-mode');
    }

    document.getElementById('current-mode').innerText = 
        mode === 'study' ? "Studera" : 
        mode === 'quiz-symbol' ? "Hitta Symbol" : 
        mode === 'quiz-name' ? "Namnge" : "Snabb-Quiz";
    
    document.getElementById('quiz-bar').classList.toggle('hidden', mode !== 'quiz-symbol');
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
            
            // I "Namnge"-läge döljer vi symbolen med ett frågetecken
            let symbolText = (currentMode === 'quiz-name') ? '?' : item.symbol;
            div.innerHTML = `<span class="number">${item.number}</span><span class="symbol">${symbolText}</span>`;
            
            div.onclick = (e) => {
                e.stopPropagation();
                handleElementClick(item);
            };
            container.appendChild(div);
        });

        if(currentMode === 'quiz-symbol') pickNewTarget();
        if(currentMode === 'quiz-multi') startMultiQuiz();
        updateZoom();
    });
}

function handleElementClick(item) {
    if(currentMode === 'quiz-symbol') {
        if(item.symbol === targetElement.symbol) {
            const el = document.getElementById(`el-${item.symbol}`);
            el.classList.add('completed');
            pickNewTarget();
        }
    } else {
        showInfo(item);
    }
}

function showInfo(item) {
    currentItem = item;
    const overlay = document.getElementById('overlay');
    overlay.classList.add('active');
    
    document.getElementById('success-overlay').classList.add('hidden');
    document.getElementById('card-inner').classList.remove('is-flipped');
    
    // Hantera synlighet för olika quiz-element
    document.getElementById('quiz-input-area').classList.toggle('hidden', currentMode !== 'quiz-name');
    document.getElementById('multi-choice-area').classList.toggle('hidden', currentMode !== 'quiz-multi');
    document.getElementById('flip-btn-text').classList.toggle('hidden', currentMode === 'quiz-multi');

    if(currentMode === 'quiz-multi') generateChoices(item);

    const cat = item.category.toLowerCase().replace(/\s/g, "-");
    const colors = { ickemetall: "#4ade80", adelgas: "#fde047", alkalimetall: "#f87171", overgangsmetall: "#cbd5e1", halvmetall: "#7dd3fc", lantanid: "#f472b6", aktinid: "#fb7185", "alkalisk-jordartsmetall": "#fbbf24" };
    
    document.getElementById('card-f').style.backgroundColor = colors[cat] || "#fff";
    document.getElementById('card-b').style.backgroundColor = colors[cat] || "#fff";
    
    // Mörk text för ljusa bakgrunder
    const isDarkText = ["ickemetall", "adelgas", "overgangsmetall", "halvmetall", "alkalisk-jordartsmetall"].includes(cat);
    document.getElementById('card-inner').className = `card ${isDarkText ? "dark-text" : "light-text"}`;

    document.getElementById('front-content').innerHTML = `
        <div class="content-center">
            <p style="font-size:16px; font-weight:800; opacity:0.6; margin:0;">ATOMNUMMER ${item.number}</p>
            <p style="font-size:80px; font-weight:900; margin:10px 0; letter-spacing:-3px;">${currentMode === 'quiz-name' ? '?' : item.symbol}</p>
            <p style="font-size:28px; font-weight:800; margin:0; text-transform:uppercase;">${(currentMode === 'quiz-name' || currentMode === 'quiz-multi') ? '???' : item.name}</p>
        </div>
    `;
    
    document.getElementById('usage-text').innerText = elementFacts[item.symbol] || "Vi samlar fortfarande in specifik data om detta grundämne. Det används inom industri och forskning för att driva teknologisk utveckling framåt.";
}

function checkGuess() {
    const val = document.getElementById('guest-input').value.trim().toLowerCase();
    if(val === currentItem.name.toLowerCase()) {
        document.getElementById('success-overlay').classList.remove('hidden');
        document.getElementById(`el-${currentItem.symbol}`).classList.add('completed');
        setTimeout(() => { 
            closePopup(); 
            document.getElementById('guest-input').value = ""; 
        }, 1200);
    } else {
        document.getElementById('guest-input').style.borderColor = "#ef4444";
        setTimeout(() => { document.getElementById('guest-input').style.borderColor = "rgba(0,0,0,0.1)"; }, 500);
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
                document.getElementById('success-overlay').classList.remove('hidden');
                document.getElementById(`el-${correctItem.symbol}`).classList.add('completed');
                setTimeout(() => { 
                    closePopup(); 
                    startMultiQuiz(); 
                }, 1200);
            } else {
                btn.style.backgroundColor = "#ef4444";
                btn.style.color = "white";
                btn.style.borderColor = "#ef4444";
            }
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
    document.getElementById('quiz-question').innerHTML = `Hitta: <strong style="color:#3b82f6; font-size:1.2em;">${targetElement.name}</strong> (${targetElement.symbol})`;
}

function closePopup() { 
    document.getElementById('overlay').classList.remove('active'); 
}

function updateZoom() { 
    document.getElementById('table-container').style.transform = `scale(${currentZoom})`; 
}

document.getElementById('zoom-in').onclick = () => { currentZoom += 0.1; updateZoom(); };
document.getElementById('zoom-out').onclick = () => { if(currentZoom > 0.3) currentZoom -= 0.1; updateZoom(); };
document.getElementById('reset-btn').onclick = () => { currentZoom = 0.75; updateZoom(); };

document.querySelectorAll('.flip-trigger').forEach(btn => {
    btn.onclick = () => document.getElementById('card-inner').classList.toggle('is-flipped');
});
