import * as path from 'path';
import * as url from 'url';

import { MainElectronApp } from './MainElectronApp';

new MainElectronApp({
  loadUrl: url.format({
    pathname: path.join(__dirname, 'snippets-tool/index.html'),
    protocol: 'file:',
    slashes: true,
  }),
}).bootstrap();
