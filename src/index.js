var difficulty = 1

document.getElementById("start").onclick = start_game;
document.getElementById("difficulty").onclick = change_difficulty;
document.getElementById("playerType").onclick = ghost_mode;
document.getElementById("customPIDCoefficientsCheckbox").onclick = showDiv;

function start_game() {
    console.log("Game Started");
    sessionStorage.setItem("difficulty", document.getElementById("difficulty").selectedIndex + 1); // +1 bc difficulties are 1-indexed
    sessionStorage.setItem("playerType", document.getElementById("playerType").selectedIndex);
}

function change_difficulty() {
    console.log("change difficulty: " + document.getElementById("difficulty").selectedIndex);
}
function ghost_mode() {
    console.log("change player type: " + document.getElementById("playerType").selectedIndex);
}

// custom PID coefficient input stuff

// displays PID coefficient inputs for when option selected
// from https://stackoverflow.com/questions/16015933/how-can-i-show-a-hidden-div-when-a-select-option-is-selected
function showDiv() {
    document.getElementById("customPIDCoefficientsInput").style.display = document.getElementById("customPIDCoefficientsCheckbox").checked ? 'flex' : 'none';
}
// event listeners and funcs to ensure custom PID coefficient inputs are legal
document.getElementById("customPIDCoefficientsInput").addEventListener("change", function() {
    checkPIDCoefficientValues("pCoefficientInputBox");
    checkPIDCoefficientValues("iCoefficientInputBox");
    checkPIDCoefficientValues("dCoefficientInputBox");
});
function checkPIDCoefficientValues(elementID) {
    let element = document.getElementById(elementID)
    let v = parseInt(element.value);
    if (v < 0) element.value = 0;
    console.log(v);
}