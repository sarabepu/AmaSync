
let ws
let amIHost = false

chrome.runtime.onMessage.addListener(
    function (message, sender, sendResponse) {
        console.log(message)    
        switch (message.action) {
            case "link":
                let input = document.createElement("input")

                input.value = message.data
                document.body.appendChild(input);
                break;
        }

    }
);

document.getElementById("start").onclick = () => {
    sendMessage({ action: "conect", data: document.getElementById("nombre-host").value })
};
document.getElementById("join").onclick = () => {
    sendMessage({ action: "setup" })
    sendMessage({ action: "join", data: document.getElementById("id-sala").textContent })
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
        document.getElementById("id-sala").textContent = params.session
        
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







