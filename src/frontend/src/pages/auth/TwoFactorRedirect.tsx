import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TwoFactorRedirect() {
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    window.sessionStorage.setItem("id", id);
    navigate("/auth/2fa");
  }, []);

  return <></>;
}
