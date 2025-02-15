export const checkInternetConnection = async () => {
    try {
        const response = await fetch("https://www.google.com", { mode: "no-cors" });
        return true; // If the request doesn't throw an error, internet is available
    } catch (error) {
        return false; // If request fails, no internet
    }
};
