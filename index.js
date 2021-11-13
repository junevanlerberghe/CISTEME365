
var difficulty = 1

document.getElementById("start").onclick = start_game();
document.getElementById("difficulty").onclick = change_difficulty();
// document.getElementById("ghostmode").onclick = ghost_mode();

function start_game() {
    console.log("Game Started");
}

function change_difficulty() {
    console.log("change difficulty");
}
function ghost_mode() {
    console.log("toggle ghost mode");
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }