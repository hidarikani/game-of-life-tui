# Structure

## Language

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**,
**SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL** in this
document are to be interpreted as defined in [RFC 2119][rfc-2119]. In brief:
**MUST** (or **REQUIRED**) denotes an absolute requirement — for example,
"implementations MUST validate the signature before processing the payload."
**MUST NOT** denotes an absolute prohibition — for example, "a client MUST NOT
retry a request that has already succeeded." **SHOULD** indicates a strong
recommendation that may be set aside only when the implications are fully
understood, while **SHOULD NOT** indicates the inverse. **MAY** (or
**OPTIONAL**) indicates a feature is genuinely optional and left to the
implementer's discretion. These terms carry their defined meaning only when
capitalized as shown; in lowercase they are ordinary English words without
normative force.

## Deno and JSR

Some conventions stem from the decision to base the project on [Deno][deno] and
publish it to [JSR][jsr]. The project defines publishing settings in
[deno.json][deno-config].

## JSDoc

Major code symbols SHALL be documented with JSDoc. Since the project is
TypeScript first, [JSDoc][js-doc] comments SHALL NOT explain types. It's worth
mentioning that packages documented with [JSDoc][js-doc] receive a higher score
from [JSR][jsr].

## Testing

Test files SHALL live alongside the source they test. Example:

```
|- src
  |- terminal
     |- terminal.ts
     |- terminal.test.ts
```

## Markdown Docs

- GitHub Flavored Markdown SHALL be used. This allows for the use of emojis and
  alerts.
- Reference-style links SHALL be used. References SHALL be grouped into
  "internal" and "external" sections. See the example at the end of this file.

- root
  - [README.md][readme] — first thing the user reads. Contains installation and
    quick-start guide. Links to advanced topics. MUST NOT repeat information
    already defined in other docs like CONVENTIONS.md or
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
[rfc-2119]: https://www.rfc-editor.org/rfc/rfc2119.html
