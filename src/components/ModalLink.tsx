import { createSignal, Show, type JSX } from "solid-js";
import type { IconName } from "./Icon";
import Modal from "./Modal";
import Icon from "./Icon";

interface Props {
  type?: "link" | "button";
  label: JSX.Element | string;
  modalIcon?: IconName;
  modalTitle: string;
  modalContent?: JSX.Element;
  modalHtmlAttributes?: {};
  onClick?: JSX.EventHandler<HTMLElement, MouseEvent>;
}

export default function ModalLink(props: Props) {
  const [showModal, setShowModal] = createSignal(false);

  const toggleModal: JSX.EventHandler<HTMLElement, MouseEvent> = (event) => {
    props.onClick?.(event);
    setShowModal(!showModal());
  };

  return (
    <>
      <Modal
        show={[showModal, setShowModal]}
        title={props.modalTitle}
        icon={props.modalIcon}
        dialogContent={props.modalContent}
        htmlAttributes={props.modalHtmlAttributes}
      />

      <Show
        when={props.type === "button"}
        fallback={
          <span
            role="button"
            class="fake-link"
            onClick={(event) => toggleModal(event)}
          >
            {props.label}
          </span>
        }
      >
        <button
          aria-label={props.modalTitle}
          type="button"
          class="button"
          onClick={(event) => toggleModal(event)}
        >
          <Show when={props.modalIcon} fallback={props.label}>
            <span aria-hidden="true" class="mx-auto xl:mr-1.5">
              <Icon name={props.modalIcon!} />
            </span>
            <span class="max-xl:hidden">{props.label}</span>
          </Show>
        </button>
      </Show>
    </>
  );
}
