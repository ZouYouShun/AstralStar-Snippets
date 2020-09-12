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
import * as robot from 'robotjs';

import { Snippet } from './models/snippet.model';
import { IpcEventType } from './utils/IpcEventType';

const DEFAULT_HEIGHT = 60;

type MainElectronAppParams = {
  loadUrl: string;
};

export class MainElectronApp {
  win: BrowserWindow = null;
  previousText = '';
  currentRoute = '';

  constructor(private option: MainElectronAppParams) {
    app.allowRendererProcessReuse = true;
    console.log('app init');
  }

  bootstrap() {
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

    if (!this.win) {
      console.log('init window');
      this.win = new BrowserWindow({
        width: size.width / 2,
        height: DEFAULT_HEIGHT,

        webPreferences: {
          nodeIntegration: true,
          // allowRunningInsecureContent: isServeMode ? true : false,
        },
        alwaysOnTop: true,
        frame: false,
        transparent: true,
        resizable: false,
        ...option,
      });

      // this.win.webContents.openDevTools();

      if (option.blurClose) {
        this.win.on('blur', () => {
          this.hideWindow();
        });
      }

      this.win.once('closed', () => {
        this.win = null;
      });

      this.win.loadURL(this.option.loadUrl);
    }

    // if (this.currentRoute === '' || route !== this.currentRoute) {
    // }
    this.currentRoute = route;

    this.setWindowInCurrentDesktop();
    this.win.show();

    return this.win;
  }

  private setWindowInCurrentDesktop() {
    this.win.setVisibleOnAllWorkspaces(true); // put the window on all screens
    this.win.focus(); // focus the window up front on the active screen
    this.win.setVisibleOnAllWorkspaces(false); // disable all screen behavior

    const { x, y } = screen.getCursorScreenPoint();
    const currentDisplay = screen.getDisplayNearestPoint({ x, y });
    this.win.setPosition(currentDisplay.workArea.x, currentDisplay.workArea.y);
    this.win.center();
  }

  hideWindow() {
    Menu.sendActionToFirstResponder('hide:');
    // this.win.close();
  }

  closeWindow() {
    this.win.close();
  }

  openSettingPage() {
    if (this.win) {
      this.win.close();
      this.win = null;
    }
    this.createWindow('settings', {
      height: 600,
      frame: true,
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
        if (this.win === null) {
          this.createWindow();
        }
      });
  }

  private setMenu() {
    const dockMenu = Menu.buildFromTemplate([
      {
        label: 'Settings',
        click: () => {
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
    globalShortcut.register('CommandOrControl+shift+v', () => {
      setTimeout(() => {
        // robot.keyTap(
        //   'v',
        //   process.platform === 'darwin' ? 'command' : 'control'
        // );

        robot.typeString(this.previousText);
      }, 500);
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
        if (this.win) {
          this.win.close();
          this.win = null;
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
        const size = this.win.getSize();
        this.win.setSize(size[0], DEFAULT_HEIGHT + value);

        event.returnValue = 'success';
      })
      .on(IpcEventType.EXIT, (event) => {
        this.hideWindow();

        event.returnValue = 'success';
      });
  }
}
