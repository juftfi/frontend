module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:react-hooks/recommended"],
    ignorePatterns: ["dist", ".eslintrc.cjs"],
    parser: "@typescript-eslint/parser",
    plugins: ["react-refresh"],
    rules: {
        "no-restricted-imports": [
            "error",
            {
                patterns: [
                    {
                        group: ["@/modules/*/components", "@/modules/*/components/*"],
                        message: `Direct imports from "components" folders are restricted.
Please import from the module root instead, for example:

import ModuleName from "@/modules/ModuleName";
const { SomeComponent } = ModuleName.components;`,
                    },
                    {
                        group: ["@/modules/*/hooks", "@/modules/*/hooks/*"],
                        message: `Direct imports from "hooks" folders are restricted.
Please import from the module root instead, for example:

import ModuleName from "@/modules/ModuleName";
const { useSomeHook } = ModuleName.hooks;`,
                    },
                    {
                        group: ["@/modules/*/utils", "@/modules/*/utils/*"],
                        message: `Direct imports from "utils" folders are restricted.
Please import from the module root instead, for example:

import ModuleName from "@/modules/ModuleName";
const { someUtility } = ModuleName.utils;`,
                    },
                ],
            },
        ],
        "@typescript-eslint/no-explicit-any": ["off"],
    },
};
