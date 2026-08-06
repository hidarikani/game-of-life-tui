# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Worktree

This project uses git worktrees, laid out as follows:

- root
  - `main` - do not touch
  - worktrees
    - `dev` - `dev` branch checked out, human-first coding. The human authors
      commit messages, commits, pushes, and creates PRs. Your job here is
      assisting with questions and helping edit specific changes.
    - `agent` - `agent` branch checked out, agent-first coding. The human
      provides requirements; you create the implementation, QA it, commit,
      push, and create the PR.

Reuse branches rather than creating a new one per feature. For example, after
a PR based on `agent` has been merged, reset the branch with:

```bash
# while on agent branch
git fetch origin --prune
git reset --hard origin/main
git push --force-with-lease
```

## Commands

````bash
# Run once and exit
deno task run:agent

## Git workflow

This repo uses worktrees. Never use `git -C` or `git checkout` to switch branches — use the `gh` CLI for PR operations and stay in the `agent` worktree.

Merge PRs with squash:

```bash
gh pr merge <number> --squash
````

After merging, reset `agent` to `main` and force push:

```bash
git fetch origin main && git reset --hard origin/main
git push --force origin agent
```

## Testing

Uses Deno's built-in test runner with `@std/assert`. Tests are hierarchical —
`Deno.test()` with nested `t.step()`.

After every code change, run tests with:

```bash
deno task test:agent
```

To re-run tests automatically on file changes during development:

```bash
deno task test:watch
```

Test files live alongside source. Example:

```
|- src
  |- terminal
     |- terminal.ts
     |- terminal.test.ts
```

## Code Style

Comments on symbols (functions, classes, exported bindings) use JSDoc
(`/** ... */`), not `//` line comments.

## Architecture

This TUI is a frontend for the `@hidarikani/game-of-life-engine` package, which
implements the actual Game of Life grid/pattern/evolution logic (see
`src/game/game.ts`). Its docs live at
https://jsr.io/@hidarikani/game-of-life-engine — check there before assuming a
type or API needs to be discovered from source.

- **`src/constants.ts`** — all ANSI escape sequences (alternate screen, cursor
  control, screen clear) and key/cell character literals. Any new terminal
  control codes or configurable constants belong here.
- **`src/terminal.ts`** — terminal helpers: `write`, `getSize`,
  `enterAltScreen`, `leaveAltScreen`, `clearScreen`, `enableRawMode`,
  `disableRawMode`, `readKey`, and the `Size` type.
- **`src/game.ts`** — game logic. Currently `renderGrid` generates a random grid
  on every call (Game of Life evolution logic is not yet implemented).
- **`mod.ts`** — entry point (also the package's JSR `exports` target). Owns the
  TUI lifecycle: enter/leave alternate screen, raw-mode stdin, and the
  render/key loop.

The grid width is halved from the terminal column count
(`Math.floor(columns / 2)`) to compensate for the `COL_SEPARATOR` space between
each cell, keeping cells square on a standard terminal.
