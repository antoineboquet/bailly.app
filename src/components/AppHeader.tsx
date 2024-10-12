import { createMemo, type JSX } from "solid-js";
import NavigationItem from "./NavigationItem";

interface Props {
  currentPath: string;
  searchBarSlot?: JSX.Element;
}
export default function AppHeader(props: Props) {
  const currentPath = createMemo(() => {
    return props.currentPath.at(-1) === "/"
      ? props.currentPath.slice(-1)
      : props.currentPath;
  });

  /*
   * <NavigationItem
   *   href="/explorer"
   *   isActive={currentPath() === "/explorer"}
   *   icon="BookOpen"
   *   name="Explorer"
   *   ariaLabel="Explorer"
   * />
   */
  return (
    <header
      id="app-header"
      class="fixed top-0 z-[99] h-24 w-dvw select-none border-b border-b-secondary-200 bg-white pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] font-sans md:h-16 md:text-sm dark:border-b-neutral-600 dark:bg-neutral-800"
    >
      <nav
        aria-label="Menu principal"
        class="grid h-full grid-cols-12 max-md:grid-flow-row-dense md:px-3 lg:px-6"
      >
        <div class="col-span-6 flex h-12 items-center max-md:pl-3 md:col-span-2 md:h-auto xl:col-span-2">
          <a
            href="/"
            class="relative -left-1.5 rounded-lg border border-transparent px-1.5 pb-0.5 pt-1 font-serif text-xl tracking-wider outline-none transition hover:border-neutral-300 hover:shadow-md md:pb-1 md:pt-1.5 lg:-left-3 lg:px-3 dark:hover:border-neutral-500"
          >
            Bailly.app
          </a>

          <a
            href="/nouveautés"
            class="inline-flex transform-gpu items-center gap-x-1.5 rounded-full bg-teal-100 px-2 py-1.5 font-sans text-xs font-medium text-teal-800 !outline-offset-0 transition-transform duration-75 hover:scale-110 dark:bg-teal-900 dark:text-teal-200"
          >
            🎉
          </a>
        </div>

        <div class="col-span-full h-[calc(theme(height.12)-1px)] w-full place-self-center border-x-secondary-200 border-t-neutral-200 max-md:border-t md:col-span-8 md:mx-0 md:h-full md:max-w-[calc(theme(screens.sm)+theme(spacing.12))] md:border-x xl:col-span-6 dark:border-x-neutral-600 dark:border-t-neutral-600">
          {props.searchBarSlot}
        </div>

        <div class="col-span-6 flex h-12 items-center justify-end gap-x-4 font-semibold max-md:pr-3 md:col-span-2 md:h-auto xl:col-span-4 xl:gap-x-7">
          <NavigationItem
            href="/signets"
            isActive={currentPath() === "/signets"}
            icon="Bookmark"
            name="Signets"
            ariaLabel="Signets"
          />

          <NavigationItem
            href="/paramètres"
            isActive={currentPath() === "/paramètres"}
            icon="AdjustmentsHorizontal"
            name="Paramètres"
            ariaLabel="Paramètres"
          />

          <NavigationItem
            href="/à-propos"
            isActive={currentPath() === "/à-propos"}
            icon="InformationCircle"
            name="À&nbsp;propos"
            ariaLabel="À propos"
          />
        </div>
      </nav>
    </header>
  );
}
