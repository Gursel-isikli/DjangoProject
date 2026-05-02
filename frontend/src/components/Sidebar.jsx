import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe } from "../services/api";

export default function Sidebar({ mobileOpen, setMobileOpen, collapsed,}){

  const location = useLocation();
  const [user, setUser] = useState({});


  useEffect(() => {
    loadUser();
  }, []);

const loadUser = async () => {
  const data = await getMe();
  setUser(data);
};

  const menu = [
    {
      title: "Dashboard",
      icon: "bi bi-grid-fill",
      path: "/dashboard",
    },
  ];

  const apiMenu = [
    {
      title: "Gescanntes dokuments",
      icon: "bi bi-circle-fill",
      path: "/scans",
    },
    {
      title: "Kontakts",
      icon: "bi bi-circle-fill",
      path: "/contacts",
    },
    {
      title: "Mahnungs",
      icon: "bi bi-circle-fill",
      path: "/reminders",
    },
    {
      title: "Rechnungs",
      icon: "bi bi-circle-fill",
      path: "/invoices",
    },
    {
      title: "Rechnungsdokuments",
      icon: "bi bi-circle-fill",
      path: "/documents",
    },
    {
      title: "Zahlungs",
      icon: "bi bi-circle-fill",
      path: "/payments",
    },
  ];

  const authMenu = [
    {
      title: "Groups",
      icon: "bi bi-people-fill",
      path: "/groups",
    },
    {
      title: "Users",
      icon: "bi bi-person-fill",
      path: "/users",
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="sidebar-mobile-overlay show" onClick={() => setMobileOpen(false)}  />
      )}
 
      {/* Sidebar */}    
        <div
        className={`sidebar ${
          collapsed ? "collapsed" : ""
        } ${mobileOpen ? "show" : ""}`} >
      
        {/* Logo */}
        <div className="sidebar-header mb-4 d-flex align-items-center gap-3">

          <div className="sidebar-logo">
            <i className="bi bi-circle-square"></i>
          </div>

          {!collapsed && (
            <h4 className="m-0 fw-bold text-white">
              R&MMS
            </h4>
          )}

        </div>

        {/* User */}
        {!collapsed && (
          <div className="sidebar-user mb-4">
            <i className="bi bi-person-circle me-2"></i>
             {user.email || "example@mail.com"}
          </div>
        )}

        {/* Main */}
        <ul className="nav flex-column gap-2 mb-3">
          {menu.map((item) => (
            <li key={item.path}>
              <Link to={item.path}   className={`nav-link ${ location.pathname === item.path ? "active": "" }`}
                    onClick={() => setMobileOpen(false)} > 
                 <i className={`${item.icon} me-2`}></i>
                  {!collapsed && item.title}
              </Link>
            </li>
          ))}
        </ul>

        {/* API */}
        {!collapsed && (
          <div className="sidebar-title">
            Api
          </div>
        )}

        <ul className="nav flex-column gap-1 mb-4">
          {apiMenu.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="nav-link nav-small"
                onClick={() => setMobileOpen(false)}
              >
                <i className={`${item.icon} me-2`}></i>
                {!collapsed && item.title}
              </Link>
            </li>
          ))}
        </ul>

        {/* AUTH */}
        {!collapsed && (
          <div className="sidebar-title">
            Authentication and Authorization
          </div>
        )}

        <ul className="nav flex-column gap-1">
          {authMenu.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="nav-link nav-small"
                onClick={() => setMobileOpen(false)}
              >
                <i className={`${item.icon} me-2`}></i>
                {!collapsed && item.title}
              </Link>
            </li>
          ))}
        </ul>

      </div>
    </>
  );
}