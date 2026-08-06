# Structure

## Deno and JSR

Some conventions stem from the decision to base the project on [Deno][deno] and
publish it to [JSR][jsr]. The project defines publishing settings in
[deno.json][deno-config].

## JSDoc

Major code symbols SHALL be documented with JSDoc. Since the project is
TypeScript first, [JSDoc][js-doc] comments SHALL NOT explain types. It's
worth mentioning that packages documented with [JSDoc][js-doc] receive a
higher score from [JSR][jsr].

## Markdown Docs

- GitHub Flavored Markdown SHALL be used. This allows for the use of emojis
  and alerts.
- Reference-style links SHALL be used. References SHALL be grouped into
  "internal" and "external" sections. See the example at the end of this
  file.

- root
  - [README.md][readme] — first thing the user reads. Contains installation
    and quick-start guide. Links to advanced topics. MUST NOT repeat
    information already defined in other docs like CONVENTIONS.md or
    [DEVELOPMENT.md][development]; it should reference them instead.
  - CONVENTIONS.md — project organisation conventions (this file).
  - [DEVELOPMENT.md][development] — information on quality assurance and
    publishing.
  - [AGENTS.md][agents] — vendor-agnostic agentic instructions. Instead of
    repeating information from other files, it should use references.

<!-- Internal -->

[readme]: ./README.md
[development]: ./DEVELOPMENT.md
[agents]: ./AGENTS.md
[deno-config]: ./deno.json

<!-- External -->

[deno]: https://deno.com/
[jsr]: https://jsr.io
[js-doc]: https://jsdoc.app/
