import { onCleanup, onMount, Show } from "solid-js";
import Icon from "./Icon";

interface Props {
  closeButton?: boolean;
  message: string;
  onClose: () => void;
  position?: "bottom" | "bottomOrRight";
  timeout?: true | number | false;
  type?: "success" | "info" | "error";
}

export default function Notification({
  closeButton = true,
  message,
  onClose,
  position = "bottom",
  timeout = true,
  type = "info"
}: Props) {
  // @fixme: check why TS complains against this.
  let currentTimeout: any /*number*/;

  onMount(() => {
    if (timeout) {
      currentTimeout = window.setTimeout(
        onClose,
        typeof timeout === "number" ? timeout : 3000
      );
    }
  });

  onCleanup(() => {
    if (timeout) clearTimeout(currentTimeout);
  });

  return (
    <div
      class="fixed inset-12 top-auto z-40 flex animate-rise justify-center"
      classList={{
        "xl:inset-auto xl:right-12 xl:top-28": position === "bottomOrRight"
      }}
    >
      <p
        class="flex w-96 justify-center gap-1.5 rounded-lg p-3 text-center font-sans font-semibold text-white shadow-xl"
        classList={{
          "border-red-100 bg-red-500": type === "error"
        }}
      >
        <span>{message}</span>
        <Show when={closeButton}>
          <Icon
            name="XCircle"
            class="float-right cursor-pointer fill-white hover:scale-105 active:scale-105"
            solid={true}
            onClick={onClose}
          />
        </Show>
      </p>
    </div>
  );
}
