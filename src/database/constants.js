export const BOOKMARK_DATABASE_NAME = "BookmarkDB";
export const BOOKMARK_DATABASE_VERSION = 1;
export const BOOKMARK_OBJECT_STORE_NAME = "BookmarkData";
export const BOOKMARK_INDEX_SELECTION = "selectionText";
export const BOOKMARK_INDEX_URL = "pageUrl";
export const BOOKMARK_INDEX_CATEGORY = "category";
export const BOOKMARK_INDEX_MACRO_NO = "macroNo";

export const CATEGORY_DATABASE_NAME = "CategoryDB";
export const CATEGORY_DATABASE_VERSION = 1;
export const CATEGORY_OBJECT_STORE_NAME = "CategoryData";
export const CATEGORY_NAME = "categoryName";
export const CATEGORY_COLOR = "categoryColor";
export const CATEGORY_SHORTCUT = "categoryShortcut";

export const DEFAULT_CATEGORY_DATA = [
    { categoryName: "메모", categoryColor: "red", categoryShortcut: "1" },
    { categoryName: "아이디어", categoryColor: "green", categoryShortcut: "2" },
    { categoryName: "인사이트", categoryColor: "yellow", categoryShortcut: "3" },
    { categoryName: "학습 자료", categoryColor: "blue", categoryShortcut: "4" }
];