// const $ = require('jquery');

document.addEventListener('DOMContentLoaded', function() {
  const settings = document.getElementsByClassName('settings')[0];
  settings.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  }, false);
}, false);
