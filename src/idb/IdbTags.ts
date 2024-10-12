import type { IDBPCursorWithValue, IDBPDatabase } from "idb";
import {
  defaultError,
  Idb,
  IdbResponse,
  IdbStore,
  type BaillyDB,
  type IdbTagCreation,
  type IdbTag,
  type IdbTagged,
  type IdbTagWithKey
} from ".";
import { Colors, LocalStorageKey, type Color } from "../enums";

type TagOrder = "position" | "insertion";

export class IdbTags {
  private constructor() {}

  private static getRandomEnumKey<T>(
    enumeration: {},
    filter: string[] = []
  ): T[keyof T] {
    const keys = Object.keys(enumeration).filter(
      (x) => Number.isNaN(Number(x)) && !filter.includes(x)
    ) as unknown as T[keyof T][];

    return keys[Math.floor(Math.random() * keys.length)];
  }

  static async buildIdbTag(tag: IdbTagCreation): Promise<IdbTag> {
    const usedColors = await IdbTags.getUsedColors();

    // Enum keys are doubled because of the reverse mapping.
    const colorsExhausted: boolean =
      usedColors.length === Object.keys(Colors).length / 2;

    const newTag: IdbTag = {
      name: tag.name.trim(),
      description: tag.description.trim(),
      color: ((): Color => {
        // If no colors remains, exclude those used by the first half of the tags.
        return IdbTags.getRandomEnumKey(
          Colors,
          colorsExhausted
            ? usedColors.slice(0, usedColors.length / 2)
            : usedColors
        );
      })(),
      position: 1
    };

    if (!newTag.name.length) {
      throw new Error("Une étiquette doit être nommée.");
    }

    if (newTag.name.toLowerCase() === "favoris") {
      throw new Error("Ce nom est réservé à la liste des favoris.");
    }

    return newTag;
  }

  static async add({
    name,
    description
  }: IdbTagCreation): Promise<IdbResponse<IdbTagWithKey>> {
    try {
      const maxItems: number = Number(import.meta.env.PUBLIC_MAX_TAGS);
      const data: IdbTag = await IdbTags.buildIdbTag({ name, description });

      const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();
      const tx = db.transaction(IdbStore.Tags, "readwrite");

      const countTags = await tx.store.count();
      if (countTags >= maxItems) {
        throw new Error(`Le nombre maximal d'étiquettes a été atteint.`);
      }

      const nameExists = await tx.store.index("name").get(data.name);
      if (nameExists) {
        throw new Error(`L'étiquette "${data.name}" existe déjà.`);
      }

      const tagKeysByPosition = await tx.store.index("position").getAllKeys();
      const newTagKey = await tx.store.add(data);
      const newTag = (await tx.store.get(newTagKey)) ?? ({} as IdbTag);
      await tx.done;

      await IdbTags.reorder([newTagKey, ...tagKeysByPosition], {
        setFirstAsCurrent: true
      });

      return new IdbResponse("completed", null, {
        ...newTag,
        key: newTagKey
      });
    } catch (error: unknown) {
      return defaultError(error);
    }
  }

  static async get(name: string): Promise<IdbTagWithKey | null> {
    const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();

    const tx = db.transaction(IdbStore.Tags);
    const key = await tx.store.index("name").getKey(name);
    const tag = await tx.store.index("name").get(name);
    await tx.done;

    return key && tag ? { key: key, ...tag } : null;
  }

  static async getAll(options: {
    orderBy: TagOrder;
  }): Promise<IdbTagWithKey[]> {
    const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();
    const tx = db.transaction(IdbStore.Tags);

    let cursor: IDBPCursorWithValue<
      BaillyDB,
      [IdbStore.Tags],
      IdbStore.Tags,
      unknown,
      "readonly"
    > | null;
    switch (options.orderBy) {
      case "position":
        cursor = await tx.store.index("position").openCursor();
        break;
      case "insertion":
      default:
        cursor = await tx.store.openCursor();
    }

    const keys: number[] = [];
    const tags: IdbTag[] = [];
    while (cursor) {
      keys.push(cursor.primaryKey);
      tags.push(cursor.value);
      cursor = await cursor.continue();
    }
    await tx.done;

    return tags.map((item, i) => {
      return { key: keys[i], ...item };
    });
  }

  /**
   * Returns all the distinct color keys (e.g. 'Blue') used by the existing
   * tags sorted by tags position.
   */
  static async getUsedColors(): Promise<Color[]> {
    const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();
    const tx = db.transaction(IdbStore.Tags);
    const idx = tx.store.index("position+color");

    const colors: Color[] = [];
    for await (const cursor of idx.iterate()) {
      colors.push(cursor.value.color);
    }
    await tx.done;

    return [...new Set(colors)];
  }

  static async getCurrent(): Promise<IdbTagWithKey | null> {
    const currentTagKey = IdbTags.getCurrentKey();

    let tag: IdbTag | undefined;
    if (currentTagKey) {
      const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();
      tag = await db.get(IdbStore.Tags, currentTagKey);
    }

    return tag ? { key: Number(currentTagKey), ...tag } : null;
  }

  static getCurrentKey(): number | null {
    const currentTagKey: string | null = localStorage.getItem(
      LocalStorageKey.CurrentTagKey
    );

    return currentTagKey ? Number(currentTagKey) : null;
  }

  static async getEntryTags(uri: string): Promise<IdbTagWithKey[] | null> {
    const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();

    const tagKeys = await IdbTags.getEntryTagKeys(uri);
    if (!tagKeys) return null;

    let tags: IdbTagWithKey[] = [];
    const tx = db.transaction(IdbStore.Tags);
    for (const tagKey of tagKeys) {
      const tag = await tx.store.get(tagKey);
      if (tag) tags.push({ key: tagKey, ...tag });
    }
    await tx.done;

    return tags.length ? tags : null;
  }

  static async getEntryTagKeys(uri: string): Promise<number[] | null> {
    const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();
    const entries: IdbTagged[] = await db.getAllFromIndex(
      IdbStore.Tagged,
      "uri",
      uri
    );

    return entries.length ? entries.map((entry) => entry.tagKey) : null;
  }

  static async remove(tagKey: number): Promise<void> {
    const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();

    await db.delete(IdbStore.Tags, tagKey);

    const currentTag = await IdbTags.getCurrent();
    if (!currentTag) {
      // Set the first tag as the new current tag.
      const cursor = await db
        .transaction(IdbStore.Tags)
        .store.index("position")
        .openCursor();
      const firstTagKey = cursor?.primaryKey;
      if (firstTagKey) {
        localStorage.setItem(
          LocalStorageKey.CurrentTagKey,
          String(firstTagKey)
        );
      } else {
        localStorage.removeItem(LocalStorageKey.CurrentTagKey);
      }
    }
  }

  static async reorder(
    orderedKeys: number[],
    options: {
      setFirstAsCurrent: boolean;
    }
  ): Promise<IdbResponse> {
    try {
      const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();

      const tx = db.transaction(IdbStore.Tags, "readwrite");
      for (const [i, orderedKey] of orderedKeys.entries()) {
        const tag = await tx.store.get(orderedKey);
        if (tag) await tx.store.put({ ...tag, position: i + 1 }, orderedKey);
        else return new IdbResponse("errored");
      }
      await tx.done;

      if (options.setFirstAsCurrent) await IdbTags.setCurrent(orderedKeys[0]);
      return new IdbResponse("completed");
    } catch (error: unknown) {
      return defaultError(error);
    }
  }

  static async setCurrent(tagKey: number): Promise<IdbResponse> {
    try {
      const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();
      const keyExists = await db.getKey(IdbStore.Tags, tagKey);

      if (keyExists) {
        localStorage.setItem(LocalStorageKey.CurrentTagKey, String(tagKey));
        return new IdbResponse("completed");
      } else {
        throw new Error(
          "L'étiquette sélectionnée n'a pas pu être promue " +
            "en tant qu'étiquette courante."
        );
      }
    } catch (error: unknown) {
      return defaultError(error);
    }
  }

  static async update(
    tagKey: number,
    { name, description }: IdbTagCreation
  ): Promise<IdbResponse<IdbTagWithKey>> {
    try {
      const data: IdbTag = await IdbTags.buildIdbTag({ name, description });

      const db: IDBPDatabase<BaillyDB> = await Idb.getIndexedDB();
      const tx = db.transaction(IdbStore.Tags, "readwrite");

      const nameExistsKey = await tx.store.index("name").getKey(data.name);
      if (nameExistsKey) {
        if (nameExistsKey === tagKey) return new IdbResponse("completed");
        else throw new Error(`L'étiquette "${data.name}" existe déjà.`);
      }

      // Check if the tag exists as `db.put()` would create a new tag otherwise.
      const storedTag = await tx.store.get(tagKey);
      if (storedTag) {
        await tx.store.put({ ...storedTag, name: data.name }, tagKey);
        const updatedTag = (await tx.store.get(tagKey)) ?? ({} as IdbTag);
        await tx.done;

        return new IdbResponse("completed", null, {
          ...updatedTag,
          key: tagKey
        });
      } else {
        throw new Error("L'étiquette n'a pas pu être mise à jour.");
      }
    } catch (error: unknown) {
      return defaultError(error);
    }
  }
}
