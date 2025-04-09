import {useTheme} from "next-themes";
import {Toaster} from "sonner";

export const ThemedToaster = () => {
    const { theme } = useTheme();
    return <Toaster
        position="bottom-right"
        theme={theme === "dark" ? "dark" : "light"}
        toastOptions={{
            className: theme === "dark" ? "dark-toast" : "light-toast",
        }}
    />;
};