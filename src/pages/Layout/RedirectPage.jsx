import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function RedirectPage({ link }) {
  const { code, state } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    if (code && state) {
      console.log("code:", code);
      console.log("state:", state);

      navigate(link);
    }
  }, [code, state, navigate, link]);

  return;
}

export default RedirectPage;
