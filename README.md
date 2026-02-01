# game-of-life-tui

Game of Life Text User Interface (TUI)

A [Conway's Game of Life][gol] Text User Interface (TUI).

## Requirements

Tested on Deno v2.5.

## Running the Application

Run the game interactively:

```bash
deno run game-of-life.ts
```

Interactive Controls

- **R** or **r**: Refresh the grid with a new random pattern
- **Q** or **q**: Quit the application

Run once without interactive mode (useful for testing):

```bash
deno run game-of-life.ts --once
```

This will display the grid briefly and exit automatically.

[gol]: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
