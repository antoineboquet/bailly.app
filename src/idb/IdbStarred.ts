import type { IDBPDatabase } from "idb";
import {
  defaultError,
  Idb,
  IdbResponse,
  IdbStore,
  type BaillyDB,
  type IdbEntryCreation,
  type IdbEntry
} from "./Idb";

export class IdbStarred {
  private constructor() {}

  static async add(entry: IdbEntryCreation): Promise<IdbResponse> {
    try {
      const maxItems: number = Number(import.meta.env.PUBLIC_TAG_MAX_ITEMS);

      const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();
      const tx = db.transaction(IdbStore.Starred, "readwrite");

      const countEntries = await tx.store.count();
      if (countEntries >= maxItems) {
        throw new Error(
          `Les favoris ne peuvent contenir plus de ${maxItems} entrées.`
        );
      }

      await tx.store.add(Idb.buildIdbEntry(entry));
      await tx.done;

      return new IdbResponse("completed");
    } catch (error: unknown) {
      return defaultError(error);
    }
  }

  static async get(uri: string): Promise<IdbEntry | null> {
    const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();
    return (await db.getFromIndex(IdbStore.Starred, "uri", uri)) ?? null;
  }

  static async getAll(): Promise<IdbEntry[]> {
    const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();
    return await db.getAll(IdbStore.Starred);
  }

  static async remove(uri: string): Promise<void> {
    const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();
    const key = await db.getKeyFromIndex(IdbStore.Starred, "uri", uri);
    if (key) await db.delete(IdbStore.Starred, key);
  }
}
