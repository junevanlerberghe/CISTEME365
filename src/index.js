var difficulty = 1

document.getElementById("start").onclick = start_game;
document.getElementById("difficulty").onclick = change_difficulty;
document.getElementById("playerType").onclick = ghost_mode;

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