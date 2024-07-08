$(document).ready(function() {
    const allQuestions = [
        {
            question: "What is the acceleration due to gravity on Earth?",
            answers: ["9.8 m/s²", "5 m/s²", "12.5 m/s²", "7.5 m/s²"],
            correct: "9.8 m/s²"
        },
        {
            question: "Who formulated the laws of motion and universal gravitation?",
            answers: ["Albert Einstein", "Galileo Galilei", "Isaac Newton", "Nicolaus Copernicus"],
            correct: "Isaac Newton"
        },
        {
            question: "Which planet has the strongest gravity in our solar system?",
            answers: ["Earth", "Jupiter", "Mars", "Saturn"],
            correct: "Jupiter"
        },
        {
            question: "Gravity on the Moon is about what fraction of Earth's gravity?",
            answers: ["1/2", "1/3", "1/6", "1/8"],
            correct: "1/6"
        },
        {
            question: "What is the term for the point where the gravitational forces of two bodies balance each other?",
            answers: ["Center of Mass", "Gravitational Equilibrium", "Lagrange Point", "Event Horizon"],
            correct: "Lagrange Point"
        },
        {
            question: "What causes tides on Earth?",
            answers: ["Winds", "Sun's Heat", "Moon's Gravity", "Earth's Rotation"],
            correct: "Moon's Gravity"
        },
        {
            question: "Which scientist is known for his theory of general relativity?",
            answers: ["Albert Einstein", "Niels Bohr", "James Clerk Maxwell", "Michael Faraday"],
            correct: "Albert Einstein"
        },
        {
            question: "What is a black hole?",
            answers: ["A star", "A planet", "A region of space where gravity is so strong that nothing can escape", "A type of galaxy"],
            correct: "A region of space where gravity is so strong that nothing can escape"
        },
        {
            question: "What is the escape velocity from Earth?",
            answers: ["7 km/s", "11.2 km/s", "15 km/s", "20 km/s"],
            correct: "11.2 km/s"
        },
        {
            question: "What does the gravitational force depend on?",
            answers: ["Charge", "Mass and distance", "Volume", "Speed"],
            correct: "Mass and distance"
        },
        {
            question: "Who discovered the law of universal gravitation?",
            answers: ["Galileo Galilei", "Johannes Kepler", "Isaac Newton", "Edwin Hubble"],
            correct: "Isaac Newton"
        },
        {
            question: "What is the gravitational constant (G)?",
            answers: ["6.67 × 10^-11 N(m/kg)^2", "9.81 m/s²", "3.00 × 10^8 m/s", "1.60 × 10^-19 C"],
            correct: "6.67 × 10^-11 N(m/kg)^2"
        },
        {
            question: "What is microgravity?",
            answers: ["Zero gravity", "Very weak gravity", "Anti-gravity", "Simulated gravity"],
            correct: "Very weak gravity"
        },
        {
            question: "Which of the following affects gravitational force?",
            answers: ["Distance", "Mass", "Charge", "Both distance and mass"],
            correct: "Both distance and mass"
        },
        {
            question: "How does gravity on Mars compare to Earth?",
            answers: ["About 0.38 times Earth's gravity", "About the same as Earth's gravity", "About 2 times Earth's gravity", "No gravity"],
            correct: "About 0.38 times Earth's gravity"
        }
    ];

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let incorrectAnswers = [];

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function selectRandomQuestions() {
        shuffle(allQuestions);
        questions = allQuestions.slice(0, 5);
    }

    function updateProgressBar() {
        const progress = (currentQuestionIndex / questions.length) * 100;
        $('#progress-bar').css('width', progress + '%');
    }

    function loadQuestion() {
        const $questionContainer = $('#question-container');
        $questionContainer.empty();

        if (currentQuestionIndex >= questions.length) {
            showResult();
            return;
        }

        const currentQuestion = questions[currentQuestionIndex];
        const $questionElement = $('<div></div>').text(currentQuestion.question);
        $questionContainer.append($questionElement);

        currentQuestion.answers.forEach(answer => {
            const $answerElement = $('<div></div>')
                .addClass('answer')
                .text(answer)
                .on('click', function() {
                    selectAnswer(answer);
                });
            $questionContainer.append($answerElement);
        });

        updateProgressBar();
    }

    function selectAnswer(answer) {
        const currentQuestion = questions[currentQuestionIndex];
        if (answer === currentQuestion.correct) {
            score++;
        }else if (answer !== currentQuestion.correct) {
            // Step 2: If the answer is incorrect, store the question, user's answer, and correct answer
            incorrectAnswers.push({
                question: currentQuestion.question,
                userAnswer: answer,
                correctAnswer: currentQuestion.correct
            });
        }
        currentQuestionIndex++;
        loadQuestion();
    }

    function showResult() {
        const $questionContainer = $('#question-container');
        $questionContainer.empty();

        // Display score at the top
        const $resultElement = $('#result');
        $resultElement.text(`You scored ${score} out of ${questions.length}!`);
        $questionContainer.append($resultElement);

        if (score === 5) {
            $('body').css('background-color', '#ffeb3b'); // Change background color to yellow
            const $specialMessage = $('<div></div>')
                .addClass('special-message')
                .text('Perfect Score! Congratulations!');
            $('#game').append($specialMessage);
            // Add confetti
            for (let i = 0; i < 100; i++) {
                const $confetti = $('<div></div>').addClass('confetti');
                $confetti.css({
                    left: Math.random() * 100 + 'vw',
                    top: Math.random() * -20 + 'vh',
                    animationDuration: Math.random() * 3 + 2 + 's'
                });
                $('body').append($confetti);
            }
        }else if (incorrectAnswers.length > 0) {
            const $incorrectAnswersElement = $('<div></div>').addClass('incorrect-answers');
            $incorrectAnswersElement.append('<h3>Incorrect Answers:</h3>');
            incorrectAnswers.forEach(item => {
                const $card = $(`
                <div class="card my-3">
                    <div class="card-body">
                        <h5 class="card-title">Question: ${item.question}</h5>
                        <p class="card-text"><strong>Your Answer:</strong> <span class="text-danger">${item.userAnswer}</span></p>
                        <p class="card-text"><strong>Correct Answer:</strong> <span class="text-success">${item.correctAnswer}</span></p>
                    </div>
                </div>
            `);
                $incorrectAnswersElement.append($card);
            });
            $questionContainer.append($incorrectAnswersElement);
        }

        $('#play-again').show();
        updateProgressBar(); // Ensure the progress bar shows full completion
    }

    function resetGame() {
        currentQuestionIndex = 0;
        score = 0;
        incorrectAnswers = []; // Reset incorrect answers
        $('#result').empty();
        $('#play-again').hide();
        $('.special-message').remove();
        $('.confetti').remove();
        $('body').css('background-color', '#f0f8ff'); // Reset background color
        selectRandomQuestions();
        loadQuestion();
    }

    $('#play-again').on('click', function() {
        resetGame();
    });

    // Initial setup
    selectRandomQuestions();
    loadQuestion();
});


