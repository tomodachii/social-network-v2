import React from "react";

type AvatarProps = {
  width?: number;
  height?: number;
  img?: any;
};

// TODO: current don't have avatar image so use background black for visualization
const Avatar = ({ width = 30, height = 30 }: AvatarProps) => {
  return (
    <div
      className={`rounded-full bg-black`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    ></div>
  );
};

export default Avatar;
