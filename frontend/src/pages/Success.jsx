import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Success.css";

export default function Success({ message = "Success!" }) {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/dashboard"); 
    }, 2000);
  }, []);

  return (
    <div className="success-page">
      <div className="success-box">
        <div className="check">✓</div>
        <h2>{message}</h2>
        <p>You are being redirected...</p>
      </div>
    </div>
  );
}