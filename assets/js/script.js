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
            //reiniciar chistes
            chistePasado.clear();
            chisteFaltante = chistes;
        }

        const randomIndex = Math.floor(Math.random() * chisteFaltante.length);
        const joke = chisteFaltante[randomIndex];
        chistePasado.add(joke);
        return joke;
    }

    function addJoke(pregunta, respuesta) {
        const newJoke = {
            pregunta: pregunta,
            respuesta: respuesta
        };
        chistes.push(newJoke);
        console.log('Nuevo chiste agregado:', newJoke);
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
            jokeDisplay.textContent = 'No se encontró ningun chiste :C.';
            jokeDisplay.style.display = 'block'; 
        }
    });

    //Agregarchiste usuario
    document.getElementById('addJoke').addEventListener('click', function() {
        const jokeQuestion = document.getElementById('jokeQuestion').value;
        const jokeAnswer = document.getElementById('jokeAnswer').value;

        if (jokeQuestion && jokeAnswer) {
            addJoke(jokeQuestion, jokeAnswer);
            alert('¡Chiste agregado!');
            document.getElementById('jokeQuestion').value = '';
            document.getElementById('jokeAnswer').value = '';
        } else {
            alert('Por favor, completa ambos campos.');
        }
    });

    await loadJokes();
});


