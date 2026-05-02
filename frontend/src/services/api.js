const BASE_URL = "http://127.0.0.1:8000/api";

export const registerUser = async (data) => {
  return fetch(`${BASE_URL}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const loginUser = async (data) => {
  return fetch("http://127.0.0.1:8000/api/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

//User Datei
//-------------------------------------
export async function getMe() {
  const token = localStorage.getItem("token");

  const res = await fetch("http://127.0.0.1:8000/api/me/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
}

// kontakt datei
export async function getKontakte() {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://127.0.0.1:8000/api/kontakte/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await res.json();
}


//---------------------------------
//recnung Datei

export async function getRechnungen() {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://127.0.0.1:8000/api/rechnungen/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.json();
}

// recnung erstellen
//--------------------------------------

export async function createRechnung(formData) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://127.0.0.1:8000/api/rechnung/create/",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  return res.json();
}

//activity Datei
//-----------------------------

export async function getActivity() {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://127.0.0.1:8000/api/activity/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await res.json();
}


//statCards Datei
//-------------------------
export async function getStats() {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://127.0.0.1:8000/api/stats/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await res.json();
}

//chartBox Datei
//----------------------
export async function getChartStats() {
  const token = localStorage.getItem("token");

  const res = await fetch(
    "http://127.0.0.1:8000/api/chart/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await res.json();
}

