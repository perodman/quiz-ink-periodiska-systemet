// Hämta datan från din JSON-fil
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('main-container');
        const subject = data.subjects[0]; // Vi fokuserar på Kemi just nu

        // Uppdatera rubriken
        document.getElementById('subject-title').textContent = subject.name;

        // Rita upp varje element
        subject.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'element';
            
            // Placera elementet i griddet [Rad, Kolumn]
            // Vi använder item.pos[0] för rad och item.pos[1] för kolumn
            div.style.gridRow = item.pos[0];
            div.style.gridColumn = item.pos[1];
            
            // Innehåll i rutan
            div.innerHTML = `
                <span class="number">${item.number}</span>
                <span class="symbol">${item.symbol}</span>
            `;

            // Vad händer när man klickar?
            div.onclick = () => {
                handleElementClick(item);
            };

            container.appendChild(div);
        });
    })
    .catch(error => console.error('Hoppsan! Kunde inte ladda data:', error));

// Funktion för klick - Förberedd för framtida Quiz
function handleElementClick(item) {
    console.log("Klickade på:", item.name);
    alert(`Ämne: ${item.name}\nTecken: ${item.symbol}\nAtomnummer: ${item.number}\n\nSnart startar vi quizet här!`);
}
