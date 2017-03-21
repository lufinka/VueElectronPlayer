const config = require('./config')
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let isQuitting = false
let mainWindow = null

const isAlreadyRunning = app.makeSingleInstance(() => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore()
		}
		mainWindow.show()
	}
})

if (isAlreadyRunning) {
  app.quit()
}

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit()
  }
})

app.on('ready', function() {

  mainWindow = new BrowserWindow(config.mainWindow)
  mainWindow.loadURL(config.entry)

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.on('will-navigate', (event) => {
    event.preventDefault()
  })
  mainWindow.on('closed', () => {
    app.quit()
  })

})
