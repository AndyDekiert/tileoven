var atom = require('app');
var spawn = require('child_process').spawn;
var BrowserWindow = require('browser-window');
var Menu = require('menu');
var shell = require('shell');
var dialog = require('dialog');
var path = require('path');
var log = require('./lib/log');
var node = path.resolve(path.join(__dirname, 'vendor', 'node'));
var exec = require('child_process').exec;
var script = path.resolve(path.join(__dirname, 'index-run-server.js'));
var logger = require('fastlog')('', 'debug', '<${timestamp}>');
var serverPort = null;
var mainWindow = null;

if (process.platform === 'win32') {
    // HOME is undefined on windows
    process.env.HOME = process.env.USERPROFILE;
    // skill shell.log setup
    shellsetup();
} else {
    var shellLog = path.join(process.env.HOME, '.tilemill', 'shell.log');
    log(shellLog, 10e6, shellsetup);
}

function shellsetup(err){
    process.on('exit', function(code) {
        logger.debug('TileMill exited with', code + '.');
    });

    // Start the server child process.
    var server = spawn(node, [script]);
    server.on('exit', exit);

    server.stdout.once('data', function(data) {
        var matches = data.toString().match(/^startatom&*?/);
        if (!matches) { exit(); }
        serverPort = data.toString().split('&')[1];
        if (matches) { loadURL(); }
        logger.debug('TileMill @ http://localhost:' + serverPort + '/');
    });

    // Report crashes to our server.
    require('crash-reporter').start();

    atom.on('window-all-closed', exit);
    atom.on('will-quit', exit);

   function exit() {
        if (server) server.kill();
        process.exit();
    };

    atom.on('ready', makeWindow);
};

function makeWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        'width': 1060,
        'height': 700,
        'center': true,
        'min-width': 720,
        'min-height': 480,
        'title': 'TileMill',
        'node-integration': 'all',
        'web-preferences': {
            'webgl': true,
            'java': false,
            'webaudio': false
        }
    });

    mainWindow.loadUrl('file://' + path.join(__dirname, 'templates', 'loading.html'));

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
    // Prevent page changes from updating the window title (typically to 'Untitled').
    mainWindow.on('page-title-updated', function(e) {
        e.preventDefault();
    });

    createMenu();
}

function loadURL() {
    if (!mainWindow) return;
    if (!serverPort) return;
    mainWindow.loadUrl('http://localhost:' + serverPort);
}

function createMenu() {
    var template;

    if (process.platform == 'darwin') {
    template = [
      {
        label: 'TileMill',
        submenu: [
          {
            label: 'About TileMill',
            selector: 'orderFrontStandardAboutPanel:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Hide TileMill',
            accelerator: 'Command+H',
            selector: 'hide:'
          },
          {
            label: 'Hide Others',
            accelerator: 'Command+Shift+H',
            selector: 'hideOtherApplications:'
          },
          {
            label: 'Show All',
            selector: 'unhideAllApplications:'
          },
          {
            type: 'separator'
          },
          {
            label: 'Quit TileMill',
            accelerator: 'Command+Q',
            selector: 'performClose:'
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          {
            label: 'Cut',
            accelerator: 'Command+X',
            selector: 'cut:'
          },
          {
            label: 'Copy',
            accelerator: 'Command+C',
            selector: 'copy:'
          },
          {
            label: 'Paste',
            accelerator: 'Command+V',
            selector: 'paste:'
          },
          {
            label: 'Select All',
            accelerator: 'Command+A',
            selector: 'selectAll:'
          }
        ]
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'Command+R',
            click: function() { mainWindow.restart(); }
          },
          {
            label: 'Toggle Developer Tools',
            accelerator: 'Alt+Command+I',
            click: function() { mainWindow.toggleDevTools(); }
          },
          {
            type: 'separator'
          },
          {
            label: 'Toggle Full Screen',
            accelerator: 'Ctrl+Command+F',
            click: function() { mainWindow.setFullScreen(!mainWindow.isFullScreen()); }
          }
        ]
      },
      {
        label: 'Window',
        submenu: [
          {
            label: 'Minimize',
            accelerator: 'Command+M',
            selector: 'performMiniaturize:'
          }
        ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Online Resources',
            click: function() { shell.openExternal('https://www.mapbox.com/tilemill/'); }
          },
          {
            label: 'Application Log',
            click: function() {
                var cp = require("child_process");
                cp.exec("open -a /Applications/Utilities/Console.app ~/Library/Logs/TileMill.log");
            }
          },
          {
            label: 'Shell Log',
            click: function() {
                var cp = require("child_process");
                cp.exec("open -a /Applications/Utilities/Console.app ~/.tilemill/shell.log");
            }
          }
        ]
      }
    ];

    menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
}