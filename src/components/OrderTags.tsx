import { createResource, createSignal, Show } from "solid-js";
import type { IdbResponse } from "../idb";
import Icon from "./Icon";
import Modal from "./Modal";
import TagList from "./TagList";
import { IdbTags } from "../idb/IdbTags";

interface Props {
  class?: string;
  disabled?: boolean;
  onChangeCompleted?: (response: IdbResponse) => void;
}

export default function OrderTags(props: Props) {
  const [showModal, setShowModal] = createSignal(false);
  const [currentTagKey, setCurrentTagKey] = createSignal<number | null>(null);

  const handleOrderChange = async (keys: number[]) => {
    const response = await IdbTags.reorder(keys, {
      setFirstAsCurrent: true
    });
    if (response.state === "completed") {
      const newCurrentTagKey = tags().find((tag) => tag.key === keys[0])?.key;
      if (newCurrentTagKey && newCurrentTagKey !== currentTagKey()) {
        setCurrentTagKey(newCurrentTagKey);
      }
    }
    props.onChangeCompleted?.(response);
  };

  const [tags, { refetch: refetchTags }] = createResource(
    () =>
      IdbTags.getAll({
        orderBy: "position"
      }),
    { initialValue: [] }
  );

  const toggleModal = (): void => {
    setShowModal(!showModal());

    if (showModal()) {
      setCurrentTagKey(IdbTags.getCurrentKey());
      refetchTags();
    }
  };

  return (
    <>
      <Modal
        show={[showModal, setShowModal]}
        title="Arranger les étiquettes"
        icon="QueueList"
        dialogContent={
          <Show when={tags()}>
            <TagList
              tags={tags()}
              currentTagKey={currentTagKey()}
              sortable={true}
              onOrderChange={handleOrderChange}
            />
          </Show>
        }
      />

      <button
        aria-label="Arranger les étiquettes"
        type="button"
        disabled={props.disabled}
        class={`${props.class ?? ""} button`}
        onClick={toggleModal}
      >
        <span aria-hidden="true" class="mx-auto xl:mr-1.5">
          <Icon name="QueueList" />
        </span>
        <span class="max-xl:hidden">Arranger</span>
      </button>
    </>
  );
}
