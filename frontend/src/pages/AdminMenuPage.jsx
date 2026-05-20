import { useEffect, useState } from "react";
import api from "../api/api";

const IconPlus    = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>;
const IconTrash   = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;
const IconMenu    = ({size=14}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>;
const IconEmpty   = ({size=38}) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" style={{opacity:0.3}}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>;

export default function AdminMenuPage() {
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({ name:"", description:"", price:"", stock:"" });
  const [submitting, setSubmitting] = useState(false);

  const fetchMenus = async () => {
    const res = await api.get("/menus/");
    setMenus(res.data);
  };

  useEffect(() => { fetchMenus(); }, []);

  const createMenu = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/menus/", {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      setForm({ name:"", description:"", price:"", stock:"" });
      fetchMenus();
    } finally {
      setSubmitting(false);
    }
  };

  const deleteMenu = async (id) => {
    if (!confirm("Yakin hapus menu ini?")) return;
    await api.delete(`/menus/${id}`);
    fetchMenus();
  };

  const inputStyle = {
    width:'100%', padding:'0.62rem 0.875rem',
    border:'1.5px solid var(--border)',
    borderRadius:'9px',
    fontFamily:"'Plus Jakarta Sans', sans-serif",
    fontSize:'0.88rem', outline:'none',
    background:'var(--cream)', color:'var(--text-dark)',
    boxSizing:'border-box', transition:'border-color 0.2s, background 0.2s',
  };

  const labelStyle = {
    display:'block', fontSize:'0.7rem', fontWeight:'700',
    color:'var(--text-mid)', marginBottom:'5px', letterSpacing:'0.09em',
    textTransform:'uppercase',
  };

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2.5rem 1.75rem' }}>

      {/* Header */}
      <div style={{ marginBottom:'2rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'4px' }}>
          <div style={{ width:'3px', height:'26px', background:'linear-gradient(180deg, #D4A017, #7D1128)', borderRadius:'2px' }} />
          <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'1.9rem', fontWeight:'700', color:'var(--maroon)', margin:0 }}>
            Kelola Menu Kantin
          </h1>
        </div>
        <p style={{ color:'var(--text-muted)', marginLeft:'13px', fontSize:'0.87rem', margin:'0 0 0 13px' }}>
          Tambah, lihat, dan hapus item menu
        </p>
      </div>

      {/* Add Form */}
      <div style={{
        background:'#FFFFFF', borderRadius:'16px', padding:'1.8rem',
        marginBottom:'1.75rem',
        boxShadow:'var(--shadow-md)', border:'1.5px solid var(--border)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'1.4rem', paddingBottom:'1.1rem', borderBottom:'1px solid var(--border)' }}>
          <div style={{
            width:'38px', height:'38px',
            background:'linear-gradient(135deg, #7D1128, #531019)',
            borderRadius:'10px',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#D4A017',
          }}>
            <IconMenu size={16} />
          </div>
          <div>
            <div style={{ fontWeight:'700', color:'var(--text-dark)', fontSize:'0.97rem' }}>Tambah Menu Baru</div>
            <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>Isi formulir berikut untuk menambahkan item</div>
          </div>
        </div>

        <form onSubmit={createMenu}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'1rem', marginBottom:'1.1rem' }}>
            {[
              { key:'name',        label:'Nama Menu',   placeholder:'Nasi Goreng',    type:'text',   required:true },
              { key:'description', label:'Deskripsi',   placeholder:'Deskripsi singkat...', type:'text', required:false },
              { key:'price',       label:'Harga (Rp)',  placeholder:'15000',          type:'number', required:true },
              { key:'stock',       label:'Stok',        placeholder:'50',             type:'number', required:true },
            ].map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}{f.required && <span style={{color:'#DC2626',marginLeft:'2px'}}>*</span>}</label>
                <input
                  style={inputStyle}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--maroon)'; e.target.style.background = '#fff'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--cream)'; }}
                  required={f.required}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              display:'flex', alignItems:'center', gap:'6px',
              padding:'0.68rem 1.75rem', borderRadius:'9px', border:'none',
              background: submitting ? '#E5E5E5' : 'linear-gradient(135deg, #7D1128, #531019)',
              color: submitting ? '#999' : '#FFFFFF',
              fontFamily:"'Plus Jakarta Sans', sans-serif",
              fontWeight:'700', fontSize:'0.9rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: submitting ? 'none' : '0 4px 14px rgba(125,17,40,0.28)',
              transition:'all 0.2s ease',
            }}
            onMouseEnter={(e) => { if (!submitting) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(125,17,40,0.35)'; }}}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = submitting ? 'none' : '0 4px 14px rgba(125,17,40,0.28)'; }}
          >
            {submitting ? 'Menyimpan...' : <><IconPlus size={13} /> Tambah Menu</>}
          </button>
        </form>
      </div>

      {/* Table */}
      <div style={{
        background:'#FFFFFF', borderRadius:'16px',
        boxShadow:'var(--shadow-sm)', border:'1.5px solid var(--border)', overflow:'hidden',
      }}>
        {/* Table header */}
        <div style={{
          background:'linear-gradient(135deg, #531019, #7D1128)',
          padding:'0.9rem 1.5rem',
          display:'grid', gridTemplateColumns:'2fr 1fr 1fr 90px',
          gap:'1rem',
        }}>
          {['Menu', 'Harga', 'Stok', 'Aksi'].map((h) => (
            <div key={h} style={{ color:'rgba(255,255,255,0.8)', fontSize:'0.7rem', fontWeight:'700', letterSpacing:'0.12em', textTransform:'uppercase' }}>
              {h}
            </div>
          ))}
        </div>

        {menus.map((menu, i) => (
          <div
            key={menu.id}
            style={{
              padding:'0.95rem 1.5rem',
              display:'grid', gridTemplateColumns:'2fr 1fr 1fr 90px',
              gap:'1rem', alignItems:'center',
              borderBottom:'1px solid var(--border)',
              background: i % 2 === 0 ? '#FFFFFF' : '#FDFBFC',
              transition:'background 0.15s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--maroon-pale)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = i % 2 === 0 ? '#FFFFFF' : '#FDFBFC'; }}
          >
            <div>
              <div style={{ fontWeight:'600', color:'var(--text-dark)', fontSize:'0.9rem' }}>{menu.name}</div>
              {menu.description && <div style={{ fontSize:'0.76rem', color:'var(--text-muted)', marginTop:'2px' }}>{menu.description}</div>}
            </div>
            <div style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:'700', color:'var(--maroon)', fontSize:'0.95rem' }}>
              Rp {menu.price.toLocaleString("id-ID")}
            </div>
            <div>
              <span style={{
                display:'inline-block', padding:'2px 11px', borderRadius:'20px',
                background: menu.stock > 0 ? '#F0FDF4' : '#FEF2F2',
                color: menu.stock > 0 ? '#166534' : '#991B1B',
                border: `1px solid ${menu.stock > 0 ? '#BBF7D0' : '#FECACA'}`,
                fontSize:'0.78rem', fontWeight:'600',
              }}>
                {menu.stock}
              </span>
            </div>
            <div>
              <button
                onClick={() => deleteMenu(menu.id)}
                style={{
                  display:'flex', alignItems:'center', gap:'5px',
                  padding:'0.35rem 0.8rem', borderRadius:'8px',
                  border:'1.5px solid var(--border)',
                  background:'#fff', color:'var(--maroon)',
                  fontFamily:"'Plus Jakarta Sans', sans-serif",
                  fontWeight:'600', fontSize:'0.78rem', cursor:'pointer',
                  transition:'all 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#7D1128'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#7D1128'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--maroon)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
              >
                <IconTrash size={12} /> Hapus
              </button>
            </div>
          </div>
        ))}

        {menus.length === 0 && (
          <div style={{ padding:'3.5rem', textAlign:'center', color:'var(--text-muted)' }}>
            <IconEmpty size={38} />
            <p style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'1.05rem', marginTop:'0.75rem' }}>
              Belum ada menu. Tambahkan menu pertama Anda!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
