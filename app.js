let currentZoom = 1.0;
let currentMode = 'study';
let targetElement = null;
let currentItem = null;

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
    "Si": "Kisel är fundamentet för modern elektronik. Halvledare gjorda av kisel utgör hjärtat i varje smartphone och dator.",
    "P": "Fosfor är nödvändigt för DNA och benvävnad. Industriellt används det främst i gödningsmedel.",
    "S": "Svavel används för att vulkanisera gummi och för att tillverka svavelsyra, världens mest använda industrikemikalie.",
    "Cl": "Klor är ett effektivt desinfektionsmedel för dricksvatten och simbassänger, och är en viktig del i PVC-plast.",
    "Ar": "Argon används som skyddgas vid svetsning för att förhindra att den heta metallen reagerar med luft.",
    "K": "Kalium är livsviktigt för nervsystemet. Det används i stora mängder som gödsel för att hjälpa växter att växa.",
    "Ca": "Kalcium bygger upp våra tänder och skelett. Det används också som ett legeringsämne för att ta bort föroreningar.",
    "Ti": "Titan är lika starkt som stål men 45% lättare. Det används ofta i medicinska implantat och flygplan.",
    "Cr": "Krom ger rostfritt stål dess glans och motståndskraft mot rost. Det används också för kromning av detaljer.",
    "Mn": "Mangan är avgörande för stålproduktion eftersom det gör stålet hårdare och mer hållbart.",
    "Fe": "Järn är vår viktigaste metall. Genom att blanda det med kol skapas stål, som bygger upp hela vår infrastruktur.",
    "Co": "Kobolt används i slitstarka legeringar och är en nyckelkomponent i batterier för elbilar.",
    "Ni": "Nickel används främst i rostfritt stål och i uppladdningsbara batterier.",
    "Cu": "Koppar leder elektricitet fantastiskt bra och är den viktigaste metallen för elledningar och datorer.",
    "Zn": "Zink används främst för att galvanisera stål, vilket förhindrar rostbildning.",
    "Ga": "Gallium smälter i din hand. Det används främst i halvledare för LED-lampor.",
    "Ge": "Germanium används i fiberoptik, nattkikare och i speciallinser för infrarött ljus.",
    "As": "Arsenik används inom elektronik för att förändra ledningsförmågan hos halvledare.",
    "Se": "Selen är ljuskänsligt och används i fotoceller och solceller.",
    "Br": "Brom används i flamskyddsmedel för att göra plaster mindre brandfarliga.",
    "Kr": "Krypton används i energieffektiva fönster och i högpresterande glödlampor.",
    "Ag": "Silver leder elektricitet bäst av alla grundämnen. Det används i högkvalitativa kontakter och solpaneler.",
    "Sn": "Tenn används för att belägga andra metaller mot korrosion och är en del av lödtenn.",
    "I": "Jod är nödvändigt för sköldkörteln. Inom medicin används det som antiseptiskt medel.",
    "Xe": "Xenon ger ett intensivt vitt ljus och används i bilstrålkastare och jonmotorer.",
    "W": "Volfram har den högsta smältpunkten av alla metaller och används i glödtrådar och borrar.",
    "Au": "Guld oxiderar aldrig och leder ström bra, vilket gör det oumbärligt för tillförlitliga kontakter i datorer.",
    "Hg": "Kvicksilver är den enda metallen som är flytande vid rumstemperatur. Det används i vissa mätinstrument.",
    "Pb": "Bly är mycket tätt. Det används som skydd mot röntgenstrålning och i bilbatterier.",
    "U": "Uran är det tyngsta naturliga grundämnet och används som bränsle i kärnkraftverk."
};

function startApp(mode) {
    currentMode = mode;
    document.getElementById('start-page').classList.add('hidden');
    document.getElementById('fixed-ui').classList.remove('hidden');
    document.getElementById('viewport').classList.remove('hidden');
    
    const modeDisplay = document.getElementById('current-mode');
    modeDisplay.innerText = mode === 'study' ? "Studera" : "Quiz";
    
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
            const cat = item.category.toLowerCase().replace(/\s/g, "-");
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
            setTimeout(pickNewTarget, 800);
        } else {
            const el = document.getElementById(`el-${item.symbol}`);
            el.classList.add('wrong');
            setTimeout(() => el.classList.remove('wrong'), 500);
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

    const cat = item.category.toLowerCase().replace(/\s/g, "-");
    const colors = { ickemetall: "#4ade80", adelgas: "#fde047", alkalimetall: "#f87171", overgangsmetall: "#cbd5e1", halvmetall: "#7dd3fc", lantanid: "#f472b6", aktinid: "#fb7185" };
    const bgColor = colors[cat] || "#ffffff";
    const isDark = ["alkalimetall", "aktinid", "overgangsmetall", "lantanid", "ickemetall"].includes(cat);
    const textClass = isDark ? "light-text" : "dark-text";

    document.getElementById('card-f').style.backgroundColor = bgColor;
    document.getElementById('card-b').style.backgroundColor = bgColor;
    document.getElementById('card-inner').className = `card ${textClass}`;

    document.getElementById('front-content').innerHTML = `
        <p style="font-size:16px; font-weight:800; opacity:0.6; margin:0;">Nr ${item.number}</p>
        <p style="font-size:70px; font-weight:900; margin:5px 0;">${currentMode === 'quiz-name' ? '?' : item.symbol}</p>
        <p style="font-size:24px; font-weight:700; margin:0;">${currentMode === 'quiz-name' ? '???' : item.name}</p>
    `;

    document.getElementById('usage-text').innerHTML = `
        <div style="font-weight:900; font-size:20px; margin-bottom:15px;">${item.name} (${item.symbol})</div>
        ${elementFacts[item.symbol] || "Detta grundämne används flitigt inom specialiserad industri och avancerad forskning."}
    `;
    
    overlay.classList.remove('hidden');
    document.getElementById('card-inner').classList.remove('is-flipped');
}

function checkGuess() {
    const val = document.getElementById('guest-input').value.trim().toLowerCase();
    const el = document.getElementById(`el-${currentItem.symbol}`);
    if(val === currentItem.name.toLowerCase()) {
        el.classList.add('correct');
        if(currentMode === 'quiz-name') el.querySelector('.symbol').innerText = currentItem.symbol;
        document.getElementById('overlay').classList.add('hidden');
        document.getElementById('guest-input').value = "";
    } else {
        const input = document.getElementById('guest-input');
        input.style.borderColor = "red";
        setTimeout(() => input.style.borderColor = "#ccc", 1000);
    }
}

function updateZoom() {
    const table = document.getElementById('table-container');
    table.style.transform = `scale(${currentZoom})`;
}

document.getElementById('zoom-in').onclick = () => { currentZoom += 0.1; updateZoom(); };
document.getElementById('zoom-out').onclick = () => { if(currentZoom > 0.4) currentZoom -= 0.1; updateZoom(); };
document.getElementById('reset-btn').onclick = () => { currentZoom = 1.0; updateZoom(); };
document.querySelectorAll('.close-x').forEach(btn => btn.onclick = () => document.getElementById('overlay').classList.add('hidden'));
document.querySelectorAll('.flip-trigger').forEach(btn => btn.onclick = () => document.getElementById('card-inner').classList.toggle('is-flipped'));
