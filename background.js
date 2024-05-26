const READ_LATER_FOLDER = "Read Later";
const BOOKMARKS_BAR_ID = "1";

chrome.action.onClicked.addListener(async (tab) => {
  let today = new Date().toISOString().split('T')[0];
  upsertFolder(BOOKMARKS_BAR_ID, READ_LATER_FOLDER).then(readLaterFolderId => {
    upsertFolder(readLaterFolderId, today).then(todayFolderId => {
      chrome.bookmarks.create({
        parentId: todayFolderId,
        title: tab.title,
        url: tab.url
      }).catch(err => {
        console.error("Cannot create bookmark for current tab", err);
      })
    }).catch(err => {
      console.error(`Cannot get/create folder ${today}`, err);
    })
  }).catch(err => {
    console.error(`Cannot get/create folder ${READ_LATER_FOLDER}`, err);
  })
});

async function upsertFolder(parentId, folderName) {
  return chrome.bookmarks.getSubTree(parentId).then(resp => {
    if (resp.length == 0) {
      throw new Error(`Cannot find folder with id ${parentId}`);
    }
    if (resp.length > 1) {
      console.warn(`Found ${resp.length} folders; keep the first`);
    }
    let children = resp[0].children.filter(child => folderName == child.title);
    if (children.length == 0) {
      return chrome.bookmarks.create({
        parentId: parentId,
        title: folderName
      }).then(resp => resp.id);
    }
    if (children.length > 1) {
      console.warn(`Found ${folder.length} folders with name ${folderName}; keep the first`);
    }
    return new Promise(resolve => {
      resolve(children[0].id);
    });
  })
}
