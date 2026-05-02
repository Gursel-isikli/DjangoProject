import { useEffect, useState } from "react";
import { getRechnungen } from "../services/api";

export default function InvoiceTable() {
  const [invoices, setInvoices] = useState([]);
  const [page, setPage] = useState(1);

  const perPage = 5;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getRechnungen();
    setInvoices(Array.isArray(data) ? data : []);
  };

  const badge = (status) => {
    if (status === "bezahlt")
      return "bg-success text-white";

    if (status === "offen")
      return "bg-warning text-dark";

    return "bg-danger text-white";
  };

  const totalPages = Math.ceil(
    invoices.length / perPage
  );

  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  const currentInvoices = invoices.slice(
    startIndex,
    endIndex
  );

  return (
    <div className="card border-0 shadow-sm rounded-4 mt-4">

      <div className="card-body">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">

          <h4 className="fw-bold m-0">Letzte Rechnungen</h4>
          <small className="text-muted"> Seite {page} / {totalPages || 1}</small>

        </div>

        {/* TABLE */}
        <div className="table-responsive">
          <table className="table align-middle">

            <thead>
              <tr>
                <th>Nr</th>
                <th>Kontakt</th>
                <th>Status</th>
                <th>Datum</th>
                <th>Fällig</th>
              </tr>
            </thead>

            <tbody>

              {currentInvoices.map((item) => (
                <tr key={item.id}>

                  <td className="fw-semibold text-primary">{item.rechnungsnummer} </td>
                  <td>{item.kontakt_name}</td>
                  <td> <span className={`badge ${badge(item.status)}`}>{item.status}</span></td>
                  <td>{item.datum}</td>
                  <td>{item.faelligkeitsdatum}</td>   

                </tr>   
              ))}   

            </tbody>

          </table>
        </div>

        {/* PAGINATION */}
        <div className="d-flex justify-content-end gap-2 mt-3">

          <button className="btn btn-sm btn-light border" disabled={page === 1} onClick={() => setPage(page - 1)} > Zurück  </button>
           
           {[...Array(totalPages)].map((_, i) => (

             <button key={i} className={`btn btn-sm ${  page === i + 1  ? "btn-primary"  : "btn-light border" }`} 
                    onClick={() => setPage(i + 1)} > {i + 1}  </button>
              
            ))}
                
             <button className="btn btn-sm btn-light border"
                     disabled={  page === totalPages ||  totalPages === 0}
                     onClick={() => setPage(page + 1)}  > Weiter </button>
                                

        </div>

      </div>

    </div>
  );
}