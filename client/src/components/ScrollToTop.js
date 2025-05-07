import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
  }, [pathname, search]);

  return null;
};

export const ScrollRestore = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const disableScrollRoutes = [
      "/", // Home
      "/login",
      "/register",
      "/unustasid-parooli",
    ];

    const isResetPasswordRoute = pathname.startsWith("/muuda-parool");

    if (disableScrollRoutes.includes(pathname) || isResetPasswordRoute) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [pathname]);

  return null;
};
