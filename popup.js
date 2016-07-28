let disableSetting;

document.addEventListener('DOMContentLoaded', function() {
  restoreOptions();
}, false);

function restoreOptions() {
  chrome.storage.sync.get(
    'disabled', function(items) {
    disableSetting = items.disabled;
    const disabled = document.getElementsByClassName('disable')[0];
    if (items.disabled === true) {
      disabled.textContent = "Enable";
    } else {
      disabled.textContent = "Disable";
    }
    setListeners();
  });
}

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
        disabled.textContent = "Disable";
      });
    } else {
      chrome.storage.sync.set({
        disabled: true
      }, () => {
        disableSetting = true;
        disabled.textContent = "Enable";
      });
    }
  });
}
