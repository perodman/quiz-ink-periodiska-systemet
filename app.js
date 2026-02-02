fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('main-container');
        const subject = data.subjects[0];
        document.getElementById('subject-title').textContent = subject.name;

        subject.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'element';
            div.style.gridRow = item.pos[0];
            div.style.gridColumn = item.pos[1];
            
            div.innerHTML = `
                <span class="number">${item.number}</span>
                <span class="symbol">${item.symbol}</span>
            `;

            div.onclick = () => showInfoCard(item);
            container.appendChild(div);
        });
    });

function showInfoCard(item) {
    const overlay = document.getElementById('info-overlay');
    const content = document.getElementById('info-content');
    
    content.innerHTML = `
        <p class="card-symbol">${item.symbol}</p>
        <h2 class="card-name">${item.name}</h2>
        <div class="card-detail"><span>Atomnummer</span> <strong>${item.number}</strong></div>
        <div class="card-detail"><span>Typ</span> <strong>Grundämne</strong></div>
    `;

    overlay.classList.remove('hidden');
}

document.getElementById('close-info').onclick = () => {
    document.getElementById('info-overlay').classList.add('hidden');
};

document.getElementById('info-overlay').onclick = (e) => {
    if (e.target.id === 'info-overlay') {
        document.getElementById('info-overlay').classList.add('hidden');
    }
};
