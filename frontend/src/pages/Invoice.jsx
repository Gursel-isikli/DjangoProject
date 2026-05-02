import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import "../styles/page.css";
import "../styles/invoice-modal.css";
import { getRechnungen, createRechnung, getKontakte } from "../services/api";


export default function Invoice() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [data, setData] = useState([]);
  const [kontakte, setKontakte] = useState([]);
  
  /* MODAL */
  const [showModal, setShowModal] = useState(false);


  /* FORM */
  const [form, setForm] = useState({
    user: "",
    kontakt: "",
    rechnungsnummer: "",
    datum: "",
    faelligkeitsdatum: "",
    status: "offen",
    pdf: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const result = await getRechnungen();
    setData(Array.isArray(result) ? result : []);
  };

  const badge = (status) => {
    if (status === "bezahlt") return "bg-success text-white";
    if (status === "offen") return "bg-warning text-dark";
    return "bg-danger text-white";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

 const saveInvoice = async () => {
  const formData = new FormData();

  formData.append("kontakt", form.kontakt);
  formData.append("rechnungsnummer", form.rechnungsnummer);
  formData.append("datum", form.datum);
  formData.append("faelligkeitsdatum", form.faelligkeitsdatum);
  formData.append("status", form.status);

  const res = await createRechnung(formData);

  console.log(res);

  await loadData();
  setShowModal(false);
};

useEffect(() => {
  loadKontakte();
}, []);

  const loadKontakte = async () => {
  const data = await getKontakte();

  console.log("KONTAKTE:", data);

  setKontakte(Array.isArray(data) ? data : []);
};


const [page, setPage] = useState(1);

const perPage = 5;

const totalPages = Math.ceil(
  data.length / perPage
);

const startIndex = (page - 1) * perPage;
const endIndex = startIndex + perPage;

const currentData = data.slice(
  startIndex,
  endIndex
);

  return (
    <div className="dashboard-layout d-flex">

      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="sidebar-mobile-overlay"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* MAIN */}
      <div className="main-content d-flex flex-column">

        {/* TOPBAR */}
        <Topbar
          setCollapsed={setCollapsed}
          setMobileOpen={setMobileOpen}
        />

        {/* PAGE */}
        <div className="p-3 p-md-4 flex-grow-1">

          {/* TITLE */}
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

            <div>
              <h2 className="fw-bold mb-1">Rechnungen</h2>

              <p className="text-muted mb-0">
                Verwalte alle Rechnungen professionell und schnell.
              </p>
            </div>

            <button
              className="btn btn-primary px-4 rounded-3"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Neue Rechnung
            </button>

          </div>

          {/* ========================
            Card Detail
          ======================== */}
          <div className="row g-4 mb-4">

            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body">
                  <small className="text-muted">Gesamt</small>
                  <h3 className="fw-bold mt-2">{data.length}</h3>
                  <small className="text-success">Rechnungen</small>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body">
                  <small className="text-muted">Offen</small>
                  <h3 className="fw-bold mt-2">
                    {data.filter((x) => x.status === "offen").length}
                  </h3>
                  <small className="text-warning">wartend</small>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body">
                  <small className="text-muted">Bezahlt</small>
                  <h3 className="fw-bold mt-2">
                    {data.filter((x) => x.status === "bezahlt").length}
                  </h3>
                  <small className="text-success">erledigt</small>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body">
                  <small className="text-muted">Überfällig</small>
                  <h3 className="fw-bold mt-2">
                    {data.filter((x) => x.status === "ueberfaellig").length}
                  </h3>
                  <small className="text-danger">kritisch</small>
                </div>
              </div>
            </div>

          </div>

          {/* FILTER */}
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body">

              <div className="row g-3">

                <div className="col-md-3">
                  <select className="form-select">
                    <option>Status</option>
                    <option>Offen</option>
                    <option>Bezahlt</option>
                    <option>Überfällig</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <input type="date" className="form-control" />
                </div>

                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Rechnung suchen..."
                  />
                </div>

                <div className="col-md-2">
                  <button className="btn btn-dark w-100">
                    Suchen
                  </button>
                </div>

              </div>

            </div>
          </div>

          {/* TABLE */}


<div className="card border-0 shadow-sm rounded-4">
  <div className="card-body">

    <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="fw-bold m-0">
        Rechnungen Liste
      </h5>

      <small className="text-muted">
        Seite {page} / {totalPages || 1}
      </small>
    </div>

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

          {currentData.map((item) => (
            <tr key={item.id}>

              <td className="fw-semibold text-primary">
                {item.rechnungsnummer}
              </td>

              <td>{item.kontakt_name}</td>

              <td>
                <span className={`badge ${badge(item.status)}`}>
                  {item.status}
                </span>
              </td>

              <td>{item.datum}</td>

              <td>{item.faelligkeitsdatum}</td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>

    {/* PAGINATION */}
    <div className="d-flex justify-content-end gap-2 mt-3">

      <button
        className="btn btn-sm btn-light border"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        Zurück
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          className={`btn btn-sm ${
            page === i + 1
              ? "btn-primary"
              : "btn-light border"
          }`}
          onClick={() => setPage(i + 1)}
        >
          {i + 1}
        </button>
      ))}

      <button
        className="btn btn-sm btn-light border"
        disabled={
          page === totalPages ||
          totalPages === 0
        }
        onClick={() => setPage(page + 1)}
      >
        Weiter
      </button>

    </div>

  </div>
</div>

        </div>

        <Footer />

      </div>

      {/* ======================
          MODAL
      ====================== */}
      {showModal && (
        <>
          <div
            className="invoice-modal-backdrop"
            onClick={() => setShowModal(false)}
          ></div>

          <div className="invoice-modal">

            {/* HEADER */}
            <div className="invoice-modal-header">
              <h3 className="invoice-modal-title">
                Neue Rechnung
              </h3>

              <button
                className="invoice-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            {/* BODY */}
            <div className="invoice-modal-body">

          

              <div className="invoice-grid">

                <div className="invoice-group">
                  <label className="invoice-label">User</label>
                  <input
                    name="user"
                    className="invoice-input"
                    onChange={handleChange}
                  />
                </div>

                <div className="invoice-group">
                  <label className="invoice-label">Kontakt</label>
                     <select name="kontakt"  className="invoice-select" onChange={handleChange}>
                        <option value="">Kontakt wählen</option>

                                {kontakte.map((item) => (
                                     <option key={item.id} value={item.id}>{item.name}</option>
                                   ))}
                      </select>
                </div>

                <div className="invoice-group">
                  <label className="invoice-label">
                    Rechnungsnummer
                  </label>
                  <input
                    name="rechnungsnummer"
                    className="invoice-input"
                    onChange={handleChange}
                  />
                </div>

                <div className="invoice-group">
                  <label className="invoice-label">Status</label>
                  <select
                    name="status"
                    className="invoice-select"
                    onChange={handleChange}
                  >
                    <option value="offen">Offen</option>
                    <option value="bezahlt">Bezahlt</option>
                    <option value="ueberfaellig">Überfällig</option>
                  </select>
                </div>

                <div className="invoice-group">
                  <label className="invoice-label">Datum</label>
                  <input
                    type="date"
                    name="datum"
                    className="invoice-input"
                    onChange={handleChange}
                  />
                </div>

                <div className="invoice-group">
                  <label className="invoice-label">
                    Fälligkeitsdatum
                  </label>
                  <input
                    type="date"
                    name="faelligkeitsdatum"
                    className="invoice-input"
                    onChange={handleChange}
                  />
                </div>

                

              </div>

            </div>

            {/* FOOTER */}
            <div className="invoice-modal-footer">

              <button
                className="invoice-btn invoice-btn-light"
                onClick={() => setShowModal(false)}
              >
                Abbrechen
              </button>

              <button
                className="invoice-btn invoice-btn-primary"
                onClick={saveInvoice}
              >
                Save
              </button>

        

            </div>

          </div>
        </>
      )}

    </div>
  );
}