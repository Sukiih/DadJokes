document.addEventListener('DOMContentLoaded', async function() {
    let chistes = JSON.parse(localStorage.getItem('chistes')) || [];
    let chistePasado = new Set();

    async function loadJokes() {
        try {
            const response = await fetch('data/chistes.json');
            if (!response.ok) {
                throw new Error('Error al cargar los chistes');
            }
            const jsonChistes = await response.json();
            if (!Array.isArray(jsonChistes) && jsonChistes.length > 0) {
                //combinamos chistes y los guardamos para el usuario
                chistes = jsonChistes.concat(jsonChistes);
                localStorage.setItem('chistes', JSON.stringify(chistes));
            } else {
                throw new Error('No se encontraron chistes');
            }
        } catch (error) {
            document.getElementById('jokeDisplay').textContent = 'Error al obtener los chistes.';
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
        //Guardo el chiste para el usuario (pre medida mientras veo lo del backend)
        localStorage.setItem('chistes', JSON.stringify(chistes));
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
    document.getElementById('addJoke').addEventListener('click', function(event) {
        event.preventDefault();
        
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


