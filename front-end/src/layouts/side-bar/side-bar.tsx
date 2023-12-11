import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { sidebarItems } from "./side-bar.constant";

import Avatar from "@/components/avatar";

// TODO: navigation, active
const SideBar = () => {
  return (
    <div className="p-8 flex flex-col gap-4 w-[200px]">
      <div className="flex gap-4 items-center cursor-pointer">
        <Avatar width={40} height={40} />
        <div className="font-bold text-[#141414] text-sm">Profile</div>
      </div>
      {sidebarItems.map((sidebarItem) => {
        return (
          <div className="flex gap-4 items-center cursor-pointer">
            <div className="w-[40px] h-[40px] flex items-center">
              <FontAwesomeIcon icon={sidebarItem.icon} className="text-[32px]" color={sidebarItem.iconColor} />
            </div>
            <div className="font-semibold text-[#141414] text-sm">{sidebarItem.title}</div>
          </div>
        );
      })}
    </div>
  );
};

export default SideBar;
