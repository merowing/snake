window.onload = function() {
    var gridBox     = document.getElementById('box-grid'),
        grid        = document.getElementById('grid'),
        gridWidth   = gridBox.clientWidth,
        gridHeight  = gridBox.clientHeight,
        div         = grid.getElementsByTagName('div'),
        score       = document.getElementById('score'),
        block1      = document.getElementById('blockGameover'),
        block2      = block1.getElementsByTagName('div'),
        backgame    = document.getElementById('backgame'),
        block4      = document.getElementById('restartgame'); 
        block5      = document.getElementById('pause'),
        score       = document.getElementById('score'),
        width       = 12, // width&height block
        elemWidth   = Math.floor((gridWidth)/width),
        elemHeight  = Math.floor(gridHeight/width),
        elemAll     = elemWidth * elemHeight,
        snakeLength = 3, // length snake
        arr         = [], // coordinates snake blocks
        snakeTime   = {}, // Date
        // checkKeyPress
        keyEnableNext = false,
        keyEnableBack = false,
        keyEnableBottom = false,
        keyEnableTop = false,
        // Timers
        nextStepTimer = null,
        backStepTimer = null,
        topStepTimer = null,
        bottomStepTimer = null;
      
      // -- create Grid -- //
      for(var i = 0; i < elemAll; i++) {
        var create = document.createElement('div');
        create.style.cssText += 'width:' + width + 'px;height:' + width + 'px';
        grid.appendChild(create);
      }
      // --- //
      
      // -- random
      function rand() {
        o.randomItem = Math.floor(Math.random()*elemAll);      
        if(o.j == o.randomItem ||
          div[o.randomItem].getAttribute('id') == 'snakeColor' ||
          div[o.randomItem].getAttribute('id') == 'wall') {
          rand();
        }else {
          div[o.randomItem].setAttribute('id','block');
        }
      }
      
      // create snake --- //
      function createSnake() {
        arr = [];
        for(var s = 0; s < snakeLength; s++) {
          arr[s] = parseInt((elemWidth/2) + (parseInt(elemAll/(2*elemWidth)) - 1) * elemWidth)-s;
          if(s == 0) {
            div[arr[s]].setAttribute('id','snakeYellow');
          }else {
            div[arr[s]].setAttribute('id','snakeColor');
          }
        }
      }
      createSnake();
      // --- //
      
      // snake Steps --- //
      function arrStep(u) {
        if(getAttr([u]) == 'block') {
          arr[arr.length] = (arr[arr.length - 1]) -1;
          o.score++;
          rand();
        }
        
        o.steps++;
        
        for(var i = arr.length - 1; i >= 0; i--) {
          if(i == 0) {
            arr[0] = u;
            div[arr[0]].setAttribute('id','snakeYellow');
            continue;
          }
          arr[i] = arr[i-1];
          div[arr[i]].setAttribute('id','snakeColor');
        }
      }
      // --- //
      
      // --- snake time --- //
      function snakeTimer() {
        snakeTime.nowDate = new Date();
        snakeTime.currentTime = snakeTime.nowDate.getTime();
        
        o.endTime = snakeTime.currentTime;
        
        snakeTime.getSeconds = (snakeTime.currentTime - o.startTime) / 1000;
        
        snakeTime.getSeconds = parseInt(snakeTime.getSeconds);
        
        if(snakeTime.getSeconds) {
          snakeTime.getHours = snakeTime.getSeconds / 3600;
          
          snakeTime.min = (snakeTime.getHours - parseInt(snakeTime.getHours)) * 60;
          snakeTime.secondsFraction = snakeTime.min - parseInt(snakeTime.min);
          snakeTime.minutesFraction = snakeTime.getHours - parseInt(snakeTime.getHours);
          
          snakeTime.seconds = Math.floor((snakeTime.secondsFraction * 60).toFixed(2));
          snakeTime.minutes = Math.floor((snakeTime.minutesFraction * 60).toFixed(2));
                  
          snakeTime.getHours = parseInt(snakeTime.getHours) || '';
          
          if(snakeTime.seconds < 10) snakeTime.seconds = '0' + snakeTime.seconds;
          if(snakeTime.minutes < 10) snakeTime.minutes = '0' + snakeTime.minutes;
          
          if(snakeTime.getHours > 0 && snakeTime.getHours < 10) snakeTime.getHours = '0' + snakeTime.getHours + ':';
          if(snakeTime.getHours > 9) snakeTime.getHours = snakeTime.getHours + ':';
          
          score.innerHTML = o.text.score + ' ' + o.score + '<br>' +
                            o.text.time + ' ' + (snakeTime.getHours + snakeTime.minutes + ':' + snakeTime.seconds) + '<br>' +
                            o.text.steps + ' ' + o.steps;
        }
        
        setTimeout(function() {
          snakeTimer();
        }, 1000);
  
      }
      // --- //
  
      // checkItem
      function checkBox(t) {
        return (div[t].getAttribute('id') == 'snakeColor' || div[t].getAttribute('id') == 'wall') ? true : false;
      }
      // removeItem
      function removeBox(t) {
        if(checkBox(t) == false) {
          removeAttribute(arr[arr.length-1]);
        }
      }
      // gameOver
      function gameover() {          
        block2[0].innerHTML = o.text.gameover + ' <br><code>' + o.text.score + o.score + '</code>';
        backgameBlock();
        block1.style.display = 'block';
        
        o.currentKeyCode = 0;
        o.game = false;
        
        o.gameOver = true;
      }
      // restartGame
      function restartGame() {
        o.score = 0;
        o.steps = 0;
        score.innerHTML = o.score;
        // clear
        for(var i = 0; i < arr.length+1; i++) {
            if(i == arr.length) {
              removeAttribute(o.randomItem);
            }else {
              removeAttribute(arr[i]);
            }
        }
        if(o.snakeAI.start) {
          backgameBlock();
        }else {
          backgame.style.display = 'none';
        }
        block1.style.display = 'none';
        
        if(o.snakeAI.start) {
          o.game = false;
        }else {
          o.game = true;
        }
      
        o.gameOver = false;
        o.optionsShow = false;
        again = false;
      
        keyEnableBack = false;
        keyEnableBottom = false,
        keyEnableTop = false;
        keyEnableNext = false;
        
        clearTimeout(backStepTimer);
        clearTimeout(bottomStepTimer);
        clearTimeout(topStepTimer);
        clearTimeout(nextStepTimer);
        
        createSnake();
        
        o.j = arr[0];
        o.speed = o.defaultSpeed;
        rand();
      }
      
      block4.onclick = function() {
        restartGame();
      };
      
      // --- getAttribute --- //
      function getAttr(param) {
        return div[param].getAttribute('id');
      }
      // ---- //
      
      // --- removeAttribute --- //
      function removeAttribute(param) {
        return div[param].removeAttribute('id');
      }
      // ---- //
      
      // --- backgame --- //
      function backgameBlock() {
        backgame.style.display = 'block';
        backgame.style.width = (elemWidth * width) + 'px';
        backgame.style.marginLeft = (grid.offsetWidth - (elemWidth * width))/2 + 'px';
        backgame.style.height = width * parseInt(elemAll/elemWidth) + 'px';
      }
      // ---- //
      
      // obj options
      var o = {
            j:              arr[0], // idHeadSnake
            game:           false, // gameStart
            gameOver:       false,
            score:          0, // startScore
            defaultSpeed:   100, // defaultSpeed
            speed:          500, // snakeSpeed
            randomItem:     0, // random box for remove
            currentKeyCode: 0, // current keyCode
            steps:          0, // steps
            startTime:      0, // start time
            endTime:        0, // end time
            // snake AI
            snakeAI:        {
                              start:true,
                              item:0,
                              position:0,
                              timerStart:'',
                              timerGame:'',
                              startTime:1000,
                              speed:10,
                              limit:20
                            },
            text:           {
                              score:    'Score:',
                              time:     'Time:',
                              steps:    'Steps:',
                              gameover: 'Game over!'
                            },
            keyCodes:       [80, 79, 38, 37, 40, 39], //l,t,r,b,o,p
            optionsShow:    false
      };
      rand();
      
      var again = false;
  
      document.onkeydown = function(e) {
        var e = e || event, // for IE8,7
            keyCode = (e.keyCode) ? e.keyCode : e.which;
        
        if(keyCode == o.keyCodes[2] || keyCode == o.keyCodes[5] || keyCode == o.keyCodes[4]) {
          if(!o.steps) {
            var d1 = new Date();
            o.startTime = d1.getTime();// - 35995000;
            snakeTimer();
          }
        }
        
        if(keyCode == 13 && !o.game && !o.optionsShow) {
          restartGame();
        }
        if(o.gameOver) {
          return;
        }
        
        // -- options -- //
        if(keyCode == o.keyCodes[1] && !again) {
          if(!o.optionsShow) {
            bKeys.style.display = 'block';
            if(!o.game) {
              blockStart.style.display = 'none';
            }
            o.optionsShow = true;
  
            clearTimeout(backStepTimer);
            clearTimeout(topStepTimer);
            clearTimeout(nextStepTimer);
            clearTimeout(bottomStepTimer);
            
            backgameBlock();
            
          }else {
          
            if(o.currentKeyCode == o.keyCodes[3] && o.steps) {
              o.j--;
              backStep();
            }
            if(o.currentKeyCode == o.keyCodes[2] && o.steps) {
              o.j -= elemWidth;
              j = o.j
              topStep();
            }
            
            if(o.currentKeyCode == o.keyCodes[5] && o.steps) {
              o.j++;
              nextStep();
            }
            
            if(o.currentKeyCode == o.keyCodes[4] && o.steps) {
              o.j += elemWidth;
              j = o.j;
              bottomStep();
            }
          
          
            for(var i = 0; i < bKeysInput.length; i++) {
              switch(bKeysInput[i].value.charCodeAt()) {
                  case 8592:
                    x = 37;
                    break;
                  case 8593:
                    x = 38;
                    break;
                  case 8594:
                    x = 39;
                    break;
                  case 8595:
                    x = 40;
                    break;
                  default:
                    x = bKeysInput[i].value.charCodeAt();
                }
              o.keyCodes[i] = x;
            }
            
            var code = options.getElementsByTagName('code');
            var save = document.getElementById('saveOptions');
            var code2 = save.getElementsByTagName('code');
            
            var pause = document.getElementById('pause');
            var code3 = pause.getElementsByTagName('code');
            
            var controls = document.getElementById('blockOptions');
            var input = controls.getElementsByTagName('input');

            var j = input.length;
            while(j--) {
              switch(o.keyCodes[j]) {
                  case 37:
                    x = 8592;
                    break;
                  case 38:
                    x = 8593;
                    break;
                  case 39:
                    x = 8594;
                    break;
                  case 40:
                    x = 8595;
                    break;
                  default:
                    x = o.keyCodes[j];
                }
              input[j].value = String.fromCharCode(x);
              if(j == 2) j = 0;
            }
            console.log(o.keyCodes);
            
            code[0].innerHTML = String.fromCharCode(o.keyCodes[1]);
            code2[0].innerHTML = String.fromCharCode(o.keyCodes[1]);
            code3[0].innerHTML = String.fromCharCode(o.keyCodes[0]);
          
            bKeys.style.display = 'none';
            if(!o.game) {
              blockStart.style.display = 'block';
            }
            o.optionsShow = false;
            backgame.style.display = 'none';
            
            
          }
        }
        // -- //
        
        if(keyCode == o.keyCodes[0] && !o.optionsShow) {
          if(blockStart.offsetParent !== null) return;
        
          score.style.display = 'block';
          if(!o.endTime) {
            score.innerHTML = o.text.score + ' ' + o.score + '<br>' +
                              o.text.time + ' 00:00<br>' +
                              o.text.steps + ' ' + o.steps;
          }
          
          if(again) {
            score.style.display = 'none';
            score.innerHTML = '';
            
            if(o.currentKeyCode && o.steps) {
              removeAttribute(arr[arr.length - 1]);
            }
            
            backgame.style.display = 'none';
            block5.style.display = 'none';
            
            again = false;
  
            if(o.currentKeyCode == o.keyCodes[3] && o.steps) {
              o.j--;
              backStep();
            }
              
            if(o.currentKeyCode == o.keyCodes[2] && o.steps) {
              o.j -= elemWidth;
              j = o.j
              topStep(j);
            }
            
            if(o.currentKeyCode == o.keyCodes[5] && o.steps) {
              o.j++;
              nextStep();
            }
            
            if(o.currentKeyCode == o.keyCodes[4] && o.steps) {
              o.j += elemWidth;
              j = o.j;
              bottomStep(j);
            }
          }else {
            clearTimeout(backStepTimer);
            clearTimeout(topStepTimer);
            clearTimeout(nextStepTimer);
            clearTimeout(bottomStepTimer);
            
            backgameBlock();
            block5.style.display = 'block';
            
            again = true;
          }
          return;
        }
        
        if(!o.optionsShow && !again && (keyCode == o.keyCodes[2] || keyCode == o.keyCodes[3] || keyCode == o.keyCodes[4] || keyCode == o.keyCodes[5])) {
          o.currentKeyCode = keyCode;
        }
        
        if(keyCode == o.keyCodes[5] && o.j < elemAll-1 && !again && !o.optionsShow) {
          if (getAttr(o.j + 1) != 'snakeColor') {
            o.steps++;
          
            keyEnableBack = false;
            keyEnableBottom = false,
            keyEnableTop = false;
            
            clearTimeout(backStepTimer);
            clearTimeout(bottomStepTimer);
            clearTimeout(topStepTimer);
            
            if(!keyEnableNext) {
              o.j++;
              removeBox(o.j);
              keyEnableNext = true;
              nextStep(o.j);
            }
          }else {
            o.currentKeyCode = o.keyCodes[3];
          }
        }
        
        if(keyCode == o.keyCodes[3] && o.j >= 1 && !again && !o.optionsShow) {
          if (getAttr(o.j - 1) != 'snakeColor') {
            o.steps++;
            
            keyEnableNext = false;
            keyEnableBottom = false,
            keyEnableTop = false;
          
            clearTimeout(nextStepTimer);
            clearTimeout(bottomStepTimer);
            clearTimeout(topStepTimer);
          
            if(!keyEnableBack) {
              o.j--;
              removeBox(o.j);
              keyEnableBack = true;
              backStep(o.j);
            }
          }else {
            o.currentKeyCode = o.keyCodes[5];
          }
        }
        
        if(keyCode == o.keyCodes[4] && !again && !o.optionsShow) {
          var param = (o.j + elemWidth < elemAll) ? o.j + elemWidth : o.j;
          if (getAttr(param) != 'snakeColor') {
            o.steps++;
            
            keyEnableNext = false;
            keyEnableBack = false,
            keyEnableTop = false;
            
            clearTimeout(nextStepTimer);
            clearTimeout(backStepTimer);
            clearTimeout(topStepTimer);
            
            if(!keyEnableBottom && (o.j) <= elemAll - 1 ) {
              o.j+=elemWidth;
              if(o.j <= elemAll) {
                removeBox(o.j);
              }
              keyEnableBottom = true;
              bottomStep(o.j);
            }
          }else {
            o.currentKeyCode = o.keyCodes[2];
          }
        }
        
        if(keyCode == o.keyCodes[2] && !again && !o.optionsShow) {
          var param = (o.j - elemWidth > 0) ? o.j - elemWidth : o.j;
          if (getAttr(param) != 'snakeColor') {
            o.steps++;
          
            keyEnableNext = false;
            keyEnableBack = false,
            keyEnableBottom = false;
  
            clearTimeout(nextStepTimer);
            clearTimeout(backStepTimer);
            clearTimeout(bottomStepTimer);
            
            if(!keyEnableTop) {
              o.j-=elemWidth;
              if(o.j > 0) {
                removeBox(o.j);
              }
              keyEnableTop = true;
              topStep(o.j);
            }
          }else {
            o.currentKeyCode = o.keyCodes[4];
          }
        }
        
      }
  
      function nextStep() {
        if((o.j) % elemWidth == 0 || checkBox(o.j)) {
          clearTimeout(nextStepTimer);
          gameover();
          return;
        }
        if(o.j < elemAll) {
          removeBox(o.j);
        }
        arrStep(o.j);
        
        nextStepTimer = setTimeout(function() {
          o.j++;
          nextStep();
        }, o.speed);
      }
      
      function backStep() {
        if((o.j < 0 || (o.j+1)%elemWidth == 0) || checkBox(o.j)) {
          clearTimeout(backStepTimer);
          gameover();
          return;
        }
        if(o.j >= 0) {
          removeBox(o.j);
        }
        arrStep(o.j);
        
        backStepTimer = setTimeout(function() {
          o.j--;
          backStep(o.j);
        }, o.speed);
      }
      
      function bottomStep() {
        removeBox(o.j);
        arrStep(o.j);
        bottomStepTimer = setTimeout(function() {
          o.j+=elemWidth;
          if(o.j >= elemAll || checkBox(o.j)) {
            clearTimeout(bottomStepTimer);
            gameover();
            return;
          }
          bottomStep();
        }, o.speed);
      }
      
      function topStep() {
        if(o.j < 0 || checkBox(o.j)) {
          clearTimeout(topStepTimer);
          gameover();
          return;
        }
        if(o.j >= 0) {
          removeBox(o.j);
        }
        arrStep(o.j);
        topStepTimer = setTimeout(function() {
          o.j-=elemWidth;
          topStep(o.j);
        }, o.speed);
      }
      
      
      // ---- ai
      function ai() {
        removeAttribute(arr[arr.length-1]);
        o.snakeAI.position = o.j;
        o.snakeAI.item = o.randomItem;
        arrStep(o.j);
        
        o.snakeAI.timerGame = setTimeout(function() {
          if(o.snakeAI.position > o.snakeAI.item && Math.floor(o.snakeAI.item/elemWidth) == Math.floor(o.snakeAI.position/elemWidth)) {
            o.j--;
          }
          if(o.snakeAI.position < o.snakeAI.item && Math.floor(o.snakeAI.item/elemWidth) == Math.floor(o.snakeAI.position/elemWidth)) {
            o.j++;
          }
          if(o.snakeAI.position <= o.snakeAI.item && Math.floor(o.snakeAI.item/elemWidth) > Math.floor(o.snakeAI.position/elemWidth)) {
            o.j += elemWidth
          }
          if(o.snakeAI.position >= o.snakeAI.item && Math.floor(o.snakeAI.item/elemWidth) < Math.floor(o.snakeAI.position/elemWidth)) {
            o.j -= elemWidth
          }
  
          // -- restart ai
          if(o.score == o.snakeAI.limit) {
            restartGame();
          }
          
  
          if(getAttr(o.randomItem) != 'block') {
            rand();
          }
          
          ai();
        }, o.snakeAI.speed);
      }
      
      // --- start AI --- //
      if(o.snakeAI.start) {
        o.snakeAI.timerStart = setTimeout(function(){        
          backgameBlock();
          ai();
        }, o.snakeAI.startTime);
      }
      // --- //
      
      // --- start game --- //
      var start = document.getElementById('startgame');
      var options = document.getElementById('options');
      var blockStart = document.getElementById('blockStartgame');
      options.onclick = function() {
        blockStart.style.display = 'none';
        bKeys.style.display = 'block';
        o.optionsShow = true;
        o.game = false;
      };
      start.onclick = function() {
        clearTimeout(o.snakeAI.timerStart);
        clearTimeout(o.snakeAI.timerGame);
        o.snakeAI.start = false;
        o.game = true;
        blockStart.style.display = 'none';
        restartGame();
      };
      // --- //
      
      // --- blockOptions --- //
      var key = true;
      var bKeys = document.getElementById('blockOptions');
      var message = document.getElementById('message');
      var bKeysInput = bKeys.getElementsByTagName('input');
      var click = true;
      for(var i=0;i<bKeysInput.length;i++) {
        (function(index) {
          bKeysInput[i].onclick = function(e) {
          
            key = true;
            message.style.visibility = 'visible';
            
            if(!this.getAttribute('style') || !this.value) {
              click = true;
              for(var j = 0; j < bKeysInput.length; j++) {
                if(bKeysInput[j].value == '') {
                  bKeysInput[j].style.backgroundColor = 'red';
                }else {
                  bKeysInput[j].removeAttribute('style');
                }
              }
            }
            
            this.onkeydown = function(e) {
              if(key) {
                switch(e.keyCode) {
                  case 37:
                    x = '8592';
                    break;
                  case 38:
                    x = '8593';
                    break;
                  case 39:
                    x = '8594';
                    break;
                  case 40:
                    x = '8595';
                    break;
                  default:
                    x = e.keyCode;
                }
                
                for(var j = 0; j < bKeysInput.length; j++) {
                  if(bKeysInput[j].value.charCodeAt() == x) {
                    bKeysInput[j].value = '';
                    bKeysInput[j].style.backgroundColor = 'red';
                  }
                }
                
                bKeysInput[index].value = String.fromCharCode(x);
                bKeysInput[index].removeAttribute('style');
                key = false;
                click = true;
                
                e.stopPropagation();
              }
              message.style.visibility = 'hidden';
            };
            
            if(click) {
              this.removeAttribute('style');
              this.style.cssText = 'color:#fff;background-color:orange;';
              click = false;
            }else {
              this.removeAttribute('style');
              if(!this.value) {
                this.style.backgroundColor = 'red';
              }
              key = false;
              click = true;
              message.style.visibility = 'hidden';
            }
            
            
            e.stopPropagation();
          }
        })(i);
      }
      // --- //
  }