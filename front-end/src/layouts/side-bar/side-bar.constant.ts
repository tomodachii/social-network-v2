import type { IconDefinition } from "@fortawesome/free-regular-svg-icons";
import { faBook, faBookmark, faCalendar, faUserGroup, faUsers } from "@fortawesome/free-solid-svg-icons";

export interface ItemBase {
  id?: number;
  icon: IconDefinition;
  title: string;
  iconColor?: string;
  href: string;
}

export interface ItemType extends ItemBase {
  children?: ItemType[];
}

export const sidebarItems: ItemType[] = [
  {
    id: 2,
    title: "Friends ",
    icon: faUserGroup,
    href: "/",
    iconColor: "#5BCDF6",
  },
  {
    id: 3,
    title: "Groups",
    icon: faUsers,
    href: "/",
    iconColor: "#5BCDF6",
  },
  {
    id: 4,
    title: "Event",
    icon: faCalendar,
    href: "/",
    iconColor: "#5BCDF6",
  },
  {
    id: 5,
    title: "Libraries",
    icon: faBookmark,
    href: "/",
    iconColor: "#FFE536",
  },
  {
    id: 6,
    title: "My books",
    icon: faBook,
    href: "/",
    iconColor: "#FFE536",
  },
];
