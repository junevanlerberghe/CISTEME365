var difficulty = 1

document.getElementById("start").onclick = start_game;
document.getElementById("difficulty").onclick = change_difficulty;
document.getElementById("ghostmode").onclick = ghost_mode;

function start_game() {
    console.log("Game Started");
    sessionStorage.setItem("difficulty", document.getElementById("difficulty").selectedIndex + 1); // +1 bc difficulties are 1-indexed
    sessionStorage.setItem("ghostMode", document.getElementById("ghostmode").checked);
}

function change_difficulty() {
    console.log("change difficulty: " + document.getElementById("difficulty").selectedIndex);
}
function ghost_mode() {
    console.log("toggle ghost mode: " + (document.getElementById("ghostmode").checked ? "true" : "false"));
}