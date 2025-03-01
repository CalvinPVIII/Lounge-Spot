import { Tab, Tabs } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import "../styles/ContentTabs.css";
import { useMediaQuery } from "react-responsive";

interface ContentTabsProps {
  children: ReactNode[];
  headers: string[];
}

const ContentTabs: React.FC<ContentTabsProps> = ({ children, headers }) => {
  const [value, setValue] = useState("1");
  const isBigScreen = useMediaQuery({ query: "(min-width: 950px)" });

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    children.length < parseInt(value) ? setValue("1") : null;
  }, [children]);

  return (
    <div className={isBigScreen ? "" : "content-tabs-wrapper-small"}>
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
    </div>
  );
};

export default ContentTabs;
