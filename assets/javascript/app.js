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
    var progressDisplay = $("#progress");
    var progressBar = $("#progressbar");
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
    
    function initProgressBar() { 
        var numQ = triviaData.length;
        for(var i = 0; i < numQ; i++) {
            progressBar.append("<li style='width:"+Math.floor(100/numQ)+"%'></li>");
        }
    }

    function resetGame() {
        questionsCorrect = questionsIncorrect = questionsUnanswered = questionIndex = 0;
        
        //reset progress bar
        progressBar.find("li").attr("class", "");

        // start with the intro
        changeState(introDisplay, false);
    }
    
    function nextQuestion() {
        // if we've run out of questions, end the game
        if(questionIndex == triviaData.length) {
            endGame();
            return;
        }

        //update the progress bar
        progressBar.find("li:nth-child("+(questionIndex+1)+")").attr("class", "active");

        // reset the pie timer
        timerDisplay.pietimer('reset');
        timerDisplay.pietimer('start');

        // display the question 
        displayQuestion(triviaData[questionIndex]);
        changeState(questionDisplay, true);
        
        questionIndex++;
    }

    function displayQuestion(questionObj) {
        // set the currentQuestion
        currentQuestion = questionObj;

        // update the question copy
        question.text(currentQuestion.question);

        // create a copy of the decoys and add the correct answer in a random position
        var answers = currentQuestion.decoys.slice();
        answers.splice(Math.floor(Math.random() * (answers.length+1)), 0, currentQuestion.answer);

        // update the answers copy
        $("button.answer").each(function (index, element) {
            $(element).text(answers[index]);
        });
    }

    function handleAnswer() {
        // pause the pie timer
        timerDisplay.pietimer('pause');

        // determine if the user pressed the correct button
        var isCorrect = $(this).text() == currentQuestion.answer;

        // update stats 
        isCorrect ? (questionsCorrect++) : (questionsIncorrect++);
        
        // update feedback & show remediation screen
        feedback.text(isCorrect ? "Correct!" : ("Nope! The correct answer was: " + currentQuestion.answer));
        remediate();
    }

    function timedOut() {
        // update stats
        questionsUnanswered++;

        // update feedback & show remediation screen
        feedback.text("Time's up! The correct answer was: " + currentQuestion.answer);
        remediate();
    }

    function remediate() {
        // update the image and show the remediation screen
        feedbackImage.attr("src", currentQuestion.image);
        changeState(remediationDisplay, true);

        // if the currentQuestion has a gifDuration property, use that, otherwise, use REMEDIATION_TIME
        setTimer(currentQuestion.gifDuration || REMEDIATION_TIME, nextQuestion);
    }

    function endGame() {
        // update stats UI, and show outro screen
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
    
    // helper function to show/hide correct "screen"
    function changeState(activeDisplay, showTimerAndProgress) {
        // show/hide timer & progress
        showTimerAndProgress ? timerDisplay.show() : timerDisplay.hide();
        showTimerAndProgress ? progressDisplay.show() : progressDisplay.hide();

        // hide all displays except for active display
        displays.forEach(display => {
            display === activeDisplay ? display.show() : display.hide();
        });
    }
    //#endregion helper functions

    // calls
    initProgressBar();
    resetGame();
});