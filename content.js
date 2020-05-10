let me = { 'iAmhost': true }
let ws
let movie=document.querySelectorAll("video")[document.querySelectorAll("video").length - 1]
chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {

    if (msg.action == 'getUrl') {
        sendResponse(window.location.href)
    }
    else if (msg.action == 'conect') {
        createSocket(msg.data)
    }
    else if (msg.action == 'join') {
        ws = new WebSocket("wss://amasync.tk:8080/")
        ws.onmessage = onmessage
        ws.onopen = () => ws.send("join " + msg.data[2]+" "+ msg.data[1])
        me.iAmhost = false
        movie.currentTime=msg.data[0]
    }
    else if (msg.action == "setup") {
        console.log(msg)
        movie.onplay = (e) => {
            console.log('si es esa')
            if (!me.iAmhost) {

                hostModePause()
            }
            else {
                console.log('content: host dio play')
                ws.send("play")
            }
        };

        movie.onpause = (e) => {
            console.log(2)
            if (!me.iAmhost) {
                hostModePlay()
            }
            else {
                console.log('content: host dio pause')
                ws.send("pause")
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
                setTimeout(()=>{ws.send("move "+ movie.currentTime)},500)
            }
         }
    }
});

function hostModePlay() {
    console.log('hostmodeplay')
    let temp = movie.onplay
    movie.onplay = null
    movie.play().then((res) => movie.onplay = temp)
}


function hostModePause() {
    console.log("hostmodepause")
    let temp = movie.onpause
    movie.onpause = null
    movie.pause()
    setTimeout(()=>{movie.onpause = temp},500)
    console.log(1)
    
}

function hostModeMove(time) {
    console.log("actualizando tiempo "+time)
    movie.currentTime=time
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
        case "hosttime":
            ws.send("hosttime "+rest[0]+" "+movie.currentTime)
            break
        case "move":
            hostModeMove(rest[0])
    }
}

function createSocket(nombre) {

    console.log('creatingsocket')
    ws = new WebSocket("wss://amasync.tk:8080/")
    ws.onmessage = onmessage
    ws.onopen = () => ws.send("create " + nombre+" "+movie.currentTime)

}
function sendMessagePop(message) {
    chrome.runtime.sendMessage(message)
}
