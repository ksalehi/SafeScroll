function walk(rootNode) {
    // Find all the text nodes in rootNode
    // treeWalker = document.createTreeWalker(root, whatToShow, filter, entityReferenceExpansion);
    const treeWalker = document.createTreeWalker(
        rootNode,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    let node;

    // Modify each text node's value
    // nextNode(): Moves the current Node to the next visible node in the
    // document order, and returns the found node. It also moves the current
    // node to this one. If no such node exists, returns null and the current
    // node is not changed.
    while (node === treeWalker.nextNode()) {
        handleText(node);
    }
}

function handleText(textNode) {
  textNode.nodeValue = 'yolo swag';
}

// Walk the doc (document) body, replace the title, and observe the body and title
function walkAndObserve(doc) {
    const docTitle = doc.getElementsByTagName('title')[0];
    const observerConfig = {
        characterData: true,
        childList: true,
        subtree: true
    };

    // Do the initial text replacements in the document body and title
    walk(doc.body);
    doc.title = 'yolo swag';

    // Observe the body so that we replace text in any added/modified nodes
    const bodyObserver = new MutationObserver(observerCallback);
    bodyObserver.observe(doc.body, observerConfig);

    // Observe the title so we can handle any modifications there
    if (docTitle) {
        const titleObserver = new MutationObserver(observerCallback);
        titleObserver.observe(docTitle, observerConfig);
    }
}

function observerCallback(mutations) {
    mutations.forEach(function(mutation) {
      for (let i = 0; i < mutation.addedNodes.length; i++) {
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

walkAndObserve(document);
