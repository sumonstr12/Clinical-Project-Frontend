import { Outlet } from "react-router";
import { useEffect } from "react";

export default function UserLayout() {

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/src/assets/css/global_app.css";

    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return <Outlet />;
}