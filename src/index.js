var difficulty = 1

document.getElementById("start").onclick = start_game();
document.getElementById("difficulty").onclick = change_difficulty();
document.getElementById("ghostmode").onclick = ghost_mode();

function start_game() {
    console.log("Game Started");
}

function change_difficulty() {
    console.log("change difficulty" + document.getElementById("difficulty").selectedIndex);
    sessionStorage.setItem("level", document.getElementById("difficulty").selectedIndex + 1);
    // +1 bc index starts at 0
    // this does not work rn ope
}
function ghost_mode() {
    console.log("toggle ghost mode");
}