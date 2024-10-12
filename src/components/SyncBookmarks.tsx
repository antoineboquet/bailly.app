import { createSignal } from "solid-js";
import Icon from "./Icon";
import Modal from "./Modal";

interface Props {
  class?: string;
}

export default function SyncBookmarks(props: Props) {
  const [showModal, setShowModal] = createSignal(false);

  return (
    <>
      <Modal
        show={[showModal, setShowModal]}
        title="Synchroniser les signets"
        icon="ArrowPath"
        dialogContent={<p>...</p>}
      />

      <button
        aria-label="Synchroniser les signets"
        class={`${props.class ?? ""} button`}
        onClick={() => setShowModal(!showModal())}
        type="button"
      >
        <span aria-hidden="true" class="mx-auto xl:mr-1.5">
          <Icon name="ArrowPath" />
        </span>
        <span class="max-xl:hidden">Synchroniser</span>
      </button>
    </>
  );
}
