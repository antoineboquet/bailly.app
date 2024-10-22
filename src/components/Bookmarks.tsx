import {
  createEffect,
  createResource,
  createSignal,
  For,
  lazy,
  Show
} from "solid-js";
import { Portal } from "solid-js/web";
import { LocalStorageKey } from "../enums";
import { highlightEntryInExcerpt } from "../helpers";
import {
  IdbResponse,
  IdbStarred,
  IdbTaggedEntry,
  IdbTags,
  type IdbEntry,
  type IdbTagged,
  type IdbTagWithKey
} from "../idb";
import BookmarksGroup from "./BookmarksGroup";
import DismissibleCard from "./DismissibleCard";
import Notification from "./Notification";
import OrderTags from "./OrderTags";
import TagCreationInput from "./TagCreationInput";

const BookmarksLanding = lazy(() => import("./BookmarksLanding"));

export default function Bookmarks() {
  const [actionErrored, setActionErrored] = createSignal<string | null>(null);

  // @fixme: this computation should be cached.
  const selectTag = (tag: IdbTagWithKey) => {
    return taggedEntries().filter((item) => item.tagKey === tag.key);
  };

  const sortEntries = <T extends IdbEntry[]>(entries: T): T => {
    // Difference between 'grc' and 'el-polyton'?
    const collator = new Intl.Collator("grc");
    return entries.sort((a, b) => collator.compare(a.word, b.word));
  };

  const handleTagCreationCompleted = (
    response: IdbResponse<IdbTagWithKey>
  ): void => {
    setActionErrored(null);
    if (response.state === "completed") refetchTags();
    else setActionErrored(response.message);
  };

  const handleTagNameUpdateCompleted = (
    response: IdbResponse<IdbTagWithKey>
  ): void => {
    setActionErrored(null);
    // Don't refresh tags as `BookmarksGroup.tsx` handles the updated values.
    if (response.state === "errored") setActionErrored(response.message ?? "");
  };

  const handleTagsOrderChangeCompleted = (response: IdbResponse): void => {
    setActionErrored(null);
    if (response.state === "completed") refetchTags();
    else setActionErrored(response.message);
  };

  const getStarredEntries = async (): Promise<IdbEntry[]> => {
    const data: IdbEntry[] = await IdbStarred.getAll();

    const entries = data.map((item) => {
      if (!item.excerpt) return item;
      return {
        ...item,
        excerpt: highlightEntryInExcerpt(item.word, item.excerpt)
      };
    });

    return sortEntries(entries);
  };

  const getTaggedEntries = async (): Promise<IdbTagged[]> => {
    const data: IdbTagged[] = await IdbTaggedEntry.getAll();

    const entries = data.map((item) => {
      if (!item.excerpt) return item;
      return {
        ...item,
        excerpt: highlightEntryInExcerpt(item.word, item.excerpt)
      };
    });

    return sortEntries(entries);
  };

  const [starredEntries, { refetch: refetchStarredEntries }] = createResource(
    getStarredEntries,
    {
      initialValue: []
    }
  );

  const [taggedEntries, { refetch: refetchTaggedEntries }] = createResource(
    getTaggedEntries,
    {
      initialValue: []
    }
  );

  const [tags, { refetch: refetchTags }] = createResource(
    () =>
      IdbTags.getAll({
        orderBy: "position"
      }),
    {
      initialValue: []
    }
  );

  createEffect(() => {
    if (
      !starredEntries.loading &&
      !starredEntries().length &&
      !tags.loading &&
      !tags().length
    ) {
      localStorage.removeItem(LocalStorageKey.DismissBookmarksInfoCard);
    }
  });

  return (
    <>
      <Show when={actionErrored()}>
        <Portal>
          <Notification
            closeButton={false}
            message={String(actionErrored())}
            onClose={() => setActionErrored(null)}
            type="error"
          />
        </Portal>
      </Show>

      <Show
        when={starredEntries().length || tags().length}
        fallback={
          <Show when={!starredEntries.loading && !tags.loading}>
            <BookmarksLanding
              onTagCreationCompleted={handleTagCreationCompleted}
            />
          </Show>
        }
      >
        <div class="mx-auto p-6 md:p-12 2xl:max-w-screen-2xl">
          <section class="grid grid-flow-row-dense grid-cols-1 gap-6 lg:grid-cols-2 2xl:grid-cols-3">
            <header class="col-span-full flex gap-6 max-md:flex-col xl:mb-6">
              <h1 class="grow font-sans text-3xl font-bold leading-normal">
                Mes signets
              </h1>

              <aside class="flex items-center gap-x-3 xl:gap-x-6">
                {/*<SyncBookmarks />*/}

                <OrderTags
                  disabled={!tags().length}
                  onChangeCompleted={handleTagsOrderChangeCompleted}
                />

                <TagCreationInput
                  class="w-full max-w-96 md:max-w-md"
                  onTagCreationCompleted={handleTagCreationCompleted}
                />
              </aside>
            </header>

            <DismissibleCard
              title="Bienvenue"
              content={
                <>
                  <p>
                    Cette page vous permet à la fois de consulter et de gérer
                    vos étiquettes, ainsi que les entrées que vous assignez aux
                    étiquettes préalablement définies et à la liste des favoris.
                  </p>
                  <p>
                    Veuillez noter que les signets sont conservés dans le{" "}
                    <span class="brightness-75 dark:brightness-125">
                      stockage de votre navigateur Internet
                    </span>
                    , ce qui signifie qu'ils sont uniquement accessibles depuis
                    ce navigateur-là, tant que vous ne supprimez pas les données
                    de navigation du site.
                  </p>
                </>
              }
              icon="Bookmark"
              key={LocalStorageKey.DismissBookmarksInfoCard}
            />

            {/*
            <DismissibleCard
              title="Synchronisation"
              content={
                <>
                  Les signets sont conservés dans le stockage de votre
                  navigateur Internet. Pour y accéder depuis un autre appareil
                  ou navigateur, ou pour en archiver une copie, veuillez vous
                  référer aux options de synchronisation.
                </>
              }
              icon="ArrowPath"
              key={LocalStorageKey.DismissBookmarksSyncInfobox}
            />
            */}

            <BookmarksGroup
              name="Favoris"
              entries={starredEntries()}
              class={starredEntries().length > 24 ? `2xl:col-span-2` : ""}
              contentClass={
                starredEntries().length > 24 ? `2xl:grid-cols-3` : ""
              }
              onTaggedEntryRemovalCompleted={refetchStarredEntries}
            />
            <For each={tags()}>
              {(tag) => (
                <BookmarksGroup
                  tagKey={tag.key}
                  name={tag.name}
                  color={tag.color}
                  entries={selectTag(tag)}
                  class={selectTag(tag).length > 18 ? `2xl:col-span-2` : ""}
                  contentClass={
                    selectTag(tag).length > 18 ? `2xl:grid-cols-3` : ""
                  }
                  onTagNameUpdateCompleted={handleTagNameUpdateCompleted}
                  onTaggedEntryRemovalCompleted={refetchTaggedEntries}
                  onTagRemovalCompleted={refetchTags}
                />
              )}
            </For>
          </section>
        </div>
      </Show>
    </>
  );
}
