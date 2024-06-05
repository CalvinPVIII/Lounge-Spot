import { Tab, Tabs } from "@mui/material";
import { ReactNode, useState } from "react";
import "../styles/ContentTabs.css";

interface ContentTabsProps {
  children: ReactNode[];
  headers: string[];
}

const ContentTabs: React.FC<ContentTabsProps> = ({ children, headers }) => {
  const [value, setValue] = useState("1");

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs onChange={handleChange} value={value} centered>
        {headers.map((header, index) => (
          <Tab label={header} value={(index + 1).toString()} key={"header" + index} />
        ))}
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
