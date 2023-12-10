import { HTMLAttributes, type FC, type PropsWithChildren } from "react";

const CustomErrorMessage: FC<PropsWithChildren<HTMLAttributes<HTMLSpanElement>>> = ({ children, ...props }) => {
  return (
    <div>
      {children ? (
        <span className="text-xs font-medium" {...props} style={{ color: "red" }}>
          {children}
        </span>
      ) : null}
    </div>
  );
};

export default CustomErrorMessage;
