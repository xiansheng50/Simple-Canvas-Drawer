module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // indent: ['warn', 2],
    quotes: ['warn', 'single'],
    semi: ['error', 'always'],
    'no-var': 'error',
    'prefer-const': 'error',
    'no-multi-assign': 'error',
    'no-new-object': 'error',
    'object-shorthand': 'warn',
    'quote-props': ['error', 'as-needed'],
    'no-array-constructor': 'error',
    'array-bracket-newline': ['warn', { multiline: true }],
    'array-element-newline': ['warn', 'consistent'],
    'prefer-destructuring': [
      'warn',
      {
        VariableDeclarator: {
          array: false,
          object: true,
        },
        AssignmentExpression: {
          array: false,
          object: true,
        },
      },
      { enforceForRenamedProperties: false },
    ],
    'prefer-template': 'error',
    'prefer-rest-params': 'error',
    'no-param-reassign': 'error',
    'prefer-arrow-callback': 'error',
    'arrow-body-style': ['warn', 'as-needed'],
    // 'arrow-parens': ['warn', 'as-needed', { requireForBlockBody: true }],
    'no-duplicate-imports': 'error',
    eqeqeq: 'error',
    'no-eval': 'error',
    'no-multi-spaces': 'warn',
    'array-bracket-spacing': 'warn',
    'block-spacing': ['warn', 'always'],
    'comma-spacing': 'warn',
    'computed-property-spacing': 'warn',
    'func-call-spacing': 'warn',
    'keyword-spacing': 'warn',
    'object-curly-spacing': ['warn', 'always'],
    'semi-spacing': 'warn',
    'space-before-blocks': 'warn',
    'space-before-function-paren': [
      'warn',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'space-in-parens': 'warn',
    'space-infix-ops': 'warn',
    'space-unary-ops': [
      'warn',
      {
        words: true,
        nonwords: false,
      },
    ],
    'switch-colon-spacing': 'warn',
    'arrow-spacing': 'warn',
    'generator-star-spacing': 'warn',
    'rest-spread-spacing': 'warn',
    'template-curly-spacing': 'warn',
    'key-spacing': 'warn',
    'comma-style': 'error',
    'comma-dangle': [
      'warn',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
    'object-curly-newline': ['warn', { multiline: true }],
    'object-property-newline': ['warn', { allowAllPropertiesOnSameLine: true }],
    'eol-last': 'warn',
    'no-multiple-empty-lines': 'warn',
    'brace-style': ['warn', '1tbs', { allowSingleLine: true }],
    camelcase: 'error',
    'new-cap': 'error',
    'newline-per-chained-call': 'warn',
    'no-plusplus': ['warn', { allowForLoopAfterthoughts: true }],
    'wrap-iife': ['warn', 'any'],
    'function-paren-newline': ['warn', 'multiline-arguments'],
    complexity: ['warn', 16],
    // 'multiline-ternary': ['warn', 'always-multiline'],
    'no-unneeded-ternary': 'warn',
    'max-params': 'warn',
    // 'max-len': [
    //   'warn',
    //   {
    //     ignoreTrailingComments: true,
    //     ignoreUrls: true,
    //     ignoreRegExpLiterals: true,
    //   },
    // ],
    'dot-notation': 'warn',
    // 'operator-linebreak': ['warn', 'after'],

    // ts部分
    '@typescript-eslint/array-type': ['warn', { default: 'generic' }],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      { allowExpressions: true },
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      'error',
      { overrides: { constructors: 'no-public' } },
    ],
    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/method-signature-style': 'warn',
    '@typescript-eslint/no-confusing-non-null-assertion': 'error',
    // '@typescript-eslint/prefer-includes': 'warn',
    '@typescript-eslint/type-annotation-spacing': 'warn',
    '@typescript-eslint/no-empty-function': 'off',
  },
};
