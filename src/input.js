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

                case 'Escape':
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
                    break
            }
        });

        document.addEventListener("keyup", event => {
            switch(event.key) {
                case 'ArrowDown':
                    if(ship.velocity > 0) ship.stop()
                    break
                    
                case 'ArrowUp':
                    if(ship.velocity < 0) ship.stop()
                    break

            }
        });
        
    }
    /*constructor(ship) {
        document.addEventListener("keydown", event =>{
            alert(event.keycode);
            /*switch(event.key) {
            
            }
        })*/
    
}