# AGENTS.md

See https://agents.md/

Also see [DEVELOPMENT.md][development] for quality-assurance, testing, and
publishing commands, and [CONVENTIONS.md][conventions] for project and
documentation conventions.

## Git workflow

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
Merge PRs with squash:

```bash
gh pr merge <number> --squash
```

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

<!-- Internal -->

[development]: ./DEVELOPMENT.md
[conventions]: ./CONVENTIONS.md
