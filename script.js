// links
/**
 * QR: https://davidshimjs.github.io/qrcodejs/
 * 
 */

//enums 
const statesEnum = {
    lang: "lang",
    gender: "gender",
    question: "questions",
    summary: "summary",
    perfumes: "perfumes"
}

const genderEnum = {
    male: 3,
    female: 2
}

//variables
let currentState = statesEnum.lang;

let currentQuestionNumber = -1;
let countOfQuestions = 6;
let currentLanguage = '';

let questions = [];
const answers = [];

//functions
function initial() {
    setButtons();
    showPage();
}

function setButtons() {
    Array.from(document.getElementsByClassName('language')).forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            let tempLang = e.target.getAttribute('data-language');
            setLanguage(tempLang);
            currentState = statesEnum.gender;
            showPage();
        });
    });

    Array.from(document.getElementsByClassName('gender')).forEach((button) => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const tempGender = e.target.getAttribute('data-gender');
            currentState = statesEnum.question;

            // get count of quesions
            countOfQuestions =
                (tempGender == genderEnum.male)
                    ? 6
                    : 10;

            // random questions
            let selectedQuestions = await downloadQuestions();
            selectedQuestions = filterQuestions(selectedQuestions, tempGender);
            for (let i = 0; i < countOfQuestions; i++) {
                const number = Math.floor(Math.random() * selectedQuestions.length);
                selectedQuestions.push(questions[number]);
            }
            questions = selectedQuestions;
            currentQuestionNumber++;
            generateQuestions();
            showPage();
        });
    });
}

function filterQuestions(questions, gender) {
    const tmp = [];
    questions.forEach(element => {
        if (element.Q_GENDER == genderEnum[gender]) {
            tmp.push(element);
        }
    });
    return tmp;
}

function generateQuestions() {
    //prepare
    const questionGenericElement = document.querySelector('.question');
    questionGenericElement.innerHTML = '';
    const tmpQuestion = questions[currentQuestionNumber];
    
    //generate
    document.querySelector('#txt-title').textContent=tmpQuestion.Q_QUESTION;
    for (let j = 0; j < tmpQuestion.ANSWERS.length; j++) {
        const answer = tmpQuestion.ANSWERS[j];

        const button = genrateAnswerButton(answer.ANS_ID, answer.ANS_IMG, answer.ANS_TEXT);
        questionGenericElement.appendChild(button);
    }
}

function generateAnswers() {
    console.log(answers);
    const questionGenericElement = document.querySelector('.summary > .answers');
    questionGenericElement.innerHTML = '';
    for (let i = 0; i < countOfQuestions; i++) {
        const button = document.createElement("button");

        questionGenericElement.append(button);
    }
}

function genrateAnswerButton(id, imgSrc, pTxt) {
    const button = document.createElement("button");
    button.classList.add('answer-option');
    button.setAttribute("data-answer", id);
    button.style.backgroundImage = `url(${imgSrc})`;

    const p = document.createElement("p");
    p.textContent = pTxt;
    button.appendChild(p);

    button.addEventListener('click', (e) => {
        e.preventDefault();
        const tempAttr = e.target.getAttribute('data-answer');

        answers.push(tempAttr);

        if (answers.length == countOfQuestions) {
            currentState = statesEnum.summary;
            showPage();
            generateAnswers();
        } else {
            currentQuestionNumber++;
            generateQuestions();
        }
    });

    return button;
}

function showPage() {
    const contentChildren = document.querySelectorAll('div#content > div');
    contentChildren.forEach(child => {
        child.style.display = "none";
    });

    const currentStateDiv = document.querySelector(`div[data-state="${currentState}"`);
    currentStateDiv.style.display = "block";
}


async function downloadQuestions() {
    let questionTmp;
    await fetch('./questions.json')
        //get data from promise
        .then(data => data.json())
        //manipulate data
        .then(data => {
            const selectedQuestions = [];
            data.forEach(dat => {
                selectedQuestions.push(dat);
            });

            questionTmp = selectedQuestions;
        });

    return questionTmp;
}

async function setLanguage(lang) {
    //download the lang JSON file
    await fetch(`lang.${lang}.json`)
        .then(response => response.json())
        .then(data => {
            currentLanguage = data;
        })
        .catch(error => console.error(error));
}

//on page load
initial();
