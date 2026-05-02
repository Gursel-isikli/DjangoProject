import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";
import toast from "react-hot-toast";
import { FaTwitter, FaInstagram, FaFacebookF} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    // validation
    if (form.password !== form.confirmPassword) {
      toast.error("Die Passwörter stimmen nicht überein");
      return;
    }

    const payload = {
      username: form.username,
      email: form.email,
      password: form.password,
    };

    try {
      const res = await registerUser(payload);

      if (!res.ok) {
        toast.error("Die Registrierung ist fehlgeschlagen.");
        return;
      }

      await res.json();

      // success toast
      toast.success("Konto erfolgreich erstellt");

     
      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (err) {
      console.log(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="register-wrapper">

  <div className="register-card">

    {/* LEFT */}
    <div className="left">
      <div className="left-content">
        <h2> <i className="bi bi-circle-square"></i> R&MMS</h2>
        <h1>Willkommen</h1>
        <p>Erstellen Sie Ihr Konto und starten Sie sofort.</p>
      </div>
    </div>

    {/* RIGHT */}
    <div className="right">
      <div className="form-box">

        

        <h2>Konto erstellen</h2>

        <input name="username" placeholder="Benutzername" onChange={handleChange}   className="custom-input" />
        <input name="email" placeholder="Email" type="email" onChange={handleChange} className="custom-input" />
        <input name="password" placeholder="Kennwort" type="password" onChange={handleChange}  className="custom-input" />
        <input name="confirmPassword" placeholder="Kennwort wiederholen" type="password" onChange={handleChange} className="custom-input" />

        <button className="btn-gradient" onClick={handleRegister}>Konto erstellen</button>

        <p className="login-link">
          Hast du schon ein Konto? <a href="/">Anmelden</a>
        </p>

      </div>
    </div>

  </div>

</div>
    
  );
}





   