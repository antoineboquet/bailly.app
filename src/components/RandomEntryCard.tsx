import { createResource } from "solid-js";
import { fetchRandomEntry, type Entry } from "../api";
import type { IdbEntry } from "../idb";
import Card from "./Card";
import TagToolbar from "./TagToolbar";

export default function RandomEntryCard() {
  const getRandomEntry = async (): Promise<
    Pick<Entry, "word" | "uri" | "htmlDefinition" | "excerpt">
  > => {
    const data = await fetchRandomEntry({
      fields: ["word", "uri", "htmlDefinition", "excerpt"],
      lengthRange: [600, 700]
    });

    return data.entry;
  };

  const [entry] = createResource(getRandomEntry);

  const idbEntry = (): IdbEntry => {
    return {
      word: entry()?.word ?? "",
      uri: entry()?.uri ?? "",
      excerpt: entry()?.excerpt ?? ""
    };
  };

  return (
    <>
      <Card
        href={"/" + entry()?.uri}
        class="hidden overflow-y-hidden border-primary-700/50 transition-colors hover:border-primary-700/50 hover-hover:border-secondary-100 lg:block lg:h-96 lg:max-h-96 dark:border-primary-700/50 dark:hover:border-primary-700/50 dark:hover-hover:border-neutral-700/50"
        contentClass="lg:h-full lg:[mask-image:linear-gradient(to_bottom,black_85%,transparent)]"
        fakeContent={entry.loading ? { animated: true, lines: 11 } : undefined}
        content={entry()?.htmlDefinition}
        toolBar={entry()?.word ? TagToolbar({ entry: idbEntry() }) : false}
      />

      <Card
        class="overflow-y-hidden lg:hidden lg:h-96 lg:max-h-96"
        contentClass="lg:h-full lg:[mask-image:linear-gradient(to_bottom,black_85%,transparent)]"
        fakeContent={entry.loading ? { animated: true, lines: 11 } : undefined}
        content={entry()?.htmlDefinition}
        toolBar={entry()?.word ? TagToolbar({ entry: idbEntry() }) : false}
      />
    </>
  );
}
