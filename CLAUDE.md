# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Worktree

All work must be done in the `agent` branch, checked out at:

```
/Users/marekpavilovic/GitHub/hidarikani/game-of-life-tui/worktrees/agent
```

Do not modify files in any other worktree (`main`, `dev`).

## Commands

```bash
# Run the TUI interactively
deno run game-of-life.ts

# Run once and exit (useful for non-interactive testing)
deno run game-of-life.ts --once
```

`deno.json` defines a `dev` task (`deno run --watch main.ts`) but `main.ts` does not yet exist — use the commands above directly.

## Architecture

Two files:

- **`constants.ts`** — all ANSI escape sequences (alternate screen, cursor control, screen clear) and key/cell character literals. Any new terminal control codes or configurable constants belong here.
- **`game-of-life.ts`** — entry point. Owns the TUI lifecycle: enter/leave alternate screen, raw-mode stdin, the render loop, and `renderGrid`. Currently `renderGrid` generates a random grid on every call (Game of Life evolution logic is not yet implemented).

The grid width is halved from the terminal column count (`Math.floor(columns / 2)`) to compensate for the `COL_SEPARATOR` space between each cell, keeping cells square on a standard terminal.
