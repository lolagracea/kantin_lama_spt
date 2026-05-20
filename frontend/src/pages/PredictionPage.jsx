import { useState } from "react";
import api from "../api/api";

const DAY_NAMES = ['', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

const IconActivity  = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IconBarChart  = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
const IconLayers    = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
const IconLoader    = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{animation:'spin 1s linear infinite'}}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>;
const IconArrow     = ({size=16}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IconInfo      = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;

export default function PredictionPage() {
  const [form, setForm] = useState({ day_of_week:1, hour:12, menu_id:1, stock_start:50 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const predict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await api.post("/predictions/demand", {
        day_of_week: Number(form.day_of_week),
        hour: Number(form.hour),
        menu_id: Number(form.menu_id),
        stock_start: Number(form.stock_start),
      });
      setResult(res.data.result);
    } catch (error) {
      alert(error.response?.data?.detail || "Prediksi gagal");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width:'100%', padding:'0.68rem 1rem',
    border:'1.5px solid var(--border)',
    borderRadius:'9px',
    fontFamily:"'Plus Jakarta Sans', sans-serif",
    fontSize:'0.9rem', outline:'none',
    background:'var(--cream)', color:'var(--text-dark)',
    boxSizing:'border-box', transition:'border-color 0.2s, background 0.2s',
  };

  const labelStyle = {
    display:'block', fontSize:'0.7rem', fontWeight:'700',
    color:'var(--text-mid)', marginBottom:'6px', letterSpacing:'0.09em',
    textTransform:'uppercase',
  };

  return (
    <div style={{ maxWidth:'860px', margin:'0 auto', padding:'2.5rem 1.75rem' }}>

      {/* Header */}
      <div style={{ marginBottom:'2rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
          <div style={{ width:'3px', height:'26px', background:'linear-gradient(180deg, #D4A017, #7D1128)', borderRadius:'2px' }} />
          <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'1.9rem', fontWeight:'700', color:'var(--maroon)', margin:0 }}>
            Prediksi Permintaan
          </h1>
        </div>
        <p style={{ color:'var(--text-muted)', marginLeft:'13px', fontSize:'0.87rem', margin:'0 0 0 13px' }}>
          GPU-Based Demand Prediction — Estimasi kebutuhan stok menu
        </p>
      </div>

      {/* Form Card */}
      <div style={{
        background:'#FFFFFF', borderRadius:'16px', padding:'2rem',
        marginBottom:'1.75rem',
        boxShadow:'var(--shadow-md)', border:'1.5px solid var(--border)',
      }}>
        <div style={{
          display:'flex', alignItems:'center', gap:'12px',
          marginBottom:'1.6rem', paddingBottom:'1.1rem', borderBottom:'1px solid var(--border)',
        }}>
          <div style={{
            width:'42px', height:'42px',
            background:'linear-gradient(135deg, #7D1128, #531019)',
            borderRadius:'11px',
            display:'flex', alignItems:'center', justifyContent:'center', color:'#D4A017',
          }}>
            <IconActivity size={18} />
          </div>
          <div>
            <div style={{ fontWeight:'700', color:'var(--text-dark)', fontSize:'0.97rem' }}>Parameter Prediksi</div>
            <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>Isi data di bawah untuk mendapatkan estimasi</div>
          </div>
        </div>

        <form onSubmit={predict}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:'1.1rem', marginBottom:'1.5rem' }}>
            <div>
              <label style={labelStyle}>Hari</label>
              <select
                value={form.day_of_week}
                onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
                style={{ ...inputStyle, cursor:'pointer', appearance:'none' }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--maroon)'; e.target.style.background = '#fff'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--cream)'; }}
              >
                {[1,2,3,4,5,6,7].map(d => (
                  <option key={d} value={d}>{d} — {DAY_NAMES[d]}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Jam (0–23)</label>
              <input
                type="number" min={0} max={23} placeholder="12"
                value={form.hour}
                onChange={(e) => setForm({ ...form, hour: e.target.value })}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'var(--maroon)'; e.target.style.background = '#fff'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--cream)'; }}
              />
            </div>

            <div>
              <label style={labelStyle}>Menu ID</label>
              <input
                type="number" min={1} placeholder="1"
                value={form.menu_id}
                onChange={(e) => setForm({ ...form, menu_id: e.target.value })}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'var(--maroon)'; e.target.style.background = '#fff'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--cream)'; }}
              />
            </div>

            <div>
              <label style={labelStyle}>Stok Awal</label>
              <input
                type="number" min={0} placeholder="50"
                value={form.stock_start}
                onChange={(e) => setForm({ ...form, stock_start: e.target.value })}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = 'var(--maroon)'; e.target.style.background = '#fff'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--cream)'; }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width:'100%', padding:'0.85rem',
              borderRadius:'11px', border:'none',
              background: loading ? '#E5E5E5' : 'linear-gradient(135deg, #7D1128 0%, #531019 100%)',
              color: loading ? '#999' : '#FFFFFF',
              fontFamily:"'Plus Jakarta Sans', sans-serif",
              fontWeight:'700', fontSize:'0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing:'0.02em',
              boxShadow: loading ? 'none' : '0 6px 20px rgba(125,17,40,0.32)',
              transition:'all 0.2s ease',
              display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
            }}
            onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(125,17,40,0.38)'; }}}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = loading ? 'none' : '0 6px 20px rgba(125,17,40,0.32)'; }}
          >
            {loading ? <><IconLoader size={15} /> Memproses...</> : <><IconArrow size={15} /> Jalankan Prediksi</>}
          </button>
        </form>
      </div>

      {/* Result */}
      {result && (
        <div style={{
          background:'#FFFFFF', borderRadius:'16px', padding:'2rem',
          boxShadow:'var(--shadow-md)', border:'1.5px solid var(--border)',
          animation:'fadeInUp 0.45s ease both',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'1.5rem' }}>
            <div style={{ color:'var(--gold)', display:'flex' }}><IconBarChart size={18} /></div>
            <h2 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'1.45rem', fontWeight:'700', color:'var(--maroon)', margin:0 }}>
              Hasil Prediksi
            </h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.1rem', marginBottom:'1.1rem' }}>
            <div style={{
              background:'linear-gradient(135deg, #FBF0F2, #F9EEF1)',
              borderRadius:'14px', padding:'1.5rem',
              borderLeft:'4px solid var(--maroon)', textAlign:'center',
            }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', color:'var(--text-muted)', fontSize:'0.7rem', fontWeight:'700', letterSpacing:'0.12em', marginBottom:'0.7rem', textTransform:'uppercase' }}>
                <IconActivity size={11} /> Prediksi Permintaan
              </div>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'3.2rem', fontWeight:'700', color:'var(--maroon)', lineHeight:1 }}>
                {result.predicted_demand}
              </div>
              <div style={{ color:'var(--text-muted)', fontSize:'0.82rem', marginTop:'5px' }}>porsi</div>
            </div>

            <div style={{
              background:'linear-gradient(135deg, #F0FDF4, #ECFDF5)',
              borderRadius:'14px', padding:'1.5rem',
              borderLeft:'4px solid #16A34A', textAlign:'center',
            }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'5px', color:'#4D7C60', fontSize:'0.7rem', fontWeight:'700', letterSpacing:'0.12em', marginBottom:'0.7rem', textTransform:'uppercase' }}>
                <IconLayers size={11} /> Rekomendasi Stok
              </div>
              <div style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'3.2rem', fontWeight:'700', color:'#16A34A', lineHeight:1 }}>
                {result.recommended_stock}
              </div>
              <div style={{ color:'#4D7C60', fontSize:'0.82rem', marginTop:'5px' }}>porsi</div>
            </div>
          </div>

          <div style={{
            padding:'0.9rem 1.1rem',
            background:'var(--gold-pale)', borderRadius:'10px',
            border:'1px solid rgba(184,134,11,0.25)',
            display:'flex', alignItems:'flex-start', gap:'9px',
            fontSize:'0.82rem', color:'#7A5C00',
          }}>
            <span style={{ marginTop:'1px', flexShrink:0, color:'var(--gold)' }}><IconInfo size={14} /></span>
            <span>Prediksi dihasilkan berdasarkan model GPU. Gunakan sebagai panduan stok, bukan keputusan mutlak.</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
