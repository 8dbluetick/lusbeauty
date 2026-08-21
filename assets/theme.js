/**
 * Lush Beauty Mart - Theme Scripts
 * E-Commerce, AJAX Cart, Quick View, WhatsApp Integration & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initScrollProgressAndBackToTop();
  initCartDrawer();
  initMobileMenu();
  initWhatsAppWidget();
  initQuickViewModal();
  initSearchModal();
  initFaqAccordion();
  initProductAccordions();
  initPincodeChecker();
  initStickyMobileBar();
  initTrendingCategoryFilters();
  initCarousels();
  initReels();
  initCouponCopy();
  initProductPage();
});

/* --------------------------------------------------------------------------
   1. AJAX Cart Drawer & Dynamic Real-Time Update
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
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Adding...</span>';
      }

      try {
        const formData = new FormData(form);
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          await updateCartDrawer();
          openCartDrawer();
        } else {
          const errData = await response.json();
          alert(errData.description || 'Could not add product to cart.');
        }
      } catch (err) {
        form.submit();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    }
  });

  // Item quantity steppers & remove
  drawer.addEventListener('click', async (e) => {
    const qtyBtn = e.target.closest('[data-qty-change]');
    const removeBtn = e.target.closest('[data-remove-item]');

    if (qtyBtn) {
      e.preventDefault();
      const lineKey = qtyBtn.dataset.key;
      const action = qtyBtn.dataset.qtyChange;
      const qtyDisplay = qtyBtn.parentElement.querySelector('.qty-num');
      const currentQty = parseInt(qtyDisplay.textContent, 10);
      const newQty = action === 'plus' ? currentQty + 1 : currentQty - 1;
      await changeCartQuantity(lineKey, newQty);
    }

    if (removeBtn) {
      e.preventDefault();
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
        const waNum = '919119595951';

        if (!cartData.items || cartData.items.length === 0) return;

        const itemsText = cartData.items
          .map((item, idx) => {
            const vText = item.variant_title && item.variant_title !== 'Default Title' ? ` (${item.variant_title})` : '';
            return `${idx + 1}. *${item.product_title || item.title}*${vText} x ${item.quantity} = ₹${(item.final_line_price / 100).toFixed(0)}`;
          })
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

    // 1. Update count badges across entire page
    document.querySelectorAll('[data-cart-count]').forEach(el => {
      el.textContent = cart.item_count;
    });

    const itemsContainer = document.querySelector('[data-cart-items-container]');
    const footerEl = document.getElementById('CartDrawerFooter');

    // 2. Render Items HTML
    if (itemsContainer) {
      if (cart.item_count === 0) {
        itemsContainer.innerHTML = `
          <div class="cart-empty-state">
            <div class="empty-cart-icon">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <h4>Your bag is currently empty</h4>
            <p>Explore luxury skincare, cosmetics, artificial jewellery and handbags from our showroom.</p>
            <a href="/collections/all" class="btn-shop-collection" data-close-cart>
              <span>Start Shopping</span>
              <span>→</span>
            </a>
          </div>
        `;
        if (footerEl) footerEl.style.display = 'none';
      } else {
        let itemsHtml = '<div class="cart-item-list">';
        cart.items.forEach((item, index) => {
          const imgUrl = item.image || (item.featured_image ? item.featured_image.url : '');
          const variantTitle = item.variant_title && item.variant_title !== 'Default Title' ? `<span class="cart-item-variant">${item.variant_title}</span>` : '';
          const itemPrice = '₹' + (item.final_line_price / 100).toFixed(0);

          itemsHtml += `
            <div class="cart-drawer-item" data-line-key="${item.key}" style="animation-delay: ${index * 0.05}s;">
              <a href="${item.url}" class="drawer-item-img-link">
                ${imgUrl ? `<img src="${imgUrl}" alt="${item.title}" class="cart-item-img" width="80" height="80">` : `<div class="cart-item-img" style="background:#FAF7F2;display:flex;align-items:center;justify-content:center;">🛍️</div>`}
              </a>
              <div class="cart-item-info">
                <div class="cart-item-top">
                  <h5 class="cart-item-title"><a href="${item.url}">${item.product_title || item.title}</a></h5>
                  <button type="button" class="cart-item-remove" data-remove-item="${item.key}" aria-label="Remove item">&times;</button>
                </div>
                ${variantTitle}
                <div class="cart-item-bottom">
                  <div class="qty-stepper">
                    <button type="button" class="qty-btn" data-qty-change="minus" data-key="${item.key}">−</button>
                    <span class="qty-num">${item.quantity}</span>
                    <button type="button" class="qty-btn" data-qty-change="plus" data-key="${item.key}">+</button>
                  </div>
                  <span class="cart-item-price">${itemPrice}</span>
                </div>
              </div>
            </div>
          `;
        });
        itemsHtml += '</div>';
        itemsContainer.innerHTML = itemsHtml;
        if (footerEl) footerEl.style.display = 'flex';
      }
    }

    // 3. Update drawer totals & subtotal
    const subtotalEl = document.querySelector('[data-cart-subtotal]');
    const totalEl = document.querySelector('[data-cart-total]');
    const shippingValEl = document.querySelector('.cart-shipping-val');
    const formattedTotal = '₹' + (cart.total_price / 100).toFixed(0);
    if (subtotalEl) subtotalEl.textContent = formattedTotal;
    if (totalEl) totalEl.textContent = formattedTotal;
    if (shippingValEl) {
      if (cart.total_price >= 99900) {
        shippingValEl.innerHTML = '<strong class="text-unlocked-badge">FREE</strong>';
      } else {
        shippingValEl.textContent = '₹50';
      }
    }

    // 4. Update threshold banner & progress bars
    const shippingTextEls = document.querySelectorAll('[data-shipping-text]');
    const progressBars = document.querySelectorAll('.shipping-progress-bar, .drawer-progress-bar');
    const percent = Math.min(100, (cart.total_price / 99900) * 100);

    progressBars.forEach(b => {
      b.style.width = percent + '%';
    });

    shippingTextEls.forEach(shippingTextEl => {
      if (cart.total_price >= 99900) {
        shippingTextEl.innerHTML = '<span class="shipping-unlocked">🎉 You have unlocked <strong>FREE Delivery in Nagpur</strong>!</span>';
      } else {
        const needed = ((99900 - cart.total_price) / 100).toFixed(0);
        shippingTextEl.innerHTML = `<span>Add <strong>₹${needed}</strong> more for <strong>FREE Delivery</strong></span>`;
      }
    });

    // 5. Handle empty cart page reload if on /cart
    if (window.location.pathname === '/cart' && cart.item_count === 0) {
      window.location.reload();
    }
  } catch (e) {}
}

// Cart Page Coupon Handler
document.addEventListener('DOMContentLoaded', () => {
  const btnPromo = document.getElementById('BtnApplyCartPageCoupon');
  const inputPromo = document.getElementById('CartPageCouponInput');
  const noteInput = document.getElementById('CartOrderNote');

  if (btnPromo && inputPromo) {
    btnPromo.addEventListener('click', () => {
      const code = inputPromo.value.trim().toUpperCase();
      if (!code) return;
      btnPromo.textContent = 'Applying...';
      setTimeout(() => {
        btnPromo.textContent = '✓ Applied';
        btnPromo.style.background = '#10B981';
      }, 600);
    });
  }

  if (noteInput) {
    noteInput.addEventListener('change', async () => {
      try {
        await fetch('/cart/update.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ note: noteInput.value }),
        });
      } catch (e) {}
    });
  }
});

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
      window.open(`https://wa.me/919119595951?text=${encodeURIComponent(msg)}`, '_blank');
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

/* --------------------------------------------------------------------------
   10. Instant Trending Category Filters
   -------------------------------------------------------------------------- */
function initTrendingCategoryFilters() {
  const filterContainer = document.getElementById('TrendingCategoryFilters');
  if (!filterContainer) return;

  const buttons = filterContainer.querySelectorAll('[data-category-filter]');
  const cards = document.querySelectorAll('.lush-trending-section .lush-product-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.categoryFilter.toLowerCase();

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const cat = (card.dataset.category || '').toLowerCase();
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   11. Live Predictive AJAX Search Modal
   -------------------------------------------------------------------------- */
function initSearchModal() {
  const modal = document.getElementById('LushSearchModal');
  const input = document.getElementById('LiveSearchInput');
  const clearBtn = document.getElementById('BtnClearSearch');
  const resultsContainer = document.getElementById('SearchResultsArea');
  const quickTags = document.getElementById('SearchQuickTags');

  if (!modal || !input) return;

  const openSearch = () => {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => input.focus(), 100);
  };

  const closeSearch = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-open-search]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openSearch();
    });
  });

  modal.querySelectorAll('[data-close-search]').forEach(el => {
    el.addEventListener('click', closeSearch);
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      input.focus();
      renderInitialSearchState();
    });
  }

  // Quick tag clicks
  if (quickTags) {
    quickTags.querySelectorAll('.search-tag-btn').forEach(tag => {
      tag.addEventListener('click', () => {
        const term = tag.dataset.searchTerm;
        input.value = term;
        performSearch(term);
      });
    });
  }

  // Live input debounce
  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = input.value.trim();
    if (!query) {
      renderInitialSearchState();
      return;
    }

    debounceTimer = setTimeout(() => {
      performSearch(query);
    }, 250);
  });

  function renderInitialSearchState() {
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="search-initial-state">
          <p>Type to search 200+ beauty products, authentic brands & accessories</p>
        </div>
      `;
    }
  }

  async function performSearch(query) {
    if (!resultsContainer) return;
    resultsContainer.innerHTML = '<div class="search-loading-state"><p>Searching products...</p></div>';

    try {
      const res = await fetch(`/search/suggest.json?q=${encodeURIComponent(query)}&resources[type]=product&resources[limit]=6`);
      const data = await res.json();
      const products = data.resources?.results?.products || [];

      if (products.length === 0) {
        resultsContainer.innerHTML = `
          <div class="search-no-results">
            <p>No products found for "<strong>${query}</strong>"</p>
            <a href="/collections/all" class="btn-search-explore" data-close-search>Browse All Products →</a>
          </div>
        `;
        return;
      }

      let html = '<div class="search-results-grid">';
      products.forEach(prod => {
        const priceFormatted = '₹' + (parseFloat(prod.price) || 0).toFixed(0);
        html += `
          <a href="${prod.url}" class="search-result-item">
            <img src="${prod.image || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=200'}" alt="${prod.title}" class="search-item-thumb">
            <div class="search-item-meta">
              <span class="search-item-title">${prod.title}</span>
              <span class="search-item-price">${priceFormatted}</span>
            </div>
          </a>
        `;
      });
      html += `
        <div class="search-view-all-row">
          <a href="/search?q=${encodeURIComponent(query)}" class="search-view-all-link">View all results for "${query}" →</a>
        </div>
      `;
      html += '</div>';
      resultsContainer.innerHTML = html;
    } catch (e) {
      resultsContainer.innerHTML = `
        <div class="search-no-results">
          <a href="/search?q=${encodeURIComponent(query)}" class="btn-search-explore">Search for "${query}" →</a>
        </div>
      `;
    }
  }
}

/* --------------------------------------------------------------------------
   12. FAQ Accordions System
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const container = document.getElementById('FaqAccordion');
  if (!container) return;

  container.querySelectorAll('.faq-accordion-item').forEach(item => {
    const trigger = item.querySelector('.faq-accordion-trigger');
    const body = item.querySelector('.faq-accordion-body');
    const icon = item.querySelector('.faq-toggle-icon');

    if (trigger && body) {
      trigger.addEventListener('click', () => {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

        // Close other open accordions in the section
        container.querySelectorAll('.faq-accordion-item').forEach(otherItem => {
          if (otherItem !== item) {
            const otherTrigger = otherItem.querySelector('.faq-accordion-trigger');
            const otherBody = otherItem.querySelector('.faq-accordion-body');
            const otherIcon = otherItem.querySelector('.faq-toggle-icon');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
            if (otherBody) otherBody.hidden = true;
            if (otherIcon) otherIcon.textContent = '+';
          }
        });

        // Toggle current
        trigger.setAttribute('aria-expanded', !isExpanded);
        body.hidden = isExpanded;
        if (icon) icon.textContent = isExpanded ? '+' : '−';
      });
    }
  });
}

/* --------------------------------------------------------------------------
   13. Product PDP Accordions / Tabs
   -------------------------------------------------------------------------- */
function initProductAccordions() {
  document.querySelectorAll('.product-acc-item').forEach(item => {
    const header = item.querySelector('.product-acc-header');
    const content = item.querySelector('.product-acc-content');
    const arrow = item.querySelector('.acc-arrow');

    if (header && content) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        item.classList.toggle('active', !isActive);
        header.setAttribute('aria-expanded', !isActive);
        content.style.display = isActive ? 'none' : 'block';
        if (arrow) arrow.textContent = isActive ? '+' : '−';
      });
    }
  });
}

/* --------------------------------------------------------------------------
   14. Nagpur Pin Code & Express Delivery Estimator
   -------------------------------------------------------------------------- */
function initPincodeChecker() {
  const input = document.getElementById('DeliveryPincodeInput');
  const btn = document.getElementById('BtnCheckPincode');
  const result = document.getElementById('PincodeResult');

  if (!input || !btn || !result) return;

  btn.addEventListener('click', () => {
    const code = input.value.trim();
    if (!/^\d{6}$/.test(code)) {
      result.style.display = 'block';
      result.className = 'pincode-result-msg error';
      result.innerHTML = '⚠️ Please enter a valid 6-digit pin code.';
      return;
    }

    result.style.display = 'block';
    // Nagpur pincodes typically start with 440
    if (code.startsWith('440') || code.startsWith('441')) {
      result.className = 'pincode-result-msg success';
      result.innerHTML = '⚡ <strong>Nagpur Express Delivery:</strong> FREE Same-Day / Next-Day Delivery available for pin code ' + code + '! Also available for immediate pickup at Lad Square showroom.';
    } else {
      result.className = 'pincode-result-msg info';
      result.innerHTML = '📦 <strong>Standard Delivery:</strong> 3–5 working days tracked courier delivery available for pin code ' + code + '.';
    }
  });
}

/* --------------------------------------------------------------------------
   15. Sticky Mobile Add to Bag Bar on Product Page
   -------------------------------------------------------------------------- */
function initStickyMobileBar() {
  const bar = document.getElementById('StickyMobilePdpBar');
  const triggerRow = document.getElementById('ProductMainCtaRow');
  const stickyBtn = document.getElementById('BtnStickyAddBag');
  const mainForm = document.getElementById('MainProductForm');

  if (!bar || !triggerRow) return;

  window.addEventListener('scroll', () => {
    if (window.innerWidth >= 768) {
      bar.classList.remove('active');
      return;
    }

    const rect = triggerRow.getBoundingClientRect();
    if (rect.bottom < 0) {
      bar.classList.add('active');
    } else {
      bar.classList.remove('active');
    }
  }, { passive: true });

  if (stickyBtn && mainForm) {
    stickyBtn.addEventListener('click', () => {
      const submitBtn = mainForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.click();
      } else {
        mainForm.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    });
  }
}

/* --------------------------------------------------------------------------
   16. Luxury Scroll Reveal Animations (Intersection Observer)
   -------------------------------------------------------------------------- */
function initScrollAnimations() {
  if (!('IntersectionObserver' in window)) {
    // Fallback if browser doesn't support IntersectionObserver
    document.querySelectorAll('.lush-reveal, .section-header-center, .lush-product-card, .testimonial-card, .faq-accordion-item, .category-card, .reel-card-item, .store-experience-card, .partner-card-layout').forEach(el => {
      el.classList.add('is-revealed');
    });
    return;
  }

  const revealTargets = [
    '.section-header-center',
    '.hero-content',
    '.hero-media',
    '.lush-product-card',
    '.testimonial-card',
    '.faq-accordion-item',
    '.category-card',
    '.reel-card-item',
    '.store-experience-card',
    '.partner-card-layout',
    '.promotional-offer-card',
    '.lush-reveal'
  ];

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(revealTargets.join(', ')).forEach((el, index) => {
    el.classList.add('lush-reveal');
    
    // Add staggered delay to child cards in grids
    const parentGrid = el.closest('.products-grid-4, .testimonials-grid-3, .categories-grid-4, .reels-grid-track');
    if (parentGrid) {
      const siblings = Array.from(parentGrid.children);
      const childIndex = siblings.indexOf(el);
      if (childIndex >= 0) {
        el.style.transitionDelay = `${childIndex * 0.08}s`;
      }
    }
    
    revealObserver.observe(el);
  });
}

/* --------------------------------------------------------------------------
   17. Scroll Progress Bar & Floating Back-To-Top Button
   -------------------------------------------------------------------------- */
function initScrollProgressAndBackToTop() {
  const progressBar = document.getElementById('ScrollProgressBar');
  const backToTopBtn = document.getElementById('BackToTopBtn');
  const header = document.querySelector('.lush-sticky-header');

  let ticking = false;

  const onScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    // 1. Reading / Scroll Progress Bar
    if (progressBar && scrollHeight > 0) {
      const progressPercent = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
      progressBar.style.width = progressPercent + '%';
    }

    // 2. Header elevation on scroll
    if (header) {
      if (scrollTop > 30) {
        header.classList.add('header-scrolled');
      } else {
        header.classList.remove('header-scrolled');
      }
    }

    // 3. Floating Back-to-Top Button
    if (backToTopBtn) {
      if (scrollTop > 350) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // Initial check
  onScroll();

  // Back to Top click with smooth physics
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}


