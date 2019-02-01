console.log('Start background.js');

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log("onUpdated");
  // console.log(tab.url);
  tabInfo.onUpdated(tab);
  chrome.pageAction.show(tabId);
});

// chrome.tabs.onActiveChanged.addListener(function(tabId, selectInfo){
//   console.log("activeChanged");
// });

chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
  console.log("selectionChanged");
  tabInfo.onSelectionChanged(tabId, selectInfo.windowId);
  chrome.pageAction.show(tabId);
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
  console.log("tabs.onRemoved")
  tabInfo.tabRemoved(tabId);
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
  console.log("window.focusChanged");
  // console.log(windowId);
  tabInfo.windowFocusChanged(windowId);
});

chrome.windows.onRemoved.addListener(function(windowId) {
  console.log("window.onRemoved");
  tabInfo.windowRemoved(windowId);
});