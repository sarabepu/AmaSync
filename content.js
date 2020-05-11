let me = {'iAmhost': true}
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

    if (msg.action == 'getUrl') {
        sendResponse(window.location.href)
    }
    else if (msg.action == 'conect'){
        createSocket(msg.data)
    }
    else if (msg.action=='join'){
        ws = new WebSocket("wss://localhost:8080")
        ws.onmessage = onmessage
        ws.onopen = () => ws.send("join " + msg.data)
        me.iAmhost=false
    }
    else if (msg.action == "setup"){
        console.log(msg)
        document.querySelectorAll("video")[1].onplay = (e) => {
            console.log(me)
            if (!me.iAmhost) {
                document.querySelectorAll("video")[1].pause()
            }
        }
    }
  });

  function createSocket(nombre){
      
    console.log('creatingsocket')
    ws = new WebSocket("wss://localhost:8080")
    ws.onmessage = onmessage
    ws.onopen = () => ws.send("create "+nombre)
    
  }
  function sendMessagePop(message){
      chrome.runtime.sendMessage(message)
  }

  function onmessage(e) {
    console.log(e)
    let [action, ...rest] = e.data.split(' ')
    switch (action){
        case "created":
                console.log('sending message to pop')
                let res=window.location.href
                
                let prefix = res.includes('?') ? '&' : '?'

                let data = res + prefix + "session=" + rest[0]

                sendMessagePop({action:"link",data})
                
            break;
    }
}

