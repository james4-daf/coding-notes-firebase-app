import { useState, useEffect } from "react";

export function useDeviceType() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkDevice = () => {
            const mobileScreen = window.innerWidth <= 720; // Adjust if needed
            const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
            setIsMobile(mobileScreen || hasTouch);
        };

        checkDevice();
        window.addEventListener("resize", checkDevice);
        return () => window.removeEventListener("resize", checkDevice);
    }, []);

    return isMobile;
}