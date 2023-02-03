const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
/**app 控制着整个应用程序的事件生命周期， BrowserWindow创建和管理应用程序的窗口 */
const createWindow = () => {
    const win = new BrowserWindow({
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

    win.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
        event.preventDefault();
        if (deviceList && deviceList.length > 0) {
            callback(deviceList[0].deviceId)
        }
    })

    ipcMain.on('bluetooth-pairing-response', (_, response) => {
        bluetoothPinCallback(response);
    })

    win.webContents.session.setBluetoothPairingHandler((details, callback) => {
        bluetoothPinCallback = callback
        win.webContents.send('bluetooth-pairing-request', details)
    })
    /**并且为你的应用加载index.html */
    win.loadFile('index.html')
    /**打开开发者工具 */
    win.webContents.openDevTools()
}
/**在electron中，只有app 模块的ready事件被触发才会创建浏览器窗口，我们可以通过app.whenReady()进行监听 */
app.whenReady().then(() => {
    createWindow()
    /**没有窗口打开就打开一个窗口 activate */
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
/**关闭所有窗口时退出应用（window-all-closed/app.quit） */
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
