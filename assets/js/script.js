document.addEventListener('DOMContentLoaded', async function() {
    let chistes = [];
    let chistePasado = new Set();

    async function loadJokes() {
        try {
            const response = await fetch('data/chistes.json');
            if (!response.ok) {
                throw new Error('Error al cargar las bromas');
            }
            chistes = await response.json();
            if (!Array.isArray(chistes) || chistes.length === 0) {
                throw new Error('No se encontraron bromas');
            }
        } catch (error) {
            document.getElementById('jokeDisplay').textContent = 'Error al obtener las bromas.';
            console.error('Error:', error);
        }
    }

    function getRandomJoke() {
        if (chistes.length === 0) return null;


        let chisteFaltante = chistes.filter(joke => !chistePasado.has(joke));
        if (chisteFaltante.length === 0) {
            //reinicia bromas
            chistePasado.clear();
            chisteFaltante = chistes;
        }

        const randomIndex = Math.floor(Math.random() * chisteFaltante.length);
        const joke = chisteFaltante[randomIndex];
        chistePasado.add(joke);
        return joke;
    }

    document.getElementById('generateJoke').addEventListener('click', function() {
        const joke = getRandomJoke();
        const jokeDisplay = document.getElementById('jokeDisplay');
        
        if (joke) {
            const jokeHtml = `
                <div class="joke-question">${joke.pregunta}</div>
                <div class="joke-answer">${joke.respuesta}</div>
            `;
            jokeDisplay.innerHTML = jokeHtml;
            jokeDisplay.style.display = 'block'; 
        } else {
            jokeDisplay.textContent = 'No se encontró ninguna broma.';
            jokeDisplay.style.display = 'block'; 
        }
    });


    await loadJokes();
});


