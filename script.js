const totalQuestions = 81; // Number of different images to ask
const imagesFolder = 'images/'; // Path to the images folder
let currentQuestionIndex = 0;
let currentAnswer = '';
let questionIndices = [];
let questionAttempts = new Array(totalQuestions).fill(0); // Array to track incorrect attempts

// Function to initialize the quiz
function initQuiz() {
    for (let i = 1; i <= totalQuestions; i++) {
        questionIndices.push(i);
    }
    loadQuestion();
}

// Function to get a weighted random index based on incorrect attempts
function getWeightedRandomIndex() {
    const totalWeight = questionAttempts.reduce((sum, attempts) => sum + (1 + attempts), 0);
    let random = Math.floor(Math.random() * totalWeight);

    for (let i = 0; i < questionAttempts.length; i++) {
        random -= (1 + questionAttempts[i]);
        if (random < 0) {
            return i + 1; // Return the question number (index + 1)
        }
    }
    return 1; // Fallback in case of an error
}

// Function to load a question
function loadQuestion() {
    if (currentQuestionIndex >= totalQuestions) {
        currentQuestionIndex = 0;
    }
    const questionNum = getWeightedRandomIndex(); // Use weighted selection for next question
    document.getElementById('question-image').src = `${imagesFolder}im${questionNum}.png`;
    currentAnswer = `an${questionNum}.png`;
    loadOptions(questionNum);
    currentQuestionIndex++;
}

// Function to load options
function loadOptions(correctIndex) {
    const options = [];
    for (let i = 1; i <= totalQuestions; i++) {
        if (i !== correctIndex) options.push(`an${i}.png`);
    }
    shuffleArray(options);
    options.splice(Math.floor(Math.random() * 4), 0, currentAnswer);

    document.querySelectorAll('.option-image').forEach((img, index) => {
        img.src = `${imagesFolder}${options[index]}`;
    });

    document.querySelectorAll('input[name="answer"]').forEach((radio) => {
        radio.checked = false;
    });

    document.getElementById('feedback').textContent = '';
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('verify-btn').style.display = 'block';
}

function revealCorrectAnswer() {
    document.querySelectorAll('.option-image').forEach((img) => {
        if (img.src.endsWith(currentAnswer)) {
            img.style.border = '5px solid green'; // Highlight the correct answer
        } else {
            img.style.border = 'none'; // Reset the border for others
        }
    });
}

function showFeedback(isCorrect) {
    const feedback = document.getElementById("feedback");
    if (isCorrect) {
        feedback.textContent = "Correct!";
        feedback.className = "correct";
    } else {
        feedback.textContent = "Incorrect!";
        feedback.className = "incorrect";
    }
}

// Function to verify the answer
function verifyAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (!selectedOption) {
        alert('Please select an answer!');
        return;
    }

    const selectedImage = document.querySelector(`label[for="${selectedOption.id}"] img`).src;
    const isCorrect = selectedImage.endsWith(currentAnswer);

    showFeedback(isCorrect);
    document.getElementById('next-btn').style.display = 'block';
    document.getElementById('verify-btn').style.display = 'none';

    if (!isCorrect) {
        revealCorrectAnswer(); // Reveal the correct answer when the choice is incorrect
        const questionNum = parseInt(currentAnswer.match(/\d+/)[0]); // Extract question number
        questionAttempts[questionNum - 1]++; // Increment incorrect attempts count
    }
}

function clearBorders() {
    const answerImages = document.querySelectorAll('.option-image');
    answerImages.forEach(img => {
        img.style.border = 'none';
    });
}

// Call this function in your "Next" button event listener
document.getElementById('next-btn').addEventListener('click', () => {
    clearBorders();
    loadQuestion(); // Continue with the existing "Next" functionality
});
// Function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
// Event listeners for buttons
document.getElementById('verify-btn').addEventListener('click', verifyAnswer);
document.getElementById('next-btn').addEventListener('click', loadQuestion);

// Start the quiz
initQuiz();



