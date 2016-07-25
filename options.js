// Saves options to chrome.storage
function saveOptions() {
  let categories = $('.category').toArray().map(category => `${category.value},${category.checked}`);
  let content = $('.content-item').toArray().map(input => `${input.value},${input.parentNode.parentNode.id},${input.checked}`);
  console.log(categories);
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

    let categoryNames = items.categories.map(category => category.split(',')[0]);
    let categoryChecks =items.categories.map(category => category.split(',')[1]);
    $('#options-content .category').toArray().forEach(category => {
      if (categoryNames.includes(category.value)) {
        let index = categoryNames.indexOf(category.value);
        if (categoryChecks[index] === "true") {
          category.checked = true;
        } else {
          category.checked = false;
        }
        items.categories.splice(index, 1);
        categoryNames.splice(index, 1);
        categoryChecks.splice(index, 1);
      }
    });

    let contentNames = items.blockContent.map(content => content.split(',')[0]);
    let contentChecks = items.blockContent.map(content => content.split(',')[2]);
    $('#options-content .content-item').toArray().forEach(input => {
      if (contentNames.includes(input.value)) {
        let index = contentNames.indexOf(input.value);
        if (contentChecks[index] === "true") {
           input.checked = true;
         } else {
           input.checked = false;
         }
        items.blockContent.splice(index, 1); // so only custom labels are left
        contentNames.splice(index, 1);
        contentChecks.splice(index, 1);
      }
    });

    items.categories.forEach(customCategory => {
      // regenerate custom categories
      if (customCategory) {
        let name = customCategory.split(',')[0];
        let check = customCategory.split(',')[1];
        createCategory(name, check);
      }
    });
    $('.down').on('click', e => {
      addDropdownListener(e);
    });

    $('.up').on('click', e => {
      addDropdownListener(e);
    });

    items.blockContent.forEach(content => {
      if (content) {
        let category = content.split(',')[1];
        let value = content.split(',')[0];
        let check = content.split(',')[2];
        createItem(category, check, value);
      }
    });
  });
}

function addDropdownListener(e) {
  e.preventDefault();
  e.stopPropagation();
  toggleDropdown(e);
}

function toggleDropdown(e) {
  let outerDiv = $(e.target.parentNode.parentNode);
  if (outerDiv.hasClass('collapsed')) {
    outerDiv.removeClass('collapsed');
    $(e.target).addClass('up');
    $(e.target).removeClass('down');
  } else {
    outerDiv.addClass('collapsed');
    $(e.target).addClass('down');
    $(e.target).removeClass('up');
  }
}

function createCategory(string, check) {
  let stringId = string.replace(" ", "-");
  let label = $(`<label><div class="label-text">${string}</div></label>`).addClass('outer-label').attr('id', `${stringId}`);
  let newDiv = $('<div></div>').addClass('content-category collapsed');
  newDiv.append(label);

   if (check === "true") {
     check = true;
   } else {
     check = false;
   }

  let category = $('<input/>', {
    "class": "category",
    type: "checkbox",
    value: `${stringId}`,
    checked: check,
  });
  label.prepend(category);
  let dropdown = $('<div class="dropdown-icon down"></div>');
  label.prepend(dropdown);

  dropdown.on('click', e => {
    addDropdownListener(e);
  });

  let contentItemForm = $('<form/>', {
    "class": `${stringId} item-form`,
    id: `${stringId}-form`
  });

  let contentFormLabel = $(`<label class="outer-label">Custom filter: </label>`);

  let contentItemInput = $('<input/>', {
    "class": `custom-content ${stringId}`,
    id: `${stringId}-input`,
    type: 'text',
    placeholder: "Enter text",
    value: "",
  });

  let contentItemSubmit = $('<input/>', {
    type: 'submit',
    class: 'hidden-submit'
  });

  $(contentItemForm).submit((e) => {
    e.preventDefault();
    createItem(stringId, "true");
  });

  contentFormLabel.append(contentItemInput);
  contentItemForm.append(contentFormLabel);
  contentItemForm.append(contentItemSubmit);
  newDiv.append(contentItemForm);

  // category[0].checked = true;
  $('#options-content').append(newDiv);
  $('.custom-category').val(''); // clear input field
}

function createItem(category, check, value) {
  const formClass = category;
  const parent = $(`#${formClass}`);
  let input;
  if (value) {
    input = value;
  } else {
    input = $(`#${formClass}-input`).val();
  }

  if (check === "true") {
   check = true;
  } else {
   check = false;
  }

  const label = $(`<label class="content-label ${input}">${input}</label>`);
  const newItem = $('<input/>', {
    "class": "content-item",
    type: "checkbox",
    value: `${input}`,
    checked: check
  });

  $(parent).append(label.prepend(newItem));
  $('.custom-content').val(''); // clear input fields
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
      createCategory($('.custom-category').val(), "true"); // pass in text field value
    });
  }

  let itemForms = $('.item-form');
  if (itemForms) {
    itemForms.toArray().forEach((form) => {
      $(form).submit((e) => {
        e.preventDefault();
        createItem($(form).attr('class').split(' ')[0], 'true');
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
