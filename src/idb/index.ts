import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Entry } from "../api";
import { type Color } from "../enums";

export { IdbHistory } from "./IdbHistory";
export { IdbStarred } from "./IdbStarred";
export { IdbTaggedEntry } from "./IdbTaggedEntry";
export { IdbTags } from "./IdbTags";

type IdbData = IdbEntry | IdbTagged | IdbTag | IdbTagWithKey | void;
type IdbState = "completed" | "errored";

export class IdbResponse<T extends IdbData = void> {
  state: IdbState;
  message: string;
  data?: T;

  constructor(state: IdbState, message?: string | null, data?: T) {
    this.state = state;
    this.message = (() => {
      if (message) return message;
      if (state === "errored") return "Une erreur est survenue.";
      return "";
    })();
    this.data = data;
  }
}

export function defaultError<T extends IdbData>(error: unknown) {
  return new IdbResponse<T>(
    "errored",
    error instanceof Error ? error.message : String(error)
  );
}

export type IdbEntry = Pick<Entry, "word" | "uri" | "excerpt">;
export type IdbTagged = IdbEntry & { tagKey: number };

export interface IdbTag {
  name: string;
  description: string;
  color: Color;
  position: number;
}

export type IdbTagWithKey = IdbTag & { key: number };

export type IdbEntryCreation<
  K extends keyof Entry = "word" | "uri" | "excerpt"
> = Pick<Entry<K>, K | "children">;

export type IdbTagCreation = Pick<IdbTag, "name" | "description">;

export enum IdbStore {
  History = "history",
  Starred = "starred",
  Tagged = "tagged",
  Tags = "tags"
}

export interface BaillyDB extends DBSchema {
  [IdbStore.History]: {
    key: number;
    value: IdbEntry;
    indexes: {
      uri: string;
    };
  };
  [IdbStore.Starred]: {
    key: number;
    value: IdbEntry;
    indexes: {
      uri: string;
    };
  };
  [IdbStore.Tagged]: {
    key: number;
    value: IdbTagged;
    indexes: {
      uri: string;
      tagKey: string;
      "tagKey+uri": string;
    };
  };
  [IdbStore.Tags]: {
    key: number;
    value: IdbTag;
    indexes: {
      name: string;
      color: Color;
      position: number;
      "position+color": [number, Color];
    };
  };
}

enum IdbInfo {
  Name = "bailly",
  Version = 3
}

export class Idb {
  private static instance: IDBPDatabase<BaillyDB>;

  private constructor() {}

  static async getIndexedDB(): Promise<IDBPDatabase<BaillyDB>> {
    if (!Idb.instance) {
      Idb.instance = await openDB<BaillyDB>(IdbInfo.Name, IdbInfo.Version, {
        async upgrade(db, oldVersion) {
          if (oldVersion === 2) {
            db.deleteObjectStore("dictionarySlices" as IdbStore);
            db.deleteObjectStore("lastWords" as IdbStore);
          }

          const history = db.createObjectStore(IdbStore.History, {
            autoIncrement: true
          });

          history.createIndex("uri", "uri");

          const starred = db.createObjectStore(IdbStore.Starred, {
            autoIncrement: true
          });

          starred.createIndex("uri", "uri");

          const tagged = db.createObjectStore(IdbStore.Tagged, {
            autoIncrement: true
          });

          tagged.createIndex("uri", "uri");
          tagged.createIndex("tagKey", "tagKey");
          tagged.createIndex("tagKey+uri", ["tagKey", "uri"], { unique: true });

          const tags = db.createObjectStore(IdbStore.Tags, {
            autoIncrement: true
          });

          tags.createIndex("name", "name");
          tags.createIndex("color", "color");
          tags.createIndex("position", "position");
          tags.createIndex("position+color", ["position", "color"]);
        }
      });
    }

    return Idb.instance;
  }

  static buildIdbEntry(entry: IdbEntryCreation): IdbEntry {
    return {
      word: entry.word,
      uri: entry.uri,
      excerpt: (() => {
        if (entry.children?.length) {
          // Excerpts start with the word.
          return `${entry.word} (v. les ${entry.children.length} entrées)`;
        }
        return String(entry.excerpt);
      })()
    };
  }
}
