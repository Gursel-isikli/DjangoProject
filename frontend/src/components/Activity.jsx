import { useEffect, useState } from "react";
import { getActivity } from "../services/api";

export default function Activity() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getActivity();
    setItems(data);
  };

  return (
    <div className="card border-0 shadow-sm rounded-4 h-100">

      <div className="card-body">

        <div className="mb-4">
          <h5 className="fw-bold mb-1">Aktivität</h5>
          <p className="text-muted small mb-0">Letzte Aktionen im System</p>
        </div>

        <div className="d-flex flex-column gap-3">

          {items.map((item, index) => (
            <div key={index} className="d-flex align-items-start gap-3">
               <div  className={`bg-${item.color} bg-opacity-10 text-${item.color} rounded-circle d-flex align-items-center justify-content-center`}
                     style={{ width: "42px", height: "42px", minWidth: "42px",}}> <i className={item.icon}></i> </div>

                   <div className="flex-grow-1">
                       <div className="fw-semibold small"> {item.title}</div>
                       <div className="text-muted small">{item.text} </div>
                   </div>

                      <small className="text-muted">{item.time} </small>
                
            </div>
          ))}

        </div>

      </div>
    </div>
  );
}