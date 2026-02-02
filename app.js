fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('main-container');
        const subject = data.subjects[0]; // Vi börjar med kemi

        subject.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'element';
            // Placera elementet i griddet baserat på pos [rad, kolumn]
            div.style.gridRow = item.pos[0];
            div.style.gridColumn = item.pos[1];
            
            div.innerHTML = `<span class="symbol">${item.symbol}</span>`;
            container.appendChild(div);
        });
    });
