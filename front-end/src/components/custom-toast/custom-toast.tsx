import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import clsx from "clsx";
import { ToastIcon } from "react-toastify/dist/types";
import { CSSProperties, ReactNode } from "react";

import styles from "./custom-toast.module.scss";

// import warningIcon from "@/assets/images/warning-icon.svg";

// TODO: fix this
export const warningIconImg = () => {
  return <div></div>;
  // return <img src={warningIcon} alt="" />;
};

// prevent toast duplicate
const toastId = "custom-id";

export const notify = (
  content: string | ReactNode,
  type: "success" | "error" | "warn",
  autoClose: number | false = 5000,
  icon?: ToastIcon,
  customStyle?: CSSProperties
) => {
  toast(content, {
    toastId: toastId,
    autoClose: autoClose,
    icon: icon,
    className: clsx([styles["toast-msg"], styles[type]]),
    bodyClassName: clsx([styles["toast-body"]]),
    style: customStyle,
  });
};

const CloseButton = ({ closeToast }) => (
  <div className={styles["close-button"]} onClick={closeToast}>
    <FontAwesomeIcon icon={faXmark} />
  </div>
);

const CustomToast = () => {
  return (
    <ToastContainer
      position="top-right"
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      closeButton={CloseButton}
    />
  );
};

export default CustomToast;
