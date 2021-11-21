module.exports = {
    'env': {
        'es2021': true,
        'node': true
    },
    'extends': [
        'eslint:recommended', 
        'prettier'
    ],
    'parserOptions': {
        'ecmaVersion': 13,
        'sourceType': 'module'
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ]
    }
};
