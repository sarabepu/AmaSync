let me = { 'iAmhost': true }
let ws
chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {

    if (msg.action == 'getUrl') {
        sendResponse(window.location.href)
    }
    else if (msg.action == 'conect') {
        createSocket(msg.data)
    }
    else if (msg.action == 'join') {
        ws = new WebSocket("wss://localhost:8080")
        ws.onmessage = onmessage
        ws.onopen = () => ws.send("join " + msg.data)
        me.iAmhost = false
    }
    else if (msg.action == "setup") {
        console.log(msg)
        document.querySelectorAll("video")[1].onplay = (e) => {
            console.log('si es esa')
            if (!me.iAmhost) {

                hostModePause()
            }
            else {
                console.log('content: host dio play')
                ws.send("control play")
            }
        };

        document.querySelectorAll("video")[1].onpause = (e) => {
            console.log('pause')
            if (!me.iAmhost) {
                hostMode()
            }
            else {
                console.log('content: host dio pause')
                ws.send("control pause")
            }
        }
    }
});

function hostModePlay() {
    let temp = document.querySelectorAll("video")[1].onplay
    document.querySelectorAll("video")[1].onplay = null
    document.querySelectorAll("video")[1].play().then((res) => document.querySelectorAll("video")[1].onplay = temp)
}


function hostModePause() {
    let temp = document.querySelectorAll("video")[1].onpause
    document.querySelectorAll("video")[1].onpause = null
    document.querySelectorAll("video")[1].pause()
    document.querySelectorAll("video")[1].onpause = temp
}

function onmessage(e) {
    console.log(e)
    let [action, ...rest] = e.data.split(' ')
    switch (action) {
        case "created":
            let res = window.location.href
            let prefix = res.includes('?') ? '&' : '?'
            let data = res + prefix + "session=" + rest[0]
            sendMessagePop({ action: "link", data })

            break;
        case "play":
            hostModePlay()
            break;
        case "pause":
            hostModePause()
            break;

        case "joined":
            console.log("llego joined a content")
            sendMessagePop({ action: "joined" })
    }
}

function createSocket(nombre) {

    console.log('creatingsocket')
    ws = new WebSocket("wss://localhost:8080")
    ws.onmessage = onmessage
    ws.onopen = () => ws.send("create " + nombre)

}
function sendMessagePop(message) {
    chrome.runtime.sendMessage(message)
}
