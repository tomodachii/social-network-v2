import React from "react";

interface TitleBarProps {
  label: string;
  icon: any;
}

const TitleBar: React.FC<TitleBarProps> = ({ label, icon }) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <img src={icon} alt="Title bar icon" />
      <span style={{ marginLeft: "16px", fontSize: "16px", fontWeight: 700, lineHeight: "24px" }}>{label}</span>
    </div>
  );
};

export default TitleBar;
