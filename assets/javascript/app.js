$(function () {
    //#region constants
    const QUESTION_TIME = 5;
    const REMEDIATION_TIME = 3000;
    //#endregion constants
   
    // data
    var triviaData = [
        {
            question: "Who speaks the first line of the series?",
            answer: "Lorelai",
            decoys: ["Rory", "Sookie", "Emily"],
            image: "assets/images/q1.gif",
            gifDuration: 2240
        },
        {
            question: "Which journalist does Rory idolize?",
            answer: "Christiane Amanpour",
            decoys: ["Peter Jennings", "Dan Rather", "Connie Chung"],
            image: "assets/images/q2.gif",
            gifDuration: 6240
        },
        {
            question: "What is the name of Babette's cat that dies in Season 1?",
            answer: "Cinnamon",
            decoys: ["Sugar", "Sprinkles", "Coffee"],
            image: "assets/images/q3.gif",
            gifDuration: 4190
        },
        {
            question: "What does Rory shoplift after her first kiss with Dean?",
            answer: "cornstarch",
            decoys: ["lip gloss", "grapes", "toilet paper"],
            image: "assets/images/q4.gif",
            gifDuration: 5240
        },
        {
            question: "Who speaks the last line of the series?",
            answer: "Rory",
            decoys: ["Lorelai", "Luke", "Michel"],
            image: "assets/images/q5.gif",
            gifDuration: 2400
        }

    ];

    //#region UI elements
    var intro = $("#intro");
    var startBtn = $("#start");
    var restartBtn = $("#restart")
    var introDisplay = $("#intro");
    var timerDisplay = $("#timer");
    var questionDisplay = $("#questionDisplay");
    var question = $("#question");
    var remediationDisplay = $("#remediation");
    var feedback = $("#feedback");
    var feedbackImage = $("#feedbackImage");
    var outro = $("#outro");
    var correctDisplay = $("#correct");
    var incorrectDisplay = $("#incorrect");
    var unansweredDisplay = $("#unanswered");
    //#endregion UI elements
 
    //#region variables
    var displays = [introDisplay, questionDisplay, remediationDisplay, outro];
    var questionsCorrect, questionsIncorrect, questionsUnanswered, questionIndex;
    var currentQuestion;
    var timerID;
    //#endregion variables

    // create a pie timer to show question time countdown
    timerDisplay.pietimer({seconds: QUESTION_TIME, color: 'rgba(0, 0, 0, 0.8)', height:40, width:40}, timedOut);

    //#region game functions
    function resetGame() {
        questionsCorrect = questionsIncorrect = questionsUnanswered = questionIndex = 0;
        changeState(introDisplay, false);
    }
    
    function nextQuestion() {
        if(questionIndex == triviaData.length) {
            endGame();
            return;
        }
        changeState(questionDisplay, true);
        displayQuestion(triviaData[questionIndex]);
        questionIndex++;
        timerDisplay.pietimer('reset');
        timerDisplay.pietimer('start');
    }

    function displayQuestion(questionObj) {
        currentQuestion = questionObj;

        question.text(currentQuestion.question);

        // create a copy of the decoys and add the correct answer in a random position
        var answers = currentQuestion.decoys.slice();
        answers.splice(Math.ceil(Math.random() * answers.length), 0, currentQuestion.answer);

        $("button.answer").each(function (index, element) {
            $(element).text(answers[index]);
        });
    }

    function handleAnswer() {
        timerDisplay.pietimer('pause');
        var isCorrect = $(this).text() == currentQuestion.answer;
        isCorrect ? (questionsCorrect++) : (questionsIncorrect++);
        feedback.text(isCorrect ? "Correct!" : ("Nope! The correct answer was: " + currentQuestion.answer));
        remediate();
    }

    function timedOut() {
        questionsUnanswered++;

        feedback.text("Time's up! The correct answer was: " + currentQuestion.answer);
        remediate();
    }

    function remediate() {
        feedbackImage.attr("src", currentQuestion.image);
        changeState(remediationDisplay, true);

        // if the currentQuestion has a gifDuration property, use that, otherwise, use REMEDIATION_TIME
        setTimer(currentQuestion.gifDuration || REMEDIATION_TIME, nextQuestion);
    }

    function endGame() {
        correctDisplay.text(questionsCorrect);
        incorrectDisplay.text(questionsIncorrect);
        unansweredDisplay.text(questionsUnanswered);
        changeState(outro, false);
    }
    //#endregion game functions

    //#region listeners
    startBtn.click(nextQuestion);
    restartBtn.click(() => {resetGame(); nextQuestion();});

    $("button.answer").click(handleAnswer);
    //#endregion listeners

    //#region helper functions
    function setTimer(time, callback) {
        clearTimeout(timerID);
        timerID = setTimeout(callback, time)
    }
    
    function changeState(activeDisplay, showTimer) {
        showTimer ? timerDisplay.show() : timerDisplay.hide();
        displays.forEach(display => {
            display === activeDisplay ? display.show() : display.hide();
        });
    }
    //#endregion helper functions

    // calls
    resetGame();
});