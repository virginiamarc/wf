export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("wfUser");
    localStorage.removeItem("wfCart");

    window.location.replace("index.html");
}

export function getToken() {
    return localStorage.getItem("token");
}

export function requireAuthRedirect() {
    const token = getToken();

    if (!token) {
        window.location.replace("index.html");
    }
}