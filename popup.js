// const $ = require('jquery');

$(document).ready(() => {
  $('.options').on('click', () => {
    //navigate to options
    alert('you clicked');
    // chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
  });
});
