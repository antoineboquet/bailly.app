import type { IDBPDatabase } from "idb";
import { LocalStorageKey } from "../enums";
import {
  defaultError,
  Idb,
  IdbResponse,
  IdbStore,
  type BaillyDB,
  type IdbEntryCreation,
  type IdbTagged
} from "./Idb";

export class IdbTaggedEntry {
  private constructor() {}

  static async add(
    entry: IdbEntryCreation,
    tagKey: number,
    setCurrentTag: boolean = false
  ): Promise<IdbResponse> {
    try {
      const maxItems: number = Number(import.meta.env.PUBLIC_TAG_MAX_ITEMS);

      const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();
      const tx = db.transaction(IdbStore.Tagged, "readwrite");

      const countEntries = await tx.store.index("tagKey").count(String(tagKey));
      if (countEntries >= maxItems) {
        throw new Error(
          `L'étiquette ne peut contenir plus de ${maxItems} entrées.`
        );
      }

      await tx.store.add({
        tagKey: tagKey,
        ...Idb.buildIdbEntry(entry)
      });
      await tx.done;

      if (setCurrentTag) {
        localStorage.setItem(LocalStorageKey.CurrentTagKey, String(tagKey));
      }

      return new IdbResponse("completed");
    } catch (error: unknown) {
      return defaultError(error);
    }
  }

  static async get(uri: string, tagKey: number): Promise<IdbTagged | null> {
    const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();
    const taggedEntry = await db.getFromIndex(
      IdbStore.Tagged,
      "tagKey+uri",
      IDBKeyRange.only([tagKey, uri])
    );

    return taggedEntry ?? null;
  }

  static async getAll(): Promise<IdbTagged[]> {
    const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();
    return await db.getAll(IdbStore.Tagged);
  }

  static async remove(uri: string, tagKey: number): Promise<void> {
    const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();
    const key = await db.getKeyFromIndex(
      IdbStore.Tagged,
      "tagKey+uri",
      IDBKeyRange.only([tagKey, uri])
    );

    if (key) await db.delete(IdbStore.Tagged, key);
  }
}
