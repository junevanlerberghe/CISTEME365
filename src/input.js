import Ship from "./ship.js"
import Game from "./game.js"
let count = 0;

export default class InputHandler {

    constructor(ship, game) {
        document.addEventListener("keydown", event => {
            
            switch(event.key) {
                case 'ArrowUp':
                    ship.moveUp()
                    break

                case 'ArrowDown':
                    ship.moveDown()
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
                    break
                    
                case 'ArrowUp':
                    ship.stop();
                    break

            }
        });
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