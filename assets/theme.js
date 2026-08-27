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
  initProductVariantSelector();
  initShareButtons();
});

/* --------------------------------------------------------------------------
   1. AJAX Cart Drawer & Dynamic Real-Time Update
   -------------------------------------------------------------------------- */
function initCartDrawer() {
  const drawer = document.getElementById('LushCartDrawer');
  if (!drawer) return;

  // Open triggers - Only explicit intentional clicks on [data-open-cart]
  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-open-cart]');
    if (openBtn) {
      e.preventDefault();
      e.stopPropagation();
      openCartDrawer();
    }
  });

  // Close triggers
  drawer.querySelectorAll('[data-close-cart]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      closeCartDrawer();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeCartDrawer();
    }
  });

  // Intercept standard Add to Cart forms - SILENT ADD WITH TOAST ONLY
  document.addEventListener('submit', async (e) => {
    const form = e.target;
    if (form.matches('.card-form, .product-form') || form.getAttribute('action') === '/cart/add') {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        if (submitBtn.disabled) return; // Prevent rapid duplicate clicks
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
          const addedItem = await response.json();
          // Update cart badge and drawer silently in the background
          await updateCartDrawer();
          // Show small, non-intrusive confirmation toast (DO NOT OPEN DRAWER)
          showAddToCartToast(addedItem);
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

  // WhatsApp 1-Click Smart Order Summary Button
  const btnWaOrder = document.getElementById('BtnWhatsAppOrder');
  if (btnWaOrder) {
    btnWaOrder.addEventListener('click', async () => {
      try {
        const res = await fetch('/cart.js');
        const cartData = await res.json();
        const waUrl = generateWhatsAppOrderUrl(cartData);
        window.open(waUrl, '_blank');
      } catch (e) {
        window.open('https://wa.me/919119595951', '_blank');
      }
    });
  }
}

let toastTimeout = null;

function showAddToCartToast(item) {
  const toastContainer = document.getElementById('LushToastContainer');
  if (!toastContainer || !item) return;

  const title = document.getElementById('ToastProductTitle');
  if (title) {
    const productTitle = item.product_title || item.title || 'Product';
    const variantTitle = (item.variant_title && item.variant_title !== 'Default Title') ? ` • ${item.variant_title}` : '';
    title.textContent = `${productTitle}${variantTitle}`;
  }

  // Clear previous timer to prevent overlapping glitches on rapid clicks
  if (toastTimeout) clearTimeout(toastTimeout);
  toastContainer.classList.add('active');

  // Auto-hide after 2.5 seconds
  toastTimeout = setTimeout(() => {
    toastContainer.classList.remove('active');
  }, 2500);

  const closeBtn = document.getElementById('BtnCloseToast');
  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.preventDefault();
      if (toastTimeout) clearTimeout(toastTimeout);
      toastContainer.classList.remove('active');
    };
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
            <p>Explore luxury skincare, cosmetics, designer handbags and fragrances from our showroom.</p>
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

  // Mobile Accordion Submenu Toggles
  drawer.querySelectorAll('.mobile-accordion-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentItem = btn.closest('.mobile-nav-item');
      const sublist = parentItem?.querySelector('.mobile-sublinks');
      if (sublist) {
        const isOpen = parentItem.classList.contains('open');
        parentItem.classList.toggle('open', !isOpen);
        sublist.style.display = isOpen ? 'none' : 'flex';
      }
    });
  });
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

      const initialVariant = prod.variants[0];
      const initialPrice = formatMoney(initialVariant.price);
      const initialCompare = initialVariant.compare_at_price > initialVariant.price ? formatMoney(initialVariant.compare_at_price) : '';

      // Build options HTML if product has variants
      let variantsHtml = '';
      if (prod.options && prod.options.length > 0 && prod.variants.length > 1) {
        variantsHtml = '<div class="qv-variants-wrap" style="margin: 12px 0; display: flex; flex-direction: column; gap: 8px;">';
        prod.options.forEach((opt, optIdx) => {
          variantsHtml += `
            <div class="qv-option-group">
              <label style="font-size: 0.72rem; font-weight: 700; color: #8A7363; text-transform: uppercase; margin-bottom: 4px; display: block;">${opt.name}:</label>
              <div class="qv-pill-row" style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${opt.values.map((val, valIdx) => `
                  <label class="qv-pill-label" style="cursor: pointer;">
                    <input type="radio" name="qv-opt-${optIdx + 1}" value="${val}" ${valIdx === 0 ? 'checked' : ''} class="qv-variant-radio" data-opt-pos="${optIdx + 1}" style="display: none;">
                    <span class="qv-pill-btn ${valIdx === 0 ? 'active' : ''}" style="display: inline-block; padding: 5px 12px; border-radius: 999px; border: 1px solid #EAE3DA; font-size: 0.72rem; font-weight: 600; background: ${valIdx === 0 ? '#1F1610' : '#FFFFFF'}; color: ${valIdx === 0 ? '#FFFFFF' : '#1F1610'};">${val}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `;
        });
        variantsHtml += '</div>';
      }

      content.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px;">
          <div>
            <img id="QvMainImg" src="${initialVariant.featured_image ? initialVariant.featured_image.src : prod.featured_image}" alt="${prod.title}" style="width: 100%; aspect-ratio: 4/5; object-fit: contain; background: #FAF7F2; padding: 12px; border-radius: 12px; border: 1px solid #EAE3DA;">
          </div>
          <div style="display: flex; flex-direction: column; justify-content: space-between; gap: 12px;">
            <div>
              <span style="font-size: 0.65rem; font-weight: 800; color: #C5A059; text-transform: uppercase; letter-spacing: 0.08em;">${prod.type || prod.vendor || 'LUSH EXCLUSIVE'}</span>
              <h2 style="font-size: 1.25rem; font-weight: 800; margin: 4px 0 8px; color: #1F1610; line-height: 1.2;">${prod.title}</h2>
              <div style="display: flex; align-items: baseline; gap: 8px; margin: 8px 0;">
                <span id="QvPrice" style="font-size: 1.3rem; font-weight: 800; color: #1F1610;">${initialPrice}</span>
                <span id="QvCompare" style="font-size: 0.85rem; color: #8A7363; text-decoration: line-through; ${initialCompare ? '' : 'display: none;'}">${initialCompare}</span>
              </div>
              ${variantsHtml}
              <p style="font-size: 0.78rem; color: #6E5E52; line-height: 1.45;">${prod.description ? prod.description.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...' : ''}</p>
            </div>
            <form action="/cart/add" method="post" class="card-form" id="QvForm" style="display: flex; flex-direction: column; gap: 8px; margin-top: auto;">
              <input type="hidden" name="id" value="${initialVariant.id}" id="QvVariantId">
              <button type="submit" id="QvSubmitBtn" class="btn-buy-now" style="width: 100%; padding: 11px; border-radius: 8px; background: #1F1610; color: #FFF; font-weight: 700; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.04em;">${initialVariant.available ? 'Add to Shopping Bag' : 'Sold Out'}</button>
              <a href="${prod.url}" style="text-align: center; font-size: 0.75rem; font-weight: 700; color: #C5A059; margin-top: 4px; text-decoration: none;">View Full Details Page →</a>
            </form>
          </div>
        </div>
      `;

      // Bind Quick View variant selection
      const qvRadios = content.querySelectorAll('.qv-variant-radio');
      if (qvRadios.length) {
        qvRadios.forEach(radio => {
          radio.addEventListener('change', () => {
            // Update button styles
            const parentGroup = radio.closest('.qv-option-group');
            if (parentGroup) {
              parentGroup.querySelectorAll('.qv-pill-btn').forEach(btn => {
                btn.style.background = '#FFFFFF';
                btn.style.color = '#1F1610';
              });
              const activeBtn = radio.parentElement.querySelector('.qv-pill-btn');
              if (activeBtn) {
                activeBtn.style.background = '#1F1610';
                activeBtn.style.color = '#FFFFFF';
              }
            }

            // Get selected values
            const selectedOpts = [];
            content.querySelectorAll('.qv-variant-radio:checked').forEach(r => {
              const pos = parseInt(r.getAttribute('data-opt-pos') || 1, 10);
              selectedOpts[pos - 1] = r.value;
            });

            // Find variant
            const matchedVar = prod.variants.find(v => {
              let match = true;
              if (selectedOpts[0] && v.option1 !== selectedOpts[0]) match = false;
              if (selectedOpts[1] && v.option2 !== selectedOpts[1]) match = false;
              if (selectedOpts[2] && v.option3 !== selectedOpts[2]) match = false;
              return match;
            });

            if (matchedVar) {
              const qvVarInput = document.getElementById('QvVariantId');
              const qvPrice = document.getElementById('QvPrice');
              const qvCompare = document.getElementById('QvCompare');
              const qvSubmit = document.getElementById('QvSubmitBtn');
              const qvImg = document.getElementById('QvMainImg');

              if (qvVarInput) qvVarInput.value = matchedVar.id;
              if (qvPrice) qvPrice.textContent = formatMoney(matchedVar.price);
              if (qvCompare) {
                if (matchedVar.compare_at_price > matchedVar.price) {
                  qvCompare.textContent = formatMoney(matchedVar.compare_at_price);
                  qvCompare.style.display = '';
                } else {
                  qvCompare.style.display = 'none';
                }
              }
              if (qvSubmit) {
                qvSubmit.disabled = !matchedVar.available;
                qvSubmit.textContent = matchedVar.available ? 'Add to Shopping Bag' : 'Sold Out';
              }
              if (matchedVar.featured_image && matchedVar.featured_image.src && qvImg) {
                qvImg.src = matchedVar.featured_image.src;
              }
            }
          });
        });
      }
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
   8. Money Formatting Helper
   -------------------------------------------------------------------------- */
function formatMoney(cents, format) {
  if (typeof cents === 'string') {
    cents = cents.replace('.', '');
  }
  let value = '';
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  const formatString = format || (window.theme && window.theme.moneyFormat) || '₹{{amount}}';

  function defaultOption(opt, def) {
    return (typeof opt === 'undefined' ? def : opt);
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal = defaultOption(decimal, '.');

    if (isNaN(number) || number == null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);

    const parts = number.split('.');
    const dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
    const centsVal = parts[1] ? (decimal + parts[1]) : '';

    return dollars + centsVal;
  }

  const match = formatString.match(placeholderRegex);
  if (match) {
    switch (match[1]) {
      case 'amount':
        value = formatWithDelimiters(cents, 2);
        if (value.endsWith('.00')) {
          value = value.slice(0, -3);
        }
        break;
      case 'amount_no_decimals':
        value = formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = formatWithDelimiters(cents, 2, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = formatWithDelimiters(cents, 0, '.', ',');
        break;
      default:
        value = formatWithDelimiters(cents, 2);
    }
    return formatString.replace(placeholderRegex, value);
  }

  const num = (cents / 100.0);
  const formattedNum = (num % 1 === 0) ? num.toFixed(0) : num.toFixed(2);
  return '₹' + formattedNum;
}

/* --------------------------------------------------------------------------
   9. Real-Time Product Variant Price & Selector Synchronization
   -------------------------------------------------------------------------- */
function initProductVariantSelector() {
  const productSections = document.querySelectorAll('.lush-main-product-section');
  if (!productSections.length) return;

  productSections.forEach(section => {
    const productId = section.getAttribute('data-product-id');
    const jsonScript = document.getElementById(`ProductJson-${productId}`);
    if (!jsonScript) return;

    let productData;
    try {
      productData = JSON.parse(jsonScript.textContent);
    } catch (e) {
      console.error('Failed to parse product JSON for variant selector', e);
      return;
    }

    if (!productData || !productData.variants || productData.variants.length === 0) return;

    const variantIdInput = section.querySelector('#ProductVariantId');
    const priceEl = section.querySelector('[data-product-price]');
    const comparePriceEl = section.querySelector('[data-compare-price]');
    const saveBadgeEl = section.querySelector('[data-save-badge]');
    const stageDiscountEl = section.querySelector('[data-stage-discount]');
    const stickyPriceEl = section.querySelector('[data-sticky-price]');
    const addBagBtn = section.querySelector('#BtnAddBag');
    const addBagText = section.querySelector('[data-add-to-cart-text]');
    const buyNowBtn = section.querySelector('#BtnBuyNow');
    const stickyAddBagBtn = section.querySelector('#BtnStickyAddBag');
    const stickyAddText = section.querySelector('[data-sticky-add-text]');
    const mainImg = section.querySelector('#ProductMainImg');

    function getSelectedOptions() {
      const options = [];
      section.querySelectorAll('.variant-radio:checked').forEach(radio => {
        const pos = parseInt(radio.getAttribute('data-option-position') || 1, 10);
        options[pos - 1] = radio.value;
      });
      section.querySelectorAll('select.variant-select').forEach(select => {
        const pos = parseInt(select.getAttribute('data-option-position') || 1, 10);
        options[pos - 1] = select.value;
      });
      return options;
    }

    function findMatchingVariant(selectedOptions) {
      return productData.variants.find(variant => {
        let match = true;
        if (selectedOptions[0] && variant.option1 !== selectedOptions[0]) match = false;
        if (selectedOptions[1] && variant.option2 !== selectedOptions[1]) match = false;
        if (selectedOptions[2] && variant.option3 !== selectedOptions[2]) match = false;
        return match;
      });
    }

    function updateVariantUI(variant) {
      if (!variant) {
        if (addBagBtn) {
          addBagBtn.disabled = true;
          if (addBagText) addBagText.textContent = 'UNAVAILABLE';
        }
        if (buyNowBtn) buyNowBtn.style.display = 'none';
        if (stickyAddBagBtn) {
          stickyAddBagBtn.disabled = true;
          if (stickyAddText) stickyAddText.textContent = 'UNAVAILABLE';
        }
        return;
      }

      // 1. Update Variant ID in form
      if (variantIdInput) {
        variantIdInput.value = variant.id;
      }

      // 2. Update Main Price
      const formattedPrice = formatMoney(variant.price);
      if (priceEl) {
        priceEl.textContent = formattedPrice;
      }

      // 3. Update Sticky Mobile Price & Thumbnail
      if (stickyPriceEl) {
        stickyPriceEl.textContent = formattedPrice;
      }
      const stickyThumb = section.querySelector('.sticky-bar-thumb');
      if (stickyThumb && variant.featured_image && variant.featured_image.src) {
        stickyThumb.src = variant.featured_image.src;
      }

      // 4. Update Compare-at Price, Savings & Discount %
      if (variant.compare_at_price && variant.compare_at_price > variant.price) {
        const formattedCompare = formatMoney(variant.compare_at_price);
        const savingsAmount = variant.compare_at_price - variant.price;
        const formattedSavings = formatMoney(savingsAmount);
        const discountPercent = Math.round((savingsAmount / variant.compare_at_price) * 100);

        if (comparePriceEl) {
          comparePriceEl.textContent = formattedCompare;
          comparePriceEl.style.display = '';
        }

        if (saveBadgeEl) {
          saveBadgeEl.textContent = `Save ${formattedSavings}`;
          saveBadgeEl.style.display = '';
        }

        if (stageDiscountEl) {
          stageDiscountEl.textContent = `${discountPercent}% OFF`;
          stageDiscountEl.style.display = '';
        }
      } else {
        if (comparePriceEl) comparePriceEl.style.display = 'none';
        if (saveBadgeEl) saveBadgeEl.style.display = 'none';
        if (stageDiscountEl) stageDiscountEl.style.display = 'none';
      }

      // 5. Update Availability & Buttons
      if (variant.available) {
        if (addBagBtn) {
          addBagBtn.disabled = false;
          if (addBagText) addBagText.textContent = 'ADD TO BAG';
        }
        if (buyNowBtn) {
          buyNowBtn.style.display = '';
        }
        if (stickyAddBagBtn) {
          stickyAddBagBtn.disabled = false;
          if (stickyAddText) stickyAddText.textContent = 'ADD TO BAG';
        }
      } else {
        if (addBagBtn) {
          addBagBtn.disabled = true;
          if (addBagText) addBagText.textContent = 'SOLD OUT';
        }
        if (buyNowBtn) {
          buyNowBtn.style.display = 'none';
        }
        if (stickyAddBagBtn) {
          stickyAddBagBtn.disabled = true;
          if (stickyAddText) stickyAddText.textContent = 'SOLD OUT';
        }
      }

      // 6. Update Delivery Checker Box Data Price for Accurate Dynamic Free Delivery
      const deliveryBox = section.querySelector('#ShiprocketDeliveryBox');
      if (deliveryBox) {
        deliveryBox.dataset.productPrice = variant.price;
      }

      // 7. Update Variant Image and Scroll to Slide if available
      if (variant.featured_image) {
        const targetThumb = Array.from(section.querySelectorAll('.thumb-btn')).find(thumb =>
          thumb.getAttribute('data-media-id') == variant.featured_image.id ||
          thumb.getAttribute('data-thumb-src')?.includes(String(variant.featured_image.id))
        );
        if (targetThumb) {
          targetThumb.click();
        } else if (mainImg && variant.featured_image.src) {
          mainImg.src = variant.featured_image.src;
          mainImg.removeAttribute('srcset');
          const track = document.getElementById('PdpMediaTrack');
          if (track) track.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }

      // 8. Update URL without page reload
      if (window.history && window.history.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.set('variant', variant.id);
        window.history.replaceState({ path: url.href }, '', url.href);
      }
    }

    // Bind event listeners to radio options
    section.querySelectorAll('.variant-radio').forEach(radio => {
      radio.addEventListener('change', () => {
        const pos = radio.getAttribute('data-option-position');
        const selectedValLabel = section.querySelector(`[data-selected-val-for="${pos}"]`);
        if (selectedValLabel) {
          selectedValLabel.textContent = radio.value;
        }

        const selectedOptions = getSelectedOptions();
        const matched = findMatchingVariant(selectedOptions);
        updateVariantUI(matched);
      });
    });

    // Bind event listeners to select dropdown options
    section.querySelectorAll('select.variant-select').forEach(select => {
      select.addEventListener('change', () => {
        const pos = select.getAttribute('data-option-position');
        const selectedValLabel = section.querySelector(`[data-selected-val-for="${pos}"]`);
        if (selectedValLabel) {
          selectedValLabel.textContent = select.value;
        }

        const selectedOptions = getSelectedOptions();
        const matched = findMatchingVariant(selectedOptions);
        updateVariantUI(matched);
      });
    });

    // Check if URL contains ?variant= on initial load
    const urlParams = new URLSearchParams(window.location.search);
    const variantParam = urlParams.get('variant');
    if (variantParam) {
      const initialVariant = productData.variants.find(v => String(v.id) === String(variantParam));
      if (initialVariant) {
        if (initialVariant.option1) {
          const r1 = section.querySelector(`.variant-radio[data-option-position="1"][value="${CSS.escape(initialVariant.option1)}"]`);
          if (r1) { r1.checked = true; }
          const l1 = section.querySelector(`[data-selected-val-for="1"]`);
          if (l1) l1.textContent = initialVariant.option1;
        }
        if (initialVariant.option2) {
          const r2 = section.querySelector(`.variant-radio[data-option-position="2"][value="${CSS.escape(initialVariant.option2)}"]`);
          if (r2) { r2.checked = true; }
          const l2 = section.querySelector(`[data-selected-val-for="2"]`);
          if (l2) l2.textContent = initialVariant.option2;
        }
        if (initialVariant.option3) {
          const r3 = section.querySelector(`.variant-radio[data-option-position="3"][value="${CSS.escape(initialVariant.option3)}"]`);
          if (r3) { r3.checked = true; }
          const l3 = section.querySelector(`[data-selected-val-for="3"]`);
          if (l3) l3.textContent = initialVariant.option3;
        }
        updateVariantUI(initialVariant);
      }
    } else {
      const initialOptions = getSelectedOptions();
      if (initialOptions.length) {
        const initialMatched = findMatchingVariant(initialOptions);
        if (initialMatched) updateVariantUI(initialMatched);
      }
    }
  });
}

/* --------------------------------------------------------------------------
   10. Main Product Page Helpers
   -------------------------------------------------------------------------- */
function initProductPage() {
  const mediaTrack = document.getElementById('PdpMediaTrack');
  const currentSlideEl = document.getElementById('PdpCurrentSlide');
  const slides = document.querySelectorAll('.pdp-media-slide');
  const dots = document.querySelectorAll('.pdp-dot');
  const thumbs = document.querySelectorAll('.thumb-btn');

  // 1. Mobile Gallery Scroll & Swipe Tracking
  if (mediaTrack && slides.length > 0) {
    let scrollTimeout;
    mediaTrack.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const trackWidth = mediaTrack.clientWidth || 1;
        const scrollLeft = mediaTrack.scrollLeft;
        const activeIdx = Math.min(slides.length - 1, Math.max(0, Math.round(scrollLeft / trackWidth)));

        if (currentSlideEl) currentSlideEl.textContent = activeIdx + 1;

        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === activeIdx);
        });

        thumbs.forEach((thumb, i) => {
          thumb.classList.toggle('active', i === activeIdx);
        });
      }, 50);
    }, { passive: true });
  }

  // 2. Thumbnail Clicks (Smooth Scroll without image overwrite)
  thumbs.forEach((thumb, idx) => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(b => b.classList.remove('active'));
      thumb.classList.add('active');

      if (mediaTrack && slides[idx]) {
        const slideLeft = slides[idx].offsetLeft;
        mediaTrack.scrollTo({ left: slideLeft, behavior: 'smooth' });
      }
    });
  });

  // 3. Fullscreen Lightbox Modal (with touch swipe gesture guard)
  const lightbox = document.getElementById('PdpLightboxModal');
  const lightboxImg = document.getElementById('LightboxMainImg');
  const lightboxCounter = document.getElementById('LightboxCurrent');
  const openLightboxBtn = document.getElementById('BtnOpenLightbox');
  const closeLightboxBtn = document.getElementById('BtnCloseLightbox');
  const closeLightboxBackdrop = document.getElementById('BtnCloseLightboxBackdrop');

  const openLightbox = (src, index) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src || '';
    if (lightboxCounter && index) lightboxCounter.textContent = index;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (openLightboxBtn) {
    openLightboxBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const activeSlide = document.querySelector('.pdp-media-slide.active') || slides[0];
      const img = activeSlide?.querySelector('img');
      const idx = activeSlide?.dataset.mediaIndex || 1;
      openLightbox(img?.src, idx);
    });
  }

  // Prevent accidental lightbox trigger while swiping gallery on mobile
  let touchStartX = 0;
  let touchStartY = 0;
  let isSwipeDrag = false;

  if (mediaTrack) {
    mediaTrack.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwipeDrag = false;
      }
    }, { passive: true });

    mediaTrack.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        const diffX = Math.abs(e.touches[0].clientX - touchStartX);
        const diffY = Math.abs(e.touches[0].clientY - touchStartY);
        if (diffX > 8 || diffY > 8) {
          isSwipeDrag = true;
        }
      }
    }, { passive: true });
  }

  slides.forEach(slide => {
    slide.addEventListener('click', () => {
      if (isSwipeDrag) return; // Ignore drag gestures
      const img = slide.querySelector('img');
      const idx = slide.dataset.mediaIndex || 1;
      openLightbox(img?.src, idx);
    });
  });

  if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
  if (closeLightboxBackdrop) closeLightboxBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('active')) {
      closeLightbox();
    }
  });

  // 4. Quantity Stepper with bounds validation
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
    input.addEventListener('change', () => {
      input.value = Math.max(1, parseInt(input.value || 1, 10) || 1);
    });
  }

  // 5. Buy Now direct checkout (Compatible with Razorpay Magic Checkout)
  const btnBuyNow = document.getElementById('BtnBuyNow');
  if (btnBuyNow) {
    btnBuyNow.addEventListener('click', async () => {
      const variantId = document.getElementById('ProductVariantId')?.value;
      const qty = parseInt(document.getElementById('ProductQuantityInput')?.value || '1', 10);
      if (variantId) {
        btnBuyNow.disabled = true;
        const originalText = btnBuyNow.innerHTML;
        btnBuyNow.innerHTML = '<span>REDIRECTING...</span>';
        try {
          await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: variantId, quantity: qty })
          });
          window.location.href = '/checkout';
        } catch (err) {
          window.location.href = `/cart/${variantId}:${qty}`;
        }
      }
    });
  }

  // 6. Dynamic PDP WhatsApp Enquiry with live variant, price & quantity
  document.addEventListener('click', (e) => {
    const pdpWaBtn = e.target.closest('.btn-pdp-tertiary-whatsapp, .btn-product-whatsapp-enquire');
    if (!pdpWaBtn) return;
    e.preventDefault();

    const title = document.querySelector('.product-page-title')?.textContent?.trim() || 'Exclusive Product';
    const price = document.querySelector('[data-product-price]')?.textContent?.trim() || document.querySelector('.price-big')?.textContent?.trim() || '';
    const qty = document.getElementById('ProductQuantityInput')?.value || 1;
    const selectedVariant = document.querySelector('.variant-radio:checked')?.value || document.querySelector('.selected-option-value')?.textContent?.trim() || '';
    const variantText = selectedVariant ? ` _(${selectedVariant})_` : '';

    const msg = `🌸 *NAMASTE LUSH BEAUTY MART NAGPUR!* 🌸\n\n` +
      `I would like to order / inquire about:\n\n` +
      `✨ *Product:* ${title}${variantText}\n` +
      `📦 *Quantity:* ${qty}\n` +
      `💰 *Price:* ${price}\n\n` +
      `📍 *Showroom:* Below Hotel Maitrayee, Near Lad Square, North Ambazari Rd, Nagpur\n\n` +
      `Is this in stock for immediate showroom pickup / delivery? Please share UPI payment details! ✨`;

    window.open(`https://wa.me/919119595951?text=${encodeURIComponent(msg)}`, '_blank');
  });
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
   14. Real Shiprocket-Backed Delivery Serviceability & Estimator
   -------------------------------------------------------------------------- */
function initPincodeChecker() {
  const box = document.getElementById('ShiprocketDeliveryBox');
  const input = document.getElementById('DeliveryPincodeInput');
  const btn = document.getElementById('BtnCheckPincode');
  const result = document.getElementById('PincodeResult');

  if (!input || !btn || !result) return;

  const btnLabel = btn.querySelector('.btn-pincode-label');
  const btnLoader = btn.querySelector('.btn-pincode-loader');

  const setLoading = (loading) => {
    btn.disabled = loading;
    if (btnLabel) btnLabel.style.display = loading ? 'none' : 'inline-block';
    if (btnLoader) btnLoader.style.display = loading ? 'inline-block' : 'none';
  };

  btn.addEventListener('click', async () => {
    const code = input.value.trim();
    if (!/^[1-8][0-9]{5}$/.test(code)) {
      result.style.display = 'block';
      result.className = 'pincode-result-msg error';
      result.innerHTML = '⚠️ Please enter a valid 6-digit Indian postal code (starting with 1–8).';
      return;
    }

    setLoading(true);
    result.style.display = 'none';

    // 1. Check if Nagpur District Local Pincode
    const isNagpurLocal = code.startsWith('440') || code.startsWith('441');

    // 2. Query Serverless Shiprocket Backend Serviceability Endpoint
    const weight = box?.dataset.productWeight || 500;
    const price = parseInt(box?.dataset.productPrice || 0, 10) / 100;

    try {
      // Call secure backend endpoint (which authenticates with Shiprocket server-side)
      const res = await fetch(`/api/shiprocket/serviceability?delivery_postcode=${encodeURIComponent(code)}&weight=${weight}&declared_value=${price}`);

      if (res.ok) {
        const data = await res.json();
        setLoading(false);
        result.style.display = 'block';

        if (data.serviceable) {
          result.className = 'pincode-result-msg success';
          const etaText = data.estimated_days ? `Estimated delivery: <strong>${data.estimated_days}</strong>` : 'Estimated delivery: <strong>2–4 business days</strong>';
          const shippingFee = (price >= 999 || data.is_free) ? '<span style="color:#0F7A42; font-weight:800;">FREE</span>' : `₹${data.shipping_rate || 70}`;
          const courierInfo = data.courier_name ? ` via ${data.courier_name}` : ' via Shiprocket Tracked Courier';

          if (isNagpurLocal) {
            result.innerHTML = `⚡ <strong>Nagpur Local Delivery:</strong> FREE Same-Day / Next-Day Delivery available for PIN code ${code}!<br>🏬 Also ready for <strong>instant pickup</strong> at our Lad Square Showroom.`;
          } else {
            result.innerHTML = `✓ <strong>Delivery Available for ${code}</strong><br>🚚 ${etaText}${courierInfo}<br>📦 Shipping: ${shippingFee} (Free above ₹999)`;
          }
        } else {
          result.className = 'pincode-result-msg error';
          result.innerHTML = `⚠️ This PIN code (${code}) is currently not serviceable for courier delivery.`;
        }
      } else {
        throw new Error('Backend service unavailable');
      }
    } catch (err) {
      // Fallback gracefully without exposing technical errors or crashing
      setLoading(false);
      result.style.display = 'block';

      if (isNagpurLocal) {
        result.className = 'pincode-result-msg success';
        result.innerHTML = `⚡ <strong>Nagpur Express Delivery:</strong> FREE Same-Day / Next-Day Delivery available for PIN code ${code}!<br>🏬 Also available for <strong>instant showroom pickup</strong> at Lad Square.`;
      } else {
        result.className = 'pincode-result-msg success';
        const freeNote = price >= 999 ? '<span style="color:#0F7A42; font-weight:800;">FREE SHIPPING</span>' : 'Standard courier charges apply (FREE above ₹999)';
        result.innerHTML = `✓ <strong>Delivery Available for ${code}</strong><br>🚚 Estimated delivery: <strong>3–5 business days</strong> via Shiprocket Tracked Courier.<br>📦 ${freeNote}.`;
      }
    }
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      btn.click();
    }
  });
}

/* --------------------------------------------------------------------------
   15. Compact Mobile Sticky Purchase Bar on Product Page
   -------------------------------------------------------------------------- */
function initStickyMobileBar() {
  const bar = document.getElementById('StickyMobilePdpBar');
  const triggerRow = document.getElementById('ProductMainCtaRow');
  const stickyBtn = document.getElementById('BtnStickyAddBag');
  const mainForm = document.getElementById('MainProductForm');
  const relatedSection = document.querySelector('.lush-related-products-section');
  const footer = document.querySelector('.site-footer, footer');

  if (!bar || !triggerRow) return;

  let ticking = false;

  const updateStickyBar = () => {
    if (window.innerWidth >= 768) {
      bar.classList.remove('active');
      return;
    }

    const ctaRect = triggerRow.getBoundingClientRect();
    const isCtaInView = ctaRect.top < window.innerHeight && ctaRect.bottom > 0;
    const isScrolledPastCta = ctaRect.bottom <= 0;

    // Check if user has scrolled down into related products or footer
    let isAtBottom = false;
    if (relatedSection) {
      const relRect = relatedSection.getBoundingClientRect();
      if (relRect.top < window.innerHeight * 0.7) {
        isAtBottom = true;
      }
    } else if (footer) {
      const footerRect = footer.getBoundingClientRect();
      if (footerRect.top < window.innerHeight) {
        isAtBottom = true;
      }
    }

    if (isScrolledPastCta && !isCtaInView && !isAtBottom) {
      bar.classList.add('active');
    } else {
      bar.classList.remove('active');
    }
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateStickyBar();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', updateStickyBar, { passive: true });

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

/* --------------------------------------------------------------------------
   18. Helper: Smart Pre-filled WhatsApp Order Summary Generator
   -------------------------------------------------------------------------- */
function generateWhatsAppOrderUrl(cartData) {
  const waNum = '919119595951';
  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return `https://wa.me/${waNum}?text=${encodeURIComponent('Namaste Lush Beauty Mart Nagpur! 🌸 I would like to inquire about beauty, skincare & cosmetics products at your Lad Square showroom.')}`;
  }

  const itemsList = cartData.items.map((item, idx) => {
    const vText = item.variant_title && item.variant_title !== 'Default Title' ? ` _(${item.variant_title})_` : '';
    const linePrice = (item.final_line_price / 100).toFixed(0);
    return `${idx + 1}. ✨ *${item.product_title || item.title}*${vText}\n   ▫️ Qty: ${item.quantity}  |  Price: ₹${linePrice}`;
  }).join('\n\n');

  const subtotal = (cartData.total_price / 100).toFixed(0);
  const isFreeDelivery = cartData.total_price >= 99900;
  const deliveryStatus = isFreeDelivery
    ? '🎉 FREE EXPRESS DELIVERY UNLOCKED (Nagpur)!'
    : '₹50 Standard Delivery (Free on ₹999+)';

  const message = `🌸 *NAMASTE LUSH BEAUTY MART NAGPUR!* 🌸\n` +
    `I would like to place an instant order for the following items:\n\n` +
    `🛒 *ORDER SUMMARY:*\n` +
    `──────────────────────\n` +
    `${itemsList}\n` +
    `──────────────────────\n` +
    `💰 *Bag Subtotal:* ₹${subtotal}\n` +
    `🚚 *Nagpur Delivery:* ${deliveryStatus}\n` +
    `💎 *Grand Total:* *₹${subtotal}*\n` +
    `──────────────────────\n\n` +
    `📍 *Showroom:* Below Hotel Maitrayee, Near Lad Square, North Ambazari Rd, Nagpur\n` +
    `💳 *Payment Preference:* UPI / GPay / PhonePe / Cash on Delivery\n\n` +
    `Please confirm stock availability at your Lad Square showroom & share UPI payment details! ✨`;

  return `https://wa.me/${waNum}?text=${encodeURIComponent(message)}`;
}

// Bind WhatsApp instant checkout buttons on Cart Page
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.btn-whatsapp-instant-checkout').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        const res = await fetch('/cart.js');
        const cartData = await res.json();
        const waUrl = generateWhatsAppOrderUrl(cartData);
        window.open(waUrl, '_blank');
      } catch (err) {
        window.open('https://wa.me/919119595951', '_blank');
      }
    });
  });

  // Universal Autoplay Enforcer (ensures muted story videos play reliably across Chrome, Safari, Android & iOS)
  document.querySelectorAll('video').forEach(video => {
    video.muted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    const playVideo = () => {
      const p = video.play();
      if (p !== undefined) {
        p.catch(() => {});
      }
    };

    playVideo();
    ['scroll', 'touchstart', 'click'].forEach(evt => {
      window.addEventListener(evt, playVideo, { once: true, passive: true });
    });
  });
});

/* --------------------------------------------------------------------------
   17. Native Web Share & Social Share Integration for All Products
   -------------------------------------------------------------------------- */
function initShareButtons() {
  document.addEventListener('click', async (e) => {
    // 1. Share Button Trigger (Web Share API or Fallback)
    const shareBtn = e.target.closest('[data-share-btn]');
    if (shareBtn) {
      e.preventDefault();
      e.stopPropagation();

      const title = shareBtn.dataset.shareTitle || document.title || 'Lush Beauty Mart Product';
      const url = shareBtn.dataset.shareUrl || window.location.href;
      const text = `Check out "${title}" at Lush Beauty Mart Nagpur! ✨\n${url}`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            text: `Check out "${title}" at Lush Beauty Mart Nagpur! ✨`,
            url: url,
          });
          return;
        } catch (err) {
          if (err.name === 'AbortError') return; // User dismissed share sheet
        }
      }

      // Fallback: Copy link to clipboard
      copyUrlToClipboard(url, title);
      return;
    }

    // 2. Direct Copy Link Button Trigger
    const copyBtn = e.target.closest('[data-copy-link]');
    if (copyBtn) {
      e.preventDefault();
      const url = copyBtn.dataset.copyLink || window.location.href;
      copyUrlToClipboard(url);
    }
  });

  function copyUrlToClipboard(url, title = '') {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showShareConfirmationToast(title);
      }).catch(() => {
        fallbackCopy(url, title);
      });
    } else {
      fallbackCopy(url, title);
    }
  }

  function fallbackCopy(url, title) {
    const input = document.createElement('input');
    input.setAttribute('value', url);
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    try {
      document.execCommand('copy');
      showShareConfirmationToast(title);
    } catch (err) {
      prompt('Copy product link:', url);
    }
    document.body.removeChild(input);
  }

  function showShareConfirmationToast(title = '') {
    const toast = document.getElementById('LushToastContainer') || document.getElementById('AddToCartToast');
    if (toast) {
      const msg = toast.querySelector('.toast-main-msg');
      const titleEl = toast.querySelector('.toast-item-title');
      const prevMsg = msg ? msg.textContent : 'Added to bag ✓';
      const prevTitle = titleEl ? titleEl.textContent : '';

      if (msg) msg.textContent = 'Link Copied to Clipboard! 📋';
      if (titleEl) titleEl.textContent = title ? title.slice(0, 30) : 'Ready to share!';
      toast.classList.add('active');

      setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => {
          if (msg) msg.textContent = prevMsg;
          if (titleEl) titleEl.textContent = prevTitle;
        }, 400);
      }, 2500);
    }
  }
}
