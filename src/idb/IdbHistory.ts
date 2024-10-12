import type { IDBPDatabase } from "idb";
import {
  defaultError,
  Idb,
  IdbResponse,
  IdbStore,
  type BaillyDB,
  type IdbEntryCreation,
  type IdbEntry
} from ".";

export class IdbHistory {
  private constructor() {}

  static async get(limit?: number): Promise<IdbEntry[]> {
    if (!limit || limit <= 0) limit = -1;

    const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();
    const tx = db.transaction(IdbStore.History);

    let cursor = await tx.store.openCursor(null, "prev");
    let history: IdbEntry[] = [];
    while (cursor) {
      history.push(cursor.value);

      limit--;
      if (limit === 0) break;

      cursor = await cursor.continue();
    }

    await tx.done;

    return history;
  }

  static async update(entry: IdbEntryCreation): Promise<IdbResponse> {
    try {
      const data: IdbEntry = Idb.buildIdbEntry(entry);

      const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();
      const tx = db.transaction(IdbStore.History, "readwrite");
      const key = await tx.store.index("uri").getKey(data.uri);
      if (key) await tx.store.delete(key);
      await tx.store.add(data);
      await tx.done;

      await IdbHistory.removeExtraItems();
      return new IdbResponse("completed");
    } catch (error: unknown) {
      return defaultError(error);
    }
  }

  private static async removeExtraItems(): Promise<void> {
    const maxItems: number = Number(
      import.meta.env.PUBLIC_SEARCH_HISTORY_LENGTH
    );

    const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();
    const tx = db.transaction(IdbStore.History, "readwrite");
    let count = await tx.store.count();
    for await (const cursor of tx.store) {
      if (count <= maxItems) break;
      cursor.delete();
      count--;
    }
    await tx.done;
  }
}
