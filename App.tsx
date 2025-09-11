import React, { useEffect, useState } from "react";
import AdminView from "./components/AdminView";
import RespondentView from "./components/RespondentView";

function getRoute(): "respondent" | "admin" {
  const h = window.location.hash || "";
  if (h.startsWith("#/respondent") || h.includes("submissionId=")) return "respondent";
  return "admin";
}

export default function App() {
  const [route, setRoute] = useState<"respondent" | "admin">(getRoute());

  useEffect(() => {
    const onChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", onChange);
    window.addEventListener("popstate", onChange);
    return () => {
      window.removeEventListener("hashchange", onChange);
      window.removeEventListener("popstate", onChange);
    };
  }, []);

  return route === "respondent" ? <RespondentView /> : <AdminView />;
}
