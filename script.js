//enums 
const states = {
    lang: "lang",
    question: "question",
    summary: "summary",
    perfumes: "perfumes"
}

const gender = {
    male: 3,
    female: 2
}

//variables
let currentState = states.lang;
let currentGender = gender.male;

let currentQuestionNumber = -1;
let countOfQuestions = 6;
let currentLanguage = '';

let answers = [];


function onClickReturnButton() {
    nextPage();
    console.log(currentQuestionNumber);
}

async function initial() {
    //document.querySelector('button.return-btn').onclick = onClickReturnButton;
    setContent();
    countOfQuestions = getCountOfQuestions();
    const questions = await downloadQuestions();
    const selectedQuestions = randomizeQuestions(questions);
}

function setContent() {
    if (currentState != states.lang && currentQuestionNumber >= 2) {
        document.querySelector(".return-btn").style.visibility = "visible";
    }
    else {
        document.querySelector(".return-btn").style.visibility = "hidden";
    }
}

function getCountOfQuestions() {
    if (currentGender == gender.male) {
        return 6;
    }
    return 10;
}

function previousPage() {

}

function nextPage() {
    if (currentState == states.lang) {
        currentState = states.question;

    }
    else if (currentState == states.question) {
        if (currentQuestionNumber != countOfQuestions) {
            return;
        }
        currentState = states.summary
    }
    else if (currentState == states.summary) {
        currentState = states.perfumes;
    }
}

async function downloadQuestions() {
    let selectedQuestions = [];

    await fetch('./questions.json')
        //get data from promise
        .then(data => data.json())
        //manipulate data
        .then(data => {
            let selectedQuestions = [];
            data.forEach(dat => {
                if (dat.Q_GENDER === currentGender) {
                    selectedQuestions.push(dat);
                }
            });
            return selectedQuestions;
        })
        // remove pending
        .then(result => {
            selectedQuestions = result;
        });

    return selectedQuestions;
}

function downloadTextAndReplace(lang) {
    // Fetch the JSON file
    fetch(`${lang}.json`)
        .then(response => response.json())
        .then(data => {
            // Loop through the JSON data
            for (const [key, value] of JSON.parse(data)) {
                // Find all span elements with the matching data-text attribute
                const spans = document.querySelectorAll(`span[data-text=${key}]`); t
                // Replace the text of each span element
                spans.forEach(span => span.textContent = value);
            }
        })
        .catch(error => console.error(error));
}

function randomizeQuestions(questions) {
    let selectedQuestions = [];

    for (let i = 0; i < countOfQuestions; i++) {
        const number = Math.floor(Math.random() * 35);
        selectedQuestions.push(questions[number]);
    }

    return selectedQuestions;
}

async function setLanguage(lang) {
    //download the lang JSON file
    await fetch('lang.{lang}.json')
        .then(response => response.json())
        .then(data => {
            currentLanguage = data;
        })
        .catch(error => console.error(error));
}

Array.from(document.getElementsByClassName('language')).forEach((button) => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        let tempLang = e.target.getAttribute('data-language');
        setLanguage(tempLang);
        
    });
});

//on page load
initial();
