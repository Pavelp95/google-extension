var windowId = null;
var ownerTabId = null; //Беграун дебажить на фоновой странице
var tabId = null;



async function start() {
    await createWindow();
    await sleep(3000);
    await executeScript(ownerTabId);
}

chrome.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if (request.action == 'get_next_logins') {
        var login = request['login'];
        var countTabs = 1;
        var allLogins = localStorage.getItem('logins').split(',');
        var indexOldLogin = allLogins.indexOf(login);
        var indexNewLogin = indexOldLogin + parseInt(countTabs);

        chrome.tabs.remove(sender.tab.id, function() {
        });
        var nextLogin = allLogins[indexNewLogin];

        if (nextLogin === undefined) {
            var oldOwnerLogin = null;
            chrome.tabs.update(ownerTabId, {}, function callback(tab) {
                var url = tab.url;
                oldOwnerLogin = url.split('/')[3];
                var ownerLogins = localStorage.getItem('login').split(','); //['парус', 'ярик']
                var indexOldOwner = ownerLogins.indexOf(oldOwnerLogin); // 0
                var indexNextOwner = indexOldOwner + 1; // 1
                var nextOwnerLogin = ownerLogins[indexNextOwner];
                if (nextOwnerLogin !== undefined) {
                    var link = 'https://instagram.com/' + nextOwnerLogin;
                    chrome.tabs.create({
                            windowId: windowId,
                            url: link
                        },

                        function callback(tab2) {
                            chrome.tabs.remove(ownerTabId, function() {
                            });
                            ownerTabId = tab2.id;

                            executeScript(ownerTabId);
                        }
                    )
                } else {
                	chrome.tabs.remove(tab.id);
                	chrome.windows.remove(windowId);
                }
            });
        } else {
            await createTab(nextLogin);
        }
    }

    if (request.action == 'get_logins') {
        localStorage.setItem('logins', request.logins);
        var countTabs = 1;
        var allLogins = request.logins;
        var logins = allLogins.slice(0, countTabs);

        for (var i in logins) {
            await createTab(logins[i]);
        }
    }

    if (request.action == 'execute_background') {
        await start(); 
    }
});

async function clickAndShowStory(tabId) {
    chrome.tabs.executeScript(tabId, {
            code: "var status = 'pause';"
        },
        function() {
            chrome.tabs.executeScript(
                tabId, {
                    file: "script.js"
                }
            );
        });
    return;
}

async function createTab(login) {
    var link = 'https://instagram.com/' + login;
    chrome.tabs.create({
            windowId: windowId,
            url: link
        },

        function callback(tab) {
            chrome.tabs.executeScript(tab.id, {
                    code: "var login = '" + login + "';"
                },
                function() {
                    chrome.tabs.executeScript(
                        tab.id, {
                            file: "script.js"
                        }
                    );
                });
            return;
        }
    )

}

async function resetLogins(tabId, logins) {
    localStorage.setItem('logins', logins);
    chrome.tabs.executeScript(tabId, {
            code: "var status = 'pause';"
        },
        function() {
            chrome.tabs.executeScript(
                tabId, {
                    file: "script.js"
                }
            );
        });
}

async function createWindow() {
    var login = localStorage.getItem('login').split(',')[0];
    var link = 'https://instagram.com/' + login;
    chrome.windows.create({
        url: link
    }, function callback(window) {
        ownerTabId = window.tabs[0].id;
        windowId = window.id;
    })
}

async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

async function executeScript(tabId) {

    chrome.tabs.executeScript(
        tabId, {
            code: "var user_count = " + localStorage.getItem('number_user') + ";var status = 'scrape';"
        },
        function() {
            chrome.tabs.executeScript(
                tabId, {
                    file: "content.js"
                }
            );
        }
    )
}