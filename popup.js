// const $ = require('jquery');

document.addEventListener('DOMContentLoaded', function() {
  const checkPageButton = document.getElementById('checkPage')
  checkPageButton.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  }, false);
}, false);
