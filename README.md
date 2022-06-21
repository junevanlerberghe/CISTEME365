# Ship Steering Game to learn PID Control

Welcome! This game can be played online at: https://junevanlerberghe.github.io/CISTEME365/. The first page has all of the instructions needed to play along with some settings.

You can play as a single player, ghost player (PID) or both. As 1-player, you are steering the ship to get between the obstacles as close to the middle as you can. The ghost ship moves automatically according to PID control. You can control the PID constants at the bottom of the screen to see how each part (P, I, D) affects the ghost ship's movement. The graph on the bottom right depicts how hard each aspect of the PID is working to get the ship in the right place.

![image](https://user-images.githubusercontent.com/18633635/174692738-801d122e-cfe9-4ad7-b9c7-56a82c183b23.png)

## Code Structure

There are 3 html files that represent each of the three game pages (index, game, summary).
The JavaScript files are all found in the src folder and they control the game play.
The Assets folder contains the images used in the game.
