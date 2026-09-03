# game-of-life-tui

This repo contains a Text User Interface (TUI) for running
[Conway's Game of Life][cgol]. The game's rules have been extensively documented
elsewhere, including on [Wikipedia][cgol], so they aren't repeated here.

This library focuses on text user interface concerns, and relies on
[game-of-life-engine][engine] for the actual simulation logic.

This library is part of a larger namespace of tools:

- [game-of-life-engine][engine] — contains the actual game logic, grid and
  pattern management, and simulation algorithm
- **game-of-life-tui** — this package
- React component for rendering game state (in planning stage)
- Next.js website for running interactive simulations in the browser (in
  planning stage)

> [!NOTE]
> This package isn't intended to be imported. It doesn't expose any symbols.
> Instead, it's meant to be run directly by a human user to view simulation
> results.

> [!WARNING]
> This library isn't stable yet. The API is expected to change, and features may
> be added or removed without notice. The first stable release will be `v1.0.0`.
> Until then, major versions will stay below one: `v0.x.x`.

## Requirements

Tested on Deno v2.9.x.

## Installation

Install the package globally from JSR as a named executable, `cgol`:

```bash
deno install -g -n cgol --allow-env --allow-read --allow-write jsr:@cell-auto/game-of-life-tui
```

The permission flags are needed by the [Ink][ink] rendering layer: `--allow-env`
and `--allow-read` for loading React and Ink, `--allow-write` for Ink's
`node:tty` terminal handling. Omitting them works too — Deno will then prompt
for each permission on first run.

This adds a `cgol` command to Deno's install directory (`$HOME/.deno/bin` by
default). If `cgol` isn't found after installing, add that directory to your
`PATH`:

```bash
echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.zshrc # or ~/.bashrc
source ~/.zshrc
```

Open a new terminal and run it:

```bash
cgol
```

## Running the Application

Running from a local clone of this repository:

```bash
deno run --allow-env --allow-read --allow-write mod.ts # default arguments
deno run --allow-env --allow-read --allow-write mod.ts --interactive --pattern-key=pulsar
deno run --allow-env --allow-read --allow-write mod.ts --no-interactive --pattern-key=pulsar --grid-width=17 --grid-height=17 --generations=3
```

### Interactive Controls

- **R** or **r**: Advance the simulation one generation
- **P** or **p**: Open the pattern selection list (**↑**/**↓** to move,
  **Enter** to restart the simulation with the chosen pattern, **Esc** to go
  back)
- **Q** or **q**: Quit the application

A toolbar at the bottom of the screen lists the controls available in the
current view. The interactive view is rendered with [Ink][ink], a React-based
terminal renderer.

## Development

See [CONVENTIONS.md][conventions] for the project's organisation conventions,
and [DEVELOPMENT.md][development] for running tests, linting, and other
quality-assurance and publishing steps.

<!-- Internal -->

[conventions]: ./CONVENTIONS.md
[development]: ./DEVELOPMENT.md

<!-- External -->

[engine]: https://jsr.io/@hidarikani/game-of-life-engine
[cgol]: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
[ink]: https://github.com/vadimdemedes/ink
