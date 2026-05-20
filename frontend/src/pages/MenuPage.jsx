import { useEffect, useState } from "react";
import api from "../api/api";

const IconCart = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const IconPlus = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);

const IconMinus = ({ size = 12 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M5 12h14"/>
  </svg>
);

const IconCheckout = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconEmpty = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.35 }}>
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const IconFork = ({ size = 38 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>
  </svg>
);

const IconUser = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

export default function MenuPage() {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");

  const fetchMenus = async () => {
    const res = await api.get("/menus/");
    setMenus(res.data);
  };

  useEffect(() => { fetchMenus(); }, []);

  const addToCart = (menu) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.menu_item_id === menu.id);
      if (existing) {
        return prev.map((item) =>
          item.menu_item_id === menu.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { menu_item_id: menu.id, name: menu.name, price: menu.price, quantity: 1 }];
    });
  };

  const removeFromCart = (menuItemId) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.menu_item_id === menuItemId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.menu_item_id === menuItemId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.menu_item_id !== menuItemId);
    });
  };

  const checkout = async () => {
    if (!customerName.trim()) { alert("Nama pelanggan wajib diisi"); return; }
    if (cart.length === 0) { alert("Keranjang masih kosong"); return; }
    const idempotencyKey = crypto.randomUUID();
    const payload = {
      customer_name: customerName,
      items: cart.map((item) => ({ menu_item_id: item.menu_item_id, quantity: item.quantity })),
    };
    try {
      const res = await api.post("/orders/checkout", payload, {
        headers: { "Idempotency-Key": idempotencyKey },
      });
      alert(`Pesanan berhasil! Nomor antrian: ${res.data.queue_number}`);
      setCart([]);
      setCustomerName("");
      fetchMenus();
    } catch (error) {
      alert(error.response?.data?.detail || "Checkout gagal");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ maxWidth: '1220px', margin: '0 auto', padding: '2.5rem 1.75rem' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(140deg, #531019 0%, #7D1128 45%, #6B0F22 75%, #531019 100%)',
        borderRadius: '20px',
        padding: '2.75rem 3.25rem',
        marginBottom: '2.75rem',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 16px 48px rgba(83,16,25,0.3)',
      }}>
        {/* Decorative shapes */}
        <div style={{ position:'absolute', top:'-50px', right:'-30px', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(212,160,23,0.1)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-70px', right:'120px', width:'240px', height:'240px', borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'30px', right:'200px', width:'80px', height:'80px', borderRadius:'50%', background:'rgba(212,160,23,0.06)', pointerEvents:'none' }} />

        <div style={{ position:'relative' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'0.8rem' }}>
            <div style={{ width:'32px', height:'2px', background:'#D4A017', borderRadius:'2px' }} />
            <span style={{ color:'#D4A017', fontSize:'0.72rem', fontWeight:'600', letterSpacing:'0.2em', textTransform:'uppercase' }}>
              Selamat Datang
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2rem, 4vw, 3.2rem)',
            fontWeight: '700',
            color: '#FFFFFF',
            margin: '0 0 0.65rem',
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
          }}>
            Kantin Lama<br />
            <span style={{ color:'#D4A017' }}>IT Del</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.92rem', margin:0, maxWidth:'380px', lineHeight:1.6 }}>
            Sistem pemesanan dan antrian cerdas berbasis web.
          </p>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'2rem', alignItems:'start' }}>

        {/* Menu Grid */}
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'1.5rem' }}>
            <div style={{ width:'3px', height:'22px', background:'linear-gradient(180deg, #D4A017, #B8860B)', borderRadius:'2px' }} />
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.55rem',
              fontWeight: '700',
              color: 'var(--maroon)',
              margin: 0,
            }}>
              Pilihan Menu
            </h2>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(230px, 1fr))', gap:'1.25rem' }}>
            {menus.map((menu, i) => {
              const inCart = cart.find((c) => c.menu_item_id === menu.id);
              const available = menu.stock > 0 && menu.is_available;
              return (
                <div
                  key={menu.id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '1.4rem',
                    boxShadow: inCart ? '0 4px 24px rgba(125,17,40,0.14)' : '0 2px 12px rgba(125,17,40,0.06)',
                    border: inCart ? '1.5px solid #9E1633' : '1.5px solid var(--border)',
                    transition: 'all 0.2s ease',
                    animation: `fadeInUp 0.4s ease ${i * 0.055}s both`,
                    position: 'relative',
                    cursor: available ? 'default' : 'not-allowed',
                  }}
                  onMouseEnter={(e) => { if (available) e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = inCart ? '0 6px 28px rgba(125,17,40,0.18)' : '0 4px 18px rgba(125,17,40,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = inCart ? '0 4px 24px rgba(125,17,40,0.14)' : '0 2px 12px rgba(125,17,40,0.06)'; }}
                >
                  {/* Qty badge */}
                  {inCart && (
                    <div style={{
                      position:'absolute', top:'10px', right:'10px',
                      background:'#7D1128', color:'#fff',
                      borderRadius:'50%', width:'22px', height:'22px',
                      fontSize:'0.72rem', fontWeight:'700',
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      {inCart.quantity}
                    </div>
                  )}

                  <div style={{ marginBottom:'0.8rem' }}>
                    <div style={{
                      display:'inline-flex', alignItems:'center', gap:'4px',
                      background: available ? '#FBF0F2' : '#F5F4F2',
                      color: available ? '#7D1128' : '#9E9E9E',
                      fontSize:'0.68rem', fontWeight:'700',
                      letterSpacing:'0.1em',
                      padding:'2px 9px', borderRadius:'20px', marginBottom:'8px',
                    }}>
                      <span style={{
                        width:'5px', height:'5px', borderRadius:'50%',
                        background: available ? '#7D1128' : '#BDBDBD',
                        display:'inline-block',
                      }} />
                      {available ? 'TERSEDIA' : 'HABIS'}
                    </div>
                    <h3 style={{
                      fontFamily:"'Cormorant Garamond', serif",
                      fontSize:'1.15rem', fontWeight:'700',
                      margin:'0 0 5px', color:'var(--text-dark)', lineHeight:1.25,
                    }}>
                      {menu.name}
                    </h3>
                    <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', margin:0, lineHeight:1.55 }}>
                      {menu.description || 'Tidak ada deskripsi'}
                    </p>
                  </div>

                  <div style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    marginBottom:'1rem', paddingTop:'0.75rem',
                    borderTop:'1px solid var(--border)',
                  }}>
                    <span style={{
                      fontFamily:"'Cormorant Garamond', serif",
                      fontSize:'1.15rem', fontWeight:'700', color:'var(--maroon)',
                    }}>
                      Rp {menu.price.toLocaleString("id-ID")}
                    </span>
                    <span style={{
                      fontSize:'0.72rem', color:'var(--text-muted)',
                      background:'var(--cream-mid)', padding:'2px 9px', borderRadius:'20px',
                    }}>
                      Stok: {menu.stock}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(menu)}
                    disabled={!available}
                    style={{
                      width:'100%', padding:'0.6rem',
                      borderRadius:'9px', border:'none',
                      background: available ? 'linear-gradient(135deg, #7D1128, #531019)' : '#EBEBEB',
                      color: available ? '#FFFFFF' : '#AAAAAA',
                      fontFamily:"'Plus Jakarta Sans', sans-serif",
                      fontWeight:'600', fontSize:'0.82rem',
                      cursor: available ? 'pointer' : 'not-allowed',
                      transition:'all 0.18s ease',
                      letterSpacing:'0.02em',
                      display:'flex', alignItems:'center', justifyContent:'center', gap:'6px',
                    }}
                  >
                    {available ? <><IconPlus size={13} /> Tambah ke Keranjang</> : 'Stok Habis'}
                  </button>
                </div>
              );
            })}

            {menus.length === 0 && (
              <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'4rem', color:'var(--text-muted)' }}>
                <IconFork size={40} />
                <p style={{ fontSize:'0.9rem', marginTop:'0.75rem' }}>Memuat menu...</p>
              </div>
            )}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.6rem',
          boxShadow: '0 6px 28px rgba(125,17,40,0.1)',
          position: 'sticky',
          top: '72px',
          border: '1.5px solid var(--border)',
        }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.4rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <div style={{ color:'var(--maroon)' }}><IconCart size={18} /></div>
              <h2 style={{
                fontFamily:"'Cormorant Garamond', serif",
                fontSize:'1.25rem', fontWeight:'700', color:'var(--maroon)', margin:0,
              }}>
                Keranjang
              </h2>
            </div>
            {cartCount > 0 && (
              <span style={{
                background:'var(--maroon)', color:'#fff',
                borderRadius:'20px', padding:'2px 11px',
                fontSize:'0.75rem', fontWeight:'700',
              }}>
                {cartCount}
              </span>
            )}
          </div>

          {/* Customer Name */}
          <div style={{ marginBottom:'1.15rem' }}>
            <label style={{ display:'flex', alignItems:'center', gap:'5px', fontSize:'0.72rem', fontWeight:'700', color:'var(--text-mid)', marginBottom:'6px', letterSpacing:'0.08em', textTransform:'uppercase' }}>
              <IconUser size={12} /> Nama Pelanggan
            </label>
            <input
              type="text"
              placeholder="Masukkan nama Anda..."
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              style={{
                width:'100%', padding:'0.6rem 0.85rem',
                border:'1.5px solid var(--border)',
                borderRadius:'9px',
                fontFamily:"'Plus Jakarta Sans', sans-serif",
                fontSize:'0.87rem', outline:'none',
                transition:'border-color 0.2s',
                boxSizing:'border-box', color:'var(--text-dark)',
                background:'var(--cream)',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#7D1128'; e.target.style.background = '#fff'; }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--cream)'; }}
            />
          </div>

          {cart.length === 0 ? (
            <div style={{ textAlign:'center', padding:'2rem 0', color:'var(--text-muted)' }}>
              <IconEmpty size={38} />
              <p style={{ fontSize:'0.85rem', margin:'0.5rem 0 0', color:'var(--text-light)' }}>Belum ada pesanan.</p>
            </div>
          ) : (
            <>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem', marginBottom:'1.1rem' }}>
                {cart.map((item) => (
                  <div key={item.menu_item_id} style={{
                    display:'flex', justifyContent:'space-between', alignItems:'center',
                    padding:'0.65rem 0.8rem', background:'var(--maroon-pale)', borderRadius:'9px',
                    border:'1px solid var(--maroon-muted)',
                  }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:'0.85rem', fontWeight:'600', color:'var(--text-dark)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{item.name}</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'1px' }}>
                        Rp {item.price.toLocaleString("id-ID")} × {item.quantity}
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'6px', marginLeft:'8px' }}>
                      <button
                        onClick={() => removeFromCart(item.menu_item_id)}
                        style={{ width:'22px', height:'22px', borderRadius:'50%', border:'1.5px solid var(--border)', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--maroon)' }}
                      ><IconMinus size={10} /></button>
                      <span style={{ fontWeight:'700', color:'var(--maroon)', minWidth:'18px', textAlign:'center', fontSize:'0.88rem' }}>{item.quantity}</span>
                      <button
                        onClick={() => addToCart({ id: item.menu_item_id, name: item.name, price: item.price })}
                        style={{ width:'22px', height:'22px', borderRadius:'50%', border:'none', background:'var(--maroon)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}
                      ><IconPlus size={10} /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={{
                borderTop:'1px dashed var(--maroon-muted)',
                paddingTop:'0.9rem', marginBottom:'1rem',
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}>
                <span style={{ fontWeight:'600', color:'var(--text-mid)', fontSize:'0.88rem' }}>Total Pembayaran</span>
                <span style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'1.2rem', fontWeight:'700', color:'var(--maroon)' }}>
                  Rp {total.toLocaleString("id-ID")}
                </span>
              </div>

              <button
                onClick={checkout}
                style={{
                  width:'100%', padding:'0.8rem',
                  borderRadius:'10px', border:'none',
                  background:'linear-gradient(135deg, #D4A017, #B8860B)',
                  color:'#2C1504',
                  fontFamily:"'Plus Jakarta Sans', sans-serif",
                  fontWeight:'700', fontSize:'0.92rem',
                  cursor:'pointer', letterSpacing:'0.02em',
                  boxShadow:'0 4px 14px rgba(184,134,11,0.35)',
                  transition:'all 0.2s ease',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:'7px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 7px 20px rgba(184,134,11,0.45)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(184,134,11,0.35)'; }}
              >
                <IconCheckout size={15} />
                Checkout Sekarang
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
