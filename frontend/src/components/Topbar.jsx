import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { getMe } from "../services/api";

export default function Topbar({
  setMobileOpen,
  setCollapsed,
}) {

  const navigate = useNavigate();
  

  const [userOpen, setUserOpen] =
    useState(false);

  const userRef = useRef(null);

 
  const [user, setUser] = useState({});
  
  
 useEffect(() => {
  loadUser();
}, []);

const loadUser = async () => {
  const data = await getMe();
  setUser(data);
};

  

  /* SIDEBAR TOGGLE */
  const handleToggle = () => {
    const isMobile =
      window.innerWidth < 992;

    if (isMobile) {
      setMobileOpen((prev) => !prev);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  /* LOGOUT */
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="topbar px-3 px-md-4 py-3 d-flex justify-content-between align-items-center">

      {/* LEFT */}
      <div className="d-flex align-items-center gap-3 flex-grow-1">

        {/* Menu */}
        <button
          className="btn btn-light border shadow-sm"
          onClick={handleToggle}
          type="button"
        >
          <i className="bi bi-list fs-5"></i>
        </button>
      </div>

      {/* RIGHT */}
      <div className="d-flex align-items-center gap-3">

        {/* USER MENU */}
        <div
          className="position-relative"
          ref={userRef}
        >

          <button
            className="btn btn-light border d-flex align-items-center gap-2 px-3"
            onClick={() =>
              setUserOpen(!userOpen)
            }
          >
            <div className="avatar-circle">
                {user.username?.charAt(0).toUpperCase()}
            </div>

            <span className="d-none d-md-inline">
              {user.username}
            </span>

            <i className="bi bi-chevron-down small"></i>
          </button>

          {/* DROPDOWN */}
          {userOpen && (
            <div className="user-dropdown shadow">

              <div className="user-dropdown-header">
                <strong>
                  {user.name}
                </strong>

                <small className="text-muted d-block">
                  {user.role}
                </small>
              </div>

              <hr className="my-2" />

              <button className="dropdown-item-custom">
                <i className="bi bi-person me-2"></i>
                My Profile
              </button>

              <button className="dropdown-item-custom">
                <i className="bi bi-gear me-2"></i>
                Settings
              </button>

              <button className="dropdown-item-custom">
                <i className="bi bi-credit-card me-2"></i>
                Billing
              </button>

              <hr className="my-2" />

              <button
                className="dropdown-item-custom text-danger"
                onClick={logout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}