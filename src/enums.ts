export enum InputMode {
  BetaCode,
  Transliteration
}

export enum LocalStorageKey {
  CurrentTagKey = "currentTagKey",
  DismissBookmarksInfoCard = "dismissBookmarksInfoCard",
  //DismissBookmarksSyncCard = "dismissBookmarksSyncCard",
  EnableGreekRomanization = "enableGreekRomanization",
  HistoryLength = "historyLength",
  SearchResultsDisplay = "searchResultsDisplay",
  SearchInputMode = "searchInputMode",
  Theme = "theme"
}

export enum SearchResultsDisplay {
  Grid,
  List
}

// Note that yellow is reserved for starred entries.
export enum Colors {
  Blue,
  Green,
  Lime,
  Orange,
  Purple,
  Red,
  Rose,
  Slate,
  Teal
}

export type Color = keyof typeof Colors;
