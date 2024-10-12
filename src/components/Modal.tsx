import { createEffect, Show, type JSX, type Signal } from "solid-js";
import { Portal } from "solid-js/web";
import type { IconName } from "./Icon";
import Icon from "./Icon";

interface Props {
  title: string;
  icon?: IconName;
  dialogContent?: JSX.Element;
  show: Signal<boolean>;
  htmlAttributes?: {};
}

export default function Modal(props: Props) {
  createEffect(() => (props.show[0]() ? showModal() : null));

  const showModal = () => {
    document.body.classList.add("noscroll");
    window.addEventListener("keydown", handleOnKeyDown);
    props.show[1](true);
  };

  const hideModal = () => {
    document.body.classList.remove("noscroll");
    window.removeEventListener("keydown", handleOnKeyDown);
    props.show[1](false);
  };

  const handleHideModal: JSX.EventHandler<HTMLElement, MouseEvent> = (
    event
  ) => {
    if (event.target === event.currentTarget) hideModal();
  };

  const handleOnKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      document.body.classList.remove("noscroll");
      window.removeEventListener("keydown", handleOnKeyDown);
      props.show[1](false);
    }
  };

  return (
    <Portal>
      <div
        {...props.htmlAttributes}
        class={`fixed inset-0 z-[999] flex flex-col items-center justify-center px-6 py-12 font-sans transition duration-300 ease-in-out md:py-16 ${
          props.show[0]()
            ? "visible bg-secondary-900/50 opacity-100 backdrop-blur-sm dark:bg-neutral-900/50"
            : "invisible opacity-0"
        } `}
        onClick={handleHideModal}
      >
        <Icon
          name="XCircle"
          class="absolute right-3 top-3 cursor-pointer fill-neutral-200 hover:scale-105 active:scale-105 md:right-6 md:top-6 md:size-7 md:hover:scale-110 md:active:scale-110 dark:fill-neutral-400"
          solid={true}
          onClick={hideModal}
        />

        <span class="mb-3 flex select-none items-center text-center text-xl font-semibold [text-shadow:0_1px_0_rgba(255,255,255,.15),0_1px_18px_rgba(255,255,255,.5)] dark:[text-shadow:0_1px_0_black,0_1px_18px_rgba(0,0,0,.75)]">
          <Show when={props.icon}>
            <span class="mr-1.5">
              <Icon name={props.icon!} solid={true} />
            </span>
          </Show>
          {props.title}
        </span>

        <div class="max-h-screen w-full min-w-80 overflow-hidden rounded-lg bg-white shadow-xl sm:max-w-screen-sm dark:bg-neutral-800 dark:shadow-neutral-950/50">
          <div class="h-full overflow-y-auto p-3">{props.dialogContent}</div>
        </div>
      </div>
    </Portal>
  );
}
