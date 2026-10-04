# HubSpot HubL by FreshJuice

Syntax highlighting for HubL, HubSpot's templating language, in the [Zed editor](https://zed.dev/). Built for daily HubSpot CMS work: templates, modules, sections, macros, email HTML.

Highlights everything HubL actually uses:

- Tags `{% ... %}`, variables `{{ ... }}`, comments `{# ... #}`
- Filters (`|upper`, `| truncate`), property access, operators, ternary `? :`
- Whitespace trimming (`{%-`, `-%}`, `{{-`, `-}}`)
- Nested expressions, like `no_wrapper={{ !is_in_editor }}` inside a `{% module %}` block
- HTML and CSS around the HubL, via language injection

## Installation

### Dev extension

1. Clone the repo
2. In Zed: `Cmd+Shift+P` → `zed: install dev extension`
3. Select the cloned directory

### File types

`.hubl`, `.hubl.html` and `.hubl.css` are detected automatically. Zed's built-in extensions claim plain `.html` and `.css`, so for HubSpot projects map them in settings:

```json
{
  "file_types": {
    "HTML + HubL": ["html"],
    "CSS + HubL": ["css"]
  }
}
```

Or per project, in the repo's `.zed/settings.json`. You can also pick the language from the status bar.

## Grammar

The parser lives in [`grammar/`](grammar/) - no external grammar repositories, Zed compiles it straight from this repo. To change it ([tree-sitter CLI](https://tree-sitter.github.io/tree-sitter/creating-parsers/tool-overview.html) v0.24+):

```sh
cd grammar
tree-sitter generate
tree-sitter test
```

Corpus regressions live in `test/corpus/`. After a grammar change: commit, push, then point `rev` in `extension.toml` at the new SHA.

## License

MIT - see [LICENSE](LICENSE).