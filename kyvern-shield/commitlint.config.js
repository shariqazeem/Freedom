module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",     // New feature
        "fix",      // Bug fix
        "docs",     // Documentation
        "style",    // Formatting, no code change
        "refactor", // Code refactoring
        "perf",     // Performance improvement
        "test",     // Adding tests
        "chore",    // Maintenance
        "ci",       // CI/CD changes
        "build",    // Build system changes
        "revert",   // Revert previous commit
      ],
    ],
    "scope-enum": [
      2,
      "always",
      [
        "web",      // Frontend app
        "api",      // Python API
        "docs",     // Documentation
        "sdk",      // Shield SDK
        "ui",       // UI components
        "config",   // Configuration
        "types",    // Type definitions
        "contracts", // Solana contracts
        "deps",     // Dependencies
        "release",  // Release related
      ],
    ],
  },
};
