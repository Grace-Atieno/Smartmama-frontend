import { useState, useEffect } from "react";
import { registerUser, loginUser, bookConsultation, getMyConsultations } from "./api";
import AdminDashboard from "./AdminDashboard";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --pink: #FF1F8E; --pink-light: #FF6DBB; --pink-pale: #FFE4F3;
    --pink-ultra-pale: #FFF5FB; --maroon: #4A0030; --white: #FFFFFF; --text-muted: #C48AAD;
  }

  body { font-family: 'Space Grotesk', sans-serif; background: var(--white); overflow-x: hidden; }

  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 16px 48px; background: rgba(255,255,255,0.92); backdrop-filter: blur(12px); border-bottom: 2px solid var(--pink); }
  .nav-logo { display: flex; align-items: center; gap: 10px; }
  .nav-logo-icon { width: 42px; height: 42px; background: linear-gradient(135deg, #FF1F8E, #FF6DBB); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
  .nav-logo-text { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 18px; letter-spacing: 2px; color: var(--maroon); }
  .nav-right { display: flex; align-items: center; gap: 12px; }
  .nav-user { font-size: 13px; font-weight: 700; color: var(--maroon); }
  .nav-signin { padding: 10px 28px; border: 2px solid var(--maroon); border-radius: 50px; background: transparent; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 1.5px; color: var(--maroon); cursor: pointer; transition: all 0.25s; }
  .nav-signin:hover { background: var(--maroon); color: white; }
  .nav-logout { padding: 10px 20px; border: 2px solid #FFE4F3; border-radius: 50px; background: transparent; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; color: var(--text-muted); cursor: pointer; transition: all 0.25s; }
  .nav-logout:hover { background: #FFE4F3; color: var(--maroon); }

  .hero { min-height: 100vh; padding: 120px 48px 80px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; background: var(--white); position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; top: -80px; right: -80px; width: 600px; height: 600px; background: radial-gradient(circle, #FFE4F3 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
  .hero-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; border: 1.5px solid var(--pink); border-radius: 50px; margin-bottom: 28px; background: var(--pink-ultra-pale); }
  .hero-badge-dot { width: 8px; height: 8px; background: var(--pink); border-radius: 50%; animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(1.3)} }
  .hero-badge-text { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; color: var(--maroon); text-transform: uppercase; }
  .hero-headline { font-family: 'Nunito', sans-serif; line-height: 1.0; margin-bottom: 24px; }
  .hero-headline .line1 { font-size: clamp(52px, 6vw, 88px); font-weight: 900; color: var(--maroon); display: block; }
  .hero-headline .line2 { font-size: clamp(52px, 6vw, 88px); font-weight: 900; color: var(--pink); display: block; }
  .hero-headline .line3 { font-size: clamp(52px, 6vw, 88px); font-weight: 900; color: var(--maroon); display: block; }
  .hero-desc { font-size: 18px; line-height: 1.7; color: var(--pink); max-width: 480px; margin-bottom: 40px; }
  .hero-actions { display: flex; align-items: center; gap: 28px; flex-wrap: wrap; }
  .btn-primary { display: flex; align-items: center; gap: 10px; padding: 18px 36px; background: var(--pink); border: none; border-radius: 16px; cursor: pointer; font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 16px; color: white; transition: all 0.25s; box-shadow: 0 8px 30px rgba(255,31,142,0.35); }
  .btn-primary:hover { background: var(--pink-light); transform: translateY(-2px); }
  .hero-social-proof { display: flex; align-items: center; gap: 12px; }
  .avatars { display: flex; }
  .avatar { width: 36px; height: 36px; border-radius: 50%; border: 2px solid white; margin-left: -8px; background: linear-gradient(135deg, #FFE4F3, #FF6DBB); display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .avatar:first-child { margin-left: 0; }
  .social-text { font-weight: 700; font-size: 13px; letter-spacing: 1px; color: var(--pink); }
  .hero-mockup { position: relative; display: flex; justify-content: center; align-items: center; }
  .mockup-card { background: white; border-radius: 28px; padding: 28px; box-shadow: 0 20px 80px rgba(74,0,48,0.12); width: 100%; max-width: 380px; }
  .mockup-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .mockup-bar { height: 10px; width: 60%; background: #FFE4F3; border-radius: 8px; }
  .mockup-plus { width: 32px; height: 32px; background: #FFE4F3; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--pink); font-size: 18px; }
  .mockup-pill-dark { height: 48px; background: var(--maroon); border-radius: 50px; margin-bottom: 12px; }
  .mockup-pill-gray { height: 36px; background: #FFE4F3; border-radius: 50px; margin-bottom: 20px; width: 78%; }
  .mockup-stethoscope { background: linear-gradient(135deg, #FFE4F3, #FFD0EC); border-radius: 20px; padding: 24px; display: flex; justify-content: center; align-items: center; margin-bottom: 16px; }
  .mockup-btns { display: flex; gap: 12px; }
  .mockup-btn-ghost { flex: 1; height: 44px; background: #FFE4F3; border-radius: 12px; }
  .mockup-btn-fill { flex: 1; height: 44px; background: var(--pink); border-radius: 12px; }
  .mockup-floating { position: absolute; top: -20px; right: -20px; background: white; border-radius: 16px; padding: 12px 16px; box-shadow: 0 8px 30px rgba(74,0,48,0.12); display: flex; align-items: center; gap: 8px; }
  .floating-dot { width: 10px; height: 10px; background: var(--pink); border-radius: 50%; }
  .floating-text { font-size: 11px; font-weight: 700; color: var(--maroon); }
  .section-label { text-align: center; font-size: 11px; font-weight: 700; letter-spacing: 3px; color: var(--pink); text-transform: uppercase; margin-bottom: 56px; }
  .strategy { padding: 80px 48px; }
  .strategy-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 32px; max-width: 1100px; margin: 0 auto; }
  .strategy-card { background: var(--pink-ultra-pale); border-radius: 24px; padding: 36px 28px; border: 1.5px solid #FFE4F3; transition: all 0.25s; }
  .strategy-card:hover { transform: translateY(-4px); box-shadow: 0 16px 50px rgba(255,31,142,0.1); }
  .strategy-icon { width: 60px; height: 60px; background: #FFE4F3; border-radius: 18px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 26px; }
  .strategy-title { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 20px; color: var(--maroon); margin-bottom: 12px; }
  .strategy-desc { font-size: 14px; line-height: 1.7; color: var(--text-muted); }
  .why { padding: 80px 48px; }
  .why h2 { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: clamp(32px,4vw,52px); color: var(--maroon); text-align: center; margin-bottom: 56px; }
  .why-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 48px; max-width: 1100px; margin: 0 auto; }
  .why-icon-wrap { width: 72px; height: 72px; background: #FFE4F3; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
  .why-title { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 22px; color: var(--maroon); margin-bottom: 12px; }
  .why-desc { font-size: 15px; line-height: 1.75; color: var(--text-muted); }
  .cta-section { background: var(--maroon); padding: 100px 48px; display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; overflow: hidden; }
  .cta-section::before { content: ''; position: absolute; top: -150px; left: 50%; transform: translateX(-50%); width: 500px; height: 500px; background: radial-gradient(circle, rgba(255,31,142,0.15) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
  .cta-title { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: clamp(28px,4vw,52px); color: white; margin-bottom: 36px; }
  .btn-cta { padding: 18px 52px; background: var(--pink); border: none; border-radius: 50px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; color: white; cursor: pointer; transition: all 0.25s; box-shadow: 0 8px 30px rgba(255,31,142,0.4); }
  .btn-cta:hover { transform: translateY(-2px); }
  .footer { background: var(--maroon); padding: 0 48px 36px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); }
  .footer-text { font-size: 11px; font-weight: 600; letter-spacing: 1.5px; color: rgba(255,255,255,0.3); text-transform: uppercase; }

  /* MAMA DASHBOARD */
  .dashboard { min-height: 100vh; padding: 100px 48px 60px; background: var(--pink-ultra-pale); }
  .dashboard-header { margin-bottom: 40px; }
  .dashboard-header h2 { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 36px; color: var(--maroon); }
  .dashboard-header p { color: var(--text-muted); margin-top: 6px; }
  .dashboard-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-bottom: 48px; }
  .stat-card { background: white; border-radius: 20px; padding: 28px; box-shadow: 0 4px 20px rgba(74,0,48,0.06); }
  .stat-card .stat-num { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 40px; color: var(--pink); }
  .stat-card .stat-label { font-size: 13px; color: var(--text-muted); margin-top: 4px; }
  .consultations-list { background: white; border-radius: 20px; padding: 28px; box-shadow: 0 4px 20px rgba(74,0,48,0.06); }
  .consultations-list h3 { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 22px; color: var(--maroon); margin-bottom: 20px; }
  .consult-item { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid #FFE4F3; }
  .consult-item:last-child { border-bottom: none; }
  .consult-info .consult-name { font-weight: 700; color: var(--maroon); font-size: 15px; }
  .consult-info .consult-date { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .status-badge { padding: 4px 12px; border-radius: 50px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
  .status-pending { background: #FFF3CD; color: #856404; }
  .status-confirmed { background: #D1FAE5; color: #065F46; }
  .status-completed { background: #DBEAFE; color: #1E40AF; }
  .empty-state { text-align: center; padding: 40px; color: var(--text-muted); }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(74,0,48,0.6); backdrop-filter: blur(6px); z-index: 200; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .modal { background: white; border-radius: 28px; padding: 48px 40px; width: 100%; max-width: 440px; position: relative; box-shadow: 0 40px 100px rgba(74,0,48,0.25); animation: slideUp 0.3s ease; }
  @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
  .modal-close { position: absolute; top: 20px; right: 20px; width: 32px; height: 32px; background: #FFE4F3; border: none; border-radius: 50%; cursor: pointer; font-size: 16px; color: var(--maroon); display: flex; align-items: center; justify-content: center; }
  .modal-title { font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 28px; color: var(--maroon); margin-bottom: 8px; }
  .modal-sub { font-size: 14px; color: var(--text-muted); margin-bottom: 32px; }
  .modal-tabs { display: flex; gap: 0; margin-bottom: 28px; background: #FFE4F3; border-radius: 12px; padding: 4px; }
  .modal-tab { flex: 1; padding: 10px; border: none; background: transparent; border-radius: 10px; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; color: var(--text-muted); transition: all 0.2s; }
  .modal-tab.active { background: white; color: var(--maroon); box-shadow: 0 2px 8px rgba(74,0,48,0.1); }
  .modal-field { margin-bottom: 16px; }
  .modal-field label { display: block; font-size: 12px; font-weight: 700; letter-spacing: 1px; color: var(--maroon); margin-bottom: 6px; text-transform: uppercase; }
  .modal-field input { width: 100%; padding: 14px 16px; border: 1.5px solid #FFE4F3; border-radius: 12px; font-family: 'Space Grotesk', sans-serif; font-size: 14px; color: var(--maroon); outline: none; transition: border 0.2s; }
  .modal-field input:focus { border-color: var(--pink); }
  .modal-error { background: #FFE4F3; color: var(--maroon); padding: 10px 14px; border-radius: 10px; font-size: 13px; margin-bottom: 14px; }
  .modal-success { background: #D1FAE5; color: #065F46; padding: 10px 14px; border-radius: 10px; font-size: 13px; margin-bottom: 14px; }
  .modal-submit { width: 100%; padding: 16px; background: var(--pink); border: none; border-radius: 14px; font-family: 'Nunito', sans-serif; font-weight: 900; font-size: 16px; color: white; cursor: pointer; margin-top: 8px; transition: all 0.25s; box-shadow: 0 6px 20px rgba(255,31,142,0.3); }
  .modal-submit:hover { background: var(--pink-light); }
  .modal-submit:disabled { opacity: 0.6; cursor: not-allowed; }

  @media (max-width: 768px) {
    .nav { padding: 14px 20px; }
    .hero { grid-template-columns: 1fr; padding: 100px 20px 60px; }
    .hero-mockup { display: none; }
    .strategy-grid, .why-grid, .dashboard-grid { grid-template-columns: 1fr; }
    .strategy, .why, .cta-section, .dashboard { padding: 60px 20px; }
  }
`;

const HeartSVG = ({ size = 22, stroke = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default function SmartMama() {
  const [modal, setModal] = useState(null);
  const [authTab, setAuthTab] = useState("login");
  const [user, setUser] = useState(null);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [view, setView] = useState("home");
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "", message: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      const u = JSON.parse(savedUser);
      setUser(u);
      if (u.role === "admin") setView("admin");
    }
  }, []);

  const resetForm = () => { setForm({ name: "", phone: "", email: "", password: "", message: "" }); setError(""); setSuccess(""); };
  const openModal = (type) => { resetForm(); setModal(type); };
  const closeModal = () => { setModal(null); resetForm(); };

  const handleAuth = async () => {
    setError(""); setLoading(true);
    try {
      let data;
      if (authTab === "register") {
        if (!form.name || !form.email || !form.phone || !form.password) { setError("Please fill in all fields."); setLoading(false); return; }
        data = await registerUser(form.name, form.email, form.phone, form.password);
      } else {
        if (!form.email || !form.password) { setError("Please enter email and password."); setLoading(false); return; }
        data = await loginUser(form.email, form.password);
      }
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        closeModal();
        if (data.user.role === "admin") {
          setView("admin");
        } else {
          setView("dashboard");
          setTimeout(() => loadConsultations(), 300);
        }
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch { setError("Could not connect to server. Make sure backend is running on port 5000."); }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); localStorage.removeItem("user");
    setUser(null); setConsultations([]); setView("home");
  };

  const handleConsultation = async () => {
    if (!user) { closeModal(); openModal("auth"); return; }
    setError(""); setLoading(true);
    try {
      const data = await bookConsultation(user.name, user.phone, user.email, form.message);
      if (data.consultation) {
        setSuccess("Consultation booked! A midwife will contact you soon.");
        loadConsultations();
        setTimeout(() => closeModal(), 2000);
      } else { setError(data.message || "Booking failed."); }
    } catch { setError("Could not connect to server."); }
    setLoading(false);
  };

  const loadConsultations = async () => {
    try {
      const data = await getMyConsultations();
      if (Array.isArray(data)) setConsultations(data);
    } catch {}
  };

  useEffect(() => { if (user && user.role !== "admin") loadConsultations(); }, [user]);

  const formatDate = (d) => new Date(d).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

  // ADMIN VIEW
  if (view === "admin" && user?.role === "admin") {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // MAMA DASHBOARD
  if (view === "dashboard" && user) {
    return (
      <>
        <style>{styles}</style>
        <nav className="nav">
          <div className="nav-logo">
            <div className="nav-logo-icon"><HeartSVG /></div>
            <span className="nav-logo-text">SMART MAMA</span>
          </div>
          <div className="nav-right">
            <span className="nav-user">👋 {user.name}</span>
            <button className="nav-signin" onClick={() => setView("home")}>Home</button>
            <button className="nav-logout" onClick={handleLogout}>Logout</button>
          </div>
        </nav>

        <div className="dashboard">
          <div className="dashboard-header">
            <h2>Welcome back, {user.name.split(" ")[0]} 💗</h2>
            <p>Here's your Smart Mama dashboard</p>
          </div>
          <div className="dashboard-grid">
            <div className="stat-card"><div className="stat-num">{consultations.length}</div><div className="stat-label">Total Consultations</div></div>
            <div className="stat-card"><div className="stat-num">{consultations.filter(c => c.status === "pending").length}</div><div className="stat-label">Pending</div></div>
            <div className="stat-card"><div className="stat-num">{consultations.filter(c => c.status === "completed").length}</div><div className="stat-label">Completed</div></div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <button className="btn-primary" onClick={() => openModal("consultation")}>+ Book New Consultation</button>
          </div>
          <div className="consultations-list">
            <h3>My Consultations</h3>
            {consultations.length === 0 ? (
              <div className="empty-state"><p style={{ fontSize: 32 }}>🩺</p><p style={{ marginTop: 10 }}>No consultations yet. Book your first one!</p></div>
            ) : (
              consultations.map((c) => (
                <div className="consult-item" key={c._id}>
                  <div className="consult-info">
                    <div className="consult-name">{c.name}</div>
                    <div className="consult-date">{formatDate(c.createdAt)} · {c.email}</div>
                    {c.message && <div className="consult-date">{c.message}</div>}
                  </div>
                  <span className={`status-badge status-${c.status}`}>{c.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {modal === "consultation" && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeModal}>×</button>
              <div className="modal-title">Book Consultation</div>
              <div className="modal-sub">A midwife will contact you shortly.</div>
              {error && <div className="modal-error">{error}</div>}
              {success && <div className="modal-success">{success}</div>}
              <div className="modal-field"><label>Message (optional)</label>
                <input placeholder="Describe your concern..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <button className="modal-submit" onClick={handleConsultation} disabled={loading}>{loading ? "Booking..." : "Book Now →"}</button>
            </div>
          </div>
        )}
      </>
    );
  }

  // HOME
  return (
    <>
      <style>{styles}</style>
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-icon"><HeartSVG /></div>
          <span className="nav-logo-text">SMART MAMA</span>
        </div>
        <div className="nav-right">
          {user ? (
            <>
              <button className="nav-signin" onClick={() => setView(user.role === "admin" ? "admin" : "dashboard")}>Dashboard</button>
              <button className="nav-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button className="nav-signin" onClick={() => openModal("auth")}>SIGN IN</button>
          )}
        </div>
      </nav>

      <section className="hero">
        <div>
          <div className="hero-badge"><div className="hero-badge-dot" /><span className="hero-badge-text">Impact Vision: Strengthening Maternal and Child Health in Kenya</span></div>
          <h1 className="hero-headline">
            <span className="line1">Accessible.</span>
            <span className="line2">Affordable.</span>
            <span className="line3">Reliable.</span>
          </h1>
          <p className="hero-desc">A midwife-led maternal health initiative dedicated to strengthening maternal and child health in Kenya through digital health innovation.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => openModal("consultation")}>
              Start Free Consultation
              <span style={{ width: 28, height: 28, background: "rgba(255,255,255,0.25)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>›</span>
            </button>
            <div className="hero-social-proof">
              <div className="avatars">{["🤱","👶","💗","🩺","🌸"].map((e, i) => <div className="avatar" key={i}>{e}</div>)}</div>
              <span className="social-text">+5K MAMAS JOINED</span>
            </div>
          </div>
        </div>
        <div className="hero-mockup">
          <div className="mockup-card">
            <div className="mockup-header"><div className="mockup-bar" /><div className="mockup-plus">+</div></div>
            <div className="mockup-pill-dark" /><div className="mockup-pill-gray" />
            <div className="mockup-stethoscope"><span style={{ fontSize: 48 }}>🩺</span></div>
            <div className="mockup-btns"><div className="mockup-btn-ghost" /><div className="mockup-btn-fill" /></div>
          </div>
          <div className="mockup-floating"><div className="floating-dot" /><span className="floating-text">Midwife Online Now</span></div>
        </div>
      </section>

      <section className="strategy">
        <p className="section-label">Our Strategy</p>
        <div className="strategy-grid">
          {[
            { icon: "📱", title: "Digital Consultations", desc: "Connect with certified midwives via video, voice, or chat — anytime, anywhere across Kenya." },
            { icon: "📚", title: "Health Education", desc: "Curated, evidence-based content tailored to every stage of pregnancy and early childhood." },
            { icon: "🤝", title: "Community Support", desc: "Peer networks and support groups facilitated by qualified maternal health professionals." },
          ].map((s) => (
            <div className="strategy-card" key={s.title}>
              <div className="strategy-icon">{s.icon}</div>
              <div className="strategy-title">{s.title}</div>
              <div className="strategy-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="why">
        <h2>Why choose Smart Mama?</h2>
        <div className="why-grid">
          {[
            { icon: "💗", title: "Midwife-Led Care", desc: "Professional support from seasoned midwives ensuring every mother feels confident and safe." },
            { icon: "📹", title: "Instant Access", desc: "Consult with maternal health experts from the comfort of your home at any time." },
            { icon: "📖", title: "Expert Knowledge", desc: "Evidence-based resources curated by clinical specialists for every growth stage." },
          ].map((w) => (
            <div key={w.title}>
              <div className="why-icon-wrap"><span style={{ fontSize: 28 }}>{w.icon}</span></div>
              <div className="why-title">{w.title}</div>
              <div className="why-desc">{w.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-section">
        <div style={{ marginBottom: 28 }}><HeartSVG size={48} stroke="#FF1F8E" /></div>
        <h2 className="cta-title">Ready for a safer journey?</h2>
        <button className="btn-cta" onClick={() => openModal("auth")}>Become a Smart Mama</button>
      </section>

      <footer className="footer">
        <p className="footer-text">© 2026 Smart Mama · Midwife-Led Initiative Kenya</p>
      </footer>

      {/* AUTH MODAL */}
      {modal === "auth" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-title">{authTab === "login" ? "Welcome Back" : "Join Smart Mama"}</div>
            <div className="modal-sub">{authTab === "login" ? "Sign in to your account" : "Create your free account"}</div>
            <div className="modal-tabs">
              <button className={`modal-tab ${authTab === "login" ? "active" : ""}`} onClick={() => { setAuthTab("login"); resetForm(); }}>Sign In</button>
              <button className={`modal-tab ${authTab === "register" ? "active" : ""}`} onClick={() => { setAuthTab("register"); resetForm(); }}>Register</button>
            </div>
            {error && <div className="modal-error">{error}</div>}
            {authTab === "register" && (
              <div className="modal-field"><label>Full Name</label>
                <input placeholder="e.g. Amina Wanjiku" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
            )}
            <div className="modal-field"><label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            {authTab === "register" && (
              <div className="modal-field"><label>Phone Number</label>
                <input placeholder="+254 7XX XXX XXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            )}
            <div className="modal-field"><label>Password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button className="modal-submit" onClick={handleAuth} disabled={loading}>
              {loading ? "Please wait..." : authTab === "login" ? "Sign In →" : "Create Account →"}
            </button>
          </div>
        </div>
      )}

      {/* CONSULTATION MODAL */}
      {modal === "consultation" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-title">Free Consultation</div>
            <div className="modal-sub">{user ? "Tell us what you need help with." : "Please sign in first to book a consultation."}</div>
            {error && <div className="modal-error">{error}</div>}
            {success && <div className="modal-success">{success}</div>}
            {!user ? (
              <button className="modal-submit" onClick={() => { closeModal(); openModal("auth"); }}>Sign In to Continue →</button>
            ) : (
              <>
                <div className="modal-field"><label>Message (optional)</label>
                  <input placeholder="Describe your concern..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
                <button className="modal-submit" onClick={handleConsultation} disabled={loading}>{loading ? "Booking..." : "Book Consultation →"}</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
