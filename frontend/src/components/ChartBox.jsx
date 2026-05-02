import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import { getChartStats } from "../services/api";

export default function ChartBox() {
  const [rawData, setRawData] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState("month"); //Monat | Jahr
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadChart();
  }, []);

  /* Automatische Live-Aktualisierung alle 30 Sekunden */
  useEffect(() => {
    const timer = setInterval(() => {
      loadChart();
    }, 30000);

    return () => clearInterval(timer);
  }, []);

  const loadChart = async () => {
    try {
      setLoading(true);
      const res = await getChartStats();
      setRawData(Array.isArray(res) ? res : []);
    } catch (error) {
      console.log(error);
      setRawData([]);
    } finally {
      setLoading(false);
    }
  };

  /* Filter jahr */
  const data = useMemo(() => {
    if (!rawData.length) return [];

    return rawData.filter((item) => {
      if (!item.year) return true;
      return Number(item.year) === Number(year);
    });
  }, [rawData, year]);



  const years = useMemo(() => {
  const list = rawData
    .map((item) => item.year)
    .filter(Boolean);

  return [...new Set(list)].sort((a, b) => b - a);
   }, [rawData]);


  

  const textColor = darkMode ? "#e5e7eb" : "#111827";
  const muted = darkMode ? "#94a3b8" : "#6b7280";
  const bgCard = darkMode ? "#111827" : "#ffffff";
  const border = darkMode ? "#1f2937" : "#eef2f7";

  return (
    <div  className="card border-0 shadow-sm rounded-4 h-100" style={{background: bgCard,transition: "0.3s",   }}  >
     
        <div className="card-body p-4">

          {/* HEADER */}
         <div className="chart-header d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <div>
              <h5 className="fw-bold mb-1" style={{ color: textColor }}>Rechnungs Analyse </h5>
             
              <p  className="small mb-0" style={{ color: muted }}> Offen / Bezahlt / Überfällig </p>
           </div>
          

             <div className="chart-actions d-flex gap-2 flex-wrap">

               {/* Monat/ jahr */}
                <div className="btn-group">
                   <button 
                        className={`btn btn-sm ${ viewMode === "month" ? "btn-primary" : "btn-light"  }`}
                        onClick={() => setViewMode("month")}> Monat 
                   </button>
                   <button
                        className={`btn btn-sm ${ viewMode === "year" ? "btn-primary" : "btn-light"}`}
                         onClick={() => setViewMode("year")}  > Jahr
                  </button>
               </div>

            {/* jahr Filter */}
             <select  className="form-select form-select-sm"   style={{ width: "110px" }}   value={year} 
                      onChange={(e) => setYear(e.target.value)} >
                      {years.length === 0 && (<option>{new Date().getFullYear()}</option> )}
                      {years.map((item) => ( <option key={item} value={item}> {item} </option> ))}
             </select>
                                  
            {/* Dunkelmodus */}
            <button className="btn btn-sm btn-dark" onClick={() => setDarkMode(!darkMode)}> {darkMode ? "☀️" : "🌙"} </button>
                
            {/* Aktualisieren */}
            <button className="btn btn-sm btn-light border" onClick={loadChart} > ⟳ </button>
          
          </div>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="small mb-3"  style={{ color: muted }} > Daten werden geladen... </div>
        )}
           
        {/* CHART */}
     <ResponsiveContainer width="100%" height={window.innerWidth < 576 ? 220 : 340} >
          <AreaChart data={data}>

            <defs>
              <linearGradient id="fillGreen" x1="0" y1="0" x2="0" y2="1">
                 <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.4}/>
                 <stop offset="95%"  stopColor="#22c55e" stopOpacity={0} /> 
              </linearGradient>
            </defs>

            <CartesianGrid  strokeDasharray="3 3" stroke={border} />
             
             <XAxis dataKey={ viewMode === "month" ? "month"  : "year"   }  stroke={muted} />
             <YAxis stroke={muted} />
             <Tooltip />
             <Legend />
                 
             {/* Gradient Fill */}
             <Area type="monotone"  dataKey="bezahlt"  stroke="#22c55e"  fill="url(#fillGreen)" strokeWidth={3} />
              
             {/* Curved Lines */}
             <Line  type="monotone"   dataKey="offen" stroke="#f59e0b"   strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
             <Line  type="monotone"   dataKey="ueberfaellig"  stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }}  activeDot={{ r: 7 }} />
             <Line  type="monotone" dataKey="bezahlt" stroke="#22c55e" strokeWidth={3}  dot={{ r: 4 }} activeDot={{ r: 7 }}   />
             
              
          </AreaChart>
      </ResponsiveContainer>

      </div>
    </div>
  );
}