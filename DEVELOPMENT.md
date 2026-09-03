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

## Interactive Rendering

Interactive mode is rendered with [Ink][ink], a React renderer for terminals,
pulled in through `npm:` specifiers — [`deno.json`][deno-json] pins both `ink`
and `react`. Non-interactive mode is unaffected: it still writes rendered
generations straight to stdout.

Because React ships no bundled types, [`deno.json`][deno-json] sets
`jsxImportSourceTypes` to `@types/react` alongside the usual `jsx` and
`jsxImportSource` compiler options. Ink also reaches for `node:tty`, so running
the app requires `--allow-env`, `--allow-read` and `--allow-write`; the
[README][readme] documents those flags for end users.

### stdin compatibility layer

Ink reads the keyboard through Node's `readable` event and `stream.read()`.
Under Deno's `process.stdin` compatibility layer that pairing never yields data
— the event fires, but every read returns `null` — so `useInput` would never see
a keystroke. [`src/ui/stdin-bridge.ts`][stdin-bridge] closes the gap: it puts
`Deno.stdin` in raw mode, reads it directly, and pumps the bytes into a
`PassThrough` stream that presents itself to Ink as a TTY. That stream is what
gets handed to Ink's `render(..., { stdin })`.

> [!WARNING]
> Don't "simplify" the bridge away by passing `process.stdin` to `render()`. It
> type checks, renders correctly, and even reports
> `isRawModeSupported === true`, but no key ever reaches the app. Confirmed
> against Ink 5 and 6 on Deno 2.9.

Two further consequences of running Ink on Deno:

- The process does not exit on its own once the Ink app unmounts, because Ink's
  stdin handling keeps the event loop alive. [`mod.ts`][mod] therefore calls
  `process.exit()` explicitly after `waitUntilExit()`.
- Keys can arrive batched in a single `useInput` call — typed during startup, or
  pasted, in which case Enter appears as a literal newline inside the string
  rather than as `key.return`. [`src/ui/App.tsx`][app] therefore walks each
  chunk character by character, and mirrors its state in a ref, since Ink
  dispatches events back to back before React commits the previous update.

Interactive behavior can't be covered by [deno test][deno-test], since it needs
a real TTY. Changes to the rendering or input path SHOULD be exercised manually,
or driven through a pseudo-terminal with a tool such as `expect`.

> [!TIP]
> When driving the app with `expect`, keep draining its output between
> keystrokes (for example `expect -timeout 2 "ZZZ_NEVER_MATCHES"`). A bare
> `sleep` leaves the pty buffer unread, which blocks the app's own writes and
> makes keystrokes look like they were ignored.

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
[readme]: README.md
[mod]: mod.ts
[app]: src/ui/App.tsx
[stdin-bridge]: src/ui/stdin-bridge.ts

<!-- External -->

[deno]: https://deno.com/
[deno-check]: https://docs.deno.com/runtime/reference/cli/check/
[deno-lint]: https://docs.deno.com/runtime/reference/cli/lint/
[deno-fmt]: https://docs.deno.com/runtime/reference/cli/fmt/
[deno-test]: https://docs.deno.com/runtime/reference/cli/test/
[jsr]: https://jsr.io
[tui]: https://jsr.io/@cell-auto/game-of-life-tui
[engine]: https://jsr.io/@hidarikani/game-of-life-engine
[ink]: https://github.com/vadimdemedes/ink
