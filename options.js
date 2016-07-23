// Saves options to chrome.storage
function saveOptions() {
  let content = $('#content input:checked').toArray().map(input => input.value);
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
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    blockContent: ['Trump'],
  }, function(items) {
    debugger;
    // restore which boxes are checked:
    $('#content input').toArray().forEach(input => {
      // document.getElementById("checkbox").checked = true;
      if (items.blockContent.includes(input.value)) {
        input.checked = true;
        items.blockContent.splice(items.blockContent.indexOf(input.value), 1); // so only custom labels are left
      }
    });
    items.blockContent.forEach(customCategory => {
      // regenerate custom categories
      let label = $(`<label>${customCategory}</label>`).addClass('outer-label');
      let category = $(`<input class="category" type="checkbox" value='${customCategory}'>`);
      label.prepend(category);
      category[0].checked = true;
      $('#custom-category-form').prepend(label);
    });
  });
}

function createCategory(string) {
  let label = $(`<label>${string}</label>`).addClass('outer-label');
  let category = $(`<input class="category" type="checkbox" value='${string}'>`);
  label.prepend(category);
  category[0].checked = true;
  $('#custom-category-form').prepend(label);
  $('.custom-category').val(''); // clear input field
}

$(document).ready(() => {
  restoreOptions();
  let saveButton = document.getElementById('save-button');
  if (saveButton) {
    saveButton.addEventListener('click',
        saveOptions);
  }
  let customCategorySubmit = document.getElementById('custom-category-form');
  if (customCategorySubmit) {
    customCategorySubmit.addEventListener('submit', e => {
      e.preventDefault();
      createCategory($('.custom-category').val()); // pass in text field value
    });
  }
  const sexualAssault = $('.category.sexual-assault')[0];
  const trump = $('.category.trump')[0];

  $(sexualAssault).change(() => {
    let categoryParent = $('.category.sexual-assault')[0].parentNode
    $(categoryParent).children('.content-item').toArray().forEach((input) => {
      if (sexualAssault.checked) {
        input.checked = true;
      } else {
        input.checked = false;
      }
    })
  });

  $(trump).change(() => {
    let categoryParent = $('.category.trump')[0].parentNode
    $(categoryParent).children('.content-item').toArray().forEach((input) => {
      if (trump.checked) {
        input.checked = true;
      } else {
        input.checked = false;
      }
    })
  });
});
