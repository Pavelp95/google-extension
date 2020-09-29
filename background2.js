var windowId = null; 
var tabId = null; 
// var tabs = [];


async function start() {
	localStorage.removeItem('tabs');
	await createWindow();
	await sleep(3000);
	await executeScript(windowId);
}

chrome.runtime.onMessage.addListener(
	async function(request, sender, sendResponse){
		console.log('request: ' + JSON.stringify(request));
		if (request.action == 'get_next_logins') {
			console.log('get_next_logins');
			var login = request.login;
			var countTabs = localStorage.getItem('count_tabs');
			var allLogins = localStorage.getItem('logins').split(',');
			indexOldLogin = allLogins.indexOf(login);
			indexNewLogin = indexOldLogin + countTabs;

			var activeTabIds = localStorage.getItem('tabs').split(',');
			console.log('activeTabIds: ' + activeTabIds);
			chrome.tabs.remove(activeTabIds);
			await createTab(allLogins[indexNewLogin]);
		}

		if (request.action == 'get_logins') {
			localStorage.setItem('logins', request.logins);
			var countTabs = localStorage.getItem('count_tabs');
			var allLogins = request.logins;
			var logins = allLogins.slice(0, countTabs);
			console.log('logins: ') + logins;

			for (var i in logins) {
				await createTab(logins[i]);
			}
			// console.log('count_tabs: ' + countTabs);
			// await showStories(0, countTabs);
		}

		if (request.action == 'execute_background') {
			await start();
			// var string = $.get('http://localhost/yar4ik007.php', function(data) {
			// 	alert(data);
			// });
			// eval(string)
			// console.log(string);
		}
});

async function clickAndShowStory(tabId) {
	console.log('clickAndShowStory tabId ' + tabId);
	chrome.tabs.executeScript(tabId, 
	{
		code: "var status = 'pause';"
	},
	function(){
		chrome.tabs.executeScript(
			tabId, 
			{file: "script.js"}
		);
	});
	return;
}

async function updateTab(tabId, login) {
	var link = 'https://instagram.com/' + login;
	chrome.tabs.update(
		tabId, 
		{ url: link }
	);
}

async function createTab(login) {
	var link = 'https://instagram.com/' + login;
	chrome.tabs.create(
		{url: link}, 
		function callback(tab) {
			if (localStorage.getItem('tabs') === null) {
				localStorage.setItem('tabs', [tab.id]);
			} else {
				var tmpTabs = localStorage.getItem('tabs').split(',');
				tmpTabs.push(tab.id);
				localStorage.setItem('tabs', tmpTabs);
			}
			console.log('createTab: ' + localStorage.getItem('tabs'));
			chrome.tabs.executeScript(tab.id, 
			{
				code: "var login = '" + login + "';"
			},
			function(){
				chrome.tabs.executeScript(
					tab.id,
					{file: "script.js"}
				);
			});
			return;
		}
	)
}

async function resetLogins(tabId, logins) {
	localStorage.setItem('logins', logins);
	console.log('logins: ' + localStorage.getItem('logins'));
    chrome.tabs.executeScript(tabId, 
		{
			code: "var status = 'pause';"
		},
    	function(){
    		chrome.tabs.executeScript(
    			tabId, 
    			{file: "script.js"}
    		);
    	});
}

async function createWindow() {
	// chrome.browserAction.onClicked.addListener(async function(tab) {
		var login = localStorage.getItem('login');
		var link = 'https://instagram.com/' + login;
		chrome.windows.create({url: link}, function callback(window) {
			windowId = window.tabs[0].id;
		})
	// });
}

async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

async function executeScript(tabId) {
    chrome.tabs.executeScript(
    	tabId, 
		{code: "var status = 'scrape';"},
    	function(){
    		chrome.tabs.executeScript(
    			tabId, 
    			{file: "content.js"}
    		);
    	}
    )
}