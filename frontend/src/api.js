const API_BASE = "http://127.0.0.1:5000";

export async function apiRequest(endpoint, method = "GET", data = null) {
  const options = { method, headers: { "Content-Type": "application/json" } };
  if (data) options.body = JSON.stringify(data);

  const res = await fetch(`${API_BASE}${endpoint}`, options);
  return res.json();
}
