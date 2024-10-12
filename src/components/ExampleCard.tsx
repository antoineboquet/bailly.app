import Card from "./Card";
import TagToolbar from "./TagToolbar";

export default function ExampleCard() {
  return (
    <Card
      class="h-52 w-full flex-shrink [mask-image:linear-gradient(15deg,transparent_33%,#000_66%,#000_100%)] max-md:max-w-96 sm:w-3/4 md:max-w-lg"
      fakeContent={{ lines: 6 }}
      toolBar={TagToolbar({
        class:
          "pointer-events-none text-primary-400 border-primary-200 dark:text-primary-200 dark:border-primary-200/25",
        entry: { uri: "", word: "", excerpt: "" }
      })}
    />
  );
}
