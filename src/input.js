import Ship from "./ship.js"

export default class InputHandler {

    constructor(ship) {
        document.addEventListener("keydown", event => {
            switch(event.key) {
                case 'ArrowUp':
                    ship.moveUp()
                    break

                case 'ArrowDown':
                    ship.moveDown()
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
}

//hellow rodl