
let ws
let amIHost = false
document.getElementById("start").onclick = () => {
    ws = new WebSocket("wss://localhost:8080")

    ws.onmessage = onmessage

    ws.onopen = () => ws.send("create "+document.getElementById("nombre-host"))
    amIHost = true
} 


function sendMessage(msg,callback){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, msg, callback); 
    });
}

chrome.tabs.getSelected(null, (tab) => {
    let url = tab.url
    params = getQueryParams(url)
    if ("session" in params){
        ws = new WebSocket("wss://localhost:8080")
        ws.onmessage = onmessage
        document.getElementById("start")
        document.getElementById("join-div").style.display = "block"
        document.getElementById("id-sala").textContent = params.session
        ws.onopen = () => ws.send("join "+params[session])
    }
    else{
        document.getElementById("nuevo").style.display = "block"
    }
})


function onmessage(e){
        console.log(e)
        let [action, ...rest] = e.data.split(' ')
        console.log(rest)
        switch (action){
            case "created":
                sendMessage({action: "getUrl"}, (res) => {
                    console.log(res);
                    let input = document.createElement("input")
                    input.value = res+"?session="+rest[0]
                    document.body.appendChild(input)
                })
                break;
        }
}

function getQueryParams(url) {
    let queryParams = {};
  //create an anchor tag to use the property called search
    let anchor = document.createElement('a');
  //assigning url to href of anchor tag
    anchor.href = url;
  //search property returns the query string of url
    let queryStrings = anchor.search.substring(1);
    let params = queryStrings.split('&');

    for (var i = 0; i < params.length; i++) {
        var pair = params[i].split('=');
        queryParams[pair[0]] = decodeURIComponent(pair[1]);
    }
    return queryParams;
};







