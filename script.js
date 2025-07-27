
async function getCountries() {
    const res = await fetch('https://restcountries.com/v3.1/all?fields=name,flags');
    const data = await res.json();

    const countries = data.filter(item =>
        item.name && item.name.common && item.flags && item.flags.png
    ).map(item => ({
        countryname: item.name.common,
        flag: item.flags.png,
    }));

    return countries;
}

function getRandomQuestions(array, num) {
    const shuffle = array.sort(() => 0.5 - Math.random());
    return shuffle.slice(0, num);
}

function generateQuestions(countries) {
    const quizCountries = getRandomQuestions(countries, 10);

    const questions = quizCountries.map(correct => {
        const otherCountries = countries.filter(item =>
            item.countryname !== correct.countryname
        );
        const wrongOptions = getRandomQuestions(otherCountries, 3);

        const allOptions = [
            correct.countryname,
            wrongOptions[0].countryname,
            wrongOptions[1].countryname,
            wrongOptions[2].countryname,
        ]
        const shuffledOptions=allOptions.sort(()=>0.5-Math.random());

        return{
            flag:correct.flag,
            correctAnswer:correct.countryname,
            options:shuffledOptions
        };
    });
    return questions;
}

let currentQuestionIndex=0;
let score=0;
let questions=[];

function showQuestion() {
    const question = questions[currentQuestionIndex];

    document.getElementById("flag-img").src = question.flag;

    document.getElementById("question-number").textContent =
        `Question ${currentQuestionIndex + 1} out of ${questions.length}`;
    document.getElementById("score").textContent =
        `Score : ${score}/${questions.length}`;

    question.options.forEach((optionText, index) => {
        const btn = document.getElementById(`option${index}`);
        btn.textContent = optionText;
        btn.className = "btn btn-outline-dark px-4 py-2 cursor-pointer";

        btn.onclick = () => {
            for (let i = 0; i < 4; i++) {
                document.getElementById(`option${i}`).onclick = null;
            }

            if (optionText === question.correctAnswer) {
                score++;
                btn.classList.remove("btn-outline-dark");
                btn.classList.add("btn-success");
            } else {
                btn.classList.remove("btn-outline-dark");
                btn.classList.add("btn-danger");

                for (let i = 0; i < 4; i++) {
                    const optionBtn = document.getElementById(`option${i}`);
                    if (optionBtn.textContent === question.correctAnswer) {
                        optionBtn.classList.remove("btn-outline-dark");
                        optionBtn.classList.add("btn-success");
                    }
                }
            }
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    showQuestion();
                } else {
                    alert(`Quiz completed! Your score: ${score}/${questions.length}`);
                }
            }, 1500);
        };
    });
}



const startQuiz = async () => {
    const countries = await getCountries();
    questions = generateQuestions(countries);
    showQuestion();
}

window.onload = startQuiz;