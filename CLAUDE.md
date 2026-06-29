# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Worktree

All work must be done in the `agent` branch. This repo uses git worktrees — the `agent` branch is checked out in a `worktrees/agent` subdirectory relative to the repo root.

Do not modify files in any other worktree (`main`, `dev`).

## Commands

```bash
# Run once and exit
deno task run:agent

## Git workflow

This repo uses worktrees. Never use `git -C` or `git checkout` to switch branches — use the `gh` CLI for PR operations and stay in the `agent` worktree.

Merge PRs with squash:

```bash
gh pr merge <number> --squash
```

After merging, reset `agent` to `main` and force push:

```bash
git fetch origin main && git reset --hard origin/main
git push --force origin agent
```

## Architecture

- **`src/constants.ts`** — all ANSI escape sequences (alternate screen, cursor control, screen clear) and key/cell character literals. Any new terminal control codes or configurable constants belong here.
- **`src/terminal.ts`** — terminal helpers: `write`, `getSize`, `enterAltScreen`, `leaveAltScreen`, `clearScreen`, `enableRawMode`, `disableRawMode`, `readKey`, and the `Size` type.
- **`src/game.ts`** — game logic. Currently `renderGrid` generates a random grid on every call (Game of Life evolution logic is not yet implemented).
- **`src/main.ts`** — entry point. Owns the TUI lifecycle: enter/leave alternate screen, raw-mode stdin, and the render/key loop.

The grid width is halved from the terminal column count (`Math.floor(columns / 2)`) to compensate for the `COL_SEPARATOR` space between each cell, keeping cells square on a standard terminal.
