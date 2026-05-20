import { useEffect, useState } from "react";
import api from "../api/api";

const IconClock    = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconChef     = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/><line x1="6" y1="17" x2="18" y2="17"/></svg>;
const IconCheck    = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconStar     = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const IconX        = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>;
const IconRefresh  = ({size=15}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>;
const IconEmpty    = ({size=38}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{opacity:0.3}}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>;
const IconHash     = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/></svg>;

const STATUS_CONFIG = {
  waiting:    { label:'Menunggu',   bg:'#FFF8E1', color:'#92650A', icon:<IconClock size={13}/>,  border:'#FDD97C' },
  processing: { label:'Diproses',   bg:'#FBF0F2', color:'#7D1128', icon:<IconChef size={13}/>,   border:'#EDD0D7' },
  ready:      { label:'Siap',       bg:'#F0FDF4', color:'#166534', icon:<IconCheck size={13}/>,  border:'#BBF7D0' },
  completed:  { label:'Selesai',    bg:'#EFF6FF', color:'#1E40AF', icon:<IconStar size={13}/>,   border:'#BFDBFE' },
  cancelled:  { label:'Dibatalkan', bg:'#FEF2F2', color:'#991B1B', icon:<IconX size={13}/>,      border:'#FECACA' },
};

const ACTIONS = [
  { status:'processing', label:'Proses',  icon:<IconChef size={13}/>,  bg:'#D97706', hover:'#B45309' },
  { status:'ready',      label:'Siap',    icon:<IconCheck size={13}/>, bg:'#16A34A', hover:'#15803D' },
  { status:'completed',  label:'Selesai', icon:<IconStar size={13}/>,  bg:'#2563EB', hover:'#1D4ED8' },
  { status:'cancelled',  label:'Batal',   icon:<IconX size={13}/>,     bg:'#DC2626', hover:'#B91C1C' },
];

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const res = await api.get("/orders/");
    setOrders(res.data);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, status) => {
    await api.patch(`/orders/${orderId}/status`, { status });
    fetchOrders();
  };

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2.5rem 1.75rem' }}>

      {/* Header */}
      <div style={{ marginBottom:'2rem', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
            <div style={{ width:'3px', height:'26px', background:'linear-gradient(180deg, #D4A017, #7D1128)', borderRadius:'2px' }} />
            <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'1.9rem', fontWeight:'700', color:'var(--maroon)', margin:0 }}>
              Dashboard Pesanan
            </h1>
          </div>
          <p style={{ color:'var(--text-muted)', marginLeft:'13px', fontSize:'0.87rem', margin:'0 0 0 13px' }}>
            Kelola dan perbarui status pesanan pelanggan
          </p>
        </div>
        <button
          onClick={fetchOrders}
          style={{
            display:'flex', alignItems:'center', gap:'6px',
            padding:'0.5rem 1rem', borderRadius:'9px',
            border:'1.5px solid var(--border)', background:'#fff',
            color:'var(--text-mid)', fontSize:'0.82rem', fontWeight:'600',
            cursor:'pointer', transition:'all 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--maroon)'; e.currentTarget.style.color = 'var(--maroon)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-mid)'; }}
        >
          <IconRefresh size={13} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'0.85rem', marginBottom:'2rem' }}>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const count = orders.filter(o => o.status === key).length;
          return (
            <div key={key} style={{
              background:'#fff', borderRadius:'12px', padding:'1rem 1.1rem',
              boxShadow:'var(--shadow-sm)',
              border:`1.5px solid ${cfg.border}`,
              display:'flex', flexDirection:'column', gap:'6px',
            }}>
              <div style={{ color:cfg.color, display:'flex' }}>{cfg.icon}</div>
              <div style={{ fontSize:'1.6rem', fontWeight:'700', color:cfg.color, fontFamily:"'Cormorant Garamond', serif", lineHeight:1 }}>{count}</div>
              <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', fontWeight:'500' }}>{cfg.label}</div>
            </div>
          );
        })}
      </div>

      {/* Orders */}
      <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
        {orders.map((order, i) => {
          const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.waiting;
          return (
            <div key={order.id} style={{
              background:'#FFFFFF', borderRadius:'14px', padding:'1.35rem 1.5rem',
              boxShadow:'var(--shadow-sm)',
              border:`1.5px solid ${cfg.border}`,
              animation:`fadeInUp 0.4s ease ${i * 0.05}s both`,
              display:'flex', justifyContent:'space-between', alignItems:'center',
              flexWrap:'wrap', gap:'1rem',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:'1.1rem', flex:1 }}>
                <div style={{
                  width:'50px', height:'50px',
                  background:'linear-gradient(135deg, #7D1128, #531019)',
                  borderRadius:'12px',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'2px' }}>
                    <span style={{ color:'rgba(212,160,23,0.7)', display:'flex' }}><IconHash size={10} /></span>
                    <span style={{ color:'#fff', fontFamily:"'Cormorant Garamond', serif", fontWeight:'700', fontSize:'0.95rem' }}>{order.queue_number}</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight:'600', fontSize:'0.97rem', color:'var(--text-dark)', marginBottom:'2px' }}>
                    {order.customer_name}
                  </div>
                  <div style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>
                    Total: <strong style={{ color:'var(--maroon)' }}>Rp {order.total_price.toLocaleString("id-ID")}</strong>
                  </div>
                  <span style={{
                    display:'inline-flex', alignItems:'center', gap:'4px',
                    marginTop:'5px', padding:'2px 9px',
                    borderRadius:'20px', background:cfg.bg, color:cfg.color,
                    fontSize:'0.7rem', fontWeight:'600', border:`1px solid ${cfg.border}`,
                  }}>
                    {cfg.icon} {cfg.label}
                  </span>
                </div>
              </div>

              <div style={{ display:'flex', flexWrap:'wrap', gap:'0.45rem' }}>
                {ACTIONS.map((btn) => (
                  <button
                    key={btn.status}
                    onClick={() => updateStatus(order.id, btn.status)}
                    style={{
                      display:'flex', alignItems:'center', gap:'5px',
                      padding:'0.42rem 0.85rem', borderRadius:'8px', border:'none',
                      background:btn.bg, color:'#FFFFFF',
                      fontFamily:"'Plus Jakarta Sans', sans-serif",
                      fontWeight:'600', fontSize:'0.78rem',
                      cursor:'pointer', transition:'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = btn.hover; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = btn.bg; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {btn.icon} {btn.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
          <div style={{
            background:'#FFFFFF', borderRadius:'14px', padding:'4rem',
            textAlign:'center', color:'var(--text-muted)',
            boxShadow:'var(--shadow-sm)', border:'1.5px solid var(--border)',
          }}>
            <IconEmpty size={40} />
            <p style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'1.1rem', marginTop:'1rem', color:'var(--text-muted)' }}>
              Belum ada pesanan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
