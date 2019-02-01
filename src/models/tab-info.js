function TabInfo() {
  this.windowIdToTagId = {};
  this.tabIdToDomain = {};
  this.domainDuration = {};

  this.currentTabId = null;
  this.currentActiveStartedAt = null;

  this.synced = false;
};

TabInfo.prototype.onSelectionChanged = function(tabId, windowId) {
  this.useTabInfo().then(() => {
    // Update
    this.calculateCurrentTabDuration();

    this.windowIdToTagId[windowId] = tabId;
    this.currentTabId = tabId;
    this.currentActiveStartedAt = new Date();
  });
};
TabInfo.prototype.onUpdated = function(tab) {
  this.useTabInfo().then(() => {
    if (tab.id === this.currentTabId) {
      // url changed
      this.calculateCurrentTabDuration();
      this.currentTabId = tab.id;
      this.currentActiveStartedAt = new Date();
    }

    var domain = null;
    var domainMatcher = tab.url.match(/https:\/\/(?<test>[^\/]*)/);
    if (domainMatcher) {
      domain = domainMatcher.groups.test;
    }
    domainMatcher = tab.url.match(/http:\/\/(?<test>[^\/]*)/);
    if (domainMatcher) {
      domain = domainMatcher.groups.test;
    }
    if (domain) {
      this.tabIdToDomain[tab.id] = domain;
    }
  });
};

TabInfo.prototype.tabRemoved = function(tabId) {
  this.useTabInfo().then(() => {
    if (tabId === this.currentTabId) {
      this.calculateCurrentTabDuration();
    }
    if (this.tabIdToDomain[tabId]) {
      delete this.tabIdToDomain[tabId];
      this.save();
    }
  });
};


TabInfo.prototype.windowFocusChanged = function(windowId) {
  this.useTabInfo().then(() => {

    if (this.currentTabId) {
      this.calculateCurrentTabDuration();
    }
    if (windowId === -1) {
      this.currentTabId = null;
      this.currentActiveStartedAt = null;
      return;
    } else {
      if (this.windowIdToTagId[windowId]) {
        this.currentTabId = this.windowIdToTagId[windowId];
        this.currentActiveStartedAt = new Date();
      }
    }
  });
};

TabInfo.prototype.windowRemoved = function(windowId) {
  if(this.windowIdToTagId[windowId]) {
    delete this.windowIdToTagId[windowId];
    this.save();
  }
};


/// private

// これは 必ず useTabInfo の then 後に呼ばれるようにすること
TabInfo.prototype.calculateCurrentTabDuration = function() {
  if (this.currentTabId) {
    var domain = this.tabIdToDomain[this.currentTabId];
    if (domain) {
      if (!this.domainDuration[domain]) {
        this.domainDuration[domain] = 0;
      }
      let now = new Date();
      let duration = now - this.currentActiveStartedAt;
      this.domainDuration[domain] += duration;
      this.currentTabId = null;
      this.currentActiveStartedAt = null;
      this.save();
    }
  }
};

TabInfo.prototype.save = function() {
  chrome.storage.sync.set({tabInfo: this}, (result) => {
    console.log('sync.set');
    console.log(this.windowIdToTagId);
    console.log(this.tabIdToDomain);
    console.log(this.domainDuration);
  });
};

TabInfo.prototype.useTabInfo = function() {
  return new Promise((resolve, reject) => {
    if (this.synced) {
      resolve();
    } else {
      chrome.storage.sync.get(['tabInfo'], (result) => {
        let info = result.tabInfo;
        this.windowIdToTagId = info.windowIdToTagId;
        this.tabIdToDomain = info.tabIdToDomain;
        this.domainDuration = info.domainDuration;
        this.currentTabId = null;
        this.currentActiveStartedAt = null;
        this.synced = true;
        console.log(this.windowIdToTagId);
        console.log(this.tabIdToDomain);
        console.log(this.domainDuration);
        resolve();
      })
    }
  });
};

var tabInfo = new TabInfo();
