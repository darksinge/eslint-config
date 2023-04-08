module.exports = {
  extends: ['@darksinge/eslint-config'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        semi: false,
        trailingComma: 'all',
        singleQuote: true,
      },
    ],
  },
}
