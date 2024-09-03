module.exports = {
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended'
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: [
    'react',
    'react-hooks',
    'react-refresh'
  ],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 0,
    'react/display-name': 0,

    'no-console': 1, // no console.log
    'no-lonely-if': 1, // không để if lẻ trong else -> nên dùng else if
    'no-unused-vars': 1, // cảnh báo biến khai báo nhưng không dùng
    'no-trailing-spaces': 1, // cảnh báo khoảng trống dư thừa
    'no-multi-spaces': 1, // không dùng nhiều khoảng trống liên tiếp
    'no-multiple-empty-lines': 1, // không dùng nhiều dòng trống liên tiếp
    'space-before-blocks': ['error', 'always'],
    'object-curly-spacing': [1, 'always'], // khoảng cách với {} khi tạo object
    'indent': ['warn', 2], // Thụt lề
    'semi': [1, 'never'], // chấm phẩy cuối lệnh
    'quotes': ['error', 'single'], // dùng nháy ĐƠN
    'array-bracket-spacing': 1,
    'linebreak-style': 0, // CRLF vs LF in ending line
    'no-unexpected-multiline': 'warn',
    'keyword-spacing': 1,
    'comma-dangle': 1, // dấu phẩy cho thuộc tính cuối
    'comma-spacing': 1,
    'arrow-spacing': 1 // khoảng trống trước và sau arrow trong arrow function
  }
}