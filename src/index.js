var difficulty = 1

document.getElementById("start").onclick = start_game;
document.getElementById("difficulty").onclick = change_difficulty;
document.getElementById("playerType").onclick = changePlayerType;
document.getElementById("windType").onclick = changeWindType;
document.getElementById("customPIDCoefficientsCheckbox").onclick = showCustomCoeffBoxes;

function start_game() {
    console.log("Game Started");
    sessionStorage.setItem("difficulty", document.getElementById("difficulty").selectedIndex + 1); // +1 bc difficulties are 1-indexed
    sessionStorage.setItem("playerType", document.getElementById("playerType").selectedIndex);
    
    sessionStorage.setItem("useCustomPIDCoeff", document.getElementById("customPIDCoefficientsCheckbox").checked);
    if (document.getElementById("customPIDCoefficientsCheckbox").checked) {
        sessionStorage.setItem("customPIDCoefficients", [document.getElementById("pCoefficientInputBox").value,
        document.getElementById("iCoefficientInputBox").value, document.getElementById("dCoefficientInputBox").value]);
    }
    sessionStorage.setItem("windType", document.getElementById("windType").selectedIndex);
}

function change_difficulty() {
    console.log("change difficulty: " + document.getElementById("difficulty").selectedIndex);
}
function changePlayerType() {
    console.log("change player type: " + document.getElementById("playerType").selectedIndex);
    showCustomCoeffBoxes();
}
function changeWindType() {
    console.log("change wind type: " + document.getElementById("windType").selectedIndex);
    showCustomCoeffBoxes();
}

// custom PID coefficient input stuff

// displays PID coefficient inputs for when option selected
// from https://stackoverflow.com/questions/16015933/how-can-i-show-a-hidden-div-when-a-select-option-is-selected
function showCustomCoeffBoxes() {
    let customPIDCoeffChecked = document.getElementById("customPIDCoefficientsCheckbox").checked;
    let playerTypeIncludingPID = document.getElementById("playerType").selectedIndex != "0";
    document.getElementById("customPIDCoefficients").style.display = playerTypeIncludingPID ? 'block' : 'none';
    document.getElementById("customPIDCoefficientsInput").style.display = customPIDCoeffChecked && playerTypeIncludingPID ? 'flex' : 'none';
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