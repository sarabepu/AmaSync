chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

    if (msg.action == 'getUrl') {
        sendResponse(window.location.href)
    }
  });