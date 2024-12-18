import { createSignal, onMount, Show, type JSX } from "solid-js";
import { LocalStorageKey } from "../enums";
import Icon, { type IconName } from "./Icon";

interface Props {
  title?: string;
  content: JSX.Element;
  icon?: IconName;
  key?: LocalStorageKey;
  class?: string;
}

export default function DismissibleCard(props: Props) {
  const [showDismissibleCard, setShowDismissibleCard] = createSignal(
    props.key ? false : true
  );

  onMount(() => {
    if (props.key) {
      const dismissed: string | null = localStorage.getItem(props.key);
      if (["false", null].includes(dismissed)) setShowDismissibleCard(true);
    }
  });

  const dismissCard: JSX.EventHandler<SVGSVGElement, MouseEvent> = () => {
    if (props.key) localStorage.setItem(props.key, String(true));
    setShowDismissibleCard(false);
  };

  return (
    <Show when={showDismissibleCard()}>
      <article class={`${props.class} select-none rounded-lg bg-secondary-200 p-3 shadow-lg shadow-black/5 dark:bg-secondary-950`}>
        <Icon
          name="XCircle"
          class="cursor-pointer float-right fill-secondary-700 hover:scale-105 hover:fill-secondary-800 active:scale-105 dark:fill-secondary-400 dark:hover:fill-secondary-300"
          solid={true}
          onClick={dismissCard}
        />
        
        <Show when={props.title}>
          <header class="mb-3 flex items-center">
            <h2 class="flex flex-1 items-center font-sans text-xl font-semibold text-secondary-700 lg:text-2xl dark:text-secondary-400">
              <Show when={props.icon}>
                <Icon name={props.icon!} class="mr-3" solid={true} />
              </Show>
              {props.title}
            </h2>
          </header>
        </Show>

        <div
          class={`space-y-1.5 font-sans font-semibold text-secondary-700 ${props.icon && props.title ? "sm:ml-9" : ""} dark:text-secondary-400`}
        >
          <Show when={props.icon && !props.title}>
            <Icon name={props.icon!} class="inline-flex size-5 mr-1.5" solid={true} />
          </Show>
          {props.content}
        </div>
      </article>
    </Show>
  );
}
