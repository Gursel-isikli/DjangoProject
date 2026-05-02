import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ChartBox from "../components/ChartBox";
import Activity from "../components/Activity";
import "../styles/dashboard.css";
import Footer from "../components/Footer";
import InvoiceTable from "../components/InvoiceTable";
import { getStats } from "../services/api";


export default function Dashboard() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [stats, setStats] = useState({ //statCards
       total: 0,
       offen: 0,
       bezahlt: 0,
       ueberfaellig: 0,
     });

  const navigate = useNavigate();

  //statCard useEffect
   useEffect(() => {
     loadStats();
   }, []);
  //statCard loadStats
   const loadStats = async () => {
   const data = await getStats();
    setStats(data);
    };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, []);
  
  return (
       <div className="dashboard-layout d-flex">

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={collapsed}
      />

      {/* Main */}
      <div className="main-content flex-grow-1 d-flex flex-column">

        {/* TOPBAR */}
        <Topbar
          setMobileOpen={setMobileOpen}
          setCollapsed={setCollapsed}
        />

        {/* Content */}
        <div className="p-3 p-md-4">

          <div className="row g-4 mb-4">

  <div className="col-md-6 col-xl-3">
    <StatCard  title="Gesamt Rechnungen" value={stats.total} icon="bi bi-receipt" color="primary"  />
  </div>

  <div className="col-md-6 col-xl-3">
    <StatCard title="Offen"  value={stats.offen} icon="bi bi-clock-history" color="warning" />  
  </div>
      
     
  <div className="col-md-6 col-xl-3">
    <StatCard  title="Bezahlt" value={stats.bezahlt} icon="bi bi-check-circle"  color="success"  />
  </div>

  <div className="col-md-6 col-xl-3">
    <StatCard   title="Überfällig"   value={stats.ueberfaellig} icon="bi bi-exclamation-circle"   color="danger" />
  </div>

</div>

          <div className="row g-3">
            <div className="col-12 col-xl-8">
              <ChartBox />
            </div>

            <div className="col-12 col-xl-4">
              <Activity />
            </div>
          </div>
             <InvoiceTable />
        </div>
        <Footer />
      </div>
        
    </div>
  );
}