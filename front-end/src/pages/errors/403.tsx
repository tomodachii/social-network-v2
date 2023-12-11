import type { FC } from "react";

import ErrorContainer from "@/pages/errors/private/error-container";
// TODO: add 403 Image
import Error403Image from "@/assets/images/403.svg";

const Error403: FC = () => {
  return (
    <ErrorContainer
      srcImage={Error403Image}
      alt={"You don't have permission"}
      title={"You don't have permission"}
      subTitle={"Oops! You don't have permission to access."}
    />
  );
};

export default Error403;
