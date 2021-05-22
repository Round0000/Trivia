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

      function shuffle(a, b) {
        return 0.5 - Math.random();
      }
      dbQuestions = dbQuestions.sort(shuffle);

      initGame();
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

console.log(dbQuestions);

const qContainer = document.querySelector(".question");
const qTitle = document.querySelector(".questionTitle");
const qForm = document.querySelector("#questionChoices");
let qOptions;

const btnSubmit = document.querySelector(".submitBtn");
const header = document.querySelector(".header");

const btnHelp = document.querySelector("#btnHelp");
const helpModal = document.querySelector("#helpModal");

btnHelp.addEventListener("click", (e) => {
  helpModal.classList.toggle("d-none");

  const helpModalContent = `
  <h2 id="helpModalQuestion">${currentQuestion.question}</h2>
  <button>Utiliser 5 points pour obtenir un conseil</button>
  <p id="helpMessage" class="messageHidden"></p>`;
  helpModal.innerHTML = helpModalContent;

  const btnUseHelp = document.querySelector("#helpModal button");

  btnUseHelp.addEventListener("click", (e) => {
    currentQuestion.help();
  });
});

header.addEventListener("click", (e) => {
  newQuestionForm.classList.toggle("d-none");
});

class Question {
  constructor(item) {
    this.id = item.id;
    this.type = item.type;
    this.question = item.question;
    this.answers = item.answers;
    this.index = item.index;
    this.tip = item.tip;
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
    } else {
      qContainer.classList.add("question--correct");
    }

    qOptions.forEach((answer) => {
      if (!answer.classList.contains("questionChoiceLabel--correct")) {
        answer.classList.add("questionChoiceLabel--faded");
      }
    });

    qContainer.classList.add("intouchable");

    setTimeout(() => {
      qContainer.classList.remove("question--correct");
      currentQuestion = new Question(dbQuestions[questionIndex]);
      currentQuestion.output();
      qContainer.classList.remove("intouchable");
      helpModal.innerHTML = "";
    }, 2000);
  }

  help() {
    const message = document.querySelector("#helpMessage");
    message.classList.remove("messageHidden");
    setTimeout(() => {
      message.innerText = this.tip;
    }, 500);
  }
}

// Game init
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
  const newID = (dbQuestions.length + 1).toString().padStart(4, "0");
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

const newQuestionForm = document.querySelector("#newQuestionForm");

newQuestionForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newQuestion = {};
  newQuestion.type = e.target.type.value;
  newQuestion.question = e.target.question.value;

  newQuestion.answers = [
    e.target.answer1.value,
    e.target.answer2.value,
    e.target.answer3.value,
    e.target.answer4.value,
  ];
  newQuestion.index = e.target.index.value;
  newQuestion.tip = e.target.tip.value;

  addToDB(newQuestion);
  console.log(newQuestion);

  document.location.reload();
});
