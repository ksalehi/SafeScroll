const contentStore = {};
let block = "Trump";

chrome.storage.sync.get(
  'blockContent', function(items) {
  block = items.blockContent;
  walkAndObserve(document);
});

function walk(rootNode)
{
    // Find all the text nodes in rootNode
    var walker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    ),
    node;

    // Modify each text node's value
    while (node = walker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
  if (textNode.textContent.match(block) &&
        !$(textNode.parentNode).is('script')) {

    let parentNode = findParentContainer(textNode);
    $(parentNode).addClass('pos-rel');
    // insert div with high z-index in front of parent node
    let warning = generateWarning();
    if (!$(parentNode).children('.extension-warning')[0]) {
      $(parentNode).append(warning);
    }
  }
}

function findParentContainer(elementNode) {
  const texts = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "span", "a"]
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

function generateWarning() {
  // debugger
  let warning = $('<div></div>').addClass("extension-warning");
  let lock = $('<div class="lock locked"></div>');
  warning.append(lock);
  $('.lock').off().on('click', function(e) {
      debugger
      e.preventDefault();
      e.stopPropagation();
      toggleLock(this);
    }
  );
  return warning;
}

function toggleLock(element) {
  debugger;
  let classes = $(element).attr('class').split(' ');
  if (classes.includes('locked')) {
    $(element).removeClass('locked');
    $(element).addClass('unlocked');
    $(element.parentNode).css("background", "transparent");
  } else if (classes.includes('unlocked')) {
    $(element).removeClass('unlocked');
    $(element).addClass('locked');
    $(element.parentNode).css("background", "lightgray");
  }
}


// The callback used for the document body and title observers
function observerCallback(mutations) {
    var i;

    mutations.forEach(function(mutation) {
        for (i = 0; i < mutation.addedNodes.length; i++) {
            if (mutation.addedNodes[i].nodeType === 3) {
                // Replace the text for text nodes
                handleText(mutation.addedNodes[i]);
            } else {
                // Otherwise, find text nodes within the given node and replace text
                walk(mutation.addedNodes[i]);
            }
        }
    });
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    var docTitle = doc.getElementsByTagName('title')[0],
    observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    },
    bodyObserver, titleObserver;

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = replaceText(doc.title);

    // Observe the body so that we replace text in any added/modified nodes
    bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}

// walkAndObserve(document);
