import { MainElectronApp } from './MainElectronApp';

const rootUrl = process.cwd();

require('electron-reload')(rootUrl, {
  electron: require(`${rootUrl}/node_modules/electron`),
  hardResetMethod: 'exit',
  forceHardReset: true,
});

new MainElectronApp({
  loadUrl: 'http://localhost:4200',
}).bootstrap();
