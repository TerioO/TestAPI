import type { Config } from "jest";

const config: Config = {
    // A preset should point to an npm module that has a jest-preset.json, jest-preset.js, jest-preset.cjs or jest-preset.mjs file at the root.
    preset: "ts-jest",

    // Default: "node"
    testEnvironment: "node", 

    // Default: [ "**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)" ]
    // The glob patterns Jest uses to detect test files
    testMatch: ["**/tests/**/*.test.ts"], 

    // Indicates whether each individual test should be reported during the run. All errors will also still be shown on the bottom after execution.
    verbose: true

}

export default config;