chrome.runtime.onMessage.addListener(
	async function(request, sender, sendResponse){
		console.log('request: ' + JSON.stringify(request));
		console.log('localStorage: ' + JSON.stringify(localStorage));
		if (request['action'] == 'get_next_logins') {
			console.log('get_next_logins');
			console.log('before login' + JSON.stringify(request));
			var login = request['login'];;
			console.log('after login' + JSON.stringify(request));
			var countTabs = localStorage.getItem('count_tabs');
			console.log('get_next_logins countTabs: ' + countTabs);
			var allLogins = localStorage.getItem('logins').split(',');
			console.log('get_next_logins allLogins: ' + allLogins);
			var indexOldLogin = allLogins.indexOf(login);
			var indexNewLogin = indexOldLogin + parseInt(countTabs);
			console.log('indexOldLogin' + indexOldLogin);
			console.log('indexNewLogin' + indexNewLogin);

			// var activeTabIds = localStorage.getItem('tabs').split(',').map(function(item) {
		 //    	return parseInt(item, 10);
			// });
			// console.log('activeTabIds: ' + activeTabIds);
			// chrome.tabs.remove(activeTabIds, function() {

			// 	localStorage.setItem('tabs', []);
			// });
			await createTab([allLoginsindexNewLogin]);
		}

		if (request.action == 'get_logins') {
			localStorage.setItem('logins', request.logins);
			var countTabs = localStorage.getItem('count_tabs');
			console.log('countTabs: ' + countTabs);
			var allLogins = request.logins;
			console.log('logins: ' + allLogins);
			var logins = allLogins.slice(0, countTabs);
			console.log('logins: ' + logins);

			for (var i in logins) {
				await createTab(logins[i]);
			}
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
		{windowId: windowId, url: link}, 
		function callback(tab) {
			// if (localStorage.getItem('tabs') === null) {
			// 	localStorage.setItem('tabs', [tab.id]);
			// } else {
			// 	var tmpTabs = localStorage.getItem('tabs').split(',');
			// 	tmpTabs.push(tab.id);
			// 	localStorage.setItem('tabs', tmpTabs);
			// }
			// console.log('createTab: ' + localStorage.getItem('tabs'));
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
			// console.log('window ' + JSON.stringify(window));
			ownerTabId = window.tabs[0].id;
			windowId = window.id;
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