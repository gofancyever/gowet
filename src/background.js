'use strict'

import {app, protocol, BrowserWindow, BrowserView, ipcMain, Menu} from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import Path from "path";
import util from "./module/utils"
import ar from "element-ui/src/locale/lang/ar";
const isDevelopment = process.env.NODE_ENV !== 'production'
let webView
let toolView
let mainWindow
var requestDatas = {}
let requestEnv = 'production'
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])
const http_proxy = "https=192.168.1.201:6000;http=192.168.1.201:6000"
// const http_proxy = "https=192.168.3.40:6000;http=192.168.3.40:6000"
const proxyBypassRules = "upload.sxyygh.com,localhost"
function onIpc(){
  ipcMain.on('OPENCERTWINDOW',()=>{
    openInstallCertWindow()
  })
  // 检测代理服务器是否可用
  ipcMain.on('CHECKPROXY',()=>{
    util.checkProxyServerIsStart().then((isStart)=>{
      console.log("代理服务器是否可用：", isStart)
      toolView.webContents.send("PROXYISENABLE", isStart)
    }).catch((e)=>{
      console.log(e)
    })
  })
  // 请求地址
  ipcMain.on("URLCHANGE",(event,arg)=>{
    console.log(arg)
    webView.webContents.loadURL(arg)
  })

  //  获取localStorag
  ipcMain.on("GETLOCALSTORAGE",(event,arg)=>{
    console.log("GETLOCALSTORAGE")
    util.StorageUtil.getAllItem(webView).then(datas=>{
      toolView.webContents.send("LOCALSTORAGEDATAS",datas)
    })
  })
  // 删除
  ipcMain.on("DELLOCALSTORAGE",(event,arg)=>{
    console.log("DELLOCALSTORAGE")
    util.StorageUtil.removeItem(mainWindow,arg.key)
  })
  // 设置
  ipcMain.on("SETLOCALSTORAGE",(event,arg)=>{
    console.log("SETLOCALSTORAGE")
    util.StorageUtil.setItem(mainWindow,arg.key,arg.value)
  })

  ipcMain.on("GETUSERS",(event,arg)=>{
    console.log("GETUSERS")
    const users = util.StorageUtil.getUsers()
    toolView.webContents.send("USERS",users)
  })
  // 获取当前userid
  ipcMain.on("GETCURRENTUSERID",(event,arg)=>{
    console.log("GETCURRENTUSERID")
    util.StorageUtil.getItem(mainWindow,'userid').then((userid)=>{
      toolView.webContents.send("CURRENTUSERID",userid)
    })

  })

  // 切换用户
  ipcMain.on("SWITCHUSER",(event,arg)=>{
    console.log("SWITCHUSER")
    util.StorageUtil.setUserInfoToLocalStroage(webView,arg)
    webView.webContents.reload()

  })

  // 切换环境
  ipcMain.on("CHANGEENV",(event,arg)=>{
    console.log("CHANGEENV")
    console.log(arg)
    var url = webView.webContents.getURL()
    var prefixUrl = url.split('#')[0]
    console.log(url)
    switch (arg) {
      case 'release':
        url = url.replace(prefixUrl,'https://weixin.sxyygh.com/')
        break;
      case 'production':
        url = url.replace(prefixUrl,'https://weixin.sxyygh.com/prod/')
        break;
      case 'preview':
        url = url.replace(prefixUrl,'https://weixin.sxyygh.com/preview/')
            break;
      case 'development':
        url = url.replace(prefixUrl,'https://weixin.sxyygh.com/beta/')
        break;
    }
    webView.webContents.loadURL(url)
    toolView.webContents.send("CURRENTURL",url)
  })
  // 网页返回
  ipcMain.on("GOBACK",(event,arg) =>{
    webView.webContents.goBack()
  })
  // 软件更新
  ipcMain.on('UPDATEAPP',()=>{

  })
  ipcMain.on("REFRESH",()=>{
    console.log("REFRESH")
    webView.webContents.reload()
  })
}
function openInstallCertWindow() {
  const certWindow = new BrowserWindow({
    height: 400,
    useContentSize: true,
    width: 600
  })
  certWindow.webContents.session.setProxy({
    proxyRules: http_proxy,
    proxyBypassRules:proxyBypassRules
  }).then(()=>{
    certWindow.loadURL("http://mitm.it/")
  })

}
function webContentHandle() {
  const filter = {
    urls: ['http://upload.sxyygh.com:8015/*']
  }

  // webView.webContents.session.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
  //   console.log("？？？？？？？？？？？？？？？")
  //   details.requestHeaders['Debug-Config'] = requestEnv
  //   console.log("header:",JSON.stringify(details.requestHeaders))
  //   callback({ cancel: false,requestHeaders: details.requestHeaders })
  // })
  // webView.webContents.session.webRequest.onHeadersReceived(filter, (details, callback) => {
  //   console.log("aaaaaaaaaa")
  //   // details.requestHeaders['Debug-Config'] = requestEnv
  //   // console.log("header:",JSON.stringify(details.requestHeaders))
  //   callback({ cancel: false,requestHeaders: details.requestHeaders })
  // })

  webView.webContents.on("did-navigate-in-page",(event,url)=>{
    console.log("did-navigate-in-page")
    let currentURL = webView.webContents.getURL();
    toolView.webContents.send("CURRENTURL",currentURL)
  })
}
function windowHandle(){
  mainWindow.on("resized",(event,newBounds)=>{
    var size   = mainWindow.getSize();
    var width = size[0];
    var height = size[1];
    console.log("size,",size)
    toolView.webContents.send("RESIZE",{width:width,height:height})
  })
}
function createMenu() {
  const isMac = process.platform === 'darwin'
  const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }] : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        isMac ? { role: 'close' } : { role: 'quit' }
      ]
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac ? [
          { role: 'pasteAndMatchStyle' },
          { role: 'delete' },
          { role: 'selectAll' },
          { type: 'separator' },
          {
            label: 'Speech',
            submenu: [
              { role: 'startSpeaking' },
              { role: 'stopSpeaking' }
            ]
          }
        ] : [
          { role: 'delete' },
          { type: 'separator' },
          { role: 'selectAll' }
        ])
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' },
          { type: 'separator' },
          { role: 'window' }
        ] : [
          { role: 'close' }
        ])
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: '安装代理证书',
          click: async () => {
            openInstallCertWindow()
          }
        },
        {
          label: '检查代理服务器',
          click: async () =>{
            util.checkProxyServerIsStart().then((isStart)=>{
              console.log("代理服务器是否可用：", isStart)
              toolView.webContents.send("PROXYISENABLE", isStart)
            }).catch((e)=>{
              console.log(e)
            })
          }
        },
        {
          label: '清除缓存',
          click: async () => {
            util.StorageUtil.clearStore()
          }
        },
        {
          label:"关于",
          click: async ()=> {
            toolView.webContents.send("ABOUT",{platform:process.platform,version:app.getVersion()})
            // autoUpdater.checkForUpdates()
          }
        }
      ]
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
async function chromeDebug(){
  console.log("chromeDebug")
  try {
    await webView.webContents.debugger.attach('1.1');
    await webView.webContents.debugger.sendCommand('Network.enable');
    await webView.webContents.debugger.sendCommand("Emulation.setEmitTouchEventsForMouse", {         enabled: true,configuration:"mobile"     });
    await webView.webContents.debugger.sendCommand("Emulation.setTouchEmulationEnabled", {         enabled: true     });
    await webView.webContents.debugger.sendCommand("Emulation.setFocusEmulationEnabled", {         enabled: true     });
    const mobile_emulation = {
      screenWidth:360,
      screenHeight:640,
      "width": 360,
      "height": 640,
      "pixelRatio": 1.0,
      "deviceScaleFactor":0.5,
      "mobile":true,
      scale:1,
    }
    await webView.webContents.debugger.sendCommand("Emulation.setDeviceMetricsOverride", mobile_emulation);
    // const mobile_useragent = {
    //   userAgent:"Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1",
    //   acceptLanguage:"zh-CN,zh;q=0.9",
    // }
    // await webView.webContents.debugger.sendCommand("Emulation.setUserAgentOverride", mobile_useragent);
    await webView.webContents.debugger.sendCommand("Security.setIgnoreCertificateErrors", {         ignore: true     });
    await webView.webContents.debugger.sendCommand("Security.disable",);
  } catch (err) {
    console.log('Debugger attach failed: ', err);
  }

  webView.webContents.debugger.on('detach', (event, reason) => {
    console.log('Debugger detached due to: ', reason);
  });


  webView.webContents.debugger.on('message', (event, method, params) => {
    if (method === 'Network.responseReceived') {
      if (params.type == "XHR") {
        console.log("params.requestId",params.requestId)
        console.log("params.requestId",JSON.stringify(params))
        if (params.response.url.indexOf("ronghub.com") == -1) {
          requestDatas[params.requestId] = params
        }
      }
    }
    if (method == 'Network.loadingFinished') {
      webView.webContents.debugger.sendCommand('Network.getResponseBody', { requestId: params.requestId }).then((result)=>{
        const requeustData = requestDatas[params.requestId]
        if (!requeustData) {
          return Promise.reject()
        }
        requestDatas[params.requestId].response.body = result
        console.log("==========")
        console.log("REQUEST")
        if (requeustData.response.url.toLowerCase().includes("app/harsUserinfo/login".toLowerCase())) { //拦截用户信息
          util.StorageUtil.saveUserFromResult(result)
        }
        return params.requestId
      }).then((requestId)=>{
        console.log("requestId",requestId)
        return webView.webContents.debugger.sendCommand('Network.getRequestPostData', { requestId:requestId }).then((result)=>{
          console.log("getRequestPostData",params.requestId,JSON.stringify(result))
          requestDatas[requestId].postData = result.postData
          toolView.webContents.send("REQUEST",requestDatas[requestId])
          delete requestDatas[params.requestId]
          console.log("============")
        })

      }).catch((e)=>{
        console.log("error:",e)
      })
    }
  })
}
function setProxy() {
  webView.webContents.session.setProxy({
    proxyRules: http_proxy,
    proxyBypassRules:proxyBypassRules
  }).then(()=> {
    console.log('代理设置完毕')

    setTimeout(()=>{

      const isOpened = util.StorageUtil.isOpened()
      if (isOpened == false) {
        toolView.webContents.send("PROXYCERTISINSTALL", false)
        util.StorageUtil.setOpened()
      }
    },10000)
  });
}


async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1375,
    height: 687,
    resizable:false
  })
  mainWindow = win
  webView = new BrowserView({webPreferences:{
      webSecurity:false,
      allowRunningInsecureContent:true,
      v8CacheOptions:"none"
    }})
  win.addBrowserView(webView)
  webView.setBounds({ x: 0, y: 0, width: 375, height: 667 })
  await webView.webContents.loadURL("http://weixin.sxyygh.com")
  webView.webContents.enableDeviceEmulation({screenPosition:"mobile"})
  toolView = new BrowserView({
    webPreferences: {

      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  win.addBrowserView(toolView)
  toolView.setBounds({ x: 375, y: 0, width: 1000, height: 687 })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await toolView.webContents.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) toolView.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    await toolView.webContents.loadURL('app://./index.html')
    // toolView.webContents.openDevTools()
  }
  util.checkProxyServerIsStart().then((isStart)=>{
    console.log("代理服务器是否可用：", isStart)
    if (isStart) {
      setProxy()
    }
  })
  onIpc()
  webContentHandle()
  await chromeDebug()
  windowHandle()
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  createMenu()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
