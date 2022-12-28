module.exports = {
  "src/**/*": [
    "pnpm prettier --write",
    "pnpm jest --findRelatedTests --passWithNoTests",
    () => "pnpm build",
    () => "git add dist",
  ],
};
