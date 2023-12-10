import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookBookmark, faGlobe, faHome } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-regular-svg-icons";

import styles from "./layout.module.scss";

import BookChatLogo from "@/assets/logo.png";
import SearchInput from "@/components/search-input";
import Avatar from "@/components/avatar";

// TODO
const Header = () => {
  return (
    <div
      className="h-[64px] w-full flex items-center px-8 py-4 gap-4"
      style={{
        boxShadow: "0px 2px 10px 0px rgba(0, 0, 0, 0.05)",
      }}
    >
      <img src={BookChatLogo} alt="BookChatLogo" className="cursor-pointer" />
      <div className="flex flex-1 items-center gap-4">
        <SearchInput />
        <div className="flex items-center cursor-pointer">
          <FontAwesomeIcon icon={faHome} width={24} height={24} className={styles["svg-header"]} />
          <FontAwesomeIcon icon={faGlobe} width={24} height={24} className={styles["svg-header"]} />
          <FontAwesomeIcon icon={faBookBookmark} width={24} height={24} className={styles["svg-header"]} />
          <FontAwesomeIcon icon={faBell} width={24} height={24} className={styles["svg-header"]} />
        </div>
      </div>
      <div className="flex items-center cursor-pointer gap-4 justify-items-end">
        <FontAwesomeIcon icon={faMessage} width={24} height={24} />
        {/* TODO: add props to Avatar components */}
        <Avatar />
      </div>
    </div>
  );
};

export default Header;
