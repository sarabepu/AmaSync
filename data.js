

let startTime = 0

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        console.log(message)    
        switch (message.action) {
            case "link":
                
                document.getElementById("nuevo").style.display = "none"
                let p=document.createElement("p");
                p.textContent="Su sala ha sido creada. Comparta este link con sus amigos"
                document.body.appendChild(p)
                let input = document.createElement("input")
                input.value = message.data
                document.body.appendChild(input);
                break;
            case "joined":
                document.getElementById("join-div").style.display = "none"
                let h=document.createElement("h1")
                h.textContent="Exito"
                document.body.appendChild(h)
        }

    }
);

document.getElementById("start").onclick = () => {
    sendMessage({ action: "setup" })
    sendMessage({ action: "conect", data: document.getElementById("nombre-host").value })
};
document.getElementById("join").onclick = () => {
    sendMessage({ action: "setup" })
    let nombre=document.getElementById("nombre").value
    sendMessage({ action: "join", data: [startTime,document.getElementById("id-sala").textContent,nombre] })
};

function sendMessage(msg, callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, msg, callback);
    });
}

chrome.tabs.getSelected(null, (tab) => {
    let url = tab.url
    params = getQueryParams(url)
    if ("session" in params) {
        
        
        document.getElementById("join-div").style.display = "block"
        
        document.getElementById("host-name").textContent = params.name
        document.getElementById("id-sala").textContent = params.session
        startTime=params.time
    }
    else {
        document.getElementById("nuevo").style.display = "block"
    }
})




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







