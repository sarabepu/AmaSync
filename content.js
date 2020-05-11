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
        ws.onopen = () => ws.send("join " + msg.data[1])
        me.iAmhost = false
        document.querySelectorAll("video")[1].currentTime=msg.data[0]
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
            console.log(2)
            if (!me.iAmhost) {
                hostModePlay()
            }
            else {
                console.log('content: host dio pause')
                ws.send("control pause")
            }
        }

         document.querySelector(`#dv-web-player > div > div:nth-child(1) > div > div > 
         div:nth-child(2) > div > div > div.scalingUiContainerBottom > div > div.controlsOverlay > 
         div.bottomPanel > div:nth-child(1) > div > div.progressBarContainer`).onclick=()=>{
            console.log('mover tiempo')
            if (!me.iAmhost) {
                
                ws.send("restart move")
                
            }
            else {
                console.log('content: host dio move')
                setTimeout(()=>{ws.send("control move "+ document.querySelectorAll("video")[1].currentTime)},500)
            }
         }
    }
});

function hostModePlay() {
    console.log('hostmodeplay')
    let temp = document.querySelectorAll("video")[1].onplay
    document.querySelectorAll("video")[1].onplay = null
    document.querySelectorAll("video")[1].play().then((res) => document.querySelectorAll("video")[1].onplay = temp)
}


function hostModePause() {
    console.log("hostmodepause")
    let temp = document.querySelectorAll("video")[1].onpause
    document.querySelectorAll("video")[1].onpause = null
    document.querySelectorAll("video")[1].pause()
    setTimeout(()=>{document.querySelectorAll("video")[1].onpause = temp},500)
    console.log(1)
    
}

function hostModeMove(time) {
    console.log("actualizando tiempo "+time)
    document.querySelectorAll("video")[1].currentTime=time
}

function onmessage(e) {
    console.log(e)
    let [action, ...rest] = e.data.split(' ')
    switch (action) {
        case "created":
            let res = window.location.href
            let idSala=rest[0]
            let nombre=rest[1]
            let tiempo=rest[2]
            let prefix = res.includes('?') ? '&' : '?'
            let data = res + prefix + "session=" + idSala+"&name="+nombre+"&time="+tiempo
            sendMessagePop({ action: "link", data })

            break;
        case "play":
            hostModePlay()
            break;
        case "pause":
            hostModePause()
            break;

        case "joined":
            sendMessagePop({ action: "joined" })
            break;
        case "hostTime":
            ws.send("hosttime "+rest[0]+document.querySelectorAll("video")[1].currentTime)
            break
        case "move":
            hostModeMove(rest[0])
    }
}

function createSocket(nombre) {

    console.log('creatingsocket')
    ws = new WebSocket("wss://localhost:8080")
    ws.onmessage = onmessage
    ws.onopen = () => ws.send("create " + nombre+" "+document.querySelectorAll("video")[1].currentTime)

}
function sendMessagePop(message) {
    chrome.runtime.sendMessage(message)
}
