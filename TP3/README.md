# LAIG 2020/2021 - TP3

## Group: T03G09

| Name             | Number    | E-Mail               |
| ---------------- | --------- | -------------------- |
| Ivo Saavedra     | 201707093 | up201707093@fe.up.pt |
| João Martins     | 201806436 | up201806436@fe.up.pt |

----
## Project information

### **Features**
+ Board with user defined size
+ 3 distinct themes
+ Interactive menu in scene
+ Interactive scoreboard in scene
+ 3 game modes (PvP, PvB and BvB)
+ 2 levels of dificulty for AI
+ Animations for piece selection and movement
+ Timeout counter
+ Undo functionality
+ Replay fucntionality
+ Camera animations

In order to execute this application first you must open the SISCstus console and
consult the **"server.pl"** file located in the **prolog-server** folder. After consulting,
start the prolog server by invoking the **server** predicate.
Once this setup is done, a localhost must be initiated in the project's folder. The
WebCGF library must also be in this folder.
Using the terminal, travel to the location of the main project's folder and start
the host with the following command **python -m http.server 8000**.
When all these steps are completed, you only need to open the created localhost 
in the desired browser.

### **Issues/Problems**

Currently there are no known errors or bugs and we consider that every proposed
feature has been implemented.

---

## **Game Rules**

Emulsion is a board game designed for two players. The board is constituted by
a NxN grid, N being an integer that can be specified within the game menu.
In the beginning of the game, the pieces are organized in a chess-like pattern.


### **Basic definitions**

- The **value** of a piece is the number of pieces orthogonaly adjacent to itself
  plus half of the number of borders that the piece touches.

- The **group** of a piece is the set of all pieces that can be visited using
  orthogonal movements between adjacent pieces.

- The **size** of a group is the number of its pieces.

- The **score** of a player is size of its largest group.

#### **Move**

A move consists of switching two pieces of different colors. When a player
makes a move, the piece of his colour must have its value increased as
a result of the move.
If a move isn't made before the timer runs out, the turn is skipped and
the next player may move.

#### **Game flow**

The black pieces are played first. After each move, the next player makes his
move.
The game ends when no available moves can be played. Generaly, the player with
the biggest group wins.
If both groups of both players are of the same size, the player with
the second biggest group wins. If a draw still occurs, this verification
is done successively until both players have exausted all of their groups.
In this case both players have the exact same groups, and the player who
made the last move wins.

---
## **User Instructions**

### **Piece Movement**
In order to execute a move the player must select the piece which he wishes to
move and then select the piece in the destination tile. After that,
if the chosen move is valid, the origin and destination pieces will switch positions.  
In order to facilitate gameplay, if the player chooses a piece that he doesn't own,
the pieces in which the values are increased when switched are highlighted.  
A switching animation is played to represent a move.
A highlight animation is played to better highlight a selected piece.

### **Menu**
The menu is a game object which is present in every theme and is used for the game's configuration.
It is composed by the following components:
+ **Mode Buttons** - allows the selection of three distinct game modes:
   + PvB - Player vs Bot
   + PvP - Player vs Player
   + BvB - Bot vs Bot
+ **Level Buttons** - allows for the selection of two AI levels:
   + Easy - AI chooses random moves
   + Normal - AI selects the move which maximizes the size of its biggest group
+ **Theme Buttons** - allows for the selection of one of three predifined themes
+ **Action Buttons** - used for the following actions:
   + **Start** - pans the camera to the game board and starts the game
   + **Apply** - applies the selected settings in the menu board
   + **Board** - transitions the camera to the game board
+ **Timeout Counter** - used for selecting the timeout limit for every turn
+ **Size Counter** - used for selecting the desired game board size

### **Score Board**
The score board allows for a better understanding of the current game state.
It displays the current player as well as each of the player's scores.
At the end of the game it is also responsible for displaying the winner of the match.
The score board is composed by the following components:
+ **Undo Button** - allows the player to revert a move after executing it
+ **Menu Button** - pans the camera over to the menu panel
+ **Status Indicators** - lights indicating player turns
+ **Scores** - section with each of the piece's colors and their current scores
