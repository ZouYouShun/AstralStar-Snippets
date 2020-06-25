import {
  app,
  BrowserWindow,
  screen,
  globalShortcut,
  Menu,
  nativeTheme,
  clipboard,
} from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as robot from 'robotjs';

let win: BrowserWindow = null;
const args = process.argv.slice(1),
  serve = args.some((val) => val === '--serve');

function createWindow(): BrowserWindow {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: size.width / 4,
    y: size.height * 0.05,
    width: size.width / 2,
    height: 600,

    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve ? true : false,
    },
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    // closable: false,
    // resizable: false,
  });

  win.hide();

  // Get mouse cursor absolute position
  const { x, y } = screen.getCursorScreenPoint();
  // Find the display where the mouse cursor will be
  const currentDisplay = screen.getDisplayNearestPoint({ x, y });
  // Set window position to that display coordinates
  win.setPosition(currentDisplay.workArea.x, currentDisplay.workArea.y);
  // Center window relatively to that display
  win.center();
  // Display the window
  win.show();

  if (serve) {
    // win.webContents.openDevTools();

    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`),
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    console.log('close');
    // process.exit();
    win = null;
  });

  return win;
}

try {
  app.allowRendererProcessReuse = true;

  // nativeTheme.on('updated', function theThemeHasChanged() {
  //   console.log(nativeTheme.shouldUseDarkColors);
  // });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.whenReady().then(() => {
    const dockMenu = Menu.buildFromTemplate([
      {
        label: 'New Window',
        click() {
          console.log('New Window');
        },
      },
      {
        label: 'New Window with Settings',
        submenu: [{ label: 'Basic' }, { label: 'Pro' }],
      },
      { label: 'New Commands...' },
    ]);

    app.dock.setMenu(dockMenu);

    globalShortcut.register('CommandOrControl+shift+X', () => {
      // const originText = clipboard.readText();

      // clipboard.writeText('Example String');

      // console.log(clipboard.readText());

      // robot.keyTap('v', process.platform === 'darwin' ? 'command' : 'control');

      // clipboard.writeText(originText);
      if (win) {
        win.close();
        // win = null;
      }

      createWindow();
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
