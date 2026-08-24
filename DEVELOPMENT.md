# Development

Runs on [Deno][deno]. Tested with `deno --version` `2.9.x`.

> [!TIP]
> **Working with local dependency updates during active development**
>
> Since Deno 2.9, `deno update`/`deno outdated` skip any package version
> published in the last 24 hours by default (supply-chain cooldown). As this
> package depends on [game-of-life-engine][engine], which might be updated often
> during development, this will block you from picking up fresh
> [game-of-life-engine][engine] versions.
>
> To bypass the cooldown when updating dependencies locally, pass
> `--minimum-dependency-age=0`:
>
> ```bash
> deno update --minimum-dependency-age=0
> ```
>
> This only affects your local resolution — it won't change `deno.lock` cooldown
> behavior for other contributors or CI. Don't disable the cooldown globally in
> `deno.json`; keep it scoped to this one command.

## Quality Assurance

Deno native quality assurance tools SHALL be executed after making changes:

- [deno fmt][deno-fmt]
- [deno check][deno-check]
- [deno lint][deno-lint]
- [deno test][deno-test]

Automated test suite SHALL be executed before commiting:

```bash
# run unit tests in watch mode - human friendly
deno task test:watch
# run once - agent friendly
deno task test
```

### Publishing

Published to [JSR][jsr] at [@game-of-life-tui][tui] happens automatically in CI
via the [publish workflow][publish-workflow] on every push to `main`. See
[`deno.json`][deno-json] for all the JSR settings.

Because CI publishes on a version that's already merged to `main`, publish-time
issues (like an unresolvable import) are otherwise only caught after the fact.
To catch these earlier, dry-run a publish locally before merging:

```zsh
deno publish --dry-run
```

This runs the same checks as CI (types, slow types, file resolution) without
uploading anything. If it succeeds locally, `deno publish` (the command CI runs)
should succeed too.

To publish for real from a local machine — for example to hotfix a release
without waiting on CI run:

```zsh
deno publish
```

<!-- Internal -->

[publish-workflow]: .github/workflows/publish.yml
[deno-json]: deno.json

<!-- External -->

[deno]: https://deno.com/
[deno-check]: https://docs.deno.com/runtime/reference/cli/check/
[deno-lint]: https://docs.deno.com/runtime/reference/cli/lint/
[deno-fmt]: https://docs.deno.com/runtime/reference/cli/fmt/
[deno-test]: https://docs.deno.com/runtime/reference/cli/test/
[jsr]: https://jsr.io
[tui]: https://jsr.io/@cell-auto/game-of-life-tui
[engine]: https://jsr.io/@hidarikani/game-of-life-engine
