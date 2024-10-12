import { For } from "solid-js";

type GreekMappingItem = {
  label: string;
  betaCode: string;
  greek: string;
  transliteration: string;
};

type GreekMapping = GreekMappingItem[];

export default function ConversionChart() {
  const mapping: GreekMapping = [
    {
      label: "Alpha",
      betaCode: "A",
      greek: "Α",
      transliteration: "A"
    },
    {
      label: "Beta",
      betaCode: "B",
      greek: "Β",
      transliteration: "B"
    },
    {
      label: "Gamma",
      betaCode: "G",
      greek: "Γ",
      transliteration: "G"
    },
    {
      label: "Delta",
      betaCode: "D",
      greek: "Δ",
      transliteration: "D"
    },
    {
      label: "Epsilon",
      betaCode: "E",
      greek: "Ε",
      transliteration: "E"
    },
    {
      label: "Zeta",
      betaCode: "Z",
      greek: "Ζ",
      transliteration: "Z"
    },
    {
      label: "Eta",
      betaCode: "H",
      greek: "Η",
      transliteration: "Ê"
    },
    {
      label: "Theta",
      betaCode: "Q",
      greek: "Θ",
      transliteration: "Th"
    },
    {
      label: "Iota",
      betaCode: "I",
      greek: "Ι",
      transliteration: "I"
    },
    {
      label: "Kappa",
      betaCode: "K",
      greek: "Κ",
      transliteration: "K"
    },
    {
      label: "Lambda",
      betaCode: "L",
      greek: "Λ",
      transliteration: "L"
    },
    {
      label: "Mu",
      betaCode: "M",
      greek: "Μ",
      transliteration: "M"
    },
    {
      label: "Nu",
      betaCode: "N",
      greek: "Ν",
      transliteration: "N"
    },
    {
      label: "Xi",
      betaCode: "C",
      greek: "Ξ",
      transliteration: "X"
    },
    {
      label: "Omicron",
      betaCode: "O",
      greek: "Ο",
      transliteration: "O"
    },
    {
      label: "Pi",
      betaCode: "P",
      greek: "Π",
      transliteration: "P"
    },
    {
      label: "Rho",
      betaCode: "R",
      greek: "Ρ",
      transliteration: "R"
    },
    {
      label: "Sigma",
      betaCode: "S",
      greek: "Σ",
      transliteration: "S"
    },
    {
      label: "Tau",
      betaCode: "T",
      greek: "Τ",
      transliteration: "T"
    },
    {
      label: "Upsilon",
      betaCode: "U",
      greek: "Υ",
      transliteration: "Y/U"
    },
    {
      label: "Phi",
      betaCode: "F",
      greek: "Φ",
      transliteration: "Ph"
    },
    {
      label: "Chi",
      betaCode: "X",
      greek: "Χ",
      transliteration: "Ch"
    },
    {
      label: "Psi",
      betaCode: "Y",
      greek: "Ψ",
      transliteration: "Ps"
    },
    {
      label: "Omega",
      betaCode: "W",
      greek: "Ω",
      transliteration: "Ô"
    }
  ];

  return (
    <div class="space-y-3">
      <table class="w-full table-fixed text-center sm:max-w-screen-sm">
        <thead>
          <tr>
            <th class="overflow-hidden text-ellipsis text-center" scope="col">
              Beta code
            </th>
            <th class="overflow-hidden text-ellipsis text-center" scope="col">
              Grec
            </th>
            <th class="overflow-hidden text-ellipsis text-center" scope="col">
              Translittération
            </th>
          </tr>
        </thead>
        <tbody>
          <For each={mapping}>
            {(char) => (
              <tr class="odd:bg-neutral-50 dark:odd:bg-neutral-700/50">
                <td>
                  {char.betaCode}
                  <span class="text-neutral-500 dark:text-neutral-400">
                    , {char.betaCode.toLowerCase()}
                  </span>
                </td>
                <th scope="row">
                  {char.greek}
                  <span class="text-neutral-500 dark:text-neutral-400">
                    , {char.greek.toLowerCase()}
                  </span>
                </th>
                <td>
                  {char.transliteration}
                  <span class="text-neutral-500 dark:text-neutral-400">
                    , {char.transliteration.toLowerCase()}
                  </span>
                </td>
              </tr>
            )}
          </For>
        </tbody>
      </table>

      <div class="rounded-lg bg-secondary-50 p-3 leading-tight text-secondary-900 dark:bg-neutral-900 dark:text-secondary-400">
        <table class="w-full table-fixed text-center sm:max-w-screen-sm">
          <caption class="my-3">
            <span class="rounded-lg border-2 border-current px-3 py-1.5 font-semibold">
              Exemples
            </span>
          </caption>
          <thead>
            <tr>
              <th class="overflow-hidden text-ellipsis text-center" scope="col">
                Beta code
              </th>
              <th class="overflow-hidden text-ellipsis text-center" scope="col">
                Grec
              </th>
              <th class="overflow-hidden text-ellipsis text-center" scope="col">
                Translittération
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-secondary-100 dark:bg-neutral-700/50">
              <td>anqrwpos</td>
              <th scope="row">ανθρωπος</th>
              <td>anthrôpos</td>
            </tr>
            <tr>
              <td>cifos</td>
              <th scope="row">ξιφος</th>
              <td>xiphos</td>
            </tr>
            <tr class="bg-secondary-100 dark:bg-neutral-700/50">
              <td>yuxh</td>
              <th scope="row">ψυχη</th>
              <td>psuchê</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
