import * as CS from "./constants.js";
import { readFromStorage, writeToStorage } from "./storage.js";

// const QUIZ_API = 'https://quizapi.io/api/v1/questions';
// const QUIZ_TOKEN = '5iZAglL7GIgvDk9OncHf3psRa0H6rKOJFWyLvnIp';
// const QUIZ_API = 'https://quizapi.io/api/v1/questions';
// const QUIZ_TOKEN = 'FhM3bp5OFLJVGzVKTixObZW1ujf8ydXJBgLwM4Uo';

(() => {
	const app = {
		initialize() {
      this.preferences = readFromStorage("preferences") || CS.defaultPreferences;
			this.cacheElements();
			//this.buildUI();
      this.registerHTMLForListeners();
      this.showPreferences();
      // this.countDown ();
		},
		cacheElements() {
      this.$form = document.querySelector('form');
      this.$startBtn = document.getElementById('start-btn');
      this.$nextBtn = document.getElementById('next-btn');
      this.$skipBtn = document.getElementById('skip-btn');
      this.$quitBtn = document.getElementById('quit-btn');
      this.startAgainBtn = document.getElementById('startAgain-btn');
      this.$startArea = document.getElementById('startArea'); 
      this.$displayArea = document.querySelector('.displayArea');
      this.$endOfGame =  document.querySelector('.endOfGame');
      this.$category = document.getElementById('category');
      this.$difficulty = document.getElementById('difficulty');
      this.$amount = document.getElementById('numberQs'); 
      this.$time = document.getElementById('time');
      this.$displayNrQ = document.querySelector('.displayNrQ');
      this.$quizQuestion = document.querySelector('.quizQuestion');  
      this.$answersBtn = document.getElementById('answers-btn');
      this.$quizStatus = document.querySelector('.quizStatus');
      this.$gameReview = document.querySelector('.gameReview');
      this.$scoreBoard = document.querySelector('.score');
      this.$difficulty = document.getElementById('difficulty');
      this.$pageBeginCountdown = document.getElementById('pageBeginCountdown');
      this.$pageBeginCountdownText = document.getElementById('pageBeginCountdownText');

    },
    showPreferences(){
      const selectOptions = CS.categories.map((category) => {
        return `<option ${category === this.preferences.category ? "selected" : ""} value="${category}">${category}</option>`;
      });
      this.$category.innerHTML = selectOptions.join("\n");
  
      const selectDifficulty = CS.difficulties.map((difficulty) => {
        
        return `<option ${difficulty === this.preferences.difficulty ? "selected" : ""} value="${difficulty}">${difficulty}</option>`;
      });
      this.$difficulty.innerHTML = selectDifficulty.join("\n");
    },
		registerHTMLForListeners() {
      this.$startBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.$startArea.style.display = "none";
        this.$displayArea.style.display = "block";
        this.$endOfGame.style.display = "none";
        this.getDataFromQuizApiEndpoint();

        const formData = new FormData(this.$form);

        this.preferences = {
          category: formData.get("category"),
          difficulty: formData.get("difficulty"),
        };
        writeToStorage("preferences", this.preferences);
        
      });
      this.$quitBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.$startArea.style.display = "block";
        this.$displayArea.style.display = "none";
        clearInterval(this.countdownTimer);
      });

      this.startAgainBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.$startArea.style.display = "block";
        this.$endOfGame.style.display = "none";
          this.$displayArea.style.display = "none";

      });
      this.$nextBtn.addEventListener('click', (e) =>{
        e.preventDefault();
          this.index 
          //this.currentQuestion ++;
          this.currentQuestion += 1;
          this.checkCorrectAnswers();
          clearInterval(this.countdownTimer);
          this.startQuiz(this.quiz);

      });
      this.$skipBtn.addEventListener('click', (e) =>{
        e.preventDefault();

        //this.currentQuestion ++;
        this.currentQuestion += 1;
        this.checkCorrectAnswers();
        clearInterval(this.countdownTimer);
        this.startQuiz(this.quiz);
      });     
  },
    async getDataFromQuizApiEndpoint() {
      
      const response = await fetch(`${CS.api_url}?apiKey=${CS.api_token}&category=${this.preferences.category}&difficulty=${this.preferences.difficulty}&limit=${this.$amount.value}`);
      this.quiz = await response.json();

      this.$answersBtn.innerHTML = '';
      this.$gameReview.innerHTML ='';
      this.$quizStatus.innerHTML = '';
      this.interval = 0;
      this.index = 0;
      this.index = 0;
      this.time = 15;
      this.score = 0;
      this.currentQuestion = 0;
      this.userAnswerList = [];
      let storedQuestions = this.quiz.map(q =>{
        return q.question;
      });

      writeToStorage("quizQuestions", storedQuestions);
      this.startQuiz(this.quiz);

       },
       // The counter
         ProgressCountdown() {

          this.time = 15;
      
            this.countdownTimer = setInterval(() => {
              
              if (this.time !== 0) {
                this.time--;
  
                this.$pageBeginCountdown.value = this.time;
                this.$pageBeginCountdownText.textContent = this.time;
              } else{
                this.currentQuestion ++;
                clearInterval(this.countdownTimer);
                this.checkCorrectAnswers();
                this.startQuiz(this.quiz);
              }
            }, 1000);
        },
        //unswer check stop
        checkCorrectAnswers(){
          console.log(this.userAnswer);
          if (this.userAnswer === this.currentCorrectAnswer) {
            this.userAnswerList.push(this.userAnswer);
            this.score ++;
          } 
          else if(this.userAnswer === undefined){
            this.userAnswerList.push('Did Not Unswer!');
          }
          else {
            this.userAnswerList.push(this.userAnswer);
          }
        },
       startQuiz(quiz){
         this.userAnswer = "";
         if(this.currentQuestion !== quiz.length){
          this.ProgressCountdown();
          this.$displayNrQ.innerHTML = `<p><span class=" timer__text">Q: </span>${1 + this.currentQuestion} / ${this.quiz.length}</p>`;
          this.$quizQuestion.innerHTML = `<h3 questionsFont>${quiz[this.currentQuestion].question}</h3>`;
          if(quiz[this.currentQuestion].correct_answer !== null){
          this.currentCorrectAnswer = quiz[this.currentQuestion].correct_answer;
          };
          this.$answersBtn.innerHTML = '';
          for(let key in quiz[this.currentQuestion].answers){
            if(quiz[this.currentQuestion].answers.hasOwnProperty(key) && quiz[this.currentQuestion].answers[key] !== null){
              let possibleAnswers = (key, quiz[this.currentQuestion].answers[key]);
				    	this.$answersBtn.innerHTML += `<button class="answerBtn" data-key=${key}> ${possibleAnswers}</button>`;
            };
          }
          this.$answerButton = document.querySelectorAll('.answerBtn');
          this.$answerButton.forEach(b => {
            b.addEventListener('click', (e) =>{
              e.preventDefault();
            
              e.target.classList.toggle("active");
              //if statement
              this.userAnswer = e.target.dataset.key || e.target.parentNode.dataset.key;
            });
          })
        } else {
          this.endQuiz(quiz);  
        }
       },
       endQuiz(quiz){
        this.$endOfGame.style.display = "block";
        this.$startArea.style.display = "none";
        this.$displayArea.style.display = "none";
        this.$scoreBoard.innerHTML = `<h3 class=""><span class="changeColour">You Score</span> : ${this.score} / ${this.quiz.length} </h3>`;
        this.userAnswerList.map((a, i) =>{
      
          this.$gameReview.innerHTML += ` <li>
          <p><span class="changeColour">Q</span>: ${this.quiz[i].question}</p>
          <br> 
          <p><span class="changeColour">A</span>: ${this.quiz[i].correct_answer}</p>
          <br> 
          <p><span class="changeColour">Your A</span>: ${a}</p>
          </li>` ; 
        })
      },  
	};
	app.initialize();
})();
