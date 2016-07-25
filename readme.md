#[SAFE SCROLL]

Chrome extension offering content screening.

## Description

SafeScroll is a Chrome extension that gives users the power of content screening. Intended for trauma survivors, SafeScroll reads your webpage before you do and will throw up a removable block between you and the content you don't want to see.

All screens are easily removed with a small lock icon in the top-right corner. SafeScroll can act as a preemptive warning for possibly triggering material, but you always have the ability to dismiss the warning. If you decide you actually didn't want to see what was beneath, simply click the item again to put the screen back in place.

SafeScroll screening is fully customizable -- use default settings or dive into the details to block exactly what you need to.

## Examples

### Gun Violence

Use SafeScroll to broadly block out news stories of gun violence, or narrow it in on particularly relevant events.

![guns]

### Hate Language

Screen out hateful language from social media.

![racist]

### Powerful

Intended as a powerful tool to assist survivors after traumatic events, SafeScroll is at home screening out massive amounts of news sources. Here we're blocking all stories related to Trump -- with a couple unhidden that we decided we wanted to peek at.

![trump]

### Widely Applicable

While SafeScroll was built to address very serious issues, the same technology is just as adept handling more frivolous applications. New episode of Game of Thrones released that you haven't gotten to? Afraid of spoilers? Block out all mentions of Game of Thrones and related words until you get caught up!

![got]

## Implementation Details

### Screening

Screening is achieved through walking the DOM tree and comparing each text node to Regex expressions generated through users' interactions with the options page. Each time a filtered work is caught, SafeScroll traverse back up the DOM tree until it finds a non-text parent container with display block and inserts a div that blocks out the content underneath.

```javascript
function findParentContainer(elementNode) {
  const texts = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "span", "a"];
  let node = elementNode.parentNode;
  while (node) {
    if (($(node).css('display') === 'block') && (
        !texts.includes(node.localName))) {
      return node;
    } else {
      node = node.parentNode;
    }
  }
}

function generateWarning(parentNode) {
  let warning = $('<div></div>').addClass("extension-warning");
  let lock = $('<div class="lock locked"></div>');

  $(parentNode).append(lock);
  $('.lock').off().on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleLock(this);
  });
  return warning;
}
```

### Locks

Each screen is equipped with a lock icon to control its display properties. Upon creation of a screen, a lock element is attached to the parent container that's being blocked. The lock is fashioned with an eventListener on click that toggles the class of the inserted screen.

```javascript
function toggleLock(element) {
  let classes = $(element).attr('class').split(' ');
  if (classes.includes('locked')) {
    $(element).removeClass('locked');
    $(element).addClass('unlocked');
    $(element.parentNode).children('.extension-warning').css("display", "none");
  } else if (classes.includes('unlocked')) {
    $(element).removeClass('unlocked');
    $(element).addClass('locked');
    $(element.parentNode).children('.extension-warning').css("display", "block");
  }
}
```

### Options

Users control and customize the extension through interaction with the options page and integration with Chrome Storage API. Input fields create DOM elements through jQuery and insert them directly into the page.

```javascript
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
  deleteDiv.on('click', e => {
    deleteContentItem(e);
  });
  $(parent).append(label.prepend(newItem).append(deleteDiv));
  $('.custom-content').val('');
}
```

Upon saving, all page content is read and stored alongside it's checked status and category. This is all saved through Chrome Storage, rendering it accessible by the web page script and upon revisiting the options page.


[got]: ./css/images/got.png
[guns]: ./css/images/guns.png
[racist]: ./css/images/racist.png
[trump]: ./trump.png
