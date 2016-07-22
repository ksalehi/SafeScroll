// Saves options to chrome.storage
function saveOptions() {
  let content = $('#content input:checked');
  chrome.storage.sync.set({
    blockContent: content,
  }, function() {
    // Update status to let user know options were saved.
    let status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
  debugger;
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    blockContent: 'Trump',
  }, function(items) {
    // restore which boxes are checked:
    $('#content input').each(input => {
      debugger;
      // document.getElementById("checkbox").checked = true;
      if (items.blockContent.includes(input)) {
        input.checked = true;
      }
    });

    // document.getElementById('content').value = items.blockContent;
  });
}

$(document).ready(() => {
  restoreOptions();
  document.getElementById('save-button').addEventListener('click',
      saveOptions);
});
