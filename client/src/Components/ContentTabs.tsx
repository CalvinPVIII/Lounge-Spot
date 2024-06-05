import { Tab, Tabs } from "@mui/material";
import { ReactNode, useState } from "react";

interface ContentTabsProps {
  children: ReactNode[];
}

const ContentTabs: React.FC<ContentTabsProps> = ({ children }) => {
  const [value, setValue] = useState("1");
  console.log(children);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      <Tabs onChange={handleChange} value={value} centered>
        <Tab label="Queue" value="1" />
        <Tab label="Search" value="2" />
      </Tabs>
      {children[parseInt(value) - 1]}
    </>
  );
};

export default ContentTabs;
