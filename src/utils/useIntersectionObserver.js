import { useEffect } from "react";

const useIntersectionObserver = (setIsVisible, option) => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
            }
        });
    }, option);

    useEffect(() => {
        const target = document.querySelector('#intro-section');
        if (target) {
            observer.observe(target);
        }
        return () => {
            if (target) {
                observer.unobserve(target);
            }
        };
    }, []);
}

export default useIntersectionObserver;