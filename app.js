const dbQuestions = [
  {
    id: "0001",
    type: "qcm",
    question: "Quelle est la capitale du Japon?",
    answers: ["Paris", "Tokyo", "Dakar", "Rio-de-Janeiro"],
  },
  {
    id: "0002",
    type: "qcm",
    question:
      "En quelle année s'est achevée la construction de la Tour Eiffel?",
    answers: ["1829", "1855", "1887", "1901"],
  },
  {
    id: "0003",
    type: "qcm",
    question: "Quelle est l'espérance de vie moyenne d'un moustique commun?",
    answers: ["12 heures", "3 jours", "7 jours", "2 semaines et demi"],
  },
  {
    id: "0004",
    type: "qcm",
    question:
      "Laquelle de ces fleurs est comestible et se déguste généralement en salade?",
    answers: ["Le muguet", "Le laurier-rose", "Le colchique", "La capucine"],
  },
];

const dbAnswers = {
  "0001": 1,
  "0002": 2,
  "0003": 2,
  "0004": 3,
};

const qContainer = document.querySelector(".question");
const qTitle = document.querySelector(".questionTitle");
const qForm = document.querySelector("#questionChoices");
let qOptions;
const btnSubmit = document.querySelector(".submitBtn");

class Question {
  constructor(item) {
    this.id = item.id;
    this.type = item.type;
    this.question = item.question;
    this.answers = item.answers;
  }

  output() {
    qTitle.innerText = this.question;
    qForm.innerHTML = "";
    this.answers.forEach((answer) => {
      const num = this.answers.indexOf(answer) + 1;
      const html = `
        <input
        type="radio"
        name="answer"
        class="questionChoiceInput"
        id="option${num}"
        value="${answer}"
        />
        <label for="option${num}" class="questionChoiceLabel">${answer}</label>
      `;

      qForm.innerHTML += html;
      qOptions = document.querySelectorAll(".questionChoiceLabel");
    });
  }

  check(selectedAnswer) {
    qOptions[dbAnswers[this.id]].classList.add("questionChoiceLabel--correct");

    if (selectedAnswer !== this.answers[dbAnswers[this.id]]) {
      currentQuestion = false;
    }

    setTimeout(() => {
      currentQuestion = new Question(shuffledDB[questionIndex]);
      currentQuestion.output();
    }, 2000);
  }
}

let shuffledDB = dbQuestions.sort(shuffle);
function shuffle(a, b) {
  return 0.5 - Math.random();
}

let questionIndex = 0;

qForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (e.target.answer.value) {
    currentQuestion.check(e.target.answer.value);
  }

  if (!currentQuestion) {
    document
      .querySelector(".questionChoiceInput:checked + .questionChoiceLabel")
      .classList.add("questionChoiceLabel--wrong");
  }
  e.target.reset();

  if (questionIndex !== shuffledDB.length - 1) {
    questionIndex += 1;
  } else {
    questionIndex = 0;
  }
});

let currentQuestion = new Question(shuffledDB[questionIndex]);
currentQuestion.output();
