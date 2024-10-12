import { AdditionalChar, KeyType, toGreek } from "greek-conversion";

export type NonEmptyArray<T> = [T, ...T[]];

export type Optional<T, K extends keyof T> = { [P in K]?: T[K] };

export type PartialExcept<T, K extends keyof T> = Pick<T, K> &
  Partial<Omit<T, K>>;

export type ApiParams<K extends keyof QueryableFields> = {
  fields: (keyof Pick<QueryableFields, K>)[];
  caseSensitive?: boolean;
  lengthRange?: [number, number?];
  limit?: number;
  offset?: number;
  siblings?: boolean;
};

type ApiEndpointParams<K extends keyof QueryableFields> =
  | ApiEntryParams<K>
  | ApiLookupParams<K>
  | ApiRandomEntryParams<K>;

type ApiEntryParams<K extends keyof QueryableFields> = Pick<
  ApiParams<K>,
  "fields" | "siblings"
>;
type ApiLookupParams<K extends keyof QueryableFields> = Pick<
  ApiParams<K>,
  "fields" | "caseSensitive" | "limit"
>;
type ApiRandomEntryParams<K extends keyof QueryableFields> = Pick<
  ApiParams<K>,
  "fields" | "lengthRange"
>;

type ApiResponse = {
  version: string;
};

type ApiEndpointResponse<K extends keyof QueryableFields> =
  | ApiEntryResponse<K>
  | ApiRandomEntryResponse<K>
  | ApiLookupResponse<K>;

type ApiWrappedResponse<
  T extends ApiEndpointResponse<K>,
  K extends keyof QueryableFields = never
> = { data: T };

export interface ApiEntryResponse<K extends keyof QueryableFields>
  extends ApiResponse {
  entry: Pick<Entry<K>, K | "children">;
  siblings: Siblings<K>;
}

export interface ApiRandomEntryResponse<K extends keyof QueryableFields>
  extends ApiResponse {
  length: number;
  entry: Pick<Entry<K>, K | "children">;
}

export interface ApiLookupResponse<K extends keyof QueryableFields>
  extends ApiResponse {
  count: number;
  countAll: number;
  lemmata: MorpheusData;
  entries: Pick<Entry<K>, K | "children" | "isExact" | "isMorpheus">[];
}

export type Entry<K extends keyof Entry = never> = {
  word: string;
  uri: string;
  htmlDefinition: string;
  definition: string;
  htmlExcerpt: string;
  excerpt: string;
  isExact: boolean;
  isMorpheus: boolean;
  children?: Pick<Entry, K>[];
};

export type QueryableFields = Pick<
  Entry,
  "word" | "uri" | "htmlDefinition" | "definition" | "htmlExcerpt" | "excerpt"
>;

export type Siblings<K extends keyof QueryableFields> = {
  previous?: Pick<Entry<K>, K>;
  next?: Pick<Entry<K>, K>;
};

export type EntryWithSiblings<K extends keyof QueryableFields> = {
  entry: Pick<Entry<K>, K>;
  siblings: Siblings<K>;
};

export type MorpheusData = {
  [lemma: string]: MorpheusDataItem[];
};

export type MorpheusDataItem = {
  workw: string;
  lem: string;
  prvb: string;
  aug1: string;
  stem: string;
  suff: string;
  end: string;
};

const formatApiParams = <K extends keyof QueryableFields>(
  params: ApiEndpointParams<K>
): string => {
  return Object.entries(params).reduce((acc, item) => {
    let [key, value] = item;

    if (!value) return acc;
    if (Array.isArray(value)) value = value.toString();

    return acc ? `${acc}&${key}=${value}` : `?${key}=${value}`;
  }, "");
};

const buildPath = (...parts: string[]): string => {
  return parts
    .filter((part) => part)
    .map((part) => part.replace(/^\/*|\/*$/g, ""))
    .join("/")
    .replace(/\/\?/, "?")
    .replace(/\/$/, "");
};

export const buildApiCall = <K extends keyof QueryableFields>(
  basePath: string,
  q: string,
  params: ApiEndpointParams<K> | null = null
): string => {
  return buildPath(
    import.meta.env.PUBLIC_API,
    basePath,
    encodeURIComponent(q),
    params ? formatApiParams(params) : ""
  );
};

export const fetchRandomEntry = async <K extends keyof QueryableFields>({
  fields,
  lengthRange
}: ApiRandomEntryParams<K>): Promise<ApiRandomEntryResponse<K>> => {
  const response = await fetch(
    buildApiCall("entry", "random", {
      fields: fields,
      lengthRange: lengthRange
    })
  );
  const json: ApiWrappedResponse<ApiRandomEntryResponse<K>> =
    await response.json();

  return {
    version: json.data.version,
    length: json.data.length,
    entry: json.data.entry
  };
};

export const fetchOneEntry = async <K extends keyof QueryableFields>(
  uri: string,
  { fields, siblings }: ApiEntryParams<K>
): Promise<ApiEntryResponse<K>> => {
  const response = await fetch(
    buildApiCall("entry", uri, {
      fields: fields,
      siblings: siblings
    })
  );
  const json: ApiWrappedResponse<ApiEntryResponse<K>> = await response.json();

  return {
    version: json.data.version,
    entry: json.data.entry ?? {},
    siblings: json.data.siblings ?? {}
  };
};

export const fetchEntries = async (
  /*<K extends keyof QueryableFields>*/ searchStr: string
  /*,{ fields, caseSensitive, limit }: ApiLookupParams<K>*/
): Promise<ApiLookupResponse<"word" | "uri" | "excerpt">> => {
  try {
    if (localStorage.getItem("searchInputMode") === "transliteration") {
      // @fixme: `greek-conversion` should implement a character exclusion list.
      searchStr = searchStr.replace(/\?/g, "§");

      searchStr = toGreek(searchStr, KeyType.TRANSLITERATION, {
        additionalChars: AdditionalChar.DIGAMMA,
        removeDiacritics: true,
        removeExtraWhitespace: true,
        transliterationStyle: {
          useCxOverMacron: true
        }
      }).replace(/§/g, "?");
    }
  } catch (error: unknown) {
    console.error(
      `Le mode de saisie n'a pas pu être déterminé.`,
      `<${error instanceof Error ? error.message : String(error)}>`
    );
  } finally {
    const response = await fetch(
      buildApiCall("lookup", encodeURI(searchStr), {
        fields: ["word", "uri", "excerpt"],
        limit: import.meta.env.PUBLIC_SEARCH_RESULTS_LENGTH
      })
    );
    const json: ApiWrappedResponse<
      ApiLookupResponse<"word" | "uri" | "excerpt">
    > = await response.json();

    return {
      version: json.data.version,
      count: json.data.count,
      countAll: json.data.countAll,
      lemmata: {}, // @fixme
      entries: json.data.entries.sort(
        (b, a) => Number(a.isExact) - Number(b.isExact)
      )
    };
  }
};