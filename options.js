// Saves options to chrome.storage
function saveOptions() {
  let content = $('#options-content input').toArray().map(input => input.value);
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
    // restore which boxes are checked:
    $('#options-content input').toArray().forEach(input => {
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
      label.prepend($('<div class="dropdown-icon"></div>'));
      category[0].checked = true;
      $('#options-content').append(label);
    });
  });
}

function createCategory(string) {
  let label = $(`<label>${string}</label>`).addClass('outer-label');
  // let category = $(`<input class="category" type="checkbox" value='${string}'>`);
  let category = $('<input/>', {
    "class": "category",
    type: "checkbox",
    value: `${string}`,
    id: `${string}-category`
  });
  label.prepend(category);
  label.prepend($('<div class="dropdown-icon"></div>'));

  let contentItemLabel = $(`<label class="content-item">${string}</label>`)
  let contentItem = $('<input/>', {
    "class": "content-item",
    type: "checkbox",
    value: `${string}`,
    id: `${string}-item`
  });

  label.append(contentItemLabel.prepend(contentItem))

  let contentItemForm = $('<form/>', {
    "class": `${string} item-form`,
    id: `${string}-item-form`
  });

  let contentFormLabel = $(`<label class="item-form-label">Add Custom Filter</label>`);

  let contentItemInput = $('<input/>', {
    "class": `${string} item-input`,
    id: `${string}-item-input`,
    type: 'text',
    placeholder: "Enter text",
    vale: "",
  })

  let contentItemSubmit = $('<input/>', {
    type: 'submit',
    class: 'hidden-submit',
    id: `${string}-submit`,
    submit: function(e) {
      e.preventDefault();
      console.log(this.id)
      debugger
    }
  });

  contentFormLabel.append(contentItemInput);
  contentItemForm.append(contentFormLabel);
  contentItemForm.append(contentItemSubmit);
  label.append(contentItemForm);

  category[0].checked = true;
  $('#options-content').append(label);
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


  // const sexualAssault = $('.category.sexual-assault')[0];
  // const trump = $('.category.trump')[0];

  // const contentItemSubmit = $('<form class="content-form"><label class="content-item-label">Custom item: <input type="text" placeholder="Enter text" class="custom-item" value=""></label><input type="submit" class="hidden-submit"/></form>')
  // $('.outer-label').append(contentItemSubmit);
  // $('.content-form').toArray.forEach(form => {
  //   form.addEventListener('submit', e => {
  //     e.preventDefault();
  //
  //   });
  // })

  // $(sexualAssault).change(() => {
  //   let categoryParent = $('.category.sexual-assault')[0].parentNode
  //   $(categoryParent).children('.content-item').toArray().forEach((input) => {
  //     if (sexualAssault.checked) {
  //       input.checked = true;
  //     } else {
  //       input.checked = false;
  //     }
  //   })
  // });
  //
  // $(trump).change(() => {
  //   let categoryParent = $('.category.trump')[0].parentNode
  //   $(categoryParent).children('.content-item').toArray().forEach((input) => {
  //     if (trump.checked) {
  //       input.checked = true;
  //     } else {
  //       input.checked = false;
  //     }
  //   })
  // });


});
