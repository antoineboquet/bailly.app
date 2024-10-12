import { For } from "solid-js";

type Document = {
  label: string;
  href: string;
};

type Documents = Document[];

export default function DocumentsList() {
  const setFilePath = (file: string): string => `/documents/${file}`;
  const documents: Documents = [
    {
      label: "Préface d'Anatole Bailly",
      href: setFilePath("préface-anatole-bailly.pdf")
    },
    {
      label: "Notice du Bailly 2020 Hugo Chávez",
      href: setFilePath("/notice-édition-2020.pdf")
    },
    {
      label: "Liste des auteurs et des ouvrages",
      href: setFilePath("/liste-auteurs-ouvrages.pdf")
    },
    {
      label: "Abréviations et signes usuels",
      href: setFilePath("/abréviations-signes-usuels.pdf")
    },
    {
      label: "Table des mesures",
      href: setFilePath("/mesures.pdf")
    }
  ];

  return (
    <ul class="select-none space-y-1.5 outline-none md:space-y-3">
      <For each={documents}>
        {(document) => (
          <li class="contents">
            <a
              target="_blank"
              rel="noopener"
              href={document.href}
              class="relative flex w-full items-center justify-center text-nowrap rounded-lg p-3 font-medium transition duration-75 hover:bg-secondary-100 dark:hover:bg-neutral-700"
            >
              <span class="-ml-3">{document.label}</span>
            </a>
          </li>
        )}
      </For>
    </ul>
  );
}
