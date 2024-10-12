import {
  createResource,
  createSignal,
  Index,
  onCleanup,
  onMount,
  type JSX,
  type Setter
} from "solid-js";
import { LocalStorageKey } from "../enums";
import { type IdbEntry, IdbHistory } from "../idb";
import { highlightEntryInExcerpt } from "../helpers";
import Card from "./Card";
import Icon from "./Icon";

interface Props {
  class?: string;
  setResultsOpen: Setter<boolean>;
}

export default function HistoryList(props: Props) {
  const maxItems: number = Number(import.meta.env.PUBLIC_SEARCH_HISTORY_LENGTH);
  const historyLengthOptions: number[] = [
    Math.ceil(maxItems / 4),
    Math.ceil(maxItems / 2),
    maxItems
  ];

  const [historyLength, setHistoryLength] = createSignal<number | null>(null);
  const [mounted, setMounted] = createSignal(false);

  onMount(() => {
    const lsHistoryLength = localStorage.getItem(LocalStorageKey.HistoryLength);

    setHistoryLength(
      lsHistoryLength ? Number(lsHistoryLength) : historyLengthOptions[1]
    );
    try {
      document.addEventListener("astro:page-load", refetch);
    } catch (error: unknown) {
      console.error(
        `Document isn't ready yet.`,
        `<${error instanceof Error ? error.message : String(error)}>`
      );
    }
    setMounted(true);
  });

  onCleanup(() => {
    try {
      document.removeEventListener("astro:page-load", refetch);
    } catch (error: unknown) {
      console.error(
        `Document isn't ready yet.`,
        `<${error instanceof Error ? error.message : String(error)}>`
      );
    }
  });

  const getEntries = async (): Promise<IdbEntry[]> => {
    const data = await IdbHistory.get(historyLength() ?? maxItems);
    return data.map((item) => {
      if (!item.excerpt) return item;
      return {
        ...item,
        excerpt: highlightEntryInExcerpt(item.word, item.excerpt)
      };
    });
  };

  const updateDisplayItems: JSX.EventHandler<HTMLElement, MouseEvent> = (
    event
  ) => {
    const selectedHistoryLength = event.currentTarget.dataset.historyLength;

    if (selectedHistoryLength) {
      localStorage.setItem(
        LocalStorageKey.HistoryLength,
        selectedHistoryLength
      );
      setHistoryLength(Number(selectedHistoryLength));

      const entriesLength = entries.latest?.length;
      if (entriesLength && entriesLength > Number(selectedHistoryLength))
        mutate(entries.latest?.slice(0, Number(selectedHistoryLength)));
      else refetch();
    }
  };

  const [entries, { mutate, refetch }] = createResource(mounted, getEntries);

  return (
    <section class={props.class ?? ""}>
      <header class="mb-3 flex w-full">
        <h6 class="inline-flex grow select-none items-center font-semibold">
          <Icon name="Clock" solid={true} class="mr-1.5" />
          Recherches récentes
        </h6>
        <aside class="float-right space-x-1.5">
          <Index each={historyLengthOptions}>
            {(item) => (
              <button
                class={`rounded-lg p-1 ${
                  item() === historyLength()
                    ? "bg-white font-semibold text-secondary-900 sm:bg-secondary-50 dark:bg-neutral-700/50 dark:text-neutral-300"
                    : "text-secondary-800 sm:hover:bg-secondary-50 dark:text-neutral-400 sm:dark:hover:bg-neutral-700/50"
                }`}
                data-history-length={item()}
                onClick={updateDisplayItems}
              >
                {item()}
              </button>
            )}
          </Index>
        </aside>
      </header>

      <div
        class="outline-none"
        classList={{
          "grid gap-x-1.5 gap-y-3 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2":
            Boolean(entries.latest?.length)
        }}
        role="list"
        tabindex={-1}
      >
        <Index
          each={entries.latest}
          fallback={<p>Votre historique est vide pour le moment.</p>}
        >
          {(entry) => (
            <Card
              aria-role="list-item"
              class="border border-secondary-200 p-3 shadow-sm transition duration-100 ease-in-out hover:bg-secondary-50 dark:border-neutral-700 dark:hover:bg-neutral-700/50"
              contentClass="line-clamp-1"
              disableDefaultClasses={true}
              href={entry().uri}
              content={entry().excerpt}
              onClick={() => props.setResultsOpen(false)}
            />
          )}
        </Index>
      </div>
    </section>
  );
}
