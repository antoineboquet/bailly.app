import { createMemo, createSignal, onMount, Show, type JSX } from "solid-js";
import { Portal } from "solid-js/web";
import {
  type IdbEntry,
  IdbStarred,
  IdbTaggedEntry,
  IdbTags,
  type IdbTagWithKey
} from "../idb";
import Icon from "./Icon";
import Modal from "./Modal";
import Notification from "./Notification";
import { getColorClasses } from "../helpers";
import TagList from "./TagList";

interface Props {
  entry?: IdbEntry;
  class?: string;
}

export default function TagToolbar(props: Props) {
  const [componentReady, setComponentReady] = createSignal(false);
  const [componentReload, setComponentReload] = createSignal(false);
  const [actionErrored, setActionErrored] = createSignal<string | null>(null);
  const [showModal, setShowModal] = createSignal(false);
  const [tags, setTags] = createSignal<IdbTagWithKey[] | null>(null);
  const [currentTag, setCurrentTag] = createSignal<IdbTagWithKey | null>(null);
  const [starred, setStarred] = createSignal(false);
  const [selectedTagKeys, setSelectedTagKeys] = createSignal<number[] | null>(
    null
  );

  const taggedAsCurrent = createMemo(() =>
    selectedTagKeys()?.includes(currentTag()?.key ?? -1)
  );

  const setup = async () => {
    setComponentReload(true);
    setCurrentTag(await IdbTags.getCurrent());

    if (props.entry) {
      setSelectedTagKeys(await IdbTags.getEntryTagKeys(props.entry.uri));
      const isStarred: boolean = Boolean(await IdbStarred.get(props.entry.uri));
      setStarred(isStarred);
    }
    setComponentReload(false);
  };

  onMount(async () => {
    setTags(
      await IdbTags.getAll({
        orderBy: "position"
      })
    );
    setup();
    document.addEventListener("astro:page-load", setup);
    setTimeout(() => setComponentReady(true), 50);
  });

  const handleTagChange: JSX.EventHandler<HTMLElement, MouseEvent> = async (
    event
  ) => {
    if (!props.entry) return;

    setActionErrored(null);

    const { selected, tagKey } = event.currentTarget.dataset;

    if (selected) {
      await IdbTaggedEntry.remove(props.entry.uri, Number(tagKey));
    } else {
      const response = await IdbTaggedEntry.add(props.entry, Number(tagKey));
      if (response.state === "errored") {
        return setActionErrored(response.message);
      }
    }

    setSelectedTagKeys(await IdbTags.getEntryTagKeys(props.entry.uri));
  };

  const toggleStar = async (): Promise<void> => {
    if (!props.entry) return;

    setActionErrored(null);

    if (!starred()) {
      const response = await IdbStarred.add(props.entry);
      if (response.state === "completed") setStarred(true);
      else setActionErrored(response.message);
    } else {
      await IdbStarred.remove(props.entry.uri);
      setStarred(false);
    }
  };

  return (
    <Show
      when={tags()}
      fallback={
        // Prevent layout shift.
        <div class="relative -right-1 -top-1 float-right h-8 w-36 lg:-right-2 lg:-top-2"></div>
      }
    >
      <span
        data-toolbar
        data-nosnippet
        class={`${props.class ?? ""} ${props.entry ? "cursor-pointer" : ""} ${
          componentReady() ? "visible opacity-100" : "invisible opacity-0"
        } relative -right-1 -top-1 z-40 float-right inline-flex rounded-lg border border-neutral-200 bg-white font-sans text-neutral-400 [transition:opacity_.3s,border-color_.15s] hover:border-neutral-300 hover:shadow-md lg:-right-2 lg:-top-2 dark:border-neutral-600 dark:bg-neutral-800 dark:shadow-neutral-950 dark:[transition:opacity_.3s,border-color_0s] dark:hover:border-neutral-500 dark:hover:[transition:border-color_.15s]`}
      >
        <Show when={actionErrored()}>
          <Portal>
            <Notification
              closeButton={false}
              message={String(actionErrored())}
              onClose={() => setActionErrored(null)}
              position="bottomOrRight"
              type="error"
            />
          </Portal>
        </Show>

        <Show when={!componentReload()}>
          <Modal
            htmlAttributes={{ "data-toolbar": "" }}
            show={[showModal, setShowModal]}
            title="Assigner des étiquettes"
            icon="Bookmark"
            dialogContent={
              <TagList
                tags={tags() ?? []}
                currentTagKey={currentTag()?.key}
                selectedTagKeys={selectedTagKeys()}
                onTagChange={handleTagChange}
              />
            }
          />
        </Show>

        <Show when={tags()?.length}>
          <span
            class="flex p-1.5 transition hover:text-neutral-500 dark:hover:text-neutral-200"
            onClick={() => setShowModal(!showModal())}
          >
            <Icon name="EllipsisHorizontalCircle" />
          </span>
        </Show>

        <Show when={currentTag()}>
          <span
            class={`hidden items-center p-1.5 transition sm:flex ${
              taggedAsCurrent()
                ? getColorClasses(currentTag()?.color)
                : props.entry
                  ? getColorClasses(currentTag()?.color, "hover")
                  : ""
            }`}
            data-selected={taggedAsCurrent() ? "selected" : null}
            data-tag-key={currentTag()?.key}
            onClick={handleTagChange}
          >
            <span class="w-78 fade-content max-w-8 overflow-hidden whitespace-nowrap text-xs">
              {currentTag()?.name}
            </span>
            <Icon name="Tag" solid={taggedAsCurrent()} />
          </span>
        </Show>

        <span
          class={`flex p-1.5 transition ${
            starred()
              ? "text-primary-400"
              : props.entry
                ? "hover:text-primary-400"
                : ""
          }`}
          onClick={toggleStar}
        >
          <Icon name="Star" solid={starred()} />
        </span>
      </span>
    </Show>
  );
}
