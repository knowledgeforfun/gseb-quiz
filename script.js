// =======================================
// GSEB Statistics Quiz Engine
// Module 1
// =======================================

// ---------- Student Data ----------
const API_URL = "https://gseb-quiz-api.pratikkanakhara1.workers.dev/api";
const API_URL = "https://script.google.com/macros/s/AKfycbwpvvDP0BQXstkO7Ga6_Fo_5tl4_prYS2ERWRyud23hXhU4GOO2jr_Id5Nx3vzUnbvqPg/exec";
let student = {
     name: "",
    roll: "",
    school: "",
    mobile: ""
};


// ---------- Quiz Variables ----------

let currentQuestion = 0;
let score = 0;
let wrong = 0;
let selectedAnswer = null;

let startTime;
let timer;
let seconds = 0;

let questionTimer;
let questionTime = 20;
let remainingTime = 20;
let skipped = 0;
let questionStatus = [];
// ---------- Page Elements ----------

const loginScreen = document.getElementById("loginScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");


// =======================================
// Start Quiz
// =======================================

startBtn.addEventListener("click", startQuiz);


function startQuiz(){
  questionStatus = Array(questions.length).fill("notVisited");

createPalette();

    student.name =
        document.getElementById("studentName").value.trim();

    student.roll =
        document.getElementById("rollNo").value.trim();

    student.school =
        document.getElementById("schoolName").value.trim();

        student.mobile =
    document.getElementById("mobileNumber")
    .value
    .trim();

    const agree =
        document.getElementById("agree").checked;

    if(student.name===""){

        alert("Please Enter Student Name");

        return;

    }
if(student.mobile==""){

    alert("Please Enter WhatsApp Number");

    return;

}

if(!/^[6-9]\d{9}$/.test(student.mobile)){

    alert("Please Enter Valid 10 Digit WhatsApp Number");

    return;

}

    if(!agree){

        alert("Please Accept Instructions");

        return;

    }

fetch(API_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        action: "checkMobile",
        mobile: student.mobile
    })
})
.then(res => res.json())
.then(data => {

    if (data.exists) {

        alert("This WhatsApp Number has already appeared for this test.");
        return;

    }

    startExam();

})
.catch(err => {

    console.error(err);
    alert("Unable to connect to server.");

});
}

function startExam(){

    document.getElementById("studentDisplay").innerHTML =
        "👤 " + student.name;

    loginScreen.style.display="none";

    quizScreen.style.display="block";

    startTime = new Date();

    startTimer();

    loadQuestion();

}

function createPalette(){

    const container =
        document.getElementById("paletteContainer");

    container.innerHTML="";

    for(let i=0;i<questions.length;i++){

        let btn =
            document.createElement("button");

        btn.innerHTML=i+1;

        btn.className="paletteBtn notVisited";

        btn.id="palette"+i;

        container.appendChild(btn);

    }

}

// =======================================
// Timer
// =======================================

function startTimer(){

    timer = setInterval(function(){

        seconds++;

        let min =
            Math.floor(seconds/60);

        let sec =
            seconds%60;

        if(min<10) min="0"+min;

        if(sec<10) sec="0"+sec;

        document.getElementById("timer").innerHTML =
            min+":"+sec;

    },1000);

}
// =======================================
// Load Question
// =======================================

function loadQuestion(){
  startQuestionTimer();

    selectedAnswer = null;

    nextBtn.style.display = "none";

    let q = questions[currentQuestion];
    console.log(q);
console.log(q.options);

    document.getElementById("questionText").innerHTML =
        q.question;

    document.getElementById("questionNumber").innerHTML =
        currentQuestion + 1;

    document.getElementById("totalQuestions").innerHTML =
        questions.length;

    let progress =
        ((currentQuestion+1)/questions.length)*100;

    document.getElementById("progressBar").style.width =
        progress + "%";

    let container =
        document.getElementById("optionsContainer");

    container.innerHTML="";

    q.options.forEach(function(option,index){

        let btn =
            document.createElement("button");

        btn.className = "option";

        btn.innerHTML = option;

        btn.onclick=function(){

            checkAnswer(index,btn);

        };

        container.appendChild(btn);

    });
    document
.querySelectorAll(".paletteBtn")
.forEach(btn=>{

    if(btn.classList.contains("current")){

        btn.classList.remove("current");

    }

});

document
.getElementById("palette"+currentQuestion)
.classList.add("current");

}
function startQuestionTimer(){

    clearInterval(questionTimer);

    remainingTime = questionTime;

   document.getElementById("questionTimer").innerHTML =
    remainingTime;

    questionTimer = setInterval(function(){

        remainingTime--;

       document.getElementById("questionTimer").innerHTML =
    remainingTime;

        if(remainingTime <= 0){

    clearInterval(questionTimer);

    skipped++;
        questionStatus[currentQuestion]="skipped";

let p=document.getElementById("palette"+currentQuestion);

p.className="paletteBtn skippedQ";

    currentQuestion++;

    if(currentQuestion >= questions.length){

        finishQuiz();

    }else{

        loadQuestion();

    }

}

    },1000);



}

// =======================================
// Check Answer
// =======================================

function checkAnswer(index,button){
  clearInterval(questionTimer);

    if(selectedAnswer!==null){

        return;

    }

    selectedAnswer=index;

    let q=questions[currentQuestion];

    let options=
        document.querySelectorAll(".option");

    options.forEach(function(btn){

        btn.disabled=true;

    });

    if(index===q.answer){

        score++;

    button.classList.add("correct");

    questionStatus[currentQuestion]="correct";

    let p=document.getElementById("palette"+currentQuestion);

    p.className="paletteBtn correctQ";

    }

    else{

      

        wrong++;

        button.classList.add("wrong");

        options[q.answer].classList.add("correct");

        questionStatus[currentQuestion]="wrong";

let p=document.getElementById("palette"+currentQuestion);

p.className="paletteBtn wrongQ";

    }

    nextBtn.style.display="block";
    

}


// =======================================
// Next Button
// =======================================

nextBtn.onclick=function(){

    currentQuestion++;

    if(currentQuestion>=questions.length){

        finishQuiz();

        return;

    }

    loadQuestion();

}
// =======================================
// Finish Quiz
// =======================================

function finishQuiz(){

  

    clearInterval(timer);
    clearInterval(questionTimer);

    quizScreen.style.display = "none";
    resultScreen.style.display = "block";

    let percentage = ((score / questions.length) * 100).toFixed(2);

    document.getElementById("finalStudent").innerHTML =
        "👤 " + student.name;

    document.getElementById("finalScore").innerHTML =
    "✅ Correct : " + score +
    "<br>❌ Wrong : " + wrong +
    "<br>⏭ Skipped : " + skipped +
    "<br>📝 Total : " + questions.length;

    document.getElementById("finalPercentage").innerHTML =
        "📊 Percentage : " + percentage + "%";

    document.getElementById("finalTime").innerHTML =
        "⏱ Time : " + document.getElementById("timer").innerHTML;

    // Save Result to Google Sheet
   fetch(API_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({

        action: "saveResult",

        name: student.name,
        roll: student.roll,
        school: student.school,
        mobile: student.mobile,

        correct: score,
        wrong: wrong,
        skipped: skipped,
        percentage: percentage,
        time: document.getElementById("timer").innerHTML

    })
})
.then(res => res.json())
.then(data => {

    console.log("Result Saved", data);

})
.catch(err => {

    console.error(err);

});

})
.then(res=>res.json())
.then(data=>{

    console.log("Saved",data);

})
.catch(err=>{

    console.log(err);

});

}
