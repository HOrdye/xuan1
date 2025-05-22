export default {
  "root": true,
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "parser": "@typescript-eslint/parser",
    "sourceType": "module"
  },
  "plugins": [
    "vue",
    "@typescript-eslint"
  ],
  "rules": {
    "vue/html-self-closing": ["warn", {
      "html": {
        "void": "always",
        "normal": "never",
        "component": "always"
      }
    }],
    "vue/max-attributes-per-line": ["warn", {
      "singleline": {
        "max": 3
      },
      "multiline": {
        "max": 1
      }
    }],
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { "allow": ["warn", "error", "info"] }]
  }
} 