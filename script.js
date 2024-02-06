console.log('V1 : Mon dico anglais')


/*

MON PROGRAMME : 

> Je veux pouvoir donner la définition d'un mot à mes utilisateurs

- 1. Récupérer le mot saisi par l'utilisateur
- 2. Envoyer le mot à l'API ( https://dictionaryapi.dev/ )
- 3. Récupérer le JSON (la donnée) en lien avec mon mot
- 4. Afficher les informations de mon mot sur ma page (HTML)
- 5. Ajouter un lecteur pour écouter la prononciation du mot

*/

// Etape 1 : Récuperer mon mot 
const watchSubmit = () => {
const form = document.querySelector("#form")
form.addEventListener("submit", (event) => {
    event.preventDefault()
    const data = new FormData(form)
    const wordToSearch= data.get("search")
    apiCall(wordToSearch)
})
}

// étape 2. Envoyer le mot à l'API
const apiCall = (word) => {
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then((response) => response.json()) // Javascript Objet Notation
        .then((data) => {
            //Etape 3, Récupérer le JSON 
            const informationsNeeded = extractData(data[0])
            renderToHtml(informationsNeeded)
        })
        .catch(() => {
            alert('Le mot demandé n\'existe pas')
        })
}

const extractData = (data) => {
    // 1 - Mot
    const word = data.word
    // 2 - Écriture phonetique
    const phonetic = findProp(data.phonetics, "text")
    // 3 - Prononciation (audio)
    const pronon = findProp(data.phonetics, "audio")
    // 4 - Définition(s)
    const meaning = data.meanings

    return{
        word : word,
        phonetic : phonetic,
        pronon : pronon,
        meaning : meaning
    }
}

const findProp = (array, name) => {
    //Elle parcours un table d'objets
    for(let i = 0; i < array.length; i++){
        //Et cherche dans ce table, si l'objet en cours contient une certaine propiété 
        const currentObject = array[i]
        const hasProp = currentObject.hasOwnProperty(name)
        //Alors elle renvoit cette propiété 
        if(hasProp) return currentObject[name]
    }
}

// étape 4, Afficher les informations de mon mot sur ma page (HTML)
const renderToHtml = (data) => {
    const card = document.querySelector(".js-card")
    card.classList.remove('card--hidden')
    //Manipulation de text avec la propiété textContent
    const title = document.querySelector(".js-card-title")
    title.textContent = data.word
    const phonetic = document.querySelector(".js-card-phonetic")
    phonetic.textContent = data.phonetic

    //Creation d'élements HTML dynamique
    const list = document.querySelector(".js-card-list")
    list.innerHTML=""
    for(let i = 0; i < data.meaning.length; i ++){
        const meaning = data.meaning[i]
        const partOfSpeech = meaning.partOfSpeech
        const definition = meaning.definitions[0].definition
        
        //1 - Avec un innerHTML
        // list.innerHTML += `
        // <li class = "card__meaning">
        //     <p class = "card__part-of-speech">${partOfSpeech}</p>
        //     <p class = "card__definition">${definition}</p>
        // </li>
        // `
        //ATTENTION : lissibilité peut être mauvaise quand on a des gros modules html

        //2 - Avec la creation d'élements
        const li = document.createElement('li')
        li.classList.add('card__meaning')
        const pPartOfSpeech = document.createElement('p')
        pPartOfSpeech.textContent = partOfSpeech
        pPartOfSpeech.classList.add('card__part-of-speech')
        const pDefinition = document.createElement('p')
        pDefinition.textContent = definition
        pDefinition.classList.add('card__definition')
        
        li.appendChild(pPartOfSpeech)
        li.appendChild(pDefinition)
        list.appendChild(li)
    }

    // Ajout de l'audio en js
    const button = document.querySelector(".js-card-button")
    const audio = new Audio(data.pronon)
    button.addEventListener('click', () => {
        button.classList.remove("card__player--off")
        button.classList.add("card__player--on")
        audio.play()
    })
    audio.addEventListener('ended', () => {
        button.classList.remove("card__player--on")
        button.classList.add("card__player--off")
    })
}

//LANCEMENT DU PROGRAMME
watchSubmit()