import { createSignal, type JSX } from "solid-js";
import { type IdbResponse, IdbTags, type IdbTagWithKey } from "../idb";
import Icon from "./Icon";

interface Props {
  class?: string;
  onTagCreationCompleted?: (response: IdbResponse<IdbTagWithKey>) => void;
}

export default function TagCreationInput(props: Props) {
  let input!: HTMLInputElement;
  let submitButton!: HTMLButtonElement;

  const [tagName, setTagName] = createSignal<string | null>(null);

  const [shakeNameInput, setShakeNameInput] = createSignal(false);

  const handleTagCreation = async (): Promise<void> => {
    const name = tagName();
    if (name) {
      const response = await IdbTags.add({ name: name, description: "" });

      setTagName(null);
      input.value = "";
      submitButton.setAttribute("disabled", "disabled");

      if (response.state === "errored") setShakeNameInput(true);

      props.onTagCreationCompleted?.(response);
    }
  };

  const onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent> = () => {
    if (!tagName()) input.value = "";
  };

  const onButtonClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = () => {
    handleTagCreation();
  };

  const onInput: JSX.EventHandler<HTMLInputElement, InputEvent> = () => {
    if (input.value) {
      setTagName(input.value);
      submitButton.removeAttribute("disabled");
    } else {
      setTagName(null);
      submitButton.setAttribute("disabled", "disabled");
    }
  };

  const onKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (
    event
  ) => {
    if (event.key === "Enter") {
      handleTagCreation();
      input.blur();
    }
  };

  return (
    <div
      class={`${props.class ?? ""} relative flex items-center`}
      classList={{
        "animate-shake": shakeNameInput()
      }}
      onAnimationEnd={() => setShakeNameInput(false)}
    >
      <div class="absolute left-3 hidden sm:block">
        <Icon name="Tag" class="text-neutral-500 dark:text-neutral-400" />
      </div>

      <input
        ref={input}
        autocomplete="off"
        autocorrect="off"
        spellcheck={false}
        enterkeyhint="done"
        minLength={1}
        maxlength={70}
        placeholder="Nouvelle étiquette"
        type="text"
        class="block h-12 w-full rounded-full border border-secondary-100 bg-white p-3 pl-4 pr-[3.25rem] shadow-lg shadow-secondary-900/10 transition placeholder:text-neutral-500 sm:pl-11 xl:pr-32 dark:border-neutral-700 dark:bg-neutral-800 dark:shadow-neutral-950 dark:placeholder:text-neutral-400"
        onBlur={onBlur}
        onInput={onInput}
        onKeyDown={onKeyDown}
      />

      <button
        aria-label="Créer une nouvelle étiquette"
        class="button absolute right-2 h-auto w-auto px-2 py-1 shadow-none xl:px-3 xl:pl-2.5"
        disabled
        onClick={onButtonClick}
        ref={submitButton}
        type="submit"
      >
        <span aria-hidden="true" class="xl:mr-1.5">
          <Icon name="Plus" />
        </span>
        <span class="max-xl:hidden">Ajouter</span>
      </button>
    </div>
  );
}
