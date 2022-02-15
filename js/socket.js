import Vue from 'vue';
import { Toast } from 'vant';

Vue.use(Toast);
let webSocket = null
let messageCallback = null
let errorCallback = null
let wsUrl = ''
let isConnecting = false
    /*
     * 发起websocket请求函数
     * @param {string} url ws连接地址
     * @param {Object} agentData 传给后台的参数
     * @param {function} successCallback 接收到ws数据，对数据进行处理的回调函数
     * @param {function} errCallback ws连接错误的回调函数

    */
window.webSocketContainer = {
    webSocket: null
}
export function sendWebsocket(webSocket, agentDatas) {
    console.log('发起websocket连接请求')
    wsUrl = webSocket.webSocketUrl
    console.log(webSocket, agentDatas)
    connectSocket(agentDatas)
    messageCallback = webSocket.successCallback
    errorCallback = webSocket.errCallback
}

function connectSocket(agentDatas) {

    //判断当前浏览器是否支持WebSocket
    if ('WebSocket' in window) {
        try {
            
            isConnecting = true;
            webSocket = new WebSocket(wsUrl)
            window.webSocketContainer.webSocket = webSocket
        } catch (e) {
            Toast("connect failed, please check whether the url is correct")
        }
    } else {
        Toast('Not support websocket')
    }

    //连接发生错误的回调方法
    webSocket.onerror = function() {
        console.log('websocket连接失败')
        errorCallback("error");
    };

    //连接成功建立的回调方法
    webSocket.onopen = function() {
        console.log('websocket连接成功')
        isConnecting = false
        messageCallback("open");
        websocketSend(agentDatas)
    }

    //接收到消息的回调方法
    webSocket.onmessage = function(e) {
        console.log('websocket连接成功，接收消息', e)
        let responseData = JSON.parse(e.data);
        let dataLength = Object.keys(responseData).length;
        if (responseData.hasOwnProperty("ping") && dataLength === 1) {
            let timestamp = new Date().getTime();
            let responseData = { "pong": timestamp }
            sendHeartbeatToServer(JSON.stringify(responseData))
        } else if (responseData.hasOwnProperty("error")) {
            // webSocket.close();
            // connectSocket(agentDatas)
            return;
        }
        messageCallback(responseData)
    }


    //连接关闭的回调方法
    webSocket.onclose = function(e) {
        isConnecting = true
        reconnectSocket(agentDatas);
        console.log('关闭websocket连接')
    }

    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function() {
        console.log('关闭websocket连接')
        webSocket.close();
    }


}


function reconnectSocket(agentDatas) {
    console.log('websocket状态：', webSocket.readyState)
    setInterval(() => {
        // 添加状态判断，当为OPEN时，发送消息
        console.log('websocket状态：', webSocket.readyState)
        if (null === webSocket || webSocket.readyState === webSocket.CLOSED) {
            console.log('websocket状态：', webSocket.readyState)
            if (isConnecting == true) {
                console.log('websocket状态：', webSocket.readyState)
                connectSocket(agentDatas)
            }
        }
    }, 1000)
}
/*
 * 发起websocket连接
 * @param {Object} agentData 需要向后台传递的参数数据
 */
export function websocketSend(agentDatas) {
    if (webSocket.readyState === webSocket.OPEN) { // websock.OPEN = 1
        // 发给后端的数据需要字符串化
        for (let i = 0; i < agentDatas.length; i++) {
            webSocket.send(JSON.stringify(agentDatas[i]))
        }
    }
}

function sendHeartbeatToServer(jsonData) {
    webSocket.send(jsonData);
}


export function webSocketClose() {
    console.log('跳转页面，关闭websocket连接')
    webSocket.close();
}



//用websocket发送接受二进制数据
// var socket = new WebSocket(url);
// socket.binaryType = 'arraybuffer';

// Wait until socket is open
// socket.addEventListener('open', function (event) {
// Send binary data
//   var typedArray = new Uint8Array(4);
//   socket.send(typedArray.buffer);
// });

// Receive binary data
// socket.addEventListener('message', function (event) {
//   var arrayBuffer = event.data;
// ···
// });