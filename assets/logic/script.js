//Variables = qNumber(null), timer(num), score(num), initials(text)
let timer = 90;
let runningTimer;
let score = 0;
let username = "";
let qNumber;
let finalScore;
const MAX_HIGH_SCORES = 7;

//DOM Objects = START BUTTON, ANSWER BUTTONS, QUESTION CONTAINER, QUESTION ELEMENT
const startButton = document.getElementById("startButton");
const qContainer = document.getElementById("questionsContainer");
const qElement = document.getElementById("question");
const answerButtons = document.getElementById("answers");
const countdown = document.getElementById("timerArea");
const scoreArea = document.getElementById("scoreArea");
const highScoresButton = document.getElementById("showScoresButton");

//LocalStorage Objects
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
//

startButton.addEventListener("click", startGame);
highScoresButton.addEventListener("click", displayScores);

//function to start the game
//called when start button is clicked, should run the function to display questions and the function to start the timer

function startGame() {
  startButton.classList.add("hide");
  scoreArea.classList.add("hide");
  answerButtons.classList.remove("hide");
  qNumber = 0;
  qContainer.classList.remove("hide");
  scoreArea.innerHTML = "";
  startClock();
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
  showQuestion(questions[qNumber]);
}

//function to display the questions
//should load one object from the questions array into the proper html elements, then run the function to collect answers
function showQuestion(question) {
  qElement.innerText = question.question;
  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtons.appendChild(button);
  });
}

//function to start the timer
//should run a countdown that is displayed in the HTML, when time is up, should run the game over function
function startClock() {
  countdown.innerHTML = "Time Remaining: " + timer;
  if (timer <= 0) {
    gameOver();
  } else {
    timer -= 1;
    runningTimer = setTimeout(startClock, 1000);
  }
}

//function to collect answers
//should listen for what answer the user clicks on, compare it to the correct answer, and decrease the timer if wrong. should then run the next question function
//unless the current question is the last, then it should run the game over function
function selectAnswer(e) {
  const selectedButton = e.target;
  if (!selectedButton.dataset.correct) {
    timer = timer - 10;
    console.log(timer);
  }
  if (qNumber == questions.length - 1) {
    gameOver();
  } else {
    clearQuestion();
    qNumber++;
    showQuestion(questions[qNumber]);
    console.log(score);
  }
}

//function to clear the current question
//should empty the HTML elements that are occupied with the currently displayed question
function clearQuestion() {
  while (answerButtons.firstChild) {
    answerButtons.removeChild(answerButtons.firstChild);
  }
}

//function for game over
//should grab the current time remaining and set it as the score, hide the questions area, display the score to the user, and give them the chance to try again or submit
//their high scores via a text box for intials and the high scores function
function gameOver() {
  clearInterval(runningTimer);
  countdown.innerHTML = "Finished";
  clearQuestion();
  showResults();
  startButton.innerText = "Restart";
  startButton.classList.remove("hide");
  timer = 90;
  score = 0;
}

function showResults() {
  finalScore = timer;
  if (finalScore < 0) {
    finalScore = 0;
  }
  qElement.innerText = "";
  scoreArea.classList.remove("hide");
  answerButtons.classList.add("hide");
  scoreArea.innerHTML = `Your score is ${finalScore}!<div id="init">Name: <input type="text" name="initials" id="initials" placeholder="Enter Your Name"><button id="save-btn" class="save-btn btn" onclick="submitScores(event)" disabled>Save</button>`;
  username = document.getElementById("initials");
  saveButton = document.getElementById("save-btn");
  username.addEventListener("keyup", function () {
    saveButton.disabled = !username.value;
  });
}

//function to submit high scores
//should grab the users score and initials and add it to the high scores object, ranked numerically, and run the function to display the high scores
function submitScores(e) {
  const score = {
    score: finalScore,
    name: username.value,
  };
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(MAX_HIGH_SCORES);

  localStorage.setItem("highScores", JSON.stringify(highScores));
  displayScores();
}

//function to display high scores
//should populate the HTML with a ranked display of the high scores and and provide the option to clear the scores via a function
function displayScores() {
  clearInterval(runningTimer);
  countdown.innerHTML = "";
  clearQuestion();
  qElement.innerText = "";
  scoreArea.classList.remove("hide");

  scoreArea.innerHTML = `<h2>High Scores</h2><ul id="highScoresList"></ul><button id="clearScores" class="btn" onclick="clearScores()">Clear Scores</button>`;
  const highScoresList = document.getElementById("highScoresList");
  highScoresList.innerHTML = highScores
    .map((score) => {
      return `<li class="scoresList">${score.name} - ${score.score}</li>`;
    })
    .join("");
  startButton.classList.remove("hide");
  highScoresButton.classList.add("hide");
}

//function to clear high scores
//should fire on click, and erase the values of the high scores object
function clearScores() {
  highScores = [];
  highScoresList.innerHTML = "<h3>Scores have been Cleared</h3>";
  document.getElementById("clearScores").classList.add("hide");
}

/////
//Questions go Here
/////
const questions = [
  {
    question:
      "Trojan-Spy programs can keep an eye on how you are using your system.",
    answers: [
      { text: " True", correct: true },
      { text: "False", correct: false },
    ],
  },
  {
    question:
      "Which can modify data on your system – so that your system doesn’t run correctly or you can no longer access specific data, or it may even ask for ransom in order to give your access.",
    answers: [
      { text: "IM – Trojans", correct: false },
      { text: "Backdoor Trojans", correct: false },
      { text: "Trojan-Downloader", correct: false },
      { text: "Ransom Trojan", correct: true },
    ],
  },
  {
    question:
      "Which one can cost you money, by sending text messages from your mobile phone numbers.",
    answers: [
      { text: "IM – Trojans", correct: false },
      { text: "Backdoor Trojans", correct: false },
      { text: "SMS Trojan", correct: true },
      { text: "Ransom Trojans", correct: false },
    ],
  },
  {
    question:
      "What method in which a computer security mechanism is bypassed untraceable for accessing the computer or its information.",
    answers: [
      { text: "front-door", correct: false },
      { text: " backdoor", correct: true },
      { text: "clickjacking", correct: false },
      { text: "key-logging", correct: false },
    ],
  },
  {
    question: "What does the acronym IoE represent?",
    answers: [
      { text: "Internet of Everyday", correct: false },
      { text: "Insight into Everything", correct: false },
      { text: "Intelligence on Everything", correct: false },
      { text: " Internet of Everything", correct: true },
    ],
  },
  {
    question:
      "Which of the following is a powerful RAT build using the language Delphi 7.",
    answers: [
      { text: "Stuxnet", correct: false },
      { text: "T-Bomb", correct: true },
      { text: "Beast", correct: false },
      { text: " Zeus", correct: false },
    ],
  },
  {
    question: "What name is given to a amateur hacker?.",
    answers: [
      { text: "blue team", correct: false },
      { text: "red hat", correct: false },
      { text: "script kiddies", correct: true },
      { text: "black hat", correct: false },
    ],
  },
  {
    question:
      "What is the workforce framework category that includes highly specialized review and evaluation of incoming cybersecurity information to determine if it is useful for intelligence?",
    answers: [
      { text: "Oversight and Development", correct: false },
      { text: "Protect and Defend", correct: false },
      { text: "Analyze", correct: true },
      { text: "Securely Provision", correct: false },
    ],
  },
  {
    question: "What name is given to hackers who hack for a cause?",
    answers: [
      { text: "white hat", correct: false },
      { text: "grey hat", correct: true },
      { text: "hacker", correct: false },
      { text: " hactivist", correct: false },
    ],
  },
  {
    question: "What does the term vulnerability mean?",
    answers: [
      {
        text: "a computer that contains sensitive information",
        correct: false,
      },
      { text: "a method of attack to exploit a target", correct: false },
      {
        text: "a weakness that makes a target susceptible to an attack",
        correct: true,
      },
      { text: "a known target or victim machine", correct: false },
      { text: "a potential threat that a hacker creates", correct: false },
    ],
  },
  {
    question: "What does the term BYOD represent?",
    answers: [
      { text: "bring your own decision", correct: false },
      { text: "buy your own disaster", correct: false },
      { text: "bring your own disaster", correct: false },
      { text: "bring your own device", correct: true },
    ],
  },
  {
    question:
      "What type of attack uses many systems to flood the resources of a target, thus making the target unavailable?",
    answers: [
      { text: "ping sweep", correct: false },
      { text: "DDoS", correct: true },
      { text: "spoof", correct: false },
      { text: "DoS", correct: false },
    ],
  },
  {
    question: "What is an example of an Internet data domain?",
    answers: [
      { text: "Palo Alto", correct: false },
      { text: "Juniper", correct: true },
      { text: "Cisco", correct: false },
      { text: "Linkedin", correct: false },
    ],
  },
  {
    question:
      "What type of an attack can disable a computer by forcing it to use memory or by overworking its CPU?",
    answers: [
      { text: "exhaustion", correct: false },
      { text: "algorithm", correct: true },
      { text: "DDoS", correct: false },
      { text: "APT", correct: false },
    ],
  },
];
