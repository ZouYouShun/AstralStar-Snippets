import {
  app,
  clipboard,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  globalShortcut,
  ipcMain,
  Menu,
  screen,
} from 'electron';
import * as path from 'path';
import * as robot from 'robotjs';
import * as url from 'url';

interface Snippet {
  key: string;
  value: string;
}

const enum IpcEventType {
  COPY = 'COPY',
  APPLY = 'APPLY',
  APPLY_COPY = 'APPLY_COPY',
  HEIGHT = 'HEIGHT',
  EXIT = 'EXIT',
  PREVIOUS_SNIPPET = 'PREVIOUS_SNIPPET',
  GO_SETTINGS = 'GO_SETTINGS',
  INIT_ROUTE = 'INIT_ROUTE',
}

const DEFAULT_HEIGHT = 60;

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some((val) => val === '--serve');

const rootUrl = process.cwd();

let previousText = '';
let currentRoute = '';

function createWindow(
  route = '',
  option: BrowserWindowConstructorOptions & { blurClose?: boolean } = {
    blurClose: true,
  }
): BrowserWindow {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;
  currentRoute = route;

  if (win) {
    win.setSize(size.width / 2, DEFAULT_HEIGHT);
    win.show();
  } else {
    console.log('init window');
    win = new BrowserWindow({
      width: size.width / 2,
      height: DEFAULT_HEIGHT,

      webPreferences: {
        nodeIntegration: true,
        allowRunningInsecureContent: serve ? true : false,
      },
      alwaysOnTop: true,
      frame: false,
      transparent: true,
      resizable: false,
      ...option,
    });

    if (option.blurClose) {
      win.on('blur', () => {
        hideWindow();
      });
    }

    win.once('closed', () => {
      win = null;
    });

    // if (serve) {
    //   // win.webContents.openDevTools();
    //   require('electron-reload')(rootUrl, {
    //     electron: require(`${rootUrl}/node_modules/electron`),
    //   });
    // }
  }
  win.loadURL(path.join('http://localhost:4200'));

  // if (serve) {
  //   win.loadURL(path.join('http://localhost:4200'));
  // } else {
  //   win.loadURL(
  //     url.format({
  //       pathname: path.join(__dirname, 'dist/index.html'),
  //       protocol: 'file:',
  //       slashes: true,
  //     })
  //   );
  // }

  const { x, y } = screen.getCursorScreenPoint();
  const currentDisplay = screen.getDisplayNearestPoint({ x, y });
  win.setPosition(currentDisplay.workArea.x, currentDisplay.workArea.y);
  win.center();

  return win;
}

try {
  app.allowRendererProcessReuse = true;

  app.whenReady().then(() => {
    const dockMenu = Menu.buildFromTemplate([
      {
        label: 'Settings',
        click() {
          openSetting();
        },
      },
    ]);
    app.dock.setMenu(dockMenu);

    globalShortcut.register('CommandOrControl+shift+X', () => {
      createWindow();
    });
    globalShortcut.register('CommandOrControl+shift+V', () => {
      setTimeout(() => {
        robot.keyTap(
          'v',
          process.platform === 'darwin' ? 'command' : 'control'
        );
      }, 200);
    });

    ipcMain
      .on(IpcEventType.APPLY, (event, arg: Snippet) => {
        previousText = arg.value;

        hideWindow();

        setTimeout(() => {
          robot.typeString(arg.value);
        }, 50);

        event.returnValue = 'success';
      })
      .on(IpcEventType.COPY, (event, arg: Snippet) => {
        previousText = arg.value;
        clipboard.writeText(arg.value);
        hideWindow();

        event.returnValue = 'success';
      })
      .on(IpcEventType.APPLY_COPY, (event, arg: Snippet) => {
        previousText = arg.value;
        clipboard.writeText(arg.value);
        hideWindow();

        setTimeout(() => {
          robot.typeString(arg.value);
        }, 50);

        event.returnValue = 'success';
      })
      .on(IpcEventType.PREVIOUS_SNIPPET, (event) => {
        event.returnValue = previousText;
      })
      .on(IpcEventType.GO_SETTINGS, (event) => {
        if (win) {
          win.close();
          win = null;
        }
        setTimeout(() => {
          openSetting();
        }, 500);
        event.returnValue = 'success';
      })
      .on(IpcEventType.INIT_ROUTE, (event) => {
        event.returnValue = currentRoute;
        currentRoute = '';
      })
      .on(IpcEventType.HEIGHT, (event, value: number) => {
        const size = win.getSize();
        win.setSize(size[0], DEFAULT_HEIGHT + value);

        event.returnValue = 'success';
      })
      .on(IpcEventType.EXIT, (event) => {
        hideWindow();

        event.returnValue = 'success';
      });
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
} catch (e) {
  // Catch Error
  // throw e;
}

function openSetting() {
  if (win) {
    win.close();
    win = null;
  }
  createWindow('settings', {
    height: 600,
    frame: true,
    alwaysOnTop: false,
    transparent: false,
    resizable: true,
    blurClose: false,
  });
}

// for return focus with previous tab
function hideWindow() {
  Menu.sendActionToFirstResponder('hide:');
}
