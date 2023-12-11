import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import styles from "./search-input.module.scss";

type Props = {};

const SearchInput = (props: Props) => {
  return (
    <div className="min-w-[250px] h-[40px] rounded-2xl bg-[#F9F9F9] flex items-center py-2 px-4 gap-4 border-[1px] border-solid border-[#ccc]">
      <FontAwesomeIcon icon={faSearch} width={24} height={24} />
      <input placeholder="Search in BookChat" type="text" className={styles.input} />
    </div>
  );
};

export default SearchInput;
