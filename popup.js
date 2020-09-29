function popup() {
  var login = document.getElementById('login').value;
  var numberUser = parseInt(document.getElementById('number_user').value);
  localStorage.setItem('login', login);
  localStorage.setItem('number_user', numberUser);
  chrome.runtime.sendMessage({
    'action': 'execute_background'
  });
  return;
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("button").addEventListener("click", popup);
});