// $('body').addClass('grayed-out');

const contentStore = {};
let uniqueId = 0;

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

function handleText(elementNode) {
  // console.log(elementNode.textContent)
  // if (elementNode.nodeValue) {
  // console.log(elementNode.nodeValue);
  // }
  //replaceText(elementNode.nodeValue);
  if (elementNode.textContent.match(/Trump/g)) {
    // debugger;
    // let node = elementNode.parentNode;
    let parentNode = elementNode.parentNode;
    $(parentNode).addClass('pos-rel');
    // insert div with high z-index in front of parent node
    let warning = generateWarning();
    $(parentNode).append(warning);
    // $(parentNode.parentNode).append('<div class="warning">warning</div>');
    // setId(parentNode);
    // contentStore[parentNode.id] = elementNode.textContent;
    // console.log(contentStore);
    // console.log(elementNode);
    // console.log(elementNode.parentNode);
    // elementNode.textContent = "warning";
    // parentNode.className += " trigger";
  }
}

function generateWarning() {
  let warning = $('<div></div>').addClass("warning")
  $('<button/>', {
    text: 'Warning',
    click: function(e) {
      $(this.parentNode).css("display", "none");
      e.stopPropagation();
    }
  }).appendTo(warning);
  return warning;
  // return ("<div class='warning'><button>Warning</button></div>")
}

function setId(node) {
  if (!node.id) {
    node.id = uniqueId;
    uniqueId++;
  }
}

function replaceText(text) {
  text = text.replace(/text/g, "yolo swag");
  return text;
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
walkAndObserve(document);
