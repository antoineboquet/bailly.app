import { createMemo, Index, type JSX } from "solid-js";

interface Props {
  href?: string;
  title?: string;
  content?: string;
  fakeContent?: FakeContentProps;
  toolBar?: JSX.Element;
  class?: string;
  contentClass?: string;
  disableDefaultClasses?: boolean;
  onClick?: (event: MouseEvent) => void; // used only if href is set
}

export default function Card(props: Props) {
  const defaultClasses: string = [
    "relative",
    "p-3",
    "lg:p-6",
    "font-serif",
    "text-xl",
    "border",
    "rounded-lg",
    "shadow-xl",
    "bg-white",
    "border-secondary-100",
    "dark:bg-neutral-800",
    "dark:border-neutral-700/50",
    "dark:shadow-neutral-950"
  ].join(" ");

  const handleLinkClick: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = (
    event
  ) => {
    const href: string | undefined = event.currentTarget.dataset.href;

    // Toolbars should have a `data-toolbar` attribute.
    if (href && !event.target.closest("[data-toolbar]")) {
      event.currentTarget.href = event.currentTarget.dataset.href ?? "";
    } else {
      event.currentTarget.blur();
    }

    props.onClick?.(event);
  };

  const inner: JSX.Element = (
    <>
      {props.toolBar}

      {!props.title && !props.content && props.fakeContent && (
        <FakeContent
          animated={props.fakeContent.animated}
          lines={props.fakeContent.lines}
        />
      )}

      {props.title && (
        <h5 class="mb-3 text-2xl font-semibold leading-none text-gray-900 dark:text-white">
          {props.title}
        </h5>
      )}

      {props.content && (
        <div class={props.contentClass ?? ""} innerHTML={props.content} />
      )}
    </>
  );

  if (props.href) {
    return (
      <a
        data-href={props.href}
        class={`${props.class ?? ""} ${
          props.disableDefaultClasses ? "" : defaultClasses
        } unstyled-link block`}
        href="javascript: void(0)"
        onClick={handleLinkClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      class={`${props.class ?? ""} ${
        props.disableDefaultClasses ? "" : defaultClasses
      }`}
    >
      {inner}
    </div>
  );
}

interface FakeContentProps {
  animated?: boolean;
  lines: number;
}

function FakeContent(props: FakeContentProps) {
  const lines = createMemo(() => {
    if (!Number.isInteger(props.lines) || props.lines < 1)
      throw new RangeError("Property `lines` must be a positive integer.");
    return props.lines;
  });

  return (
    <div
      class="mt-3 space-y-5 lg:mt-2 lg:space-y-6"
      classList={{
        "animate-pulse": props.animated
      }}
    >
      <Index each={[...Array(lines())]}>
        {(_, i) => (
          <div
            class={`h-1.5 rounded bg-neutral-300 lg:h-2 dark:bg-neutral-500 ${
              i < 2 // first two lines
                ? "w-8/12 md:w-9/12"
                : i + 1 === lines() // last line
                  ? "w-7/12"
                  : (i + 1) % 2 == 0 // even/odd lines
                    ? "w-11/12"
                    : "w-12/12"
            }`}
          />
        )}
      </Index>
    </div>
  );
}
