// const $ = require('jquery');
let disableSetting

document.addEventListener('DOMContentLoaded', function() {
  restoreOptions();
}, false);

function restoreOptions() {
  let disableSetting
  chrome.storage.sync.get(
    'disabled', function(items) {
    disableSetting = items.disabled;
    const disabled = document.getElementsByClassName('disable')[0];
    if (items.disabled === true) {
      disabled.textContent = "Disabled";
    } else {
      disabled.textContent = "Enabled";
    }
    // alert(disableSetting);
    setListeners();
  });
};

function setListeners() {
  const settings = document.getElementsByClassName('settings')[0];
  settings.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  }, false);

  const disabled = document.getElementsByClassName('disable')[0];
  disabled.addEventListener('click', () => {
    if (disableSetting) {
      chrome.storage.sync.set({
        disabled: false
      }, () => {
        disableSetting = false;
        disabled.textContent = "Enabled";
      })
    } else {
      chrome.storage.sync.set({
        disabled: true
      }, () => {
        disableSetting = true;
        disabled.textContent = "Disabled";
      })
    }
  });
}

// document.addEventListener('DOMContentLoaded', function() {
//   const settings = document.getElementsByClassName('settings')[0];
//   settings.addEventListener('click', function() {
//     chrome.runtime.openOptionsPage();
//   }, false);
//
//   const disable = document.getElementsByClassName('disable')[0];
//   disable.addEventListener('click', () => {
//     chrome.storage.sync.set({
//       disabled: true
//     })
//   }, false);
//
//   const enable = document.getElementsByClassName('enable')[0];
//   enable.addEventListener('click', () => {
//     chrome.storage.sync.set({
//       disabled: false
//     })
//   }, false);
// }, false);
