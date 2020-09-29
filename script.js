console.log('login in script: ' + login);
setTimeout(function(){
	document.getElementsByClassName('CfWVH')[0].click();
	var timerId = setInterval(function(){
		if (!document.getElementsByClassName('B20bj').length) {
		 //|| document.getElementsByClassName('ow3u_')[0].click())
			chrome.runtime.sendMessage({
			    'action': 'get_next_logins',
			    'login': login
			});			
			clearInterval(timerId);
		} else {
			document.getElementsByClassName('ow3u_')[0].click()
		};
	}, 3000);
	return ;
}, 1000)
