module.exports = {
  plugins: ["@dwmt/commitlint-plugin-jira-type"],
  extends: ["@dwmt/commitlint-config-jira-type"],
  rules: {
    "jira-type-type-enum": [2, "always", ["feat", "fix", "docs", "style", "refactor", "test", "chore"]],
  },
};
