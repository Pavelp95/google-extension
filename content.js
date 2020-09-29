console.log('status ' + status);
console.log('user_count ' + user_count);
document.getElementsByClassName("-nal3 ")[1].click();

setTimeout(function() {
    var div_accounts = document.getElementsByClassName("isgrP");
    var div_accounts_height = div_accounts[0].scrollHeight;
    var title = document.getElementsByClassName("m82CD")[0].textContent;
    var usersWithStory =  document.getElementsByClassName("RR-M- h5uC0 SAvC5");
    var height_scrolling = [];
    var speed_scrolling = 350;
    var language = 'en';
    if (title == "Подписчики" || title == "Followers") {
        if (title == "Подписчики") language = 'ru';
        var total_count = document.getElementsByClassName("g47SY")[1].innerHTML;
    } else {
        var total_count = document.getElementsByClassName("g47SY")[2].innerHTML;
    }

    scrollBellow();
    run_scrolling();
   
    function start_parsing() {   // получает имена с прокрутки.
        var usersWithStory = document.getElementsByClassName("RR-M- h5uC0 SAvC5");
        var logins = [],
            tag;
        for (var i = 0; i < usersWithStory.length; i++) {
        	if (i == 0) continue;
            tag = usersWithStory[i].children[1].children[0].getAttribute('alt');
            logins.push(getLoginFromTag(tag));
        }
        chrome.runtime.sendMessage({
			logins: logins,
			action: 'get_logins'
        });
        return;

        function getLoginFromTag(tag) {
            if (language == 'ru') return tag.split(' ')[2];
            return tag.split(' ')[0].replace("'s", "");
        }
    }
    
    function scrollBellow() {       // прокручивает до появление классов.

        for (var i = 0; i < 3; i++) {
            div_accounts[0].scrollBy(0, 100);   
        }
    }
        
    function run_scrolling() {  // прокручивет до появление нужного количество имен
        usersWithStory = document.getElementsByClassName("RR-M- h5uC0 SAvC5");
        div_accounts_height = div_accounts[0].scrollHeight;
        height_scrolling.push(div_accounts_height);
        if (user_count >= total_count || user_count == 0) {
            user_count = total_count;
        }
        if (
            usersWithStory.length != total_count &&
            user_count > usersWithStory.length &&
            height_scrolling[0] != height_scrolling[4]
        ) {
            div_accounts[0].scrollBy(0, 200);
            if (height_scrolling.length == 5) {
                height_scrolling = [];
            }
            var timeoutID = setTimeout(run_scrolling, speed_scrolling);
        } else {
            clearTimeout(timeoutID);
            start_parsing();
        }
        return false;
    }
}, 2000);