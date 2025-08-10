import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // Or 'dark'

  const themeColors = {
    light: {
      primary: "#007bff",
      background: "#f8f9fa",
      text: "#212529",
    },
    dark: {
      primary: "#6c757d",
      background: "#343a40",
      text: "#f8f9fa",
    },
  };

  const currentTheme = themeColors[theme];

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
