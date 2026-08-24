# Development

Runs on [Deno][deno]. Tested with `deno --version` `2.9.x`.

## Quality Assurance

Deno native quality assurance tools SHALL be used:

- [deno fmt][deno-fmt]
- [deno check][deno-check]
- [deno lint][deno-lint]
- [deno test][deno-test]

```bash
# run unit tests in watch mode - human friendly
deno task test:watch
# run once - agent friendly
deno task test
```

### Publishing

Published to [JSR][jsr] at [@game-of-life-tui][package] happens automatically in
CI via the [publish workflow][publish-workflow] on every push to `main`. See
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
[package]: https://jsr.io/@cell-auto/game-of-life-tui
