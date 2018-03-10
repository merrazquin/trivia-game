$(function () {
    //constants
    const QUESTION_TIME = 5;
    const REMEDIATION_TIME = 2000;
   
    // data
    var triviaData = [
        {
            question: "Question 1",
            answer: "Correct answer 1",
            decoys: ["decoy", "decoy", "decoy"]
        },
        {
            question: "Question 2",
            answer: "Correct answer 2",
            decoys: ["decoy", "decoy", "decoy"]
        },
        {
            question: "Question 3",
            answer: "Correct answer 3",
            decoys: ["decoy", "decoy", "decoy"]
        },
        {
            question: "Question 4",
            answer: "Correct answer 4",
            decoys: ["decoy", "decoy", "decoy"]
        }
    ];

    // UI elements
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
    var timedOutDisplay = $("#timed-out");

    timerDisplay.pietimer({seconds: QUESTION_TIME, color: 'rgba(0, 0, 0, 0.8)', height:40, width:40}, timedOut);
 
    // variables
    var displays = [introDisplay, questionDisplay, remediationDisplay, outro];
    var questionsCorrect, questionsIncorrect, questionsUnanswered, questionIndex;
    var currentQuestion;
    var timerID;

    function resetGame() {
        questionsCorrect = questionsIncorrect = questionsUnanswered = questionIndex = 0;
        changeState(introDisplay, false);
    }

    function changeState(activeDisplay, showTimer) {
        showTimer ? timerDisplay.show() : timerDisplay.hide();
        displays.forEach(display => {
            display === activeDisplay ? display.show() : display.hide();
        });
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
        feedback.text(isCorrect ? "correct" : "incorrect");
        remediate();
    }

    function remediate() {
        changeState(remediationDisplay, true);
        setTimer(REMEDIATION_TIME, nextQuestion);
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

    function timedOut() {
        questionsUnanswered++;

        feedback.text("Timed out");
        remediate();
    }

    function endGame() {
        correctDisplay.text(questionsCorrect);
        incorrectDisplay.text(questionsIncorrect);
        timedOutDisplay.text(questionsUnanswered);
        changeState(outro, false);
    }

    // listeners
    startBtn.click(nextQuestion);

    $("button.answer").click(handleAnswer);
    restartBtn.click(() => {resetGame(); nextQuestion();});

    // helper functions
    function setTimer(time, callback) {
        clearTimeout(timerID);
        timerID = setTimeout(callback, time)
    }


    // calls
    resetGame();
});