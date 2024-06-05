import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#487efa",
    },
    secondary: {
      main: "#ffffff",
    },
    background: {
      default: "#0D0D12",
    },
  },
  typography: {
    fontFamily: "Montserrat",
    h1: {
      fontFamily: "Montserrat",
    },
  },
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </>
);
