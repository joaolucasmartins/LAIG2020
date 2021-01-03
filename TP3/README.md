# LAIG 2020/2021 - TP3

## Group: T0xG0y

| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| John Doe         | 201801010 | ...                |
| Jane Doe         | 201801011 | ...                |

----
## Project information

- (items describing main strong points)
- Scene
  - (Brief description of the created scene)
  - (relative link to the scene)
----
## Issues/Problems

- (items describing unimplemented features, bugs, problems, etc.)


### **User Instructions**
#### **Piece Movement**
In order to execute a move the player must select the piece which he wishes to move and then select the piece in the destination tile. After having done that, and if the chosen move is valid, the origin and destination pieces will switch positions.  
In order to facilitate the gameplay, when a piece is selected the pieces that can be switched with current one will also be highlighted.  

#### **Menu**
The menu is a game object which is present in every theme and allows the for the configuration of the game.
It is composed by the following components:
+ **Mode Buttons** - allows the selection of three distinct game modes:
   + PvB - Player vs Player
   + PvP - Player vs Player
   + BvB - Bot vs Bot
+ **Level Buttons** - allows for the selection of two AI levels:
   + Easy - AI chooses random moves
   + Normal - AI selects the best generated move
+ **Theme Buttons** - allows for the selection of one of three predifined themes
+ **Action Buttons** - used for the following actions:
   + **Start** - pans the camera to the game board and starts the game
   + **Apply** - applies the selected settings in the menu board
   + **Board** - brings the game board into view
+ **Timeout Counter** - used for selecting the timeout for every turn
+ **Size Counter** - used for selecting the desired game board size

#### **Score Board**
The score board allows for a better understanding of the current game state. It displays the current player as well as each of the player's scores. At the end of the game it is also responsible for displaying the winner of the match.
The score board is composed by the following components:
+ **Undo Button** - allows the player to revert a move after executing it
+ **Menu Buttons** - pans the camera over to the menu panel
+ **Status Indicators** - lights indicating player turns
+ **Scores** - section with each of the piece's colors and their current scores