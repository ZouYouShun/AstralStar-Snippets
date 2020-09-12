const fs = require('fs-extra');
const path = require('path');

const { writePackageJson } = require('./writePackageJson');

const rootPath = process.cwd();

const pkg = require(path.join(rootPath, 'package.json'));

const targetPath = 'build';
const movePaths = ['README.md', 'dist/snippets-tool'];

const targetFolder = path.join(rootPath, targetPath);

fs.removeSync(targetFolder);

movePaths.forEach((movePath) => {
  fs.copySync(
    path.join(rootPath, movePath),
    path.join(targetFolder, path.basename(movePath))
  );
});

writePackageJson(pkg, targetFolder);

console.log('[Build] release]: ready for build');
