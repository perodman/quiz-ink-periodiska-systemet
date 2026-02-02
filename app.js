let currentMode = 'study'; // 'study' eller 'quiz'

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('main-container');
        const subject = data.subjects[0];
        renderGrid(subject.items);
    });

function renderGrid(items) {
    const container = document.getElementById('main-container');
    container.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        
        // Här lägger vi till kategorin som en klass för att få färg!
        // Om item.category inte finns i JSON än, kan vi sätta en standard
        const categoryClass = item.category || 'metall'; 
        div.className = `element ${categoryClass}`;
        
        div.style.gridRow = item.pos[0];
        div.style.gridColumn = item.pos[1];
        div.innerHTML = `<span class="number">${item.number}</span><span class="symbol">${item.symbol}</span>`;
        div.onclick = () => showInfoCard(item);
        container.appendChild(div);
    });
}

// Växla mellan lägen
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

function showInfoCard(item) {
    const overlay = document.getElementById('info-overlay');
    const content = document.getElementById('info-content');
    
    // I Quiz-läge kan vi välja att dölja namnet tills man klickar "Visa"
    // Men här visar vi allt som en snygg sammanfattning
    content.innerHTML = `
        <p class="card-symbol">${item.symbol}</p>
        <h2 class="card-name">${item.name}</h2>
        <div class="card-row"><span>Atomnummer</span> <strong>${item.number}</strong></div>
        <div class="card-row"><span>Kategori</span> <strong>Grundämne</strong></div>
    `;

    overlay.classList.remove('hidden');
}

// Stäng-logik
document.getElementById('close-info').onclick = () => document.getElementById('info-overlay').classList.add('hidden');
document.getElementById('info-overlay').onclick = (e) => {
    if (e.target.id === 'info-overlay') document.getElementById('info-overlay').classList.add('hidden');
};
