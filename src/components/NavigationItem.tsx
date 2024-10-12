import Icon, { type IconName } from "./Icon";

interface Props {
  isActive: boolean;
  ariaLabel: string;
  icon: IconName;
  href: string;
  name: string;
}

export default function NavigationItem(props: Props) {
  return (
    <a
      aria-label={props.ariaLabel}
      href={props.href}
      class={`flex items-center transition duration-100 ease-in-out max-xl:h-full xl:flex-col ${
        props.isActive
          ? "text-primary-700 hover:text-primary-700 focus:text-primary-700 dark:text-primary-500 dark:hover:text-primary-500 dark:focus:text-primary-500"
          : "hover:text-primary-700 focus:text-primary-700 dark:hover:text-primary-500 dark:focus:text-primary-500"
      }`}
    >
      <span>
        <Icon name={props.icon} />
      </span>
      <span class="max-xl:hidden">{props.name}</span>
    </a>
  );
}
