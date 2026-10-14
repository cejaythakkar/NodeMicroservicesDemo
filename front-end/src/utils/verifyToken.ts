export function verifyToken(token: string): boolean {
    try {
        const tokenParts = token.split(".");

        if (tokenParts.length !== 3) {
            return true;
        }

        const payload = JSON.parse(atob(tokenParts[1]));
        console.log(payload);
        if (!payload.exp) {
            return true;
        }

        const expiryTime = payload.exp * 1000;

        return Date.now() >= expiryTime;
    } catch {
        return true;
    }
}
