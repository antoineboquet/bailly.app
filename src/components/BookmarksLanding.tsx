import type { IdbResponse, IdbTagWithKey } from "../idb";
import ExampleCard from "./ExampleCard";
import TagCreationInput from "./TagCreationInput";

interface Props {
  onTagCreationCompleted: (response: IdbResponse<IdbTagWithKey>) => void;
}

export default function BookmarksLanding(props: Props) {
  return (
    <div class="mx-auto flex h-[calc(100dvh-theme(spacing.24))] flex-col items-center justify-center gap-6 px-6 md:h-[calc(100dvh-theme(spacing.16))] md:gap-12 md:px-12 lg:max-w-screen-lg lg:px-24 xl:px-0">
      <p class="flex-shrink text-center font-sans text-xl font-bold md:text-2xl xl:text-3xl xl:leading-normal">
        Commencez d'étiquetter
        <br />
        des mots, puis retrouvez‑les
        <br />
        sur cette page.
      </p>

      <ExampleCard />

      <aside class="w-auto max-w-96 max-md:absolute max-md:bottom-12 max-md:px-6 md:max-w-md">
        <TagCreationInput
          onTagCreationCompleted={props.onTagCreationCompleted}
        />
      </aside>
    </div>
  );
}
