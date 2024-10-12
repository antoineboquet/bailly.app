import {
  closestCenter,
  createSortable,
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  useDragDropContext,
  type DragEventHandler
  //type Id
} from "@thisbeyond/solid-dnd";
import { createEffect, createSignal, For, Show } from "solid-js";
import type { IdbTagWithKey } from "../idb";
import { getColorClasses } from "../helpers";
import Icon from "./Icon";

interface TagListProps {
  tags: IdbTagWithKey[];
  currentTagKey?: number | null;
  selectedTagKeys?: number[] | null;
  sortable?: boolean;
  onTagChange?: (event: any) => void;
  onOrderChange?: (keys: number[]) => void;
}

// https://solid-dnd.com/?example=Sortable%2520list%2520%28vertical%29#features
// Types: https://github.com/thisbeyond/solid-dnd/issues/68
export default function TagList(props: TagListProps) {
  const listItemClasses: string =
    "transition duration-75 relative flex items-center p-3 font-medium rounded-lg";
  const [sortableTags, setSortableTags] = createSignal(props.tags);
  //const [activeItem, setActiveItem] = createSignal<Id | null>(null);
  const ids = () => sortableTags().map((tag) => tag.key);

  createEffect(() => setSortableTags(props.tags));

  /*const onDragStart: DragEventHandler = ({ draggable }) =>
    setActiveItem(draggable.id);*/

  const onDragEnd: DragEventHandler = ({ draggable, droppable }) => {
    if (draggable && droppable) {
      const currentIds = ids();
      const fromIndex = currentIds.indexOf(draggable.id as number);
      const toIndex = currentIds.indexOf(droppable.id as number);
      if (fromIndex !== toIndex) {
        const updatedItems = sortableTags().slice();
        updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
        setSortableTags(updatedItems);
        props.onOrderChange?.(ids());
      }
    }
  };

  return (
    <ul class="select-none space-y-1.5 outline-none md:space-y-3" tabindex={-1}>
      <Show
        when={props.sortable}
        fallback={
          <For each={props.tags}>
            {(tag) => (
              <TagListItem
                class={listItemClasses}
                tag={tag}
                currentTag={props.currentTagKey === tag.key}
                selected={props.selectedTagKeys?.includes(tag.key)}
                onClick={(event) => props.onTagChange?.(event)}
              />
            )}
          </For>
        }
      >
        <DragDropProvider
          //onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          collisionDetector={closestCenter}
        >
          <DragDropSensors />
          <SortableProvider ids={ids()}>
            <For each={sortableTags()}>
              {(tag) => (
                <SortableTagListItem
                  class={listItemClasses}
                  tag={tag}
                  currentTag={props.currentTagKey === tag.key}
                />
              )}
            </For>
          </SortableProvider>
          <DragOverlay>
            <></>
          </DragOverlay>
        </DragDropProvider>
      </Show>
    </ul>
  );
}

interface TagProps {
  tag: IdbTagWithKey;
  currentTag?: boolean;
  selected?: boolean;
}

function Tag(props: TagProps) {
  return (
    <>
      <Icon
        name="Tag"
        class={`${getColorClasses(props.tag.color)} mr-1.5`}
        solid={true}
      />

      <span class="grow">{props.tag.name}</span>

      <Show when={props.currentTag}>
        <Icon
          name="Flag"
          class={`float-right text-neutral-400 ${
            props.selected ? "text-primary-700 dark:text-primary-200" : ""
          }`}
          solid={true}
        />
      </Show>
    </>
  );
}

interface TagListItemProps {
  class?: string;
  tag: IdbTagWithKey;
  currentTag?: boolean;
  selected?: boolean;
  onClick?: (event: any) => void;
}

function TagListItem(props: TagListItemProps) {
  return (
    <li
      data-tag-key={props.tag.key}
      data-selected={props.selected ? "selected" : null}
      class={`cursor-pointer ${props.class ?? ""} ${
        props.selected
          ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200"
          : "hover:bg-secondary-100 dark:hover:bg-neutral-700"
      }`}
      onClick={(event) => props.onClick?.(event)}
    >
      <Tag
        tag={props.tag}
        currentTag={props.currentTag}
        selected={props.selected}
      />
    </li>
  );
}

interface SortableTagListItemProps {
  class?: string;
  tag: IdbTagWithKey;
  currentTag?: boolean;
}

function SortableTagListItem(props: SortableTagListItemProps) {
  const sortable = createSortable(props.tag.key);
  const context = useDragDropContext();
  const state = context && context[0];

  return (
    <li
      ref={sortable}
      classList={{
        "transition-transform": !!state?.active.draggable
      }}
      class={`cursor-grab touch-none ${props.class ?? ""} ${
        sortable.isActiveDraggable
          ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200"
          : "hover:bg-secondary-100 dark:hover:bg-neutral-700"
      }`}
    >
      <Icon name="Bars3" class="mr-3 text-neutral-400" />
      <Tag tag={props.tag} currentTag={props.currentTag} />
    </li>
  );
}
