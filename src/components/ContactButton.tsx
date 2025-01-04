import { createSignal, type JSX } from "solid-js";
import ModalLink from "./ModalLink";

export default function ContactButton() {
  const encodedEmail = import.meta.env.PUBLIC_CONTACT_EMAIL_ENCODED;
  const [decodedEmail, setDecodedEmail] = createSignal("");

  const handleContact: JSX.EventHandler<HTMLElement, MouseEvent> = () => {
    setDecodedEmail(atob(encodedEmail));
  };

  return (
    <ModalLink
      type="button"
      class="!bg-slate-100 dark:!bg-slate-600 hover:!bg-slate-200 dark:hover:!bg-slate-500 !text-slate-600 dark:!text-white" 
      label="Contacter"
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
  );
}
