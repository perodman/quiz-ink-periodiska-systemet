let currentData = [];
let currentMode = 'study';

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        currentData = data.subjects[0].items;
        renderGrid(currentData);
    });

function renderGrid(items) {
    const container = document.getElementById('main-container');
    container.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = `element ${item.category}`;
        div.style.gridRow = item.pos[0];
        div.style.gridColumn = item.pos[1];
        div.innerHTML = `<span class="number">${item.number}</span><span class="symbol">${item.symbol}</span>`;
        div.onclick = () => showInfoCard(item);
        container.appendChild(div);
    });
}

function showInfoCard(item) {
    const overlay = document.getElementById('info-overlay');
    
    // Svenska översättningar för kategorier
    const categoryNames = {
        "ickemetall": "Ickemetall",
        "adelgas": "Ädelgas",
        "alkalimetall": "Alkalimetall",
        "alkalisk-jordmetall": "Alkalisk jordmetall",
        "halvmetall": "Halvmetall",
        "halogen": "Halogen",
        "overgangsmetall": "Övergångsmetall",
        "metall": "Metall",
        "lantanid": "Lantanid",
        "aktinid": "Aktinid"
    };

    const catLabel = categoryNames[item.category] || item.category;

    document.getElementById('info-content').innerHTML = `
        <p class="card-symbol">${item.symbol}</p>
        <h2 class="card-name">${item.name}</h2>
        <div class="card-row"><span>Atomnummer</span> <strong>${item.number}</strong></div>
        <div class="card-row"><span>Kategori</span> <strong>${catLabel}</strong></div>
    `;
    overlay.classList.remove('hidden');
    document.getElementById('start-item-quiz').onclick = () => startQuiz(item);
}

// Stängningslogik
const closeInfo = () => {
    document.getElementById('info-overlay').classList.add('hidden');
};

document.getElementById('close-info').onclick = (e) => { e.stopPropagation(); closeInfo(); };
document.getElementById('info-overlay').onclick = (e) => { if(e.target.id === 'info-overlay') closeInfo(); };

// Lägesväljare
document.getElementById('study-mode-btn').onclick = function() {
    currentMode = 'study'; document.body.classList.remove('quiz-mode');
    this.classList.add('active'); document.getElementById('quiz-mode-btn').classList.remove('active');
};
document.getElementById('quiz-mode-btn').onclick = function() {
    currentMode = 'quiz'; document.body.classList.add('quiz-mode');
    this.classList.add('active'); document.getElementById('study-mode-btn').classList.remove('active');
};

// Quiz-logik (Förenklad version för att spara plats)
function startQuiz(targetItem) {
    document.getElementById('info-overlay').classList.add('hidden');
    document.getElementById('quiz-overlay').classList.remove('hidden');
    
    const types = ['name-to-symbol', 'symbol-to-name'];
    const type = types[Math.floor(Math.random() * types.length)];
    let questionText = (type === 'name-to-symbol') ? `Symbol för ${targetItem.name}?` : `Namn på "${targetItem.symbol}"?`;
    let correctAnswer = (type === 'name-to-symbol') ? targetItem.symbol : targetItem.name;

    document.getElementById('quiz-question').innerText = questionText;
    let options = [correctAnswer];
    while(options.length < 4) {
        let r = currentData[Math.floor(Math.random()*currentData.length)];
        let v = (type === 'name-to-symbol') ? r.symbol : r.name;
        if(!options.includes(v)) options.push(v);
    }
    options.sort(() => Math.random() - 0.5);

    const container = document.getElementById('quiz-options');
    container.innerHTML = '';
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => {
            if(opt === correctAnswer) {
                btn.classList.add('correct');
                setTimeout(() => document.getElementById('quiz-overlay').classList.add('hidden'), 600);
            } else {
                btn.classList.add('wrong');
            }
        };
        container.appendChild(btn);
    });
}
document.getElementById('exit-quiz').onclick = () => document.getElementById('quiz-overlay').classList.add('hidden');
