// Saves options to chrome.storage
function saveOptions() {
  let categories = $('.category').toArray().map(category => {
    return `${category.value},${category.checked}`;
  });
  let content = $('.content-item').toArray().map(input => {
    return `${input.value},${input.parentNode.parentNode.id},${input.checked}`;
  });
  chrome.storage.sync.set({
    categories: categories,
    blockContent: content,
  }, function() {
    // Update status to let user know options were saved.
    let status = $('#status');
    status[0].textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
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
        category.checked = (categoryChecks[index] === "true" ? true : false);
        spliceContent([items.categories, categoryNames, categoryChecks], index);
      }
    });

    let contentNames = items.blockContent.map(content => content.split(',')[0]);
    let contentChecks = items.blockContent.map(content => content.split(',')[2]);
    $('#options-content .content-item').toArray().forEach(input => {
      if (contentNames.includes(input.value)) {
        let index = contentNames.indexOf(input.value);
        input.checked = (contentChecks[index] === "true" ? true : false);
        spliceContent([items.blockContent, contentNames, contentChecks], index);
      }
    });

    addListeners();

    items.categories.forEach(customCategory => {
      // regenerate custom categories
      if (customCategory) {
        let name = customCategory.split(',')[0];
        let check = customCategory.split(',')[1];
        createCategory(name, check, 'true');
      }
    });

    items.blockContent.forEach(content => {
      if (content) {
        let category = content.split(',')[1];
        let value = content.split(',')[0];
        let check = content.split(',')[2];
        createItem(category, check, value);
      }
    });

    $('.category').toArray().forEach((cat) => {
      $(cat).change(() => {
        categoryChange(cat);
      });
    });
  });
}

function addListeners() {
  $('.down').on('click', e => {
    addDropdownListener(e);
  });

  $('.up').on('click', e => {
    addDropdownListener(e);
  });

  $('.delete-content-item').on('click', e => {
    deleteContentItem(e);
  });

  $('.delete-category').on('click', e => {
    deleteCategory(e);
  });
}

function spliceContent(items, index) {
  items.forEach( item => item.splice(index, 1));
  // so only custom categories / subfields are left
}

function categoryChange(cat) {
  let children = $(cat.parentNode).find('.content-item').toArray();
  children.forEach((child) => {
    child.checked = (cat.checked ? true : false);
  });
}

function addDropdownListener(e) {
  e.preventDefault();
  e.stopPropagation();
  toggleDropdown(e);
}

function deleteContentItem(e) {
  e.preventDefault();
  e.stopPropagation();
  $(e.target.parentNode).remove();
}

function deleteCategory(e) {
  e.preventDefault();
  e.stopPropagation();
  $(e.target.parentNode.parentNode).remove();
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

function createCategory(string, check, regenerate) {
  let stringId = string.replace(" ", "-");
  let label = $(`<label><div class="label-text">${string}</div></label>`).addClass('outer-label').attr('id', `${stringId}`);
  let deleteButton = $('<div class="delete-category"></div>');
  label.prepend(deleteButton);
  let newDiv = $('<div></div>').addClass('content-category');
  newDiv.append(label);

  check = (check === "true" ? true : false);

  let category = $('<input/>', {
    "class": "category",
    type: "checkbox",
    value: `${stringId}`,
    checked: check,
  });
  label.prepend(category);
  let dropdown;
  if (regenerate === "true") {
    dropdown = $('<div class="dropdown-icon down"></div>');
    newDiv.addClass('collapsed');
  } else {
    dropdown = $('<div class="dropdown-icon up"></div>');
  }
  label.prepend(dropdown);

  dropdown.on('click', e => {
    addDropdownListener(e);
  });

  deleteButton.on('click', e => {
    deleteCategory(e);
  });

  $(category).change(() => {
    categoryChange(category[0]);
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

  $('#options-content').append(newDiv);
  $('.custom-category').val(''); // clear input field
}

function createItem(category, check, value) {
  const parent = $(`#${category}`);
  let input;
  if (value) {
    input = value;
  } else {
    input = $(`#${category}-input`).val();
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
  const deleteDiv = $('<div class="delete-content-item"></div>');
  deleteDiv.on('click', e => deleteContentItem(e));
  $(parent).append(label.prepend(newItem).append(deleteDiv));
  $('.custom-content').val('');
}

$(document).ready(() => {
  restoreOptions();
  let saveButton = $('#save-button');
  if (saveButton) {
    saveButton.on('click', saveOptions);
  }

  let customCategorySubmit = $('#custom-category-form');
  if (customCategorySubmit) {
    customCategorySubmit.on('submit', e => {
      e.preventDefault();
      createCategory($('.custom-category').val(), 'true', 'false'); // pass in text field value
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
});
