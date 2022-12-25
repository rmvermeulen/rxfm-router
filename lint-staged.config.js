module.exports = {
  "src/**/*": [
    "pnpm jest --findRelatedTests",
    () => "pnpm build",
    () => "git add dist",
  ],
};
