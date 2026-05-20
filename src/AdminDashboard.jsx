import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token");

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --pink: #FF1F8E; --pink-light: #FF6DBB; --pink-pale: #FFE4F3;
    --maroon: #4A0030; --white: #fff; --muted: #C48AAD;
    --bg: #FFF5FB; --green: #065F46; --green-bg: #D1FAE5;
    --yellow: #856404; --yellow-bg: #FFF3CD; --blue: #1E40AF; --blue-bg: #DBEAFE;
    --red: #991B1B; --red-bg: #FEE2E2;
  }
  body { font-family: 'Space Grotesk', sans-serif; background: var(--bg); }

  /* LAYOUT */
  .admin-wrap { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .sidebar {
    width: 240px; min-height: 100vh; background: var(--maroon);
    display: flex; flex-direction: column; padding: 28px 0;
    position: fixed; top: 0; left: 0;
  }
  .sidebar-logo { display: flex; align-items: center; gap: 10px; padding: 0 24px 32px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .sidebar-logo-icon { width: 36px; height: 36px; background: var(--pink); border-radius: 10px; display: flex; align-items: center; justify-content: center; }
  .sidebar-logo-text { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 14px; letter-spacing: 2px; color: white; }
  .sidebar-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: rgba(255,255,255,0.3); text-transform: uppercase; padding: 24px 24px 8px; }
  .sidebar-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 24px; cursor: pointer; transition: all 0.2s;
    font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.6);
    border-left: 3px solid transparent;
  }
  .sidebar-item:hover { background: rgba(255,255,255,0.06); color: white; }
  .sidebar-item.active { background: rgba(255,31,142,0.15); color: white; border-left-color: var(--pink); }
  .sidebar-item .icon { font-size: 18px; }
  .sidebar-bottom { margin-top: auto; padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.1); }
  .logout-btn { width: 100%; padding: 10px; background: rgba(255,31,142,0.15); border: 1px solid rgba(255,31,142,0.3); border-radius: 10px; color: var(--pink-light); font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; }
  .logout-btn:hover { background: var(--pink); color: white; }

  /* MAIN */
  .admin-main { margin-left: 240px; flex: 1; padding: 32px 36px; }

  /* TOPBAR */
  .topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
  .topbar h1 { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 28px; color: var(--maroon); }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .admin-badge { padding: 6px 14px; background: var(--pink-pale); border-radius: 50px; font-size: 12px; font-weight: 700; color: var(--maroon); }
  .refresh-btn { padding: 8px 16px; background: white; border: 1.5px solid var(--pink-pale); border-radius: 10px; font-size: 13px; font-weight: 600; color: var(--maroon); cursor: pointer; transition: all 0.2s; }
  .refresh-btn:hover { border-color: var(--pink); }

  /* STATS */
  .stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 16px; margin-bottom: 32px; }
  .stat { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(74,0,48,0.06); }
  .stat-num { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 36px; color: var(--pink); }
  .stat-label { font-size: 12px; color: var(--muted); margin-top: 4px; font-weight: 600; }
  .stat-icon { font-size: 24px; margin-bottom: 8px; }

  /* TABLE */
  .table-card { background: white; border-radius: 20px; padding: 24px; box-shadow: 0 2px 12px rgba(74,0,48,0.06); margin-bottom: 28px; }
  .table-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .table-header h2 { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 20px; color: var(--maroon); }
  .table-header span { font-size: 12px; color: var(--muted); }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 11px; font-weight: 700; letter-spacing: 1px; color: var(--muted); text-transform: uppercase; padding: 0 12px 12px; border-bottom: 1.5px solid var(--pink-pale); }
  td { padding: 14px 12px; font-size: 14px; color: var(--maroon); border-bottom: 1px solid #FFF5FB; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: #FFF5FB; }

  /* BADGES */
  .badge { padding: 4px 10px; border-radius: 50px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .badge-pending { background: var(--yellow-bg); color: var(--yellow); }
  .badge-confirmed { background: var(--green-bg); color: var(--green); }
  .badge-completed { background: var(--blue-bg); color: var(--blue); }
  .badge-cancelled { background: var(--red-bg); color: var(--red); }

  /* ACTIONS */
  .action-select { padding: 6px 10px; border: 1.5px solid var(--pink-pale); border-radius: 8px; font-family: 'Space Grotesk', sans-serif; font-size: 12px; font-weight: 600; color: var(--maroon); cursor: pointer; background: white; outline: none; }
  .action-select:focus { border-color: var(--pink); }
  .del-btn { padding: 6px 10px; background: var(--red-bg); border: none; border-radius: 8px; color: var(--red); font-size: 13px; cursor: pointer; transition: all 0.2s; margin-left: 6px; }
  .del-btn:hover { background: var(--red); color: white; }

  /* USERS TABLE */
  .user-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--pink-pale); display: inline-flex; align-items: center; justify-content: center; font-size: 14px; margin-right: 8px; vertical-align: middle; }

  /* EMPTY */
  .empty { text-align: center; padding: 48px; color: var(--muted); }
  .empty p { font-size: 32px; margin-bottom: 8px; }

  /* MAKE ADMIN MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(74,0,48,0.5); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; }
  .modal { background: white; border-radius: 24px; padding: 40px; width: 100%; max-width: 400px; box-shadow: 0 20px 60px rgba(74,0,48,0.2); }
  .modal h3 { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 22px; color: var(--maroon); margin-bottom: 6px; }
  .modal p { font-size: 13px; color: var(--muted); margin-bottom: 20px; }
  .modal input { width: 100%; padding: 12px 14px; border: 1.5px solid var(--pink-pale); border-radius: 10px; font-family: 'Space Grotesk', sans-serif; font-size: 14px; color: var(--maroon); outline: none; margin-bottom: 12px; }
  .modal input:focus { border-color: var(--pink); }
  .modal-btns { display: flex; gap: 10px; }
  .modal-submit { flex: 1; padding: 12px; background: var(--pink); border: none; border-radius: 10px; font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 15px; color: white; cursor: pointer; }
  .modal-cancel { flex: 1; padding: 12px; background: var(--pink-pale); border: none; border-radius: 10px; font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 15px; color: var(--maroon); cursor: pointer; }
  .msg-success { background: var(--green-bg); color: var(--green); padding: 8px 12px; border-radius: 8px; font-size: 13px; margin-bottom: 10px; }
  .msg-error { background: var(--red-bg); color: var(--red); padding: 8px 12px; border-radius: 8px; font-size: 13px; margin-bottom: 10px; }

  @media (max-width: 900px) {
    .sidebar { display: none; }
    .admin-main { margin-left: 0; padding: 20px; }
    .stats-grid { grid-template-columns: repeat(2,1fr); }
  }
`;

export default function AdminDashboard({ onLogout }) {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [adminMsg, setAdminMsg] = useState({ type: "", text: "" });

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };

  const loadStats = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/stats`, { headers });
      const data = await res.json();
      setStats(data);
    } catch {}
  };

  const loadConsultations = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/consultations`, { headers });
      const data = await res.json();
      if (Array.isArray(data)) setConsultations(data);
    } catch {}
  };

  const loadUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/users`, { headers });
      const data = await res.json();
      if (Array.isArray(data)) setUsers(data);
    } catch {}
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([loadStats(), loadConsultations(), loadUsers()]);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/consultations/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      setConsultations((prev) => prev.map((c) => (c._id === id ? data : c)));
      loadStats();
    } catch {}
  };

  const deleteConsultation = async (id) => {
    if (!confirm("Delete this consultation?")) return;
    try {
      await fetch(`${BASE_URL}/admin/consultations/${id}`, { method: "DELETE", headers });
      setConsultations((prev) => prev.filter((c) => c._id !== id));
      loadStats();
    } catch {}
  };

  const makeAdmin = async () => {
    try {
      const res = await fetch(`${BASE_URL}/admin/make-admin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail, secret: adminSecret }),
      });
      const data = await res.json();
      if (res.ok) {
        setAdminMsg({ type: "success", text: data.message });
      } else {
        setAdminMsg({ type: "error", text: data.message });
      }
    } catch {
      setAdminMsg({ type: "error", text: "Could not connect to server." });
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

  const navItems = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "consultations", icon: "🩺", label: "Consultations" },
    { id: "users", icon: "👩", label: "Users" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="admin-wrap">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <span className="sidebar-logo-text">SMART MAMA</span>
          </div>

          <span className="sidebar-label">Menu</span>
          {navItems.map((item) => (
            <div key={item.id} className={`sidebar-item ${tab === item.id ? "active" : ""}`} onClick={() => setTab(item.id)}>
              <span className="icon">{item.icon}</span>
              {item.label}
            </div>
          ))}

          <div className="sidebar-bottom">
            <button className="logout-btn" onClick={onLogout}>← Logout</button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="admin-main">
          <div className="topbar">
            <h1>
              {tab === "overview" && "Dashboard Overview"}
              {tab === "consultations" && "All Consultations"}
              {tab === "users" && "Registered Users"}
              {tab === "settings" && "Settings"}
            </h1>
            <div className="topbar-right">
              <span className="admin-badge">🛡️ Admin</span>
              <button className="refresh-btn" onClick={loadAll}>↻ Refresh</button>
            </div>
          </div>

          {/* OVERVIEW */}
          {tab === "overview" && (
            <>
              <div className="stats-grid">
                {[
                  { icon: "👩", label: "Total Mamas", num: stats?.totalUsers ?? "—" },
                  { icon: "🩺", label: "Total Bookings", num: stats?.totalConsultations ?? "—" },
                  { icon: "⏳", label: "Pending", num: stats?.pending ?? "—" },
                  { icon: "✅", label: "Confirmed", num: stats?.confirmed ?? "—" },
                  { icon: "🎉", label: "Completed", num: stats?.completed ?? "—" },
                ].map((s) => (
                  <div className="stat" key={s.label}>
                    <div className="stat-icon">{s.icon}</div>
                    <div className="stat-num">{s.num}</div>
                    <div className="stat-label">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent consultations preview */}
              <div className="table-card">
                <div className="table-header">
                  <h2>Recent Consultations</h2>
                  <span>{consultations.length} total</span>
                </div>
                {consultations.length === 0 ? (
                  <div className="empty"><p>🩺</p><p>No consultations yet</p></div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Mama</th><th>Phone</th><th>Date</th><th>Status</th><th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consultations.slice(0, 5).map((c) => (
                        <tr key={c._id}>
                          <td><strong>{c.name}</strong><br /><span style={{ fontSize: 12, color: "var(--muted)" }}>{c.email}</span></td>
                          <td>{c.phone}</td>
                          <td>{formatDate(c.createdAt)}</td>
                          <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                          <td>
                            <select className="action-select" value={c.status} onChange={(e) => updateStatus(c._id, e.target.value)}>
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button className="del-btn" onClick={() => deleteConsultation(c._id)}>🗑</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {/* ALL CONSULTATIONS */}
          {tab === "consultations" && (
            <div className="table-card">
              <div className="table-header">
                <h2>All Consultations</h2>
                <span>{consultations.length} total</span>
              </div>
              {consultations.length === 0 ? (
                <div className="empty"><p>🩺</p><p>No consultations yet</p></div>
              ) : (
                <table>
                  <thead>
                    <tr><th>Mama</th><th>Phone</th><th>Message</th><th>Date</th><th>Status</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {consultations.map((c) => (
                      <tr key={c._id}>
                        <td><strong>{c.name}</strong><br /><span style={{ fontSize: 12, color: "var(--muted)" }}>{c.email}</span></td>
                        <td>{c.phone}</td>
                        <td style={{ maxWidth: 160, fontSize: 13 }}>{c.message || <span style={{ color: "var(--muted)" }}>—</span>}</td>
                        <td>{formatDate(c.createdAt)}</td>
                        <td><span className={`badge badge-${c.status}`}>{c.status}</span></td>
                        <td>
                          <select className="action-select" value={c.status} onChange={(e) => updateStatus(c._id, e.target.value)}>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button className="del-btn" onClick={() => deleteConsultation(c._id)}>🗑</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* USERS */}
          {tab === "users" && (
            <div className="table-card">
              <div className="table-header">
                <h2>Registered Mamas</h2>
                <span>{users.length} total</span>
              </div>
              {users.length === 0 ? (
                <div className="empty"><p>👩</p><p>No users yet</p></div>
              ) : (
                <table>
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th></tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td><span className="user-avatar">🤱</span>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.phone}</td>
                        <td><span className={`badge badge-${u.role === "admin" ? "confirmed" : "pending"}`}>{u.role}</span></td>
                        <td>{formatDate(u.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* SETTINGS */}
          {tab === "settings" && (
            <div className="table-card" style={{ maxWidth: 500 }}>
              <div className="table-header"><h2>Admin Settings</h2></div>
              <p style={{ color: "var(--muted)", marginBottom: 20, fontSize: 14 }}>Promote a registered user to admin role.</p>
              <button
                style={{ padding: "12px 24px", background: "var(--pink)", border: "none", borderRadius: 12, color: "white", fontFamily: "Nunito", fontWeight: 900, fontSize: 15, cursor: "pointer" }}
                onClick={() => { setShowAdminModal(true); setAdminMsg({ type: "", text: "" }); }}
              >
                + Promote User to Admin
              </button>
            </div>
          )}
        </main>
      </div>

      {/* MAKE ADMIN MODAL */}
      {showAdminModal && (
        <div className="modal-overlay" onClick={() => setShowAdminModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Promote to Admin</h3>
            <p>Enter the user's email and the admin secret key.</p>
            {adminMsg.text && <div className={adminMsg.type === "success" ? "msg-success" : "msg-error"}>{adminMsg.text}</div>}
            <input placeholder="User email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
            <input type="password" placeholder="Admin secret key" value={adminSecret} onChange={(e) => setAdminSecret(e.target.value)} />
            <div className="modal-btns">
              <button className="modal-cancel" onClick={() => setShowAdminModal(false)}>Cancel</button>
              <button className="modal-submit" onClick={makeAdmin}>Promote</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
