// Saves options to chrome.storage
function saveOptions() {
  let categories = $('.category').toArray().map(category => category.value);
  let content = $('.content-item:checked').toArray().map(input => `${input.value},${input.parentNode.parentNode.id}`);
  console.log(content);
  chrome.storage.sync.set({
    categories: categories,
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
    categories: ['trump'],
    blockContent: ['trump'],
  }, function(items) {
    // restore which boxes are checked:
    $('#options-content .category').toArray().forEach(category => {
      if (items.categories.includes(category.value)) {
        category.checked = true;
        items.categories.splice(items.categories.indexOf(category.value), 1);
      }
    });

    let contentNames = items.blockContent.map(content => content.split(',')[0])
    $('#options-content .content-item').toArray().forEach(input => {
      if (contentNames.includes(input.value)) {
        input.checked = true;
        let index = contentNames.indexOf(input.value)
        items.blockContent.splice(index, 1); // so only custom labels are left
        contentNames.splice(index, 1);
      }
    });
    items.categories.forEach(customCategory => {
      // regenerate custom categories
      if (customCategory) {
        createCategory(customCategory);
      }
    });

    items.blockContent.forEach(content => {
      if (content) {
        let category = content.split(',')[1];
        let value = content.split(',')[0];
        createItem(category, value);
      }
    })
  });
}

function createCategory(string) {
  stringId = string.replace(" ", "-");
  let label = $(`<label>${string}</label>`).addClass('outer-label').attr('id', `${stringId}`);
  let category = $('<input/>', {
    "class": "category",
    type: "checkbox",
    value: `${stringId}`
  });
  label.prepend(category);
  label.prepend($('<div class="dropdown-icon"></div>'));

  let contentItemForm = $('<form/>', {
    "class": `${stringId} item-form`,
    id: `${stringId}-form`
  });

  let contentFormLabel = $(`<label class="outer-label">Custom filter</label>`);

  let contentItemInput = $('<input/>', {
    "class": `custom-content ${stringId}`,
    id: `${stringId}-input`,
    type: 'text',
    placeholder: "Enter text",
    vale: "",
  })

  let contentItemSubmit = $('<input/>', {
    type: 'submit',
    class: 'hidden-submit'
  });

  $(contentItemForm).submit((e) => {
    e.preventDefault();
    createItem(stringId);
  })

  contentFormLabel.append(contentItemInput);
  contentItemForm.append(contentFormLabel);
  contentItemForm.append(contentItemSubmit);
  label.append(contentItemForm);

  category[0].checked = true;
  $('#options-content').append(label);
  $('.custom-category').val(''); // clear input field
}

function createItem(category, value) {
  const formClass = category
  const parent = $(`#${formClass}`);
  let input
  if (value) {
    input = value;
  } else {
    input = $(`#${formClass}-input`).val()
  }

  const label = $(`<label class="content-label ${input}">${input}</label>`);
  const newItem = $('<input/>', {
    "class": "content-item",
    type: "checkbox",
    value: `${input}`,
    checked: true
  });

  $(parent).append(label.prepend(newItem));
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

  let itemForms = $('.item-form');
  if (itemForms) {
    itemForms.toArray().forEach((form) => {
      $(form).submit((e) => {
        e.preventDefault();
        createItem($(form).attr('class').split(' ')[0]);
      });
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
