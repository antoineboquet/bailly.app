import { createSignal, Index, onCleanup, Show, type JSX } from "solid-js";
import type { Color } from "../enums";
import {
  IdbResponse,
  IdbStarred,
  IdbTaggedEntry,
  IdbTags,
  type IdbEntry,
  type IdbTagWithKey
} from "../idb";
import Card from "./Card";
import Icon from "./Icon";
import { getColorClasses } from "../helpers";

interface Props {
  tagKey?: number;
  name: string;
  color?: Color;
  entries: IdbEntry[];
  class?: string;
  contentClass?: string;
  onTagNameUpdateCompleted?: (response: IdbResponse<IdbTagWithKey>) => void;
  onTaggedEntryRemovalCompleted?: () => void;
  onTagRemovalCompleted?: () => void;
}

export default function BookmarksGroup(props: Props) {
  let bookmarksGroup!: HTMLElement;
  let tagNameInput!: HTMLInputElement;

  const favorites = props.name === "Favoris";

  // Use copies of these props in order to be able to modify their displayed
  // values without refreshing the global state in `Bookmarks.tsx`.
  const [tagName, setTagName] = createSignal(props.name);

  const [shakeNameInput, setShakeNameInput] = createSignal(false);

  const [editMode, setEditMode] = createSignal<boolean>(false);

  onCleanup(() => {
    // Prevent trigger updates after tag deletion.
    window.removeEventListener("click", handleClickOutsideOfGroup);
  });

  const handleClickOutsideOfGroup = (event: MouseEvent) => {
    if (!(event.target as HTMLElement)?.closest(`#${bookmarksGroup.id}`)) {
      exitEditMode();
    }
  };

  const handleNameInputKeyDown: JSX.EventHandler<
    HTMLInputElement,
    KeyboardEvent
  > = (event) => {
    if (event.key === "Enter") exitEditMode();
  };

  const enterEditMode = (): void => {
    window.addEventListener("click", handleClickOutsideOfGroup);
    if (!favorites) tagNameInput.value = tagName();
    setEditMode(true);
  };

  const exitEditMode = async (): Promise<void> => {
    window.removeEventListener("click", handleClickOutsideOfGroup);
    if (!favorites) await updateTagName();
    setEditMode(false);
  };

  const toggleEditMode = (): void => {
    editMode() ? exitEditMode() : enterEditMode();
  };

  const updateTagName = async (): Promise<IdbResponse<IdbTagWithKey>> => {
    let response: IdbResponse<IdbTagWithKey>;
    if (props.tagKey) {
      response = await IdbTags.update(props.tagKey, {
        name: tagNameInput.value,
        description: ""
      });

      if (response.state === "completed") {
        if (response.data) setTagName(response.data.name);
      } else {
        setShakeNameInput(true);
      }
    } else {
      response = new IdbResponse(
        "errored",
        "Cette étiquette ne peut être modifiée."
      );
    }

    props.onTagNameUpdateCompleted?.(response);
    return response;
  };

  const handleStarredOrTaggedEntryRemoval: JSX.EventHandler<
    HTMLElement,
    MouseEvent
  > = async (event) => {
    const { uri, tagKey } = event.currentTarget.dataset;

    if (favorites && uri) await IdbStarred.remove(uri);
    else if (uri && tagKey) await IdbTaggedEntry.remove(uri, Number(tagKey));

    props.onTaggedEntryRemovalCompleted?.();
  };

  const handleTagRemoval: JSX.EventHandler<HTMLElement, MouseEvent> = async (
    event
  ) => {
    const { tagKey } = event.currentTarget.dataset;
    if (tagKey) await IdbTags.remove(Number(tagKey));
    props.onTagRemovalCompleted?.();
  };

  return (
    <article
      ref={bookmarksGroup}
      id={`bookmarks-${Date.now()}`}
      class={`${props.class ?? ""} group rounded-lg border p-3 shadow-lg shadow-black/5 backdrop-blur-[2px] ${
        !favorites
          ? "border-neutral-400/25 bg-neutral-400/15 dark:border-neutral-400/15"
          : "border-primary-400/25 bg-primary-400/15 dark:border-primary-400/15"
      }`}
    >
      <header class="mb-3 flex items-center">
        <h2
          class={`flex flex-1 select-none items-center font-sans text-xl font-semibold lg:text-2xl ${
            !favorites
              ? "text-neutral-700 dark:text-neutral-300"
              : "text-primary-500 dark:text-primary-400"
          }`}
        >
          <Show
            when={!favorites}
            fallback={
              <>
                <Icon name="Star" solid={true} />
                <span class="px-3">{tagName()}</span>
              </>
            }
          >
            <Icon
              name="Tag"
              class={`${getColorClasses(props.color)}`}
              solid={true}
            />
            <span
              class="px-3"
              classList={{
                hidden: editMode() || shakeNameInput(),
                "my-0.5 text-base lg:text-lg": tagName().length > 30
              }}
            >
              {tagName()}
            </span>

            <input
              ref={tagNameInput}
              autocomplete="off"
              autocorrect="off"
              spellcheck={false}
              enterkeyhint="done"
              type="text"
              class="ml-1.5 w-full rounded-lg bg-transparent px-1.5 outline outline-1 outline-neutral-400/75 focus:outline-2 dark:outline-neutral-400/50"
              classList={{
                hidden: !editMode() && !shakeNameInput(),
                "animate-shake": shakeNameInput(),
                "my-0.5 text-base lg:text-lg": tagName().length > 30
              }}
              onAnimationEnd={() => setShakeNameInput(false)}
              onKeyDown={handleNameInputKeyDown}
            />
          </Show>
        </h2>

        <aside
          class={`flex gap-3 pl-3 hover-hover:group-hover:visible ${
            editMode() ? "" : "hover-hover:invisible"
          } `}
        >
          <Show when={!favorites || (favorites && props.entries.length)}>
            <Icon
              name="PencilSquare"
              class={`transition-colors duration-75 ${editMode() ? "text-primary-600 dark:text-primary-600" : ""} cursor-pointer hover:text-primary-700 dark:hover:text-primary-500`}
              onClick={toggleEditMode}
            />
          </Show>

          <Show when={!favorites && !props.entries.length}>
            <span
              class="cursor-pointer"
              data-tag-key={props.tagKey}
              onClick={handleTagRemoval}
            >
              <Icon name="XCircle" class="hover:scale-105 active:scale-105" />
            </span>
          </Show>
        </aside>
      </header>

      <Show
        when={props.entries.length}
        fallback={
          <Show
            when={!favorites}
            fallback={
              <p class="select-none font-sans font-semibold text-primary-500 sm:ml-9 dark:text-primary-400">
                Retrouvez aisément les entrées que vous consultez le plus
                souvent en les ajoutant à cette liste.
              </p>
            }
          >
            <p class="select-none font-sans font-semibold text-neutral-700 sm:ml-9 dark:text-neutral-300">
              Cette étiquette ne référence aucune entrée.
            </p>
          </Show>
        }
      >
        <section
          class={`grid select-none grid-cols-1 gap-1.5 space-y-1.5 outline-none sm:grid-cols-2 sm:gap-3 sm:space-y-3 ${
            props.contentClass ? props.contentClass : ""
          }`}
          role="list"
        >
          <Index each={props.entries}>
            {(entry) => (
              <div class="group/item contents" role="listitem">
                <Card
                  class={`h-full w-full !bg-white/75 !shadow-none transition group-hover/item:!shadow-sm dark:!bg-white/15 ${
                    !favorites
                      ? "!border-neutral-400/25 group-hover/item:!border-neutral-400/75 dark:!border-neutral-400/15 dark:group-hover/item:!border-neutral-400/50"
                      : "!border-primary-400/25 group-hover/item:!border-primary-400/75 dark:!border-primary-400/15 dark:group-hover/item:!border-primary-400/50"
                  } ${
                    props.entries.length >= 5 ? "!p-1.5" : "!p-1.5 sm:!px-3"
                  } ${editMode() ? "select-none" : ""} `}
                  content={entry().excerpt}
                  contentClass={`transition ${
                    props.entries.length >= 5
                      ? "whitespace-nowrap overflow-hidden fade-content"
                      : "max-sm:whitespace-nowrap max-sm:overflow-hidden max-sm:fade-content line-clamp-4"
                  } ${editMode() ? "text-neutral-600 dark:text-neutral-300" : ""}
                  `}
                  href={!editMode() ? entry().uri : undefined}
                  toolBar={
                    <Show when={editMode()}>
                      <span
                        class="group/delete absolute inset-y-0 right-0 z-40 flex cursor-pointer items-center rounded-full p-1.5 transition hover-hover:invisible hover-hover:opacity-0 hover-hover:group-hover/item:visible hover-hover:group-hover/item:opacity-100"
                        classList={{
                          "sm:bottom-auto": props.entries.length < 5
                        }}
                        data-tag-key={props.tagKey}
                        data-uri={entry().uri}
                        onClick={handleStarredOrTaggedEntryRemoval}
                      >
                        <Icon
                          name="XCircle"
                          class="text-neutral-600 group-hover/delete:scale-105 group-active/delete:scale-105 dark:text-neutral-300"
                          solid={true}
                        />
                      </span>
                    </Show>
                  }
                />
              </div>
            )}
          </Index>
        </section>
      </Show>
    </article>
  );
}
