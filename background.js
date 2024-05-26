const READ_LATER_FOLDER = "Read Later";
const BOOKMARKS_BAR_ID = "1";

chrome.action.onClicked.addListener(async (tab) => {
  console.log("--> clicked!", tab);
  let today = new Date().toISOString().split('T')[0];
  console.log("... today:", today);
  searchFolder(BOOKMARKS_BAR_ID, READ_LATER_FOLDER).then(readLaterFolder => {
    console.log("... readLaterFolder:", readLaterFolder);
    let readLaterFolderId = null;
    if (readLaterFolder == null) {
      createFolder(READ_LATER_FOLDER, BOOKMARKS_BAR_ID).then(id => {
        console.log("... id:", id);
        readLaterFolderId = id;
      })
    } else {
      console.log("... exists!");
      readLaterFolderId = readLaterFolder.id;
    }
    console.log("... readLaterFolderId:", readLaterFolderId);
  }).catch(err => {
    console.error(`[ERR ] Cannot find folder ${READ_LATER_FOLDER}`);
  })
});

async function searchFolder(parentId, folderName) {
  console.log("--> searchFolder");
  console.log("... parentId: ", parentId);
  console.log("... folderName: ", folderName);
  const resp = await chrome.bookmarks.getSubTree(parentId);
  if (resp.length == 0) {
    throw new Error(`Cannot find folder with id ${parentId}`);
  }
  let folder = resp[0].children.filter(child => folderName == child.title);
  if (folder.length == 0) {
    return null;
  }
  if (folder.length > 1) {
    console.warn(`Found ${folder.length} folders with name ${folderName}; keep the first`);
  }
  return folder[0];
}

function createFolder(folderName, parentId) {
  return chrome.bookmarks.create({
    parentId: parentId,
    title: folderName
  }).then(resp => resp.id);
}
