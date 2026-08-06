# AGENTS.md

Vendor-agnostic file for guiding AI agents, based on
[a simple, open format][agents].

## Introduction

This repo contains a Text User Interface (TUI) for running
[Conway's Game of Life][cgol]. See the following resources:

- [README.md][readme] — for app overview and tips on running it
- [DEVELOPMENT.md][development] — for coding, quality assurance, and
  publishing tips
- [CONVENTIONS.md][conventions] — for project and documentation conventions

## Git workflow

This project uses git worktrees, laid out as follows:

- root
  - `main` — do not touch
  - worktrees
    - `dev` — `dev` branch checked out, human-first coding. The human authors
      commit messages, commits, pushes, and creates PRs. Your job here is to
      assist with questions and help edit specific changes.
    - `agent` — `agent` branch checked out, agent-first coding. The human
      provides requirements; you create the implementation, QA it, commit,
      push, and create the PR.

Reuse branches rather than creating a new one per feature. For example, after a
PR based on `agent` has been merged, reset the branch with:

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

<!-- Internal -->

[readme]: ./README.md
[development]: ./DEVELOPMENT.md
[conventions]: ./CONVENTIONS.md

<!-- External -->

[agents]: https://agents.md/
[cgol]: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
