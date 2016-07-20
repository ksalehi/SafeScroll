// document.addEventListener('DOMContentLoaded', function() {
//   var checkPageButton = document.getElementById('checkPage');
//
//   checkPageButton.addEventListener('click', function() {
//     // chrome.tabs.getSelected(null, function(tab) {
//       // var f = d.createElement('form');
//       // f.action = 'http://gtmetrix.com/analyze.html?bm';
//       // f.method = 'post';
//       // var i = d.createElement('input');
//       // i.type = 'hidden';
//       // i.name = 'url';
//       // i.value = tab.url;
//       // f.appendChild(i);
//       // d.body.appendChild(f);
//       // f.submit();
//     // });
//   }, false);
// }, false);

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
    alert(response.farewell);
  });
});

//chrome.tabs.sendMessage(integer tabId, any message, object options, function responseCallback)
