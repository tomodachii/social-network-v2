import type { FC } from "react";

// TODO: add 404 image
import Error404Image from "@/assets/images/404.svg";
import ErrorContainer from "@/pages/errors/private/error-container";

const Error404: FC = () => {
  return (
    <ErrorContainer
      srcImage={Error404Image}
      alt={"Site not found"}
      title={"Site not found"}
      subTitle={"Well, this is awkward. The site you're looking for is not here."}
    />
  );
};

export default Error404;
