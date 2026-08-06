# game-of-life-tui

Game of Life Text User Interface (TUI)

A [Conway's Game of Life][gol] Text User Interface (TUI).

## Requirements

Tested on Deno v2.9.x.

## Running the Application

Run the game interactively:

```bash
deno run mod.ts # default arguments
deno run mod.ts --interactive --pattern-key=pulsar
deno run mod.ts --no-interactive --pattern-key=pulsar --grid-width=17 --grid-height=17 --generations=3
```

Interactive Controls

- **R** or **r**: Refresh the grid with a new random pattern
- **Q** or **q**: Quit the application

## Testing

Run the test suite once:

```bash
deno task test
```

Run the test suite in watch mode, re-running on file changes:

```bash
deno task test:watch
```
