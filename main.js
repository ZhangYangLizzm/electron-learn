const { app, BrowserWindow, dialog, ipcMain, shell } = require('electron')
const path = require('path')
/**app 控制着整个应用程序的事件生命周期， BrowserWindow创建和管理应用程序的窗口 */

let mainWindow
const createWindow = () => {
    mainWindow = new BrowserWindow({
        /**全屏 */
        //fullscreen: false,
        /**让桌面应用没有边框，这样菜单栏也会消失 */
        // frame: false,
        /**不允许用户改变窗口大小*/
        // resizable: false,
        /**设置窗口宽高 */
        width: 800,
        height: 600,
        /**应用运行时的标题栏图标 */
        //icon: iconPath,
        /**最小宽度 */
        //minWidth: 300,
        /**最小高度 */
        // minHeight: 500,
        /**最大宽度*/
        // maxWidth: 300,
        /**最大高度 */
        //maxHeight: 600,
        /**进行对首选项的设置 */
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            // /**允许node环境运行 */
            // NodeIterator: true,
            // /**设置应用在后台正常运行*/
            // backgroundThrottling: false,
            // /**关闭警告信息*/
            // contextIsolation: false,
            // /**在主进程的窗口中加入enableRemoteModule: true参数才能够调用remote模块*/
            // enableRemoteModule: true
        }
    })
    /**并且为你的应用加载index.html */
    mainWindow.loadFile('index.html')
    /**打开开发者工具 */
    mainWindow.webContents.openDevTools()
}
if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient('electron-fiddle', process.execPath, [path.resolve(process.argv[1])])
    }
} else {
    app.setAsDefaultProtocolClient('electron-fiddle')
}

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
        dialog.showErrorBox('Welcome Back', `you arrived from ${commandLine.pop().slice(0, -1)}`)
    })
}
/**在electron中，只有app 模块的ready事件被触发才会创建浏览器窗口，我们可以通过app.whenReady()进行监听 */
app.whenReady().then(createWindow)
app.on('open-url', (event, url) => {
    dialog.showErrorBox('Welcome Back', `You arrived from: ${url}`)
})

/**关闭所有窗口时退出应用（window-all-closed/app.quit） */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('shell:open', () => {
    const pageDirectory = __dirname.replace('app.asar', 'app.asar:unpacked')
    const pagePath = path.join('file://', pageDirectory, 'index.html')
    shell.openExternal(pagePath)
})
