const collection = db.collection("trivia");
let dbQuestions = [];

async function getCollection() {
  collection
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const item = doc.data();
        item.id = doc.id;
        dbQuestions.push(item);
      });
      initGame();
      dbQuestions = dbQuestions.sort(shuffle);
      function shuffle(a, b) {
        return 0.5 - Math.random();
      }
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

console.log(dbQuestions);

// const dbQuestions = [
// {
//   id: "0001",
//   type: "qcm",
//   question: "Quelle est la capitale du Japon?",
//   answers: ["Paris", "Tokyo", "Dakar", "Rio-de-Janeiro"],
// },
// {
//   id: "0002",
//   type: "qcm",
//   question:
//     "En quelle année s'est achevée la construction de la Tour Eiffel?",
//   answers: ["1829", "1855", "1887", "1901"],
// },
// {
//   id: "0003",
//   type: "qcm",
//   question: "Quelle est l'espérance de vie moyenne d'un moustique commun?",
//   answers: ["12 heures", "3 jours", "7 jours", "2 semaines et demi"],
// },
// {
//   id: "0004",
//   type: "qcm",
//   question:
//     "Laquelle de ces fleurs est comestible et se déguste généralement en salade?",
//   answers: ["Le muguet", "Le laurier-rose", "Le colchique", "La capucine"],
// },
// {
//   id: "0005",
//   type: "qcm",
//   question: "A quels animaux le terme 'Strigiformes' se rapporte-t-il?",
//   answers: ["Hiboux", "Singes", "Tortues", "Mollusques"],
// },
// {
//   id: "0006",
//   type: "qcm",
//   question:
//     "A quel courant artistique rattache-t-on le peintre Edvard Munch?",
//   answers: ["Impressionisme", "Art brut", "Expressionisme", "Symbolisme"],
// },
// {
//   id: "0007",
//   type: "qcm",
//   question: "Qui a, en 1830, inventé la tondeuse à gazon?",
//   answers: [
//     "Edwin Beard Budding",
//     "Alexander Graham Bell",
//     "Tim Berners-Lee",
//     "Nikola Tesla",
//   ],
// },
// {
//   id: "0008",
//   type: "qcm",
//   question: "xxxxxxxxxx",
//   answers: ["aaaaaaa", "bbbbbbb", "ccccccc", "ddddddd"],
// },
// ];

// const dbAnswers = {
//   "0001": 1,
//   "0002": 2,
//   "0003": 2,
//   "0004": 3,
//   "0005": 0,
//   "0006": 2,
//   "0007": 0,
// };

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
    this.index = item.index;
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
    qOptions[this.index].classList.add("questionChoiceLabel--correct");

    if (selectedAnswer !== this.answers[this.index]) {
      currentQuestion = false;
    }

    setTimeout(() => {
      currentQuestion = new Question(dbQuestions[questionIndex]);
      currentQuestion.output();
    }, 2000);
  }
}

let currentQuestion;
let questionIndex = 0;

function initGame() {
  currentQuestion = new Question(dbQuestions[questionIndex]);
  currentQuestion.output();
}

getCollection();

// Answer validation
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

  if (questionIndex !== dbQuestions.length - 1) {
    questionIndex += 1;
  } else {
    questionIndex = 0;
  }
});

// Add new question to DB
function addToDB(item) {
  const newID = dbQuestions.length.toString().padStart(4, "0");
  collection
    .doc(newID)
    .set(item)
    .then((docRef) => {
      console.log("Document written with ID: ", newID);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}
