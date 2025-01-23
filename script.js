 let currentRiddleIndex = -1;
        let score = 0;
        let timerInterval;
        let timeLeft = 30;
         let usedEasyRiddles = new Set();
         let usedHardRiddles = new Set();
        let gameStarted = false;
         const startButton = document.getElementById("start-button");

      startButton.addEventListener("click", startGame);


          function startGame(){
             if(!gameStarted){
                gameStarted = true;
                startButton.style.display ="none"
               loadNextRiddle();
               }
            }
        function generateUniqueRiddleIndex(isEasy) {
          const riddleSet = isEasy ? easyRiddles : hardRiddles;
           const usedSet = isEasy ? usedEasyRiddles: usedHardRiddles;
            if(usedSet.size === riddleSet.length){
               return -1;
           }
           let index;
             do {
                  index = Math.floor(Math.random() * riddleSet.length);
                } while (usedSet.has(index));
                usedSet.add(index)
                return index;
        }


      function loadNextRiddle() {
        if (currentRiddleIndex < 9) {
            currentRiddleIndex++;
           const selectedRiddles = [];
           for(let i = 0; i< 3; i++){
              let easyIndex = generateUniqueRiddleIndex(true);
                if(easyIndex === -1){
                     endGame();
                      return;
                }
                selectedRiddles.push(easyRiddles[easyIndex]);
             }
             for(let i = 0; i< 7; i++){
              let hardIndex = generateUniqueRiddleIndex(false);
                if(hardIndex === -1){
                   endGame();
                   return;
                }
                 selectedRiddles.push(hardRiddles[hardIndex]);
             }
              const randomIndex = Math.floor(Math.random() * selectedRiddles.length);
             const riddle = selectedRiddles[randomIndex];
            const riddleContainer = document.getElementById("riddle-container");
             riddleContainer.innerHTML = `
               <div class="riddle-text english">${riddle.english}</div>
               <div class="riddle-text marathi">${riddle.marathi}</div>
            `;
            riddleContainer.classList.add("show");
             selectedRiddles.splice(randomIndex,1);
            const timerDisplay = document.getElementById("timer");
               timerDisplay.classList.add("show");
            timeLeft = 30;
            timerDisplay.textContent = "Time: " + timeLeft;
            startTimer();
           } else {
              endGame();
         }
       }
          function startTimer() {
            timerInterval = setInterval(function () {
                timeLeft--;
               const timerDisplay = document.getElementById("timer");
                timerDisplay.textContent = "Time: " + timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                     const currentRiddle = document.querySelector('#riddle-container .riddle-text.english').textContent;
                    const riddleObj = easyRiddles.find(r => r.english === currentRiddle) || hardRiddles.find(r=> r.english === currentRiddle);
                   showAnswer(riddleObj.answer);
                     showResult(false);
                     setTimeout(loadNextRiddle, 1500);
                }
            }, 1000);
        }
         function showAnswer(answer) {
           const answerDisplay = document.getElementById("answer-display");
              answerDisplay.textContent = `Answer: ${answer}`;
             answerDisplay.classList.add("show");
            setTimeout(() => {
                 answerDisplay.textContent = "";
                 answerDisplay.classList.remove("show");
             }, 1500);
        }
        function showResult(isCorrect) {
          const resultDiv = document.getElementById("result");
            resultDiv.classList.add("show");
             if (isCorrect) {
                resultDiv.textContent = "Correct!";
                resultDiv.classList.add("correct");
                 score++;
               } else {
                resultDiv.textContent = "Wrong!";
                 resultDiv.classList.add("wrong");
             }
             setTimeout(() => {
                resultDiv.textContent = "";
                 resultDiv.classList.remove("show","correct","wrong");
             }, 1000);
        }

         function submitAnswer() {
            clearInterval(timerInterval);
            const userAnswer = document.getElementById("answer-input").value.trim().toLowerCase();
              const currentRiddle = document.querySelector('#riddle-container .riddle-text.english').textContent;
               const riddleObj = easyRiddles.find(r => r.english === currentRiddle) || hardRiddles.find(r=> r.english === currentRiddle);
              const isCorrect = userAnswer === riddleObj.answer;
               showAnswer(riddleObj.answer);
            showResult(isCorrect);
             document.getElementById("answer-input").value = "";
             setTimeout(loadNextRiddle, 1500);
         }

           function endGame() {
              const riddleContainer = document.getElementById("riddle-container");
                 riddleContainer.textContent = "Game Over!";
                 riddleContainer.classList.remove("show");
              const timerDisplay = document.getElementById("timer");
               timerDisplay.classList.remove("show");
             if(score >= 8){
               showCongratsMessage();
             }else{
                const congratsMessage = document.getElementById("congrats-message");
               congratsMessage.textContent = `You scored ${score} out of 10. Better luck next time!`;
                 congratsMessage.style.display = "block";
              }
        }
           function showCongratsMessage() {
            const congratsMessage = document.getElementById("congrats-message");
            congratsMessage.textContent = "Congratulations! You can eat your dhokla free yupiiiiii enjoy!";
           congratsMessage.style.display = "block";
              createConfetti();
        }
        function createConfetti() {
            const container = document.querySelector('.confetti-container');
             for (let i = 0; i < 100; i++) {
                const confetti = document.createElement('div');
                 confetti.classList.add('confetti');
                confetti.style.left = `${Math.random() * 100}%`;
                 confetti.style.animationDelay = `${Math.random() * 2}s`;
                container.appendChild(confetti);
              }
        }
        document.getElementById("submit-button").addEventListener("click", submitAnswer);
          document.getElementById("answer-input").addEventListener("keypress", function(event){
                if(event.key === "Enter"){
                  submitAnswer();
                }
            });