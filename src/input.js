import Ship from "./ship.js"
import Game from "./game.js"
let count = 0;

export default class InputHandler {

    constructor(ship, game) {
        document.addEventListener("keydown", event => {
            
            switch(event.key) {
                case 'ArrowUp':
                    ship.moveUp()
                    event.preventDefault();
                    break

                case 'ArrowDown':
                    ship.moveDown()
                    event.preventDefault();
                    break

                case 'ArrowLeft':
                    document.getElementById('btnFullscreen').click()
                    break

                /*case 'Enter':
                    //alert("Game Paused")
                    if(count == 0) {
                        count = 1;
                        game.pauseGame()
                        console.log('pause')
                    }
                    else if(count == 1) {
                        count = 0;
                        game.resumeGame()
                        console.log('resume')
                    }
                    break*/
            }
        });

        document.addEventListener("keyup", event => {
            switch(event.key) {
                case 'ArrowDown':
                    ship.stop();
                    event.preventDefault();
                    break
                    
                case 'ArrowUp':
                    ship.stop();
                    event.preventDefault();
                    break

            }
        });

        document.addEventListener("touchstart", startTouch, false);
        document.addEventListener("touchmove", moveTouch, false);
        document.addEventListener("touchend", stopTouch, false);
        document.body.classList.add("stop-scrolling")
                    
        // Swipe Up / Down / Left / Right
        var initialX = null;
        var initialY = null;

        function stopTouch(e) {
            ship.stop();
            e.preventDefault();
        }
        
        function startTouch(e) {
            initialX = e.touches[0].clientX;
            initialY = e.touches[0].clientY;
        };
        
        function moveTouch(e) {
            if (initialX === null) {
            return;
            }
        
            if (initialY === null) {
            return;
            }
        
            var currentX = e.touches[0].clientX;
            var currentY = e.touches[0].clientY;
        
            var diffX = initialX - currentX;
            var diffY = initialY - currentY;
        
            if (Math.abs(diffX) > Math.abs(diffY)) {
            // sliding horizontally
            if (diffX > 0) {
                // swiped left
                console.log("swiped left");
            } else {
                // swiped right
                console.log("swiped right");
            }  
            } else {
            // sliding vertically
            if (diffY > 0) {
                // swiped up
                ship.moveUp()
            } else {
                // swiped down
                ship.moveDown()
            }  
            }
        
            initialX = null;
            initialY = null;
            
            e.preventDefault();
        };
        /*document.addEventListener("keydown", function(e){
            if (e.key === "Enter"){
                toggleFullScreen();
            }
        },false);
        /*
        function toggleFullScreen(){
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
              if (document.exitFullscreen) {
                document.exitFullscreen();
              }
            }
        }*/
        
    }
    /*constructor(ship) {
        document.addEventListener("keydown", event =>{
            alert(event.keycode);
            /*switch(event.key) {
            
            }
        })*/
    
}