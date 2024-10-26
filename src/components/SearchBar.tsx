import {
  createResource,
  createSignal,
  Match,
  onMount,
  Show,
  Suspense,
  Switch,
  type JSX
} from "solid-js";
import { createScheduled, debounce } from "@solid-primitives/scheduled";
import {
  AdditionalChar,
  KeyType,
  removeDiacritics,
  toGreek,
  toTransliteration,
  type IConversionOptions
} from "greek-conversion";
import { fetchEntries } from "../api";
import { LocalStorageKey } from "../enums";
import Icon from "./Icon";
import ResultsList from "./ResultsList";
import Spinner from "./Spinner";

export default function SearchBar() {
  const conversionOptions: IConversionOptions = {
    additionalChars: AdditionalChar.DIGAMMA,
    betaCodeStyle: {
      skipSanitization: true
    },
    greekStyle: {
      useBetaVariant: true
    },
    transliterationStyle: {
      useCxOverMacron: true
    },
    removeDiacritics: true,
    removeExtraWhitespace: true
  };

  let input!: HTMLInputElement;

  const [inputValue, setInputValue] = createSignal("");
  const [skipLemmatization, setSkipLemmatization] = createSignal(false);
  const [inputMode, setInputMode] = createSignal<string | null>(null);
  const [resultsOpen, setResultsOpen] = createSignal(false);
  const [preventOpeningResults, setPreventOpeningResults] = createSignal(false);

  /**
   * Defines a function that creates a signal used for scheduling execution
   * of solid computations by tracking.
   * @see {@link https://www.npmjs.com/package/@solid-primitives/scheduled#createscheduled}
   */
  const scheduled = createScheduled((fn) =>
    debounce(fn, import.meta.env.PUBLIC_SEARCH_DEBOUNCE_TIME)
  );

  /**
   * Fetches entries every time:
   *   1. the fetcher isn't prevented to fetch;
   *   1. the input value has been updated and isn't empty;
   *   2. the scheduled execution is ready.
   */
  const [entries, { mutate, refetch }] = createResource(
    () => (inputValue() && scheduled() ? inputValue() : false),
    () => {
      if (!preventOpeningResults()) showResults();
      else setPreventOpeningResults(false);

      return fetchEntries(inputValue(), {
        fields: ["word", "uri", "excerpt"],
        skipMorpheus: skipLemmatization()
      });
    },
    {
      initialValue: undefined
    }
  );

  onMount(() => {
    const lsSkipLemmatization: boolean =
      localStorage.getItem(LocalStorageKey.SearchSkipLemmatization) === "true";
    const lsInputMode = localStorage.getItem(LocalStorageKey.SearchInputMode);

    setSkipLemmatization(lsSkipLemmatization);
    setInputMode(lsInputMode);

    window.addEventListener("storage", () => {
      const lsSkipLemmatization: boolean =
        localStorage.getItem(LocalStorageKey.SearchSkipLemmatization) ===
        "true";
      const lsInputMode = localStorage.getItem(LocalStorageKey.SearchInputMode);

      const lastSkipLemmatizationValue: boolean = skipLemmatization();
      const lastInputMode: string | null = inputMode();

      setSkipLemmatization(lsSkipLemmatization);
      setInputMode(lsInputMode);

      if (inputMode() !== lastInputMode) {
        setPreventOpeningResults(true);
        const newValue =
          inputMode() === "transliteration"
            ? toTransliteration(input.value, KeyType.GREEK, conversionOptions)
            : toGreek(input.value, KeyType.TRANSLITERATION, conversionOptions);

        setInputValue(newValue);
      }

      if (skipLemmatization() !== lastSkipLemmatizationValue) {
        setPreventOpeningResults(true);
        refetch();
      }
    });
  });

  const clearSearch = (): void => {
    setInputValue("");
    mutate(undefined);
  };

  /**
   * Handles input behavior. Source value is assumed to be simplified beta code.
   * @fixme when upgrading to greek-conversion@0.15.0, change KeyType
   * parameter to `KeyType.SIMPLE_BETA_CODE`.
   */
  const handleInput = (): void => {
    if (!input.value) return clearSearch();

    if (inputMode() === "transliteration") {
      return void setInputValue(input.value);
    }

    // Convert input to greek. Note that all characters except the last one
    // entered have already been converted to Greek.

    // @fixme: `greek-conversion` should implement a character exclusion list.
    const unaccentedGreekStr = toGreek(
      input.value.replace(/\?/g, "§"),
      KeyType.BETA_CODE,
      conversionOptions
    ).replace(/§/g, "?");

    const selection = {
      start: input.selectionStart,
      end: input.selectionEnd
    };

    if (!["^", '"'].includes(unaccentedGreekStr)) {
      setInputValue(unaccentedGreekStr);
    }

    input.selectionEnd = selection.start;
  };

  const handleKeyDown: JSX.EventHandler<HTMLInputElement, KeyboardEvent> = (
    event
  ) => {
    switch (event.key) {
      case "Enter":
        // Blurs the search field when enter key is pressed. This is particularly
        // useful for closing virtual keyboards under iOS/Android.
        input.blur();
        break;
      case "Escape":
        // Blurs the search field and hide search results.
        input.blur();
        setResultsOpen(false);
        break;
    }
  };

  /**
   * Updates an input value assumed to be passed by the `onDrop` or the `onPaste` handler.
   * @param greekStr A greek string.
   */
  const onDropOrPaste = (greekStr: string = ""): void => {
    const unaccentedGreekStr = removeDiacritics(greekStr, KeyType.GREEK);
    setInputValue(unaccentedGreekStr.trim());
    input.focus();
  };

  /**
   * Handles drop behavior. Source value is assumed to be Greek.
   */
  const handleDrop: JSX.EventHandler<HTMLInputElement, DragEvent> = (event) => {
    if (inputMode() === "transliteration") return;

    event.preventDefault();
    onDropOrPaste(event.dataTransfer?.getData("text"));
  };

  /**
   * Handles paste behavior. Source value is assumed to be Greek.
   */
  const handlePaste: JSX.EventHandler<HTMLInputElement, ClipboardEvent> = (
    event
  ) => {
    if (inputMode() === "transliteration") return;

    event.preventDefault();
    onDropOrPaste(event.clipboardData?.getData("text"));
  };

  const showResults = (): void => {
    const appHeader = document.getElementById("app-header");
    const resultsList = document.getElementById("search-results-list");

    if (resultsList) resultsList.scrollTop = 0;
    document.body.classList.add("noscroll");
    setResultsOpen(true);

    appHeader?.addEventListener("click", (event: any) => {
      const t = event.target;
      if (input !== t && !resultsList?.contains(t)) {
        document.body.classList.remove("noscroll");
        setResultsOpen(false);
      }
    });
  };

  return (
    <>
      <div class="relative flex h-full items-center">
        <div
          class="absolute left-1.5 h-12 content-center p-1.5 text-neutral-500 md:h-auto dark:text-neutral-400"
          classList={{
            "cursor-pointer hover:text-neutral-600 dark:hover:text-neutral-300":
              Boolean(resultsOpen() || inputValue())
          }}
          onClick={clearSearch}
        >
          <Show
            when={resultsOpen() || inputValue()}
            fallback={<Icon name="MagnifyingGlass" />}
          >
            <Icon name="XCircle" />
          </Show>
        </div>

        <input
          ref={input}
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          spellcheck={false}
          enterkeyhint="done"
          placeholder={
            inputMode() === "transliteration" ? "anazêteô…" : "ἀναζητέω…"
          }
          value={inputValue()}
          type="search"
          class="h-full w-full appearance-none rounded-none bg-white p-3 pl-12 pr-36 shadow-secondary-900/10 !-outline-offset-2 transition-shadow duration-200 ease-in-out placeholder:text-neutral-500 focus:shadow-lg dark:bg-neutral-800 dark:shadow-neutral-950 dark:placeholder:text-neutral-400"
          onDrop={handleDrop}
          onFocus={showResults}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />

        <aside class="absolute right-4 z-20 flex items-center space-x-3 font-medium">
          <Switch>
            <Match when={entries.loading}>
              <Spinner delay={150} />
            </Match>
            <Match when={entries.error}>
              <span class="text-red-500 dark:text-red-400">Erreur</span>
            </Match>
          </Switch>

          <Show when={inputValue()}>
            <Suspense>
              <Show when={entries.latest}>
                <span class="rounded-lg bg-primary-600 px-2 text-white md:px-1.5 md:py-1 dark:bg-primary-700 dark:text-primary-100">
                  {entries.latest?.countAll === 0
                    ? "Aucun résultat"
                    : entries.latest?.countAll}
                </span>
              </Show>
            </Suspense>
          </Show>
        </aside>
      </div>

      <div
        class={`fixed inset-x-0 top-24 grid h-dvh grid-cols-12 pb-24 transition duration-300 ease-in-out md:top-16 md:px-[calc(theme(spacing.3)+env(safe-area-inset-left))] md:pb-16 lg:px-[calc(theme(spacing.6)+env(safe-area-inset-left))] ${
          resultsOpen()
            ? "visible bg-secondary-900/10 opacity-100 backdrop-blur-sm dark:bg-neutral-900/10"
            : "invisible opacity-0"
        }`}
        onClick={(event) =>
          event.currentTarget === event.target ? setResultsOpen(false) : null
        }
      >
        <Suspense>
          <ResultsList
            id="search-results-list"
            class={`${resultsOpen() ? "visible opacity-100" : "invisible opacity-0"} col-span-full w-full overflow-y-auto md:col-span-8 md:col-start-3 md:h-min md:max-h-[85vh] md:max-w-[calc(theme(screens.sm)+theme(spacing.12))] md:justify-self-center xl:col-span-6 xl:col-start-3`}
            entries={entries}
            searchValue={inputValue()}
            setResultsOpen={setResultsOpen}
          />
        </Suspense>
      </div>
    </>
  );
}
