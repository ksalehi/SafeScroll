// const $ = require('jquery');

<<<<<<< HEAD
  checkPageButton.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  }, false);
}, false);
=======
$(document).ready(() => {
  $('.options').on('click', () => {
    //navigate to options
    alert('you clicked');
    // chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
  });
});
>>>>>>> f19aebcb26e2b5fcdbb9a3dd2eba445e484520c0
