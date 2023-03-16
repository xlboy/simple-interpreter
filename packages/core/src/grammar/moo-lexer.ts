import * as moo from 'moo';

const lexer = moo.states({
  main: {
    tqlStart: { match: /`/, next: 'tql' },
    ws: { match: /\s/, lineBreaks: true },
    newLine: { match: /\n/, lineBreaks: true },
    comment: /\/\/.*?$/,
    // js 的 number，包含了 16 进制，8 进制，浮点数，负正整数
    // number: /-?0x[0-9a-fA-F]+|0o[0-7]+|0b[01]+|\d*\.\d+|\d+\.?([eE][+-]?\d+)?/,
    number: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
    // 字符串字面量，包围符号为“双引号、单引号”
    string: /"(?:\\["\\]|[^\n"\\])*"|'(?:\\['\\]|[^\n'\\])*'/,
    literalKeyword: [
      'string',
      'number',
      'null',
      'undefined',
      'never',
      'any',
      'symbol',
      'void',
      'unknown',
      'this',
      ...['true', 'false', 'boolean']
    ],
    restOrSpread: ['...'],
    extend: ['extends', '=='],
    return: ['return'],
    arrowFnSymbol: '=>',
    symbol: [':', ';', '.', ',', '?', '|', '<', '>', '=', '-', '&', '^', '`'],
    lbracket: ['{', '[', '('],
    rbracket: ['}', ']', ')'],
    identifier: {
      match: /[a-zA-Z_$][a-zA-Z0-9_$]*/,
      type: moo.keywords({
        keyword: [
          'if',
          'for',
          'of',
          'else',
          'in',
          'void',
          'this',
          'new',
          'function',
          'interface',
          'namespace',
          'keyof',
          'type',
          'as',
          'is',
          'out',
          'infer',
          'asserts',
          'declare'
        ]
      })
    }
  },
  tql: {
    tqlEnd: { match: /`/, pop: 1 },
    tqlInterpStart: { match: '${', next: 'tqlInterp' },
    tqlString: { match: /(?!\$\{)(?:[^`\\]|\\[\s\S])/, lineBreaks: true }
  },
  tqlInterp: {
    tqlEnd: { match: /`/, pop: 1 },
    tqlInterpEnd: { match: '}', next: 'tql' },
    tqlInterpContent: { match: /(?:[^`\}\\]|\\[\s\S])+/, lineBreaks: true }
  }
});

export default lexer;
