module.exports = {
  "src/**/*": [
    "pnpm jest --findRelatedTests --passWithNoTests",
    () => "pnpm build",
    () => "git add dist",
  ],
};
