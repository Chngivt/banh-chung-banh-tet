import { useState } from 'react';
import './App.css';

function App() {
  // 1. CÁC BIẾN TRẠNG THÁI CƠ BẢN
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  
  // HOTLINE CÓ THỂ THAY ĐỔI
  const [hotline, setHotline] = useState('0914 073 866');

  // DỮ LIỆU SẢN PHẨM (Admin có thể Thêm/Sửa/Xóa)
  const [products, setProducts] = useState([
    { id: 1, name: 'BÁNH CHƯNG XANH TRUYỀN THỐNG', price: '120,000đ', oldPrice: '150,000đ', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&auto=format&fit=crop&q=60', inStock: true, category: 'Bánh Chưng', badge: 'BÁN CHẠY' },
    { id: 2, name: 'BÁNH TÉT TRÀ CUÔN ĐẶC BIỆT', price: '150,000đ', oldPrice: '180,000đ', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60', inStock: true, category: 'Bánh Tét', badge: 'HOT' },
    { id: 3, name: 'BÁNH CHƯNG GẤC ĐỎ MAY MẮN', price: '140,000đ', oldPrice: '', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&auto=format&fit=crop&q=60', inStock: false, category: 'Bánh Chưng', badge: 'HẾT HÀNG' },
    { id: 4, name: 'BÁNH TÉT NHÂN CHUỐI ĐỒNG THÁP', price: '95,000đ', oldPrice: '110,000đ', image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=60', inStock: true, category: 'Đồ chay', badge: 'MỚI' },
    { id: 5, name: 'BÁNH CHƯNG CHAY HẠT SEN', price: '100,000đ', oldPrice: '', image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&auto=format&fit=crop&q=60', inStock: true, category: 'Đồ chay', badge: '' },
    { id: 6, name: 'BÁNH TÉT LÁ CẨM CẦN THƠ (2 TRỨNG)', price: '160,000đ', oldPrice: '190,000đ', image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=500&auto=format&fit=crop&q=60', inStock: true, category: 'Bánh Tét', badge: 'HOT' },
    { id: 7, name: 'SET QUÀ BIẾU TẾT CAO CẤP AN KHANG', price: '450,000đ', oldPrice: '520,000đ', image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=500&auto=format&fit=crop&q=60', inStock: true, category: 'Set quà biếu', badge: 'VIP' },
  ]);

  // STATE ĐẶT HÀNG & THANH TOÁN
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [orderMessage, setOrderMessage] = useState('');

  // STATE DÀNH CHO ADMIN
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  
  // STATE THÊM BÁNH MỚI
  const [newCake, setNewCake] = useState({
    name: '',
    price: '',
    image: '',
    category: 'Bánh Chưng',
    badge: ''
  });

  // 2. HÀM XỬ LÝ DÀNH CHO KHÁCH HÀNG
  const addToCart = (product) => setCart([...cart, product]);
  
  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const calculateTotal = () => {
    const total = cart.reduce((sum, item) => {
      const priceNumber = parseInt(item.price.replace(/,|đ/g, ''));
      return sum + priceNumber;
    }, 0);
    return new Intl.NumberFormat('vi-VN').format(total) + 'đ';
  };

  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  // HÀM GỬI ĐƠN HÀNG VỀ GOOGLE SHEETS / EXCEL (ĐÃ CẬP NHẬT LINK CỦA BẠN)
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      alert("Vui lòng nhập đầy đủ thông tin giao hàng!");
      return;
    }

    // ĐƯỜNG LINK GOOGLE APPS SCRIPT CỦA BẠN
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbysIcGfq4C-h2-PnGoyViKUwrBNEig2uU3a1JrtsjyVEjBLbPDqP9VCDlTnWa9QpMHK/exec";

    const cartItemsText = cart.map(item => item.name).join(", ");
    const totalAmountText = calculateTotal();

    const orderData = {
      customerName,
      customerPhone,
      customerAddress,
      cartItems: cartItemsText,
      totalAmount: totalAmountText
    };

    try {
      // Gửi dữ liệu sang Google Sheets
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData)
      });

      setOrderMessage(`🎉 Đặt hàng thành công! Đơn hàng của anh/chị ${customerName} đã được lưu trực tiếp vào bảng tính Excel.`);
      setCart([]);
      setIsCheckoutOpen(false);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
    } catch (error) {
      console.error("Lỗi gửi đơn hàng:", error);
      alert("Có lỗi xảy ra khi gửi đơn hàng. Vui lòng kiểm tra lại đường link Google Script!");
    }
  };

  // 3. HÀM XỬ LÝ DÀNH CHO ADMIN
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === 'admin123') {
      setIsAdminLoggedIn(true);
      alert("Đăng nhập Admin thành công!");
    } else {
      alert("Sai mật khẩu Admin! (Mật khẩu mặc định: admin123)");
    }
  };

  const handleUpdatePrice = (id, newPrice) => {
    setProducts(products.map(p => p.id === id ? { ...p, price: newPrice } : p));
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa món bánh này?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newCake.name || !newCake.price) {
      alert("Vui lòng nhập tên và giá bánh!");
      return;
    }
    const createdCake = {
      id: Date.now(),
      name: newCake.name.toUpperCase(),
      price: newCake.price.includes('đ') ? newCake.price : `${newCake.price}đ`,
      oldPrice: '',
      image: newCake.image || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=500&auto=format&fit=crop&q=60',
      inStock: true,
      category: newCake.category,
      badge: newCake.badge
    };
    setProducts([createdCake, ...products]);
    setNewCake({ name: '', price: '', image: '', category: 'Bánh Chưng', badge: '' });
    alert("Đã thêm món bánh mới thành công!");
  };

  const filteredProducts = products.filter(product => {
    const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = activeCategory === 'Tất cả' || product.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="app-container">
      {/* HEADER */}
      <header className="header">
        <div className="header-top">
          <div className="logo" onClick={() => setActiveCategory('Tất cả')}>
            <h2>🌾 Bếp Quê</h2>
            <span>HƯƠNG VỊ TẾT TRUYỀN THỐNG</span>
          </div>
          
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="🔍 Tìm kiếm bánh chưng, bánh tét..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="contact-info">
            <span className="hotline-text">📞 Hotline đặt hàng</span>
            <span className="phone-number">{hotline}</span>
          </div>
          
          <div className="user-actions">
            <div className="action-btn admin-btn" title="Quản trị viên Admin" onClick={() => setIsAdminModalOpen(true)}>
              <span>⚙️</span>
            </div>
            <div className="action-btn">
              <span>❤️</span>
              <span className="badge-count">{wishlist.length}</span>
            </div>
            <div className="action-btn cart-btn" onClick={() => setIsCheckoutOpen(true)}>
              <span>🛒</span>
              <span className="badge-count">{cart.length}</span>
            </div>
          </div>
        </div>

        <div className="header-bottom">
          <nav>
            <a href="#" className={activeCategory === 'Tất cả' ? 'active' : ''} onClick={() => setActiveCategory('Tất cả')}>Trang Chủ</a>
            <a href="#" className={activeCategory === 'Bánh Chưng' ? 'active' : ''} onClick={() => setActiveCategory('Bánh Chưng')}>Bánh Chưng</a>
            <a href="#" className={activeCategory === 'Bánh Tét' ? 'active' : ''} onClick={() => setActiveCategory('Bánh Tét')}>Bánh Tét</a>
            <a href="#" className={activeCategory === 'Đồ chay' ? 'active' : ''} onClick={() => setActiveCategory('Đồ chay')}>Menu Chay</a>
            <a href="#" className={activeCategory === 'Set quà biếu' ? 'active' : ''} onClick={() => setActiveCategory('Set quà biếu')}>Set Quà Biếu Tết</a>
          </nav>
        </div>
      </header>

      {/* BANNER NỔI BẬT */}
      <div className="hero-banner">
        <div className="banner-text">
          <span className="sub-title">🧧 CHÀO XUÂN MỚI 2026</span>
          <h1>Bánh Chưng - Bánh Tét Đậm Vị Quê Hương</h1>
          <p>Được làm từ nếp nương, đỗ xanh ngấu mịn và thịt lợn bản tươi ngon chuẩn vị truyền thống.</p>
        </div>
      </div>

      <div className="main-content">
        {/* SIDEBAR DANH MỤC */}
        <aside className="sidebar">
          <div className="sidebar-title">
            <span>☰</span> DANH MỤC SẢN PHẨM
          </div>
          <ul className="sidebar-menu">
            <li className={activeCategory === 'Tất cả' ? 'selected' : ''} onClick={() => setActiveCategory('Tất cả')}>🏠 Tất cả sản phẩm</li>
            <li className={activeCategory === 'Set quà biếu' ? 'selected' : ''} onClick={() => setActiveCategory('Set quà biếu')}>🎁 Set quà tặng Tết</li>
            <li className={activeCategory === 'Bánh Chưng' ? 'selected' : ''} onClick={() => setActiveCategory('Bánh Chưng')}>🍘 Bánh chưng các loại</li>
            <li className={activeCategory === 'Bánh Tét' ? 'selected' : ''} onClick={() => setActiveCategory('Bánh Tét')}>🥖 Bánh tét đặc sản</li>
            <li className={activeCategory === 'Đồ chay' ? 'selected' : ''} onClick={() => setActiveCategory('Đồ chay')}>🥗 Menu bánh chay</li>
          </ul>
        </aside>

        {/* PRODUCTS GRID */}
        <section className="product-section">
          <div className="section-header">
            <h2 className="section-title">✨ {activeCategory.toUpperCase()}</h2>
          </div>

          {orderMessage && (
            <div className="success-message">
              <span>{orderMessage}</span>
              <button onClick={() => setOrderMessage('')}>✕</button>
            </div>
          )}

          <div className="product-grid">
            {filteredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                {product.badge && <span className={`card-badge ${product.badge === 'HẾT HÀNG' ? 'sold-out' : ''}`}>{product.badge}</span>}
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="price-box">
                    <span className="product-price">{product.price}</span>
                    {product.oldPrice && <span className="old-price">{product.oldPrice}</span>}
                  </div>
                  <div className="product-actions">
                    {product.inStock ? (
                      <button className="add-to-cart-btn" onClick={() => addToCart(product)}>🛒 Thêm giỏ hàng</button>
                    ) : (
                      <button className="out-of-stock-btn" disabled>🚫 Tạm hết hàng</button>
                    )}
                    <button className={`wishlist-btn ${wishlist.includes(product.id) ? 'active' : ''}`} onClick={() => toggleWishlist(product.id)}>
                      {wishlist.includes(product.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* MODAL CHECKOUT */}
      {isCheckoutOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>🛒 Giỏ Hàng & Thanh Toán</h2>
              <button className="close-modal" onClick={() => setIsCheckoutOpen(false)}>✖</button>
            </div>
            <div className="modal-body">
              {cart.length === 0 ? (
                <p>Giỏ hàng đang trống!</p>
              ) : (
                <>
                  <ul className="cart-list">
                    {cart.map((item, index) => (
                      <li key={index} className="cart-item">
                        <div className="cart-item-details">
                          <strong>{item.name}</strong>
                          <span className="cart-item-price">{item.price}</span>
                        </div>
                        <button className="remove-item-btn" onClick={() => removeFromCart(index)}>Xóa</button>
                      </li>
                    ))}
                  </ul>
                  <div className="cart-total">
                    <span>Tổng số tiền:</span> <strong>{calculateTotal()}</strong>
                  </div>
                  <form className="checkout-form" onSubmit={handlePlaceOrder}>
                    <h3>📋 Thông Tin Nhận Hàng (Tự động gửi về Excel)</h3>
                    <input type="text" placeholder="Họ và Tên người nhận *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
                    <input type="tel" placeholder="Số điện thoại *" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />
                    <input type="text" placeholder="Địa chỉ giao bánh *" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} required />
                    <button type="submit" className="confirm-order-btn">🚀 XÁC NHẬN ĐẶT HÀNG</button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL ADMIN */}
      {isAdminModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content admin-modal">
            <div className="modal-header admin-header">
              <h2>⚙️ BẢNG QUẢN TRỊ ADMIN</h2>
              <button className="close-modal" onClick={() => setIsAdminModalOpen(false)}>✖</button>
            </div>
            <div className="modal-body">
              {!isAdminLoggedIn ? (
                <form className="admin-login-form" onSubmit={handleAdminLogin}>
                  <h3>Đăng nhập Quản Trị Viên</h3>
                  <input 
                    type="password" 
                    placeholder="Nhập mật khẩu Admin..." 
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                  <small style={{color: '#888'}}>Mật khẩu mặc định: <b>admin123</b></small>
                  <button type="submit" className="confirm-order-btn">ĐĂNG NHẬP</button>
                </form>
              ) : (
                <div className="admin-dashboard">
                  <button className="logout-btn" onClick={() => setIsAdminLoggedIn(false)}>Đăng xuất Admin</button>
                  
                  {/* 1. SỬA HOTLINE */}
                  <div className="admin-section">
                    <h3>📞 Thay Đổi Hotline</h3>
                    <input 
                      type="text" 
                      value={hotline} 
                      onChange={(e) => setHotline(e.target.value)} 
                    />
                  </div>

                  {/* 2. THÊM BÁNH MỚI */}
                  <div className="admin-section">
                    <h3>➕ Thêm Món Bánh Mới</h3>
                    <form className="add-cake-form" onSubmit={handleAddProduct}>
                      <input 
                        type="text" 
                        placeholder="Tên món bánh..." 
                        value={newCake.name}
                        onChange={(e) => setNewCake({...newCake, name: e.target.value})}
                      />
                      <input 
                        type="text" 
                        placeholder="Giá bánh (vd: 130,000đ)..." 
                        value={newCake.price}
                        onChange={(e) => setNewCake({...newCake, price: e.target.value})}
                      />
                      <input 
                        type="text" 
                        placeholder="Link ảnh (URL)..." 
                        value={newCake.image}
                        onChange={(e) => setNewCake({...newCake, image: e.target.value})}
                      />
                      <select 
                        value={newCake.category} 
                        onChange={(e) => setNewCake({...newCake, category: e.target.value})}
                      >
                        <option value="Bánh Chưng">Bánh Chưng</option>
                        <option value="Bánh Tét">Bánh Tét</option>
                        <option value="Đồ chay">Đồ chay</option>
                        <option value="Set quà biếu">Set quà biếu</option>
                      </select>
                      <button type="submit" className="add-btn">Thêm Sản Phẩm</button>
                    </form>
                  </div>

                  {/* 3. CHỈNH SỬA GIÁ VÀ XÓA MÓN */}
                  <div className="admin-section">
                    <h3>📝 Quản Lý Giá & Danh Sách Bánh</h3>
                    <div className="admin-product-list">
                      {products.map(p => (
                        <div key={p.id} className="admin-product-item">
                          <span>{p.name}</span>
                          <div className="admin-item-controls">
                            <input 
                              type="text" 
                              value={p.price} 
                              onChange={(e) => handleUpdatePrice(p.id, e.target.value)} 
                            />
                            <button className="delete-btn" onClick={() => handleDeleteProduct(p.id)}>Xóa</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;