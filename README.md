# game-of-life-tui

Game of Life Text User Interface (TUI)

A [Conway's Game of Life][gol] Text User Interface (TUI).

## Requirements

Tested on Deno v2.9.x.

## Installation

Install the package globally from JSR as a named executable, `cgol`:

```bash
deno install -g -n cgol jsr:@cell-auto/game-of-life-tui
```

This adds a `cgol` command to Deno's install directory
(`$HOME/.deno/bin` by default). If `cgol` isn't found after installing, add
that directory to your `PATH`:

```bash
echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.zshrc # or ~/.bashrc
source ~/.zshrc
```

Open a new terminal and run it:

```bash
cgol
```

To upgrade to the latest published version, reinstall with `-f` (force):

```bash
deno install -g -n cgol -f jsr:@cell-auto/game-of-life-tui
```

### Alias instead of installing

If you'd rather not run `deno install`, you can add a shell alias that runs
the package directly from JSR instead:

```bash
echo 'alias cgol="deno run jsr:@cell-auto/game-of-life-tui"' >> ~/.zshrc # or ~/.bashrc
source ~/.zshrc
```

Open a new terminal and `cgol` will now fetch (and cache) the package on
first run.

## Running the Application

Running from a local clone of this repository:

```bash
deno run mod.ts # default arguments
deno run mod.ts --interactive --pattern-key=pulsar
deno run mod.ts --no-interactive --pattern-key=pulsar --grid-width=17 --grid-height=17 --generations=3
```

Interactive Controls

- **R** or **r**: Refresh the grid with a new random pattern
- **Q** or **q**: Quit the application

## Development

See [DEVELOPMENT.md][development] for running tests, linting, and other
quality-assurance and publishing steps.

<!-- Internal -->

[development]: ./DEVELOPMENT.md
