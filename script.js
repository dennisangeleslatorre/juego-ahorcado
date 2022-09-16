const containerCanvas = document.getElementById('containerCanvas');
const canvas = document.getElementById('canvas');
const secretWord = document.getElementById('secretWord');
const containerInfo = document.getElementById('containerInfo');
const containerSecretWord = document.getElementById('containerSecretWord');
const btnLetters = document.querySelectorAll( "#letters button" );
const resultTitle = document.getElementById('resultTitle');
const message = document.getElementById('message');
//Añadir palabra
const inputWord = document.getElementById('inputWord');
const containerAddWord = document.getElementById('containerAddWord');
const spanResponse = document.getElementById('spanResponse');


let wordSelected;
let hits = 0;
let mistakes = 0;
let context = canvas.getContext('2d');

const words = [
    "Padre",
    "Gaviota",
    "Mesa",
    "Enfermo",
    "Caliente",
    "Llave",
    "Moto",
    "Lavadora",
    "Techo",
    "Sombrero",
    "Verano"
];

const bodyParts = [
    {type: "circle", centerx:120 , centery:36 , radio:12 },
    {type: "line", xi:120, yi:48, xf:120, yf:92},
    {type: "line", xi:120, yi:92, xf:100, yf:132},
    {type: "line", xi:120, yi:92, xf:140, yf:132},
    {type: "line", xi:120, yi:56, xf:100, yf:90},
    {type: "line", xi:120, yi:56, xf:140, yf:90}
];

const drawGallows = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle  = 'black';
	context.beginPath();
    context.moveTo(30, 120);
    context.lineTo(0, 152);
    context.moveTo(60, 152);
    context.lineTo(30, 120);
    context.lineTo(30, 8);
    context.lineTo(120, 8);
    context.lineTo(120, 24);
    context.stroke();
};

//Localstorage
const getWordsAdded= () => {
    let newWords = window.localStorage.getItem('newWords');
    if(newWords) return JSON.parse(newWords);
    return [];
};

const setWordsAdded = (newWord) => {
    window.localStorage.setItem('newWords', JSON.stringify([...getWordsAdded(), newWord]));
};

const selectRandomWord = () => {
    const newWords = getWordsAdded();
    const allWords = [...words,...newWords];
    let randomValue = Math.floor((Math.random() * allWords.length));
    wordSelected = allWords[randomValue].toUpperCase();
};

//Funcion que se usa para iniciar el juego
const startGame = () => {
    //Desaparece la div al iniciar el juego
    containerCanvas.style.display = "block";
    containerInfo.style.display = "none";
    containerSecretWord.style.display = "block";
    //Restablece los valores
    hits = 0;
    mistakes = 0;
    selectRandomWord();
    secretWord.innerHTML = '';
    //Dibuja la horca
    drawGallows();
    //Bucle que recorre los botones del teclado y los habilita
    for( let i = 0; i < btnLetters.length ; i++ ){
        btnLetters[ i ].disabled = false;
    }
    //Bucle que crea el las rayas segu  la palabra
    for( let i = 0; i < wordSelected.length; i++ ){
        const span = document.createElement( 'span' );
        secretWord.appendChild( span );
    }
};

const addBodyPart = (bodyPart) => {
    if(bodyPart.type === "circle") context.arc(bodyPart.centerx, bodyPart.centery, bodyPart.radio, 0, Math.PI*2);
    else {
        context.moveTo(bodyPart.xi, bodyPart.yi);
        context.lineTo(bodyPart.xf, bodyPart.yf);
    }
    context.stroke();
}

const correctLetter = (letter) => {
    const spans = document.querySelectorAll('#secretWord span');
    const wordSelectedLength = wordSelected.length;
    for( let i = 0; i < wordSelectedLength;  i++ ) {
        if(letter === wordSelected[i]){
            spans[i].innerHTML = letter;
            hits++;
        }
    }
    if(hits === wordSelectedLength) gameOver("win");
}

const wrongLetter = () => {
    addBodyPart(bodyParts[mistakes]);
    mistakes++;
    if(mistakes === bodyParts.length) gameOver("lost");
}

const clickLetter = (event) => {
    const letterButtonPressed = event.target;
    letterButtonPressed.disabled = true;

    const letter = letterButtonPressed.innerHTML.toUpperCase();

    if(wordSelected.includes(letter))
        correctLetter(letter);
    else
        wrongLetter();
}

//Agregar un event listener para cada boton
for( let i = 0; i < btnLetters.length; i++ ) btnLetters[i].addEventListener('click', clickLetter);

const gameOver = (gameResult) => {
    for( let i = 0; i < btnLetters.length ; i++ ){
        btnLetters[ i ].disabled = true;
    }
    containerSecretWord.style.display = "none";
    containerInfo.style.display = "flex";
    if(gameResult === "win") {
        resultTitle.innerHTML = "¡GANASTE, FELICIDADES!";
        message.innerHTML = "Felicidades has adivinado la palabra.";
    } else {
        resultTitle.innerHTML = "FIN DEL JUEGO!!!";
        message.innerHTML = `PERDISTE!!!. La palabra era ${wordSelected}`;
    }
}

const showAddWorForm = () => {
    containerInfo.style.display = "none";
    containerSecretWord.style.display = "none";
    containerCanvas.style.display = "none";
    containerAddWord.style.display = "flex";
    spanResponse.innerHTML = "";
}

const backToMenu = () => {
    containerAddWord.style.display = "none";
    containerSecretWord.style.display = "none";
    containerCanvas.style.display = "none";
    containerInfo.style.display = "flex";
    inputWord.value="";
    resultTitle.innerHTML = "Menú";
    message.innerHTML = "";
}

const addWord = () => {
    if ((/^[a-zA-Z\u00f1\u00d1]+$/).test(inputWord.value)) {
        setWordsAdded(inputWord.value);
        spanResponse.innerHTML = "La palabra se agrego correctamente";
        spanResponse.style.color = "green";
    } else {
        spanResponse.innerHTML = "La palabra solo puede contener letras";
        spanResponse.style.color = "red";
    }
    inputWord.value="";
}