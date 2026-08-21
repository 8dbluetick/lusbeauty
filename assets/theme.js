/**
 * Lush Beauty Mart - Theme Scripts
 * E-Commerce, AJAX Cart, Quick View, WhatsApp Integration & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initCartDrawer();
  initMobileMenu();
  initWhatsAppWidget();
  initWholesaleModal();
  initQuickViewModal();
  initCarousels();
  initReels();
  initCouponCopy();
  initProductPage();
});

/* --------------------------------------------------------------------------
   1. AJAX Cart Drawer
   -------------------------------------------------------------------------- */
function initCartDrawer() {
  const drawer = document.getElementById('LushCartDrawer');
  if (!drawer) return;

  // Open triggers
  document.querySelectorAll('[data-open-cart]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });

  // Close triggers
  drawer.querySelectorAll('[data-close-cart]').forEach(el => {
    el.addEventListener('click', closeCartDrawer);
  });

  // Intercept standard Add to Cart forms
  document.addEventListener('submit', async (e) => {
    const form = e.target;
    if (form.matches('.card-form, .product-form') || form.getAttribute('action') === '/cart/add') {
      e.preventDefault();
      const formData = new FormData(form);

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          await updateCartDrawer();
          openCartDrawer();
        } else {
          form.submit(); // fallback
        }
      } catch (err) {
        form.submit();
      }
    }
  });

  // Item quantity steppers & remove
  drawer.addEventListener('click', async (e) => {
    const qtyBtn = e.target.closest('[data-qty-change]');
    const removeBtn = e.target.closest('[data-remove-item]');

    if (qtyBtn) {
      const lineKey = qtyBtn.dataset.key;
      const action = qtyBtn.dataset.qtyChange;
      const currentQty = parseInt(qtyBtn.parentElement.querySelector('.qty-num').textContent, 10);
      const newQty = action === 'plus' ? currentQty + 1 : currentQty - 1;
      await changeCartQuantity(lineKey, newQty);
    }

    if (removeBtn) {
      const lineKey = removeBtn.dataset.removeItem;
      await changeCartQuantity(lineKey, 0);
    }
  });

  // WhatsApp 1-Click Order Button
  const btnWaOrder = document.getElementById('BtnWhatsAppOrder');
  if (btnWaOrder) {
    btnWaOrder.addEventListener('click', async () => {
      try {
        const res = await fetch('/cart.js');
        const cartData = await res.json();
        const waNum = '9191195951';

        if (cartData.items.length === 0) return;

        const itemsText = cartData.items
          .map((item, idx) => `${idx + 1}. *${item.title}* (Qty: ${item.quantity}) - ₹${(item.final_line_price / 100).toFixed(0)}`)
          .join('\n');

        const totalFormatted = (cartData.total_price / 100).toFixed(0);
        const msg = `*Namaste Lush Beauty Mart Nagpur!* 🛍️\n\nI would like to place an order from my bag:\n\n${itemsText}\n\n*Total Amount:* *₹${totalFormatted}*\n\nPlease confirm availability and store pickup/delivery details at Lad Square. Thank you!`;

        window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, '_blank');
      } catch (e) {}
    });
  }
}

function openCartDrawer() {
  const drawer = document.getElementById('LushCartDrawer');
  if (drawer) {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('LushCartDrawer');
  if (drawer) {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  }
}

async function changeCartQuantity(id, quantity) {
  try {
    await fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, quantity }),
    });
    await updateCartDrawer();
  } catch (err) {}
}

async function updateCartDrawer() {
  try {
    const res = await fetch('/cart.js');
    const cart = await res.json();

    // Update count badges
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = cart.item_count;
    });

    // Update drawer total
    const subtotalEl = document.querySelector('[data-cart-subtotal]');
    const totalEl = document.querySelector('[data-cart-total]');
    const formattedTotal = '₹' + (cart.total_price / 100).toFixed(0);
    if (subtotalEl) subtotalEl.textContent = formattedTotal;
    if (totalEl) totalEl.textContent = formattedTotal;

    // Update threshold banner
    const shippingTextEl = document.querySelector('[data-shipping-text]');
    if (shippingTextEl) {
      if (cart.total_price >= 49900) {
        shippingTextEl.innerHTML = '<span class="shipping-unlocked">🎉 You have unlocked <strong>FREE Delivery in Nagpur</strong>!</span>';
      } else {
        const needed = ((49900 - cart.total_price) / 100).toFixed(0);
        shippingTextEl.innerHTML = `<span>Add <strong>₹${needed}</strong> more for <strong>FREE Delivery</strong></span>`;
      }
    }
  } catch (e) {}
}

/* --------------------------------------------------------------------------
   2. Mobile Menu Drawer
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const drawer = document.getElementById('MobileNavDrawer');
  const toggleBtn = document.getElementById('BtnMobileMenuToggle');
  const closeBtn = document.getElementById('BtnCloseMobileMenu');
  const closeX = document.getElementById('BtnCloseMobileNavX');

  if (!drawer || !toggleBtn) return;

  const openMenu = () => drawer.classList.add('active');
  const closeMenu = () => drawer.classList.remove('active');

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (closeX) closeX.addEventListener('click', closeMenu);
}

/* --------------------------------------------------------------------------
   3. WhatsApp Floating Widget
   -------------------------------------------------------------------------- */
function initWhatsAppWidget() {
  const toggleBtn = document.getElementById('BtnToggleWaPopup');
  const card = document.getElementById('WaPopupCard');
  const closeBtn = document.getElementById('BtnCloseWaPopup');

  if (!toggleBtn || !card) return;

  toggleBtn.addEventListener('click', () => {
    card.classList.toggle('active');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      card.classList.remove('active');
    });
  }
}

/* --------------------------------------------------------------------------
   4. Wholesale Modal
   -------------------------------------------------------------------------- */
function initWholesaleModal() {
  const modal = document.getElementById('LushWholesaleModal');
  if (!modal) return;

  document.querySelectorAll('[data-open-wholesale]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
    });
  });

  modal.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  });

  const form = document.getElementById('WholesaleForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you! Your wholesale inquiry has been submitted. Our Nagpur B2B manager will contact you promptly.');
      modal.classList.remove('active');
      form.reset();
    });
  }

  const btnWa = document.getElementById('BtnWholesaleWhatsApp');
  if (btnWa && form) {
    btnWa.addEventListener('click', () => {
      const name = form.elements['name']?.value || 'Store Owner';
      const biz = form.elements['business']?.value || 'Salon/Boutique';
      const cat = form.elements['category']?.value || 'General';
      const msg = `*Namaste Lush Beauty Mart!* 🏢\n\n*Wholesale B2B Inquiry:*\nName: ${name}\nBusiness: ${biz}\nCategory: ${cat}\n\nPlease send your wholesale price catalogue.`;
      window.open(`https://wa.me/9191195951?text=${encodeURIComponent(msg)}`, '_blank');
    });
  }
}

/* --------------------------------------------------------------------------
   5. Quick View Product Modal
   -------------------------------------------------------------------------- */
function initQuickViewModal() {
  const modal = document.getElementById('LushQuickViewModal');
  const content = document.getElementById('QuickViewContent');
  if (!modal || !content) return;

  document.addEventListener('click', async (e) => {
    const trigger = e.target.closest('[data-quick-view-handle]');
    if (!trigger) return;

    const handle = trigger.dataset.quickViewHandle;
    modal.classList.add('active');
    content.innerHTML = '<div class="quick-view-loading"><p>Loading product details...</p></div>';

    try {
      const res = await fetch(`/products/${handle}.js`);
      const prod = await res.json();

      const priceFormatted = '₹' + (prod.price / 100).toFixed(0);
      const compareFormatted = prod.compare_at_price ? '₹' + (prod.compare_at_price / 100).toFixed(0) : '';

      content.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px;">
          <div>
            <img src="${prod.featured_image}" alt="${prod.title}" style="width: 100%; aspect-ratio: 1/1; object-fit: cover; border-radius: 12px;">
          </div>
          <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 12px;">
            <div>
              <span style="font-size: 0.65rem; font-weight: 800; color: #B38C44; text-transform: uppercase;">${prod.type || 'Lush Exclusive'}</span>
              <h2 style="font-size: 1.3rem; margin: 4px 0;">${prod.title}</h2>
              <div style="display: flex; align-items: baseline; gap: 8px; margin: 8px 0;">
                <span style="font-size: 1.3rem; font-weight: 800;">${priceFormatted}</span>
                ${compareFormatted ? `<span style="font-size: 0.85rem; color: #999; text-decoration: line-through;">${compareFormatted}</span>` : ''}
              </div>
              <p style="font-size: 0.8rem; color: #555;">${prod.description ? prod.description.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...' : ''}</p>
            </div>
            <form action="/cart/add" method="post" class="card-form" style="display: flex; flex-direction: column; gap: 8px;">
              <input type="hidden" name="id" value="${prod.variants[0].id}">
              <button type="submit" class="btn-buy-now" style="width: 100%; padding: 12px; border-radius: 10px; background: #2C1D11; color: #FFF; font-weight: 700; font-size: 0.8rem;">Add to Shopping Bag</button>
              <a href="${prod.url}" style="text-align: center; font-size: 0.75rem; font-weight: 700; color: #B38C44; margin-top: 4px;">View Full Details Page →</a>
            </form>
          </div>
        </div>
      `;
    } catch (err) {
      content.innerHTML = '<p>Unable to load quick view. Please click on the product to view details.</p>';
    }
  });

  modal.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => modal.classList.remove('active'));
  });
}

/* --------------------------------------------------------------------------
   6. Horizontal Product Carousels
   -------------------------------------------------------------------------- */
function initCarousels() {
  document.querySelectorAll('.lush-new-arrivals-section').forEach(section => {
    const track = section.querySelector('[data-carousel-track]');
    const prev = section.querySelector('[data-carousel-prev]');
    const next = section.querySelector('[data-carousel-next]');

    if (!track) return;

    if (prev) {
      prev.addEventListener('click', () => {
        track.scrollBy({ left: -300, behavior: 'smooth' });
      });
    }

    if (next) {
      next.addEventListener('click', () => {
        track.scrollBy({ left: 300, behavior: 'smooth' });
      });
    }
  });
}

/* --------------------------------------------------------------------------
   7. Coupon Copy Helper
   -------------------------------------------------------------------------- */
function initCouponCopy() {
  document.querySelectorAll('[data-coupon-code]').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.dataset.couponCode;
      navigator.clipboard.writeText(code).then(() => {
        const original = btn.textContent;
        btn.textContent = 'Applied!';
        btn.style.background = '#1B7A43';
        btn.style.color = '#FFF';

        const couponInput = document.getElementById('CartCouponInput');
        if (couponInput) couponInput.value = code;

        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.style.color = '';
        }, 2500);
      });
    });
  });
}

/* --------------------------------------------------------------------------
   8. Main Product Page Helpers
   -------------------------------------------------------------------------- */
function initProductPage() {
  // Thumbnail switch
  document.querySelectorAll('.thumb-btn').forEach(thumb => {
    thumb.addEventListener('click', () => {
      document.querySelectorAll('.thumb-btn').forEach(b => b.classList.remove('active'));
      thumb.classList.add('active');

      const mainImg = document.getElementById('ProductMainImg');
      if (mainImg && thumb.dataset.thumbSrc) {
        mainImg.src = thumb.dataset.thumbSrc;
      }
    });
  });

  // Quantity Stepper
  const minus = document.getElementById('BtnQtyMinus');
  const plus = document.getElementById('BtnQtyPlus');
  const input = document.getElementById('ProductQuantityInput');

  if (minus && plus && input) {
    minus.addEventListener('click', () => {
      input.value = Math.max(1, parseInt(input.value || 1, 10) - 1);
    });
    plus.addEventListener('click', () => {
      input.value = parseInt(input.value || 1, 10) + 1;
    });
  }

  // Buy Now direct checkout
  const btnBuyNow = document.getElementById('BtnBuyNow');
  if (btnBuyNow) {
    btnBuyNow.addEventListener('click', () => {
      const variantId = document.getElementById('ProductVariantId')?.value;
      const qty = document.getElementById('ProductQuantityInput')?.value || 1;
      if (variantId) {
        window.location.href = `/cart/${variantId}:${qty}`;
      }
    });
  }
}

/* --------------------------------------------------------------------------
   9. Instagram Reels & Video Stories Interactive System
   -------------------------------------------------------------------------- */
function initReels() {
  const track = document.getElementById('ReelsTrack');
  const prevBtn = document.querySelector('[data-reel-prev]');
  const nextBtn = document.querySelector('[data-reel-next]');

  // Track scrolling
  if (track) {
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -280, behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: 280, behavior: 'smooth' });
      });
    }
  }

  // Video Autoplay & Sound Toggle in Cards
  document.querySelectorAll('.reel-card-item').forEach(card => {
    const video = card.querySelector('video');
    const soundBtn = card.querySelector('.btn-reel-sound-toggle');

    if (video) {
      // Auto play on hover / visibility
      card.addEventListener('mouseenter', () => {
        video.play().catch(() => {});
      });

      // Play on intersection observer
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          });
        }, { threshold: 0.5 });
        observer.observe(card);
      }

      // Sound button
      if (soundBtn) {
        soundBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          video.muted = !video.muted;
          soundBtn.classList.toggle('unmuted', !video.muted);
        });
      }
    }
  });

  // Reel Full-Screen Modal Viewer
  const modal = document.getElementById('ReelModalOverlay');
  const mediaHolder = document.getElementById('ReelModalMediaHolder');
  const captionEl = document.getElementById('ReelModalCaption');
  const productEl = document.getElementById('ReelModalProduct');
  const closeBackdrop = document.getElementById('BtnCloseReelModal');
  const closeX = document.getElementById('BtnCloseReelModalX');

  if (!modal || !mediaHolder) return;

  const closeReelModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    const modalVideo = mediaHolder.querySelector('video');
    if (modalVideo) {
      modalVideo.pause();
    }
    mediaHolder.innerHTML = '';
  };

  if (closeBackdrop) closeBackdrop.addEventListener('click', closeReelModal);
  if (closeX) closeX.addEventListener('click', closeReelModal);

  document.querySelectorAll('.reel-card-item').forEach(card => {
    card.addEventListener('click', (e) => {
      // Ignore if clicking sound toggle
      if (e.target.closest('.btn-reel-sound-toggle')) return;

      const type = card.dataset.reelType;
      const videoSrc = card.dataset.videoSrc;
      const imageSrc = card.dataset.imageSrc;
      const caption = card.dataset.caption || 'Lush Beauty Mart Nagpur Reel';
      const product = card.dataset.product || 'Exclusive Store Collection';

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';

      if (captionEl) captionEl.textContent = caption;
      if (productEl) productEl.textContent = product;

      if (type === 'video' && videoSrc) {
        mediaHolder.innerHTML = `
          <video src="${videoSrc}" controls autoplay loop playsinline style="width: 100%; height: 100%; object-fit: contain; background: #000;"></video>
        `;
        const v = mediaHolder.querySelector('video');
        if (v) v.play().catch(() => {});
      } else if (imageSrc) {
        mediaHolder.innerHTML = `
          <img src="${imageSrc}" alt="${caption}" style="width: 100%; height: 100%; object-fit: contain; background: #000;">
        `;
      }
    });
  });
}
