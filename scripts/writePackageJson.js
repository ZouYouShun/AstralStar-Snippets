const fs = require('fs');
const path = require('path');

const deps = ['robotjs'];
const devDeps = ['electron'];

const writePackageJson = (pkg, targetPath) => {
  const getDependencies = (pkgs = []) => {
    return pkgs.reduce((acc, curr) => {
      acc[curr] = pkg.dependencies[curr] || pkg.devDependencies[curr];
      return acc;
    }, {});
  };

  const output = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    main: 'main.js',
    author: pkg.author,
    license: pkg.license,
    typings: pkg.typings,
    dependencies: { ...getDependencies(deps) },
    devDependencies: { ...getDependencies(devDeps) },
    sideEffects: false,
    scripts: {
      postinstall: 'npm rebuild --runtime=electron --target=9.0.5 --disturl=https://atom.io/download/atom-shell --abi=79',
    },
  };
  fs.writeFileSync(
    path.join(targetPath, 'package.json'),
    JSON.stringify(output, null, 2)
  );
};

module.exports = { writePackageJson };
