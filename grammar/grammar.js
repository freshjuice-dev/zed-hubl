/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "hubl",

  extras: (_$) => [],

  rules: {
    source_file: ($) => repeat($._node),

    _node: ($) =>
      choice($.comment, $.statement, $.expression, $.content),

    // Content: everything that's not a HubL tag
    // Matches one or more characters that are not the start of a HubL delimiter
    content: (_$) => prec(-1, /([^{]|\{[^{%#])+/),

    // {# comment #} with optional whitespace trimming (- prefix/suffix)
    comment: ($) =>
      seq(
        $.comment_begin,
        optional($.comment_content),
        $.comment_end
      ),

    comment_begin: (_$) => choice("{#-", "{#"),
    comment_end: (_$) => choice("-#}", "#}"),
    comment_content: (_$) => token(prec(-1, /([^#]|#[^}]|-[^#]|--+[^#])*/)),

    // {{ expression }} with optional whitespace trimming
    expression: ($) =>
      seq(
        $.expression_begin,
        optional($._inner),
        $.expression_end
      ),

    expression_begin: (_$) => choice("{{-", "{{"),
    expression_end: (_$) => choice("-}}", "}}"),

    // {% statement %} with optional whitespace trimming
    statement: ($) =>
      seq(
        $.statement_begin,
        optional($.keyword),
        optional($._inner),
        $.statement_end
      ),

    statement_begin: (_$) => choice("{%-", "{%"),
    statement_end: (_$) => choice("-%}", "%}"),

    // The first identifier after {% is treated as the keyword
    keyword: (_$) => token(prec(2, /\s*[a-zA-Z_][a-zA-Z0-9_]*/)),

    // Inner content of {{ }} and {% %} expressions
    _inner: ($) =>
      repeat1(
        choice(
          $.string,
          $.number,
          $.boolean,
          $.none,
          $.identifier,
          $.operator,
          $.comparison_operator,
          $.assignment_operator,
          $.filter,
          $.attribute,
          $.punctuation,
          $.whitespace,
          $.expression
        )
      ),

    string: (_$) =>
      token(
        choice(
          seq('"', /([^"\\]|\\.)*/, '"'),
          seq("'", /([^'\\]|\\.)*/, "'")
        )
      ),

    number: (_$) => token(/\d+(\.\d+)?/),

    boolean: (_$) => token(choice("true", "false", "True", "False")),

    none: (_$) => token(choice("none", "None", "null")),

    identifier: (_$) => token(prec(-1, /[a-zA-Z_][a-zA-Z0-9_]*/)),

    operator: (_$) =>
      token(
        choice(
          "+", "-", "**", "*", "//", "/", "%", "~", "!",
          "not", "and", "or", "is"
        )
      ),

    comparison_operator: (_$) =>
      token(choice("==", "!=", "<=", ">=", "<", ">", "in")),

    assignment_operator: (_$) => "=",

    filter: ($) => seq("|", optional($.whitespace), $.identifier),

    attribute: ($) => seq(".", $.identifier),

    punctuation: (_$) => token(choice("(", ")", "[", "]", "{", "}", ",", ":", "?")),

    whitespace: (_$) => token(/\s+/),
  },
});
