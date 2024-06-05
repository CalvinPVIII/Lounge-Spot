import { Tab, Tabs } from "@mui/material";
import { ReactNode, useState } from "react";
import "../styles/ContentTabs.css";

interface ContentTabsProps {
  children: ReactNode[];
}

const ContentTabs: React.FC<ContentTabsProps> = ({ children }) => {
  const [value, setValue] = useState("1");

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs onChange={handleChange} value={value} centered>
        <Tab label="Queue" value="1" />
        <Tab label="Search" value="2" />
      </Tabs>
      {children.map((child, index) => (
        <div className={parseInt(value) - 1 === index ? "active-content" : "hidden-content"} key={index}>
          {child}
        </div>
      ))}
    </>
  );
};

export default ContentTabs;
