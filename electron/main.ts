import {
  app,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  clipboard,
  globalShortcut,
  ipcMain,
  Menu,
  screen,
} from 'electron';
import * as path from 'path';
import * as robot from 'robotjs';
import * as url from 'url';

import { IpcEventType } from './utils/IpcEventType';
import { Snippet } from './models/snippet.model';

export const DEFAULT_HEIGHT = 60;

export let win: BrowserWindow = null;

// tslint:disable-next-line: one-variable-per-declaration
export const args = process.argv.slice(1),
  serve = args.some((val) => val === '--serve');

export const rootUrl = process.cwd();

class MainElectronApp {
  previousText = '';
  currentRoute = '';

  init() {
    app.allowRendererProcessReuse = true;
    app.whenReady().then(() => {
      this.setMenu();
      this.bindGlobalShortcut();
      this.bindIpcEvent();
    });
    this.bindCloseEvent();
  }

  createWindow(
    route = '',
    option: BrowserWindowConstructorOptions & { blurClose?: boolean } = {
      blurClose: true,
    }
  ): BrowserWindow {
    const size = screen.getPrimaryDisplay().workAreaSize;

    this.currentRoute = route;

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
          this.hideWindow();
        });
      }

      win.once('closed', () => {
        win = null;
      });

      if (serve) {
        // win.webContents.openDevTools();
        require('electron-reload')(rootUrl, {
          electron: require(`${rootUrl}/node_modules/electron`),
        });
      }
    }

    if (serve) {
      win.loadURL(path.join('http://localhost:4200'));
    } else {
      win.loadURL(
        url.format({
          pathname: path.join(__dirname, 'dist/index.html'),
          protocol: 'file:',
          slashes: true,
        })
      );
    }

    const { x, y } = screen.getCursorScreenPoint();
    const currentDisplay = screen.getDisplayNearestPoint({ x, y });
    win.setPosition(currentDisplay.workArea.x, currentDisplay.workArea.y);
    win.center();

    return win;
  }

  hideWindow() {
    Menu.sendActionToFirstResponder('hide:');
  }

  openSettingPage() {
    if (win) {
      win.close();
      win = null;
    }
    this.createWindow('settings', {
      height: 600,
      frame: true,
      alwaysOnTop: false,
      transparent: false,
      resizable: true,
      blurClose: false,
    });
  }

  private bindCloseEvent() {
    // Quit when all windows are closed.
    app
      .on('window-all-closed', () => {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
          app.quit();
        }
      })
      .on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (win === null) {
          this.createWindow();
        }
      });
  }

  private setMenu() {
    const dockMenu = Menu.buildFromTemplate([
      {
        label: 'Settings',
        click() {
          this.openSettingPage();
        },
      },
    ]);
    app.dock.setMenu(dockMenu);
  }

  private bindGlobalShortcut() {
    globalShortcut.register('CommandOrControl+shift+X', () => {
      this.createWindow();
    });
    globalShortcut.register('CommandOrControl+shift+V', () => {
      setTimeout(() => {
        robot.keyTap(
          'v',
          process.platform === 'darwin' ? 'command' : 'control'
        );
      }, 200);
    });
  }

  private bindIpcEvent() {
    ipcMain
      .on(IpcEventType.APPLY, (event, arg: Snippet) => {
        this.previousText = arg.value;

        this.hideWindow();

        setTimeout(() => {
          robot.typeString(arg.value);
        }, 50);

        event.returnValue = 'success';
      })
      .on(IpcEventType.COPY, (event, arg: Snippet) => {
        this.previousText = arg.value;
        clipboard.writeText(arg.value);
        this.hideWindow();

        event.returnValue = 'success';
      })
      .on(IpcEventType.APPLY_COPY, (event, arg: Snippet) => {
        this.previousText = arg.value;
        clipboard.writeText(arg.value);
        this.hideWindow();

        setTimeout(() => {
          robot.typeString(arg.value);
        }, 50);

        event.returnValue = 'success';
      })
      .on(IpcEventType.PREVIOUS_SNIPPET, (event) => {
        event.returnValue = this.previousText;
      })
      .on(IpcEventType.GO_SETTINGS, (event) => {
        if (win) {
          win.close();
          win = null;
        }
        setTimeout(() => {
          this.openSettingPage();
        }, 500);
        event.returnValue = 'success';
      })
      .on(IpcEventType.INIT_ROUTE, (event) => {
        event.returnValue = this.currentRoute;
        this.currentRoute = '';
      })
      .on(IpcEventType.HEIGHT, (event, value: number) => {
        const size = win.getSize();
        win.setSize(size[0], DEFAULT_HEIGHT + value);

        event.returnValue = 'success';
      })
      .on(IpcEventType.EXIT, (event) => {
        this.hideWindow();

        event.returnValue = 'success';
      });
  }
}

new MainElectronApp().init();
