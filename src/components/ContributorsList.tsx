import { For } from "solid-js";

export default function ContributorsList() {
  const contributors: string[] = [
    "José Antonio Artés",
    "Anne Bargibant",
    "Jérôme Bastick",
    "Adrienne Bernardi",
    "Adrien Bresson",
    "Jean Pierre Brèthes",
    "Hélène Chaillot",
    "Isabelle Chouinard",
    "Marine Chovin",
    "Florent Cistac",
    "Guillaume Crocquevieille",
    "Élisa Cuvillier",
    "Alexia Dedieu",
    "Blandine Demotz",
    "Aurélien Dollard",
    "Thomas Frétard",
    "Yvon Gicquel",
    "Stéphanie Groulard",
    "Stéphane Itic",
    "Laurence Jénoc",
    "Annick Judas",
    "Franck Kempf",
    "Charlotte Labro",
    "Xavier Lafontaine",
    "Sylvie Launay",
    "Isabelle Le Bris-Leleux",
    "Annabelle Maniez",
    "Jean-Baptiste Navlet",
    "Joseph Ozelz Owono",
    "Émilie Picard",
    "Jérémie Pinguet",
    "Lucas Rascle",
    "Benjamin Sevestre",
    "Bernard Simon",
    "Marie-Dominique Simon",
    "Anne-Laure Viger",
    "Christine Vulliard"
  ];

  return (
    <ul class="space-y-3 text-center font-semibold">
      <For each={contributors}>{(contributor) => <li>{contributor}</li>}</For>
    </ul>
  );
}
