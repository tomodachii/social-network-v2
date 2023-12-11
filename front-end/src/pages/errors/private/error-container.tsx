// import Typography from "@comfortdelgro/react-compass/typography";
// import Button from "@comfortdelgro/react-compass/button";
import { Link } from "react-router-dom";

export interface ErrorContainerProps {
  srcImage?: string;
  alt?: string;
  title: string;
  subTitle: string;
}

const ErrorContainer = ({ srcImage, alt, title, subTitle }: ErrorContainerProps) => {
  return (
    <div className="flex align-middle justify-center h-full">
      <div className="flex flex-wrap content-center items-center justify-center">
        {srcImage && <img className="block mb-6" src={srcImage} alt={alt} />}
        {/* <Typography.Header
          css={{ textAlign: "center", lineHeight: "2.625rem", marginBottom: "1.5rem" }}
          variant="header2"
        >
          {title}
        </Typography.Header>
        <Typography.Body css={{ textAlign: "center", lineHeight: "1.313rem", marginBottom: "1.5rem" }} variant="body3">
          {subTitle}
        </Typography.Body> */}
        <Link to="/" className="flex">
          {/* <Button variant="primary">Back to home</Button> */}
        </Link>
      </div>
    </div>
  );
};
export default ErrorContainer;
