import { MainElectronApp } from './MainElectronApp';

// import * as path from 'path';
// const rootUrl = path.join(process.cwd(), '/dist/electron');

// require('electron-reload')(rootUrl, {
//   electron: require(`${process.cwd()}/node_modules/electron`),
//   argv: ['--remote-debugging-port=9222'],
//   hardResetMethod: 'exit',
//   forceHardReset: true,
// });

new MainElectronApp({
  loadUrl: 'http://localhost:4200',
}).bootstrap();
