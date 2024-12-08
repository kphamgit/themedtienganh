import { useEffect, useState } from "react";
import { ThemeContext } from "../contexts/theme_context";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [darkTheme, setDarkTheme] = useState<boolean>(false);

    const toggleTheme = () => {
        setDarkTheme((curr) => !curr);
    };

    //enable dark mode by default
    useEffect(() => {
        if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            setDarkTheme(true);
        }
    }, []);

    useEffect(() => {
        document.body.className = darkTheme ? "theme-dark" : "theme-light";
    }, [darkTheme]);


    return (
        <ThemeContext.Provider value={{ darkTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
