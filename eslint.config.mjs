import js from "@eslint/js";
import globals from "globals";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactNative from "eslint-plugin-react-native";
import reactCompiler from "eslint-plugin-react-compiler";

export default [
	{
		ignores: [
			"node_modules/",
			".github/",
			".vscode/",
			"assets/",
			"ios/",
			"android/",
			"dist/",
			"tests/",
			"*.log",
			"build/",
			"android/build/",
			"ios/build/",
			".expo/",
			"coverage/",
			"web-build/",
			"*.bundle.js",
			".metro-cache/",
			"babel.config.js",
			"jest.config.js",
			"metro.config.js",
			"tailwind.config.js",
			"app-env.d.ts",
			"supabase/",
		],
	},
	js.configs.recommended,
	{
		files: ["**/*.{js,ts,tsx}"],
		plugins: {
			"react-native": reactNative,
			"react-compiler": reactCompiler,
		},
		rules: {
			"react-compiler/react-compiler": "error",
			quotes: ["error", "double"],
			"no-console": ["warn", { allow: ["warn", "error"] }],
			"react-native/no-unused-styles": "error",
			"react-native/no-inline-styles": "off",
			"react-native/no-color-literals": "off",
			"no-empty-pattern": "off",
			"no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1, maxBOF: 0 }],
			"no-var": "error",
			"prefer-const": "error",
			"arrow-body-style": ["error", "as-needed"],
			"no-useless-return": "error",

			semi: ["error", "always"],
			eqeqeq: ["error", "always"],
			"no-alert": "warn",
			"no-warning-comments": [
				"warn",
				{
					terms: ["todo", "fixme"],
					location: "start",
				},
			],
			"object-curly-spacing": ["error", "always"],
			"array-bracket-spacing": ["error", "never"],
		},
	},
	{
		files: ["**/*.{js,mjs,cjs,ts,tsx}"],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.jest,
				React: "readonly",
			},
		},
	},
	{
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
			},
		},
		plugins: {
			"@typescript-eslint": tsPlugin,
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			"@typescript-eslint/no-unused-vars": "error",
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/explicit-function-return-type": [
				"warn",
				{
					allowExpressions: true,
					allowTypedFunctionExpressions: true,
					allowHigherOrderFunctions: true,
				},
			],
			"@typescript-eslint/consistent-type-definitions": ["error", "type"],
		},
	},
];
