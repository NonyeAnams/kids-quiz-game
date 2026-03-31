let allQuestions = [];
let selectedQuestions = [];
let currentQuestion = 0;
let score = 0;
let answered = false;
let timer;
let timeLeft = 10;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const progressEl = document.getElementById("progress");
const timerEl = document.getElementById("timer");

const startBtn = document.getElementById("startBtn");
const difficultySelect = document.getElementById("difficulty");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");


// FETCH QUESTIONS FROM JSON
fetch("questions.json")
    .then(res => res.json())
    .then(data => {
        console.log("Loaded questions:", data); // 👈 ADD THIS
        allQuestions = data;
    })
    .catch(err => console.error("Error loading questions:", err));

// START QUIZ
startBtn.onclick = () => {
    if (allQuestions.length === 0) {
        alert("Questions are still loading. Please wait a moment and try again.");
        return;
    }

    const level = difficultySelect.value;

    selectedQuestions = allQuestions
        .filter(q => q.level === level)
        .sort(() => Math.random() - 0.5);

    if (selectedQuestions.length === 0) {
        alert("No questions found for this level!");
        return;
    }

    currentQuestion = 0;
    score = 0;

    startBtn.style.display = "none";
    difficultySelect.style.display = "none";

    loadQuestion();
};


// LOAD QUESTION
function loadQuestion() {
    answered = false;
    feedbackEl.textContent = "";
    answersEl.innerHTML = "";

    let q = selectedQuestions[currentQuestion];

    progressEl.textContent = `Question ${currentQuestion + 1} of ${selectedQuestions.length}`;
    questionEl.textContent = q.question;

    startTimer();

    q.answers.forEach(answer => {
        let btn = document.createElement("button");
        btn.textContent = answer;

        btn.onclick = () => checkAnswer(answer, btn);

        answersEl.appendChild(btn);
    });
}


// TIMER
function startTimer() {
    timeLeft = 10;
    timerEl.textContent = `⏱ Time left: ${timeLeft}s`;

    clearInterval(timer);

    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `⏱ Time left: ${timeLeft}s`;

        if (timeLeft === 0) {
            clearInterval(timer);
            feedbackEl.textContent = "⏰ Time's up!";
            answered = true;
        }
    }, 1000);
}


// CHECK ANSWER
function checkAnswer(answer, button) {
    if (answered) return;

    answered = true;
    clearInterval(timer);

    const correct = selectedQuestions[currentQuestion].correct;
    const buttons = answersEl.querySelectorAll("button");

    buttons.forEach(btn => {
        if (btn.textContent === correct) {
            btn.classList.add("correct");
        }
    });

    if (answer === correct) {
        feedbackEl.textContent = "🎉 Great job!";
        score++;
        button.classList.add("correct");
        correctSound.play();
    } else {
        feedbackEl.textContent = "❌ Oops!";
        button.classList.add("wrong");
        wrongSound.play();
    }
}


// NEXT
nextBtn.onclick = () => {
    if (!answered) {
        feedbackEl.textContent = "⚠️ Please select an answer!";
        return;
    }

    currentQuestion++;

    if (currentQuestion < selectedQuestions.length) {
        loadQuestion();
    } else {
        showScore();
    }
};


// SHOW SCORE
function showScore() {
    questionEl.textContent = `🎉 You scored ${score} out of ${selectedQuestions.length}`;
    answersEl.innerHTML = "";
    nextBtn.style.display = "none";
    restartBtn.style.display = "block";
    progressEl.textContent = "";
    timerEl.textContent = "";
}


// RESTART
restartBtn.onclick = () => {
    currentQuestion = 0;
    score = 0;

    nextBtn.style.display = "block";
    restartBtn.style.display = "none";
    startBtn.style.display = "block";
    difficultySelect.style.display = "block";

    questionEl.textContent = "";
    answersEl.innerHTML = "";
    feedbackEl.textContent = "";
};