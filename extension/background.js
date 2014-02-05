var bookmarks = [];

function getRandomBookmark() {
  return bookmarks[Math.floor(Math.random()*bookmarks.length)];
}

function loadRandomBookmarkNewTab() {
  chrome.tabs.create({
    url: getRandomBookmark().url
  });
}

function loadRandomBookmarkSameTab(bookmark) {
  chrome.tabs.update({
    url: getRandomBookmark().url
  });
}

function buildBookmarks() {
  console.log("rebuilding bookmark list");
  chrome.bookmarks.getTree(
    function traverseBookmarks(bookmarkTreeNodes) {
      for (var i = 0; i < bookmarkTreeNodes.length; i++) {
        bookmarks.push(bookmarkTreeNodes[i]);
        if (bookmarkTreeNodes[i].children) {
          traverseBookmarks(bookmarkTreeNodes[i].children);
        }
      }
    });
}

document.addEventListener('DOMContentLoaded', function () {
  buildBookmarks();

  chrome.bookmarks.onCreated.addListener(function () {
    buildBookmarks();
  });
  chrome.bookmarks.onRemoved.addListener(function () {
    buildBookmarks();
  });
  chrome.bookmarks.onChanged.addListener(function () {
    buildBookmarks();
  });
  
  chrome.browserAction.onClicked.addListener( function(tab){
    loadRandomBookmarkNewTab();
  });

  chrome.commands.onCommand.addListener(function (command) {
    if (command === 'random-bookmark-new-tab') {
      loadRandomBookmarkNewTab();  
    }
    if (command === 'random-bookmark-same-tab') {
      loadRandomBookmarkSameTab();  
    } 
  });
});
