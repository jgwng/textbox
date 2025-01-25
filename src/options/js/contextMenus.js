export const createContextMenu = (categorySeq,title) => {
    // Remove the separator and "openOptions" first
  chrome.contextMenus.remove("separator", () => {
    chrome.contextMenus.remove("openOptions", () => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      }

      chrome.contextMenus.create({
        id: categorySeq.toString(),
        title: title,
        contexts: ["selection"]
      ,});

      // Re-add the separator
      chrome.contextMenus.create({
        id: "separator",
        type: "separator",
        contexts: ["all"],
      });

      // Re-add the "openOptions" menu item
      chrome.contextMenus.create({
        id: "openOptions",
        title: "설정 열기", // Context menu item title
        contexts: ["all"], // Show this menu item everywhere
      });

      console.log(`Menu item "${title}" added above the separator.`);
    });
  });
    
    
    
}

export const removeContextMenu = (categorySeq) => {
    chrome.contextMenus.remove(`${categorySeq}`);
}

export const removeAllContextMenu = () => {
    chrome.contextMenus.removeAll();
}   

export const updateContextMenu = (categorySeq, title, color) => {
    console.log('title : ', title);
    console.log('color : ', color);
    console.log('categorySeq : ', categorySeq);

    chrome.contextMenus.update(`${categorySeq}`, {
        title: title,
    });
}   