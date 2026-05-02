import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import '../styles/Login.css';
import { Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { FaTwitter, FaInstagram, FaFacebookF} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";


export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const res = await loginUser(form);
    const data = await res.json();

    if (data.access) {
      localStorage.setItem("token", data.access);
     navigate("/dashboard");
    } else {
      toast.success("Benutzername oder Kennwort ist falsch !",{
     style: {
             background: "green",
             color: "white",
            },
     });
    
    }

    
  };


  return (

<div className="login-wrapper">

      <div className="login-card">

        {/* LEFT */}
        <div className="left">
          <div className="left-content">
            <h2> <i className="bi bi-circle-square"></i> R&MMS</h2>
            <h1>Willkommen zurück</h1>
            <p>Verwalten Sie Ihre Rechnungen effizient und ohne Aufwand.</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right">
          <div className="form-box">

            
       
            <h2>Anmelden</h2>

            <input name="username" placeholder="Benutzername" onChange={handleChange} className="custom-input" />
            <input name="password" type="password"  placeholder="Kenntwort" onChange={handleChange} className="custom-input"/>

            <button className="btn-gradient" onClick={handleLogin}>Anmelden</button>

            <p className="login-link">
              Sie haben noch kein Konto?<a href="/register">Registrieren</a>
            </p>

                   

          </div>
        </div>

      </div>
    </div>
  
    
  );
}


 




 