import Icon from "./Icon";
import { createSignal, type JSX } from "solid-js";
import ModalLink from "./ModalLink";

export default function SupportToolbar() {
  const encodedEmail = import.meta.env.PUBLIC_CONTACT_EMAIL_ENCODED;
  const [decodedEmail, setDecodedEmail] = createSignal("");

  const handleContact: JSX.EventHandler<HTMLElement, MouseEvent> = () => {
    setDecodedEmail(atob(encodedEmail));
  };

  return (
    <span
      data-toolbar
      class="relative -right-1 -top-1 z-40 float-right inline-flex cursor-pointer rounded-lg border border-neutral-200 bg-white font-sans text-neutral-400 transition hover:border-neutral-300 hover:shadow-md lg:-right-2 lg:-top-2 dark:border-neutral-600 dark:bg-neutral-800 dark:shadow-neutral-950 dark:hover:border-neutral-500"
    >
      <ModalLink
        label={
          <span class="flex p-1.5 outline-none transition hover:text-neutral-500 dark:hover:text-neutral-200">
            <Icon name="Envelope" />
          </span>
        }
        modalHtmlAttributes={{ "data-toolbar": "" }}
        modalIcon="Envelope"
        modalTitle="Contact"
        modalContent={
          <div class="space-y-3 text-center">
            <p>
              Vous pouvez nous joindre par courriel à l'adresse suivante&nbsp;:
            </p>
            <p class="rounded-lg bg-secondary-50 p-3 font-semibold text-secondary-900 dark:bg-neutral-900 dark:text-secondary-400">
              {decodedEmail()}
            </p>
          </div>
        }
        onClick={handleContact}
      />
      
      <a
        class="flex p-1.5 transition hover:text-neutral-500 dark:hover:text-neutral-200"
        href="https://www.paypal.com/donate/?hosted_button_id=HFBZZVKRBE7HY"
      >
        <Icon name="Star" />
      </a>
    </span>
  );
}
