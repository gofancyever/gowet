import it from "element-ui/src/locale/lang/it";

const Store = require('electron-store');
const  { net } = require("electron");
import encryptModule from "/src/module/encryptModule"
import axios from 'axios'
const checkProxyServerIsStart = function () {
    return new Promise((resolve)=>{
        axios.get('http://192.168.1.201:6000').then((res)=>{
            console.log(res)
        }).catch((error)=>{
            if (error.response) {
                resolve(true)
            }else {
                resolve(false)
            }
        })
    })
}
const checkProxyCertIsInstall = function (){
    return new Promise((resolve)=>{
        const request = net.request("http://mitm.it/")
        request.on("response",(res)=>{
            res.on("data",(chunk)=>{
                const body = chunk.toString()
                if (body.toLowerCase().includes('If you can see this, traffic is not passing through mitmproxy'.toLowerCase())) {
                    resolve(false)
                }else {
                    resolve(true)
                }
            })
        })
        request.end()
    })
}

const StorageUtil = {
    getItem:function (webView,key) {
        return webView.webContents.executeJavaScript(`window.localStorage.getItem('${key}');`);
    },
    setItem: function (webView,key,value) {
        return webView.webContents.executeJavaScript(`window.localStorage.setItem('${key}', '${value}');`);
    },
    removeItem: function (webView,key,value) {
        return webView.webContents.executeJavaScript(`window.localStorage.removeItem('${key}');`);
    },
    getKey:function (webView,index) {
        return webView.webContents.executeJavaScript(`window.localStorage.key(${index});`);
    },
    getAllItem: function (webView) {
        return webView.webContents.executeJavaScript(`window.localStorage.length;`).then((length)=>{
            var arr = []
            for(var i = 0; i < length; i++) {
                const result = new Promise((resolve, reject)=>{
                    this.getKey(webView,i).then((key)=>{
                        return this.getItem(webView,key).then((item)=>{
                            // console.log('value:',item,'key:',key)
                            resolve({key:key,value:item})
                        }).catch((e)=>{
                            reject(e)
                        })
                    }).catch((e)=>{
                        reject(e)
                    })
                })

                arr.push(result)
            }
            return Promise.all(arr)
        })
    },
    clearAll: function (webView) {
        return webView.webContents.session.clearStorageData()
    },
    setUserInfoToLocalStroage:function (webView,patient) {
        let user = { userid: patient.userid, username: (!patient.username)?'':patient.username, phone: patient.phone };
        this.setItem(webView,'userid', patient.userid)
        this.setItem(webView,'username', (!patient.username)?'':patient.username)
        this.setItem(webView,'phone', (!patient.phone)?'':patient.phone)
        this.setItem(webView,'addrcity', (!patient.addrcity)?'':patient.addrcity)
        this.setItem(webView,'addrcountry', (!patient.addrcountry)?'':patient.addrcountry)
        this.setItem(webView,'addrprovince', (!patient.addrprovince)?'':patient.addrprovince)
        this.setItem(webView,'idcard', (!patient.idcard)?'':patient.idcard)
        this.setItem(webView,'user', JSON.stringify(user))
        this.setItem(webView,'appClient', 'patient')
    },
    saveUserFromResult(result) {
        console.log("saveUserFromResult:",result)
        var json = result.body
        if (typeof result.body == "string") {
            try {
                json = JSON.parse(result.body)
            }catch (e) {
                return
            }

        }
        if (json && json.result && json.code == 1) {
            let encryptStr = encryptModule.j_img666555_d_m(json.result)
            const decodeJson = JSON.parse(encryptStr)
            console.log("decodeJson",decodeJson)
            if (decodeJson.result) {
                this.saveUser(decodeJson.result)
            }
            
        }
    },
    saveUser:function(user) {
        const store = new Store();
        var users = store.get("users") || []
        console.log("users",users)
        const arr_user = users.find((u)=>{
            return u.userid == user.userid
        })
        if (arr_user) return
        users.splice(0,0,user)
        if (users.length > 6) {
            users.slice(0,5)
        }
        store.set('users', users);
    },
    getUsers:function(){
        const store = new Store();
        var users = store.get("users")
        console.log("users",users)
        return users
    },
    clearStore:function (){
        const store = new Store();
        store.clear()
    },
    isOpened:function (){
        const store = new Store();
        var isOpened = store.get("isOpened") || false
        console.log("isOpened:",isOpened)
        return isOpened || false
    },
    setOpened:function (){
        const store = new Store();
        store.set("isOpened",true)
    }
}
export default {
    StorageUtil:StorageUtil,
    checkProxyServerIsStart:checkProxyServerIsStart,
    checkProxyCertIsInstall:checkProxyCertIsInstall
}
