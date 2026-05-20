import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminMenuPage from "./pages/AdminMenuPage";
import PredictionPage from "./pages/PredictionPage";

const NAV_LINKS = [
  { to: "/",                 label: "Menu",        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg> },
  { to: "/admin/orders",     label: "Pesanan",     icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
  { to: "/admin/menus",      label: "Kelola Menu", icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg> },
  { to: "/admin/prediction", label: "Prediksi",   icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg> },
];

function NavLink({ to, label, icon }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        color: isActive ? '#D4A017' : 'rgba(255,255,255,0.78)',
        fontWeight: isActive ? '600' : '400',
        textDecoration: 'none',
        fontSize: '0.85rem',
        letterSpacing: '0.01em',
        padding: '6px 2px',
        borderBottom: isActive ? '2px solid #D4A017' : '2px solid transparent',
        transition: 'all 0.2s ease',
      }}
    >
      <span style={{ opacity: isActive ? 1 : 0.7 }}>{icon}</span>
      {label}
    </Link>
  );
}

const LogoIcon = () => (
  <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="10" fill="url(#logoGrad)"/>
    <path d="M10 27c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#531019" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="20" cy="13" r="3" fill="#531019"/>
    <path d="M14 27h12" stroke="#531019" strokeWidth="2" strokeLinecap="round"/>
    <defs>
      <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#D4A017"/>
        <stop offset="1" stopColor="#B8860B"/>
      </linearGradient>
    </defs>
  </svg>
);

function Layout() {
  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>
      {/* Top accent line */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #B8860B 0%, #D4A017 50%, #7D1128 100%)' }} />

      {/* Navbar */}
      <nav style={{
        background: 'linear-gradient(160deg, #531019 0%, #7D1128 55%, #6B0F22 100%)',
        padding: '0 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 20px rgba(83,16,25,0.45)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        minHeight: '62px',
        backdropFilter: 'blur(8px)',
      }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '11px' }}>
          <LogoIcon />
          <div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.2rem',
              fontWeight: '700',
              color: '#FFFFFF',
              lineHeight: 1.1,
              letterSpacing: '0.02em',
            }}>Kantin Lama</div>
            <div style={{ fontSize: '0.65rem', color: '#D4A017', letterSpacing: '0.18em', fontWeight: '600', textTransform: 'uppercase' }}>
              Institut Teknologi Del
            </div>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          {NAV_LINKS.map(l => <NavLink key={l.to} {...l} />)}
        </div>
      </nav>

      <main style={{ flex: 1, background: 'var(--cream)' }}>
        <Routes>
          <Route path="/"                 element={<MenuPage />} />
          <Route path="/admin/orders"     element={<AdminDashboardPage />} />
          <Route path="/admin/menus"      element={<AdminMenuPage />} />
          <Route path="/admin/prediction" element={<PredictionPage />} />
        </Routes>
      </main>

      <footer style={{
        background: 'linear-gradient(135deg, #330A10 0%, #531019 100%)',
        color: 'rgba(255,255,255,0.45)',
        textAlign: 'center',
        padding: '1.1rem',
        fontSize: '0.78rem',
        letterSpacing: '0.06em',
        borderTop: '1px solid rgba(212,160,23,0.15)',
      }}>
        © 2025 Kantin Lama — Institut Teknologi Del &nbsp;·&nbsp; Sistem Pemesanan Cerdas
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
