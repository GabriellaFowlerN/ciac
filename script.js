const products = [
  {
    id: 'ciac-unsweet',
    title: 'Ciac Tigernut Milk — Unsweetened (200g)',
    price: 28400,
    badge: 'UNSWEETENED',
    image: 'assets/product-1.jpeg',
    desc: 'Pure and wholesome. Enjoy the natural goodness of tigernuts with no added sugar.'
  },
  {
    id: 'ciac-sweet',
    title: 'Ciac Tigernut Milk — Naturally Sweetened (200g)',
    price: 31800,
    badge: 'NATURALLY SWEETENED',
    image: 'assets/product-2.jpeg',
    desc: 'Lightly sweetened with natural ingredients for a smooth, delicious taste.'
  }
]

function formatPrice(p){ return 'AED ' + (p/100).toFixed(2) }

const cartKey = 'ciac_cart_v2'
function getCart(){ return JSON.parse(localStorage.getItem(cartKey) || '[]') }
function setCart(c){ localStorage.setItem(cartKey, JSON.stringify(c)); renderCartCount(); renderCartItems() }

function addToCart(id, qty=1){
  let c = getCart();
  const item = c.find(i=>i.id===id)
  const prod = products.find(p=>p.id===id)
  if(!prod) return
  if(item) item.qty += qty; else c.push({id, qty})
  setCart(c)
}

function renderCartCount(){
  const count = getCart().reduce((s,i)=>s+i.qty,0)
  document.getElementById('cart-count').textContent = count
}

function renderCartItems(){
  const list = document.getElementById('cart-items')
  if(!list) return
  const items = getCart()
  if(items.length===0) list.innerHTML = '<p>Your cart is empty.</p>'
  else list.innerHTML = items.map(it=>{
    const p = products.find(x=>x.id===it.id)
    const lineTotal = (p.price * it.qty)
    return `<div class="cart-row"><strong>${p.title}</strong> <div>Qty: <button class="qty-sub" data-id="${p.id}">−</button> ${it.qty} <button class="qty-add" data-id="${p.id}">+</button></div><div>${formatPrice(lineTotal)}</div><button class="remove-item" data-id="${p.id}">Remove</button></div>`
  }).join('')
  const total = items.reduce((s,i)=>{
    const p = products.find(x=>x.id===i.id); return s + (p.price * i.qty)
  },0)
  document.getElementById('cart-total').textContent = formatPrice(total)
}

// Render products
function renderProducts(){
  const grid = document.getElementById('product-grid')
  grid.innerHTML = products.map((p, idx)=>{
    const variantClass = p.id.includes('unsweet') ? 'variant-unsweet' : 'variant-sweet'
    // feature icons list
    const featuresHtml = `
      <ul class="product-features">
        <li>100% Natural</li>
        <li>No Artificial Flavours</li>
        <li>Dairy Free</li>
        <li>Plant Based</li>
      </ul>
    `
    // place features left for first product, right for second
    if(idx % 2 === 0){
      return `
        <div class="product-wrap">
          ${featuresHtml}
          <article class="product-card" data-id="${p.id}">
            <div class="variant-strip ${variantClass}"></div>
            <img class="product-image" src="${p.image}" onerror="this.src='assets/product-placeholder.svg'" alt="${p.title}">
            <h3 class="product-title">${p.title}</h3>
            <p class="price">${formatPrice(p.price)}</p>
            <p class="product-desc">${p.desc}</p>
            <div class="product-actions">
              <button class="btn primary add-to-cart" data-id="${p.id}">Add to Cart</button>
              <button class="btn outline quick-view" data-id="${p.id}">Quick View</button>
            </div>
          </article>
        </div>
      `
    } else {
      return `
        <div class="product-wrap">
          <article class="product-card" data-id="${p.id}">
            <div class="variant-strip ${variantClass}"></div>
            <img class="product-image" src="${p.image}" onerror="this.src='assets/product-placeholder.svg'" alt="${p.title}">
            <h3 class="product-title">${p.title}</h3>
            <p class="price">${formatPrice(p.price)}</p>
            <p class="product-desc">${p.desc}</p>
            <div class="product-actions">
              <button class="btn primary add-to-cart" data-id="${p.id}">Add to Cart</button>
              <button class="btn outline quick-view" data-id="${p.id}">Quick View</button>
            </div>
          </article>
          ${featuresHtml}
        </div>
      `
    }
  }).join('')
}

// Navigation toggle
document.querySelector('.nav-toggle').addEventListener('click', ()=>{
  const nav = document.querySelector('.main-nav')
  nav.classList.toggle('open')
  const expanded = nav.classList.contains('open')
  document.querySelector('.nav-toggle').setAttribute('aria-expanded', expanded)
})

// Shop Now scroll
document.getElementById('shop-now').addEventListener('click', (e)=>{
  e.preventDefault(); document.getElementById('shop').scrollIntoView({behavior:'smooth'})
})

// Cart button (explicit)
document.getElementById('cart-btn').addEventListener('click', ()=> openModal('cart-modal'))
document.getElementById('search-btn').addEventListener('click', ()=> alert('Search (simulation)'))
document.getElementById('account-btn').addEventListener('click', ()=> alert('Account (simulation)'))

// Modals
function openModal(id){ const m = document.getElementById(id); if(!m) return; m.setAttribute('aria-hidden','false') }
function closeModals(){ document.querySelectorAll('.modal').forEach(m=>m.setAttribute('aria-hidden','true')) }

document.addEventListener('click', e=>{
  const add = e.target.closest('.add-to-cart')
  if(add){ addToCart(add.dataset.id); openModal('cart-modal'); return }
  if(e.target.matches('#buy-hero')){ addToCart(products[0].id); openModal('cart-modal'); return }
  if(e.target.matches('.modal-close')){ closeModals(); return }
  if(e.target.matches('#cart-btn')){ openModal('cart-modal'); return }
  const q = e.target.closest('.quick-view')
  if(q){ const id = q.dataset.id; showQuickView(id); return }
  const addBtn = e.target.closest('.qty-add')
  if(addBtn){ const id = addBtn.dataset.id; changeQty(id,1); return }
  const subBtn = e.target.closest('.qty-sub')
  if(subBtn){ const id = subBtn.dataset.id; changeQty(id,-1); return }
  const rem = e.target.closest('.remove-item')
  if(rem){ removeFromCart(rem.dataset.id); return }
})

function changeQty(id, delta){
  const c = getCart(); const it = c.find(x=>x.id===id); if(!it) return; it.qty = Math.max(0, it.qty + delta); if(it.qty===0) { const idx = c.findIndex(x=>x.id===id); c.splice(idx,1) } setCart(c)
}

function removeFromCart(id){ let c = getCart(); c = c.filter(x=>x.id!==id); setCart(c) }

function showQuickView(id){
  const p = products.find(x=>x.id===id); if(!p) return
  const qc = document.getElementById('quick-content')
  qc.innerHTML = `
    <h3>${p.title}</h3>
    <img src="${p.image}" onerror="this.src='assets/product-placeholder.svg'" style="width:220px">
    <p class="product-badge">${p.badge}</p>
    <p>${p.desc}</p>
    <p><strong>${formatPrice(p.price)}</strong></p>
    <div style="display:flex;gap:.5rem"><button class='btn primary add-to-cart' data-id='${p.id}'>Add to cart</button><button class='btn outline' onclick="openReviewsFor('${p.id}')">View Reviews</button></div>
  `
  openModal('quick-modal')
}

// Checkout simulation
document.getElementById('checkout').addEventListener('click', ()=>{
  const items = getCart()
  if(items.length===0){ alert('Cart is empty'); return }
  const summary = items.map(i=>{ const p = products.find(x=>x.id===i.id); return `${p.title} x ${i.qty}` }).join('\n')
  localStorage.removeItem(cartKey)
  renderCartCount(); renderCartItems(); closeModals(); alert('Order placed (simulation):\n'+summary)
})

// Reviews per-product
const reviewsKey = 'ciac_reviews_v2'
function getReviews(){ return JSON.parse(localStorage.getItem(reviewsKey) || '{}') }
function setReviews(obj){ localStorage.setItem(reviewsKey, JSON.stringify(obj)); renderReviews(currentReviewProduct) }
let currentReviewProduct = products[0].id

function renderReviewProductSelect(){
  const sel = document.getElementById('review-product-select'); sel.innerHTML = products.map(p=>`<option value="${p.id}">${p.title}</option>`).join('')
  sel.addEventListener('change', ()=>{ currentReviewProduct = sel.value; document.getElementById('review-product-id').value = sel.value; renderReviews(sel.value) })
  document.getElementById('review-product-id').value = currentReviewProduct
}

function renderReviews(productId){
  const list = document.getElementById('reviews-list')
  const all = getReviews()
  const revs = all[productId] || []
  if(!list) return
  if(revs.length===0) list.innerHTML = '<p>No reviews yet — be the first to add one!</p>'
  else list.innerHTML = revs.map(r=>`<div class="review"><strong>${r.name}</strong> — ${'★'.repeat(r.rating)}<p>${r.text}</p></div>`).join('')
}

document.getElementById('review-form').addEventListener('submit', e=>{
  e.preventDefault(); const f = e.target; const pid = f.product_id.value || currentReviewProduct
  const data = {name:f.name.value, rating:parseInt(f.rating.value), text:f.text.value, date:Date.now()}
  const all = getReviews(); all[pid] = all[pid] || []; all[pid].unshift(data); setReviews(all)
  f.reset(); document.getElementById('review-product-id').value = pid
})

function openReviewsFor(id){ document.getElementById('review-product-select').value = id; document.getElementById('review-product-id').value = id; currentReviewProduct = id; renderReviews(id); closeModals(); window.scrollTo({top: document.getElementById('reviews').offsetTop - 80, behavior:'smooth'}) }

// Subscribe
document.getElementById('subscribe-form').addEventListener('submit', e=>{ e.preventDefault(); alert('Subscribed — we will email updates (simulation).'); e.target.reset() })

// Init
document.getElementById('year').textContent = new Date().getFullYear()
renderProducts(); renderCartCount(); renderCartItems(); renderReviewProductSelect(); renderReviews(currentReviewProduct)
