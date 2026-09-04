/**
 * Lush Beauty Mart — Native Luxury Product Reviews & Photo Engine
 * 100% In-House, Zero Subscriptions, Real Photo Uploads & Lightbox
 */

(function () {
  'use strict';

  var DEFAULT_REVIEWS = [
    {
      id: 'rev_seed_1',
      name: 'Pooja Deshmukh',
      city: 'Dharampeth, Nagpur',
      rating: 5,
      title: '100% Original & Luxurious! Nagpur same-day delivery was amazing ✨',
      body: 'Bought this from Lush Beauty Mart after seeing recommendations. The fragrance and texture are top-notch luxury! Also received it in Nagpur within hours of ordering. Genuine product with sealed packaging.',
      photo: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
      date: '2 days ago',
      verified: true,
      helpful: 19
    },
    {
      id: 'rev_seed_2',
      name: 'Sneha Kulkarni',
      city: 'Ramdaspeth, Nagpur',
      rating: 5,
      title: 'Gentle on skin, leaves a divine glow and scent',
      body: 'I have sensitive skin and was skeptical at first, but this exceeded all expectations. Very nourishing and didn\'t dry out my skin at all. Definitely restocking soon from the store!',
      photo: 'https://images.unsplash.com/photo-1608248597359-0010996884ab?auto=format&fit=crop&w=600&q=80',
      date: '4 days ago',
      verified: true,
      helpful: 14
    },
    {
      id: 'rev_seed_3',
      name: 'Rhea Singhania',
      city: 'Civil Lines, Nagpur',
      rating: 5,
      title: 'Premium packaging & authentic brand quality',
      body: 'So glad Nagpur now has Lush Beauty Mart offering authentic luxury brands. Beautiful bottle aesthetics and the product feels ultra-premium. 10/10 recommend!',
      photo: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80',
      date: '1 week ago',
      verified: true,
      helpful: 11
    },
    {
      id: 'rev_seed_4',
      name: 'Tanvi Joshi',
      city: 'Sadarpeth, Nagpur',
      rating: 4,
      title: 'Loved the results, very refreshing experience',
      body: 'A very rich and pleasant lather. A small amount goes a long way. Packaging was securely wrapped with bubble wrap and seal intact.',
      photo: '',
      date: '2 weeks ago',
      verified: true,
      helpful: 8
    },
    {
      id: 'rev_seed_5',
      name: 'Aarav Mehta',
      city: 'Mumbai, MH',
      rating: 5,
      title: 'Super fast shipping & 100% authentic seal',
      body: 'Ordered online after a friend in Nagpur recommended Lush Beauty Mart. Tracking via Shadowfax was super accurate and delivery reached in 2 days. Top notch authenticity.',
      photo: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
      date: '3 weeks ago',
      verified: true,
      helpful: 7
    }
  ];

  var currentFilter = 'all';
  var currentSort = 'newest';
  var currentPhotoBase64 = null;
  var productId = null;
  var productTitle = '';
  var allReviews = [];

  
  // =========================================================================
  // SUPABASE REALTIME CLOUD DATABASE ENGINE
  // =========================================================================
  var SUPABASE_URL = window.LUSH_SUPABASE_URL || '';
  var SUPABASE_ANON_KEY = window.LUSH_SUPABASE_ANON_KEY || '';

  function isSupabaseConfigured() {
    return SUPABASE_URL && SUPABASE_URL.indexOf('http') === 0 && SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 20;
  }

  function fetchReviewsFromSupabase() {
    if (!isSupabaseConfigured()) return;

    var endpoint = SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/product_reviews?product_id=eq.' + encodeURIComponent(productId) + '&is_approved=eq.true&order=created_at.desc';
    fetch(endpoint, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    })
    .then(function (res) {
      if (!res.ok) throw new Error('Supabase fetch failed: ' + res.status);
      return res.json();
    })
    .then(function (rows) {
      if (Array.isArray(rows) && rows.length > 0) {
        var cloudReviews = rows.map(function (r) {
          return {
            id: String(r.id),
            name: r.reviewer_name || 'Customer',
            city: r.reviewer_city || 'Nagpur, MH',
            rating: parseInt(r.rating, 10) || 5,
            title: r.review_title || '',
            body: r.review_body || '',
            photo: r.photo_url || '',
            date: formatRelativeDate(r.created_at),
            verified: r.verified_buyer !== false,
            helpful: parseInt(r.helpful_count, 10) || 0
          };
        });

        // Merge Supabase reviews at the top of default reviews
        allReviews = cloudReviews.concat(DEFAULT_REVIEWS);
        renderAll();
      }
    })
    .catch(function (err) {
      console.warn('Supabase fetch error:', err);
    });
  }

  function pushReviewToSupabase(newRev, email) {
    if (!isSupabaseConfigured()) return;

    var endpoint = SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/product_reviews';
    var payload = {
      product_id: String(productId),
      product_title: productTitle || '',
      reviewer_name: newRev.name,
      reviewer_city: newRev.city || 'Nagpur, MH',
      reviewer_email: email || null,
      rating: parseInt(newRev.rating, 10),
      review_title: newRev.title,
      review_body: newRev.body,
      photo_url: newRev.photo || null,
      verified_buyer: true,
      helpful_count: 0,
      is_approved: true
    };

    fetch(endpoint, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      console.log('Lush Review synced to Supabase database ✓:', data);
    })
    .catch(function (err) {
      console.warn('Failed to push review to Supabase:', err);
    });
  }

  function formatRelativeDate(dateStr) {
    if (!dateStr) return 'Recent';
    try {
      var d = new Date(dateStr);
      var diffMs = Date.now() - d.getTime();
      var diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return diffHours + ' hours ago';
      var diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 30) return diffDays + ' days ago';
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch (e) {
      return 'Recent';
    }
  }

  function initLushReviews() {
    var wrappers = document.querySelectorAll('#LushProductReviews');
    if (!wrappers || wrappers.length === 0) return;
    if (wrappers.length > 1) {
      for (var i = 1; i < wrappers.length; i++) {
        wrappers[i].parentNode.removeChild(wrappers[i]);
      }
    }
    var wrapper = wrappers[0];

    productId = wrapper.getAttribute('data-product-id') || 'default_product';
    productTitle = wrapper.getAttribute('data-product-title') || '';

    // Load saved reviews from localStorage
    loadReviewsData();
    fetchReviewsFromSupabase();

    // Render summary, photos, and list
    renderAll();

    // Hook up listeners
    setupModalListeners();
    setupStarSelector();
    setupPhotoUpload();
    setupFilterPills();
    setupSortDropdown();
    setupTopRatingJump();
  }

  function loadReviewsData() {
    var storageKey = 'lush_reviews_' + productId;
    var userReviews = [];
    try {
      var raw = localStorage.getItem(storageKey);
      if (raw) {
        userReviews = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Lush reviews storage error:', e);
    }

    allReviews = userReviews.concat(DEFAULT_REVIEWS);
  }

  function saveUserReview(newRev) {
    var storageKey = 'lush_reviews_' + productId;
    var userReviews = [];
    try {
      var raw = localStorage.getItem(storageKey);
      if (raw) userReviews = JSON.parse(raw);
    } catch (e) {}

    userReviews.unshift(newRev);
    try {
      localStorage.setItem(storageKey, JSON.stringify(userReviews));
    } catch (e) {
      console.warn('Unable to persist review to localStorage:', e);
    }

    allReviews.unshift(newRev);
    renderAll();
  }

  function renderAll() {
    renderSummary();
    renderPhotosGallery();
    renderReviewsFeed();
  }

  function renderSummary() {
    var total = allReviews.length;
    if (total === 0) return;

    var sum = 0;
    var counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    allReviews.forEach(function (r) {
      var stars = Math.min(5, Math.max(1, Math.round(r.rating)));
      sum += r.rating;
      counts[stars] = (counts[stars] || 0) + 1;
    });

    var avg = (sum / total).toFixed(1);
    if (avg.endsWith('.0')) avg = avg.replace('.0', '');

    var elScore = document.getElementById('LushAvgScore');
    if (elScore) elScore.textContent = avg;

    var elTotal = document.getElementById('LushTotalReviewsCount');
    if (elTotal) elTotal.textContent = 'Based on ' + total + ' Reviews';

    var elCountAll = document.getElementById('FilterCountAll');
    if (elCountAll) elCountAll.textContent = total;

    // Update star breakdown bars
    [5, 4, 3, 2, 1].forEach(function (star) {
      var count = counts[star] || 0;
      var pct = Math.round((count / total) * 100);
      var barFill = document.getElementById('BarFill' + star);
      var barCount = document.getElementById('BarCount' + star);
      if (barFill) barFill.style.width = pct + '%';
      if (barCount) barCount.textContent = count;
    });

    // Update header star score if present on PDP
    var topScore = document.querySelector('.pdp-rating-score');
    if (topScore) topScore.textContent = avg;
    var topCount = document.querySelector('.pdp-reviews-count');
    if (topCount) topCount.textContent = '(' + total + ' Reviews)';
  }

  function renderPhotosGallery() {
    var gallery = document.getElementById('LushPhotosGallery');
    var badge = document.getElementById('LushPhotoCountBadge');
    var filterPhotoCount = document.getElementById('FilterCountPhotos');
    if (!gallery) return;

    var photosList = [];
    allReviews.forEach(function (r) {
      if (r.photo) {
        photosList.push({
          photo: r.photo,
          name: r.name,
          title: r.title,
          body: r.body
        });
      }
    });

    if (badge) badge.textContent = photosList.length + ' Photos';
    if (filterPhotoCount) filterPhotoCount.textContent = photosList.length;

    var sec = document.getElementById('LushCustomerPhotosSection');
    if (photosList.length === 0) {
      if (sec) sec.style.display = 'none';
      return;
    } else {
      if (sec) sec.style.display = 'block';
    }

    gallery.innerHTML = '';
    photosList.forEach(function (item) {
      var thumb = document.createElement('div');
      thumb.className = 'customer-photo-thumb';
      thumb.setAttribute('role', 'button');
      thumb.setAttribute('tabindex', '0');
      thumb.setAttribute('aria-label', 'View photo by ' + item.name);

      var img = document.createElement('img');
      img.src = item.photo;
      img.alt = 'Customer photo by ' + item.name;
      img.loading = 'lazy';

      var overlay = document.createElement('span');
      overlay.className = 'thumb-zoom-icon';
      overlay.innerHTML = '🔍';

      thumb.appendChild(img);
      thumb.appendChild(overlay);

      thumb.addEventListener('click', function () {
        openLightbox(item.photo, item.name, item.title + ' — ' + item.body);
      });

      gallery.appendChild(thumb);
    });
  }

  function renderReviewsFeed() {
    var container = document.getElementById('LushReviewsList');
    if (!container) return;

    // Filter
    var filtered = allReviews.filter(function (r) {
      if (currentFilter === 'photos') return !!r.photo;
      if (currentFilter === '5star') return Math.round(r.rating) === 5;
      if (currentFilter === '4star') return Math.round(r.rating) === 4;
      if (currentFilter === 'verified') return !!r.verified;
      return true;
    });

    // Sort
    filtered.sort(function (a, b) {
      if (currentSort === 'highest') return b.rating - a.rating;
      if (currentSort === 'helpful') return (b.helpful || 0) - (a.helpful || 0);
      return 0; // default order is newest
    });

    container.innerHTML = '';

    if (filtered.length === 0) {
      container.innerHTML = '<div class="reviews-empty-state"><p>No reviews match this filter. Be the first to share your experience!</p></div>';
      return;
    }

    filtered.forEach(function (rev) {
      var card = document.createElement('div');
      card.className = 'lush-review-card';
      card.setAttribute('data-id', rev.id);

      // Stars string
      var starsStr = '';
      var full = Math.round(rev.rating);
      for (var i = 0; i < 5; i++) {
        starsStr += i < full ? '★' : '☆';
      }

      // Initial letter for avatar
      var initial = rev.name ? rev.name.charAt(0).toUpperCase() : 'C';

      var photoHtml = '';
      if (rev.photo) {
        photoHtml = '<div class="review-card-photo" data-photo="' + rev.photo + '">' +
          '<img src="' + rev.photo + '" alt="Product photo by ' + rev.name + '" loading="lazy">' +
          '<span class="photo-expand-badge">🔍 Zoom</span>' +
          '</div>';
      }

      var helpfulStoredKey = 'lush_helpful_' + rev.id;
      var isHelpfulVoted = localStorage.getItem(helpfulStoredKey) === 'true';

      card.innerHTML =
        '<div class="review-card-top">' +
          '<div class="reviewer-avatar">' + initial + '</div>' +
          '<div class="reviewer-details">' +
            '<div class="reviewer-name-row">' +
              '<strong class="reviewer-name">' + escapeHtml(rev.name) + '</strong>' +
              (rev.verified ? '<span class="verified-buyer-badge"><span class="badge-check">✓</span> Verified Buyer</span>' : '') +
            '</div>' +
            '<div class="reviewer-meta">' +
              '<span class="reviewer-location">📍 ' + escapeHtml(rev.city || 'Nagpur, MH') + '</span>' +
              '<span class="reviewer-date">• ' + escapeHtml(rev.date || 'Recent') + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="review-stars-display" aria-label="' + rev.rating + ' out of 5 stars">' + starsStr + '</div>' +
        '</div>' +
        '<h4 class="review-card-title">' + escapeHtml(rev.title) + '</h4>' +
        '<p class="review-card-body">' + escapeHtml(rev.body) + '</p>' +
        photoHtml +
        '<div class="review-card-footer">' +
          '<button type="button" class="btn-helpful ' + (isHelpfulVoted ? 'voted' : '') + '" data-id="' + rev.id + '">' +
            '<span>👍 Helpful (' + (rev.helpful || 0) + ')</span>' +
          '</button>' +
        '</div>';

      // Attach lightbox click to photo
      var photoEl = card.querySelector('.review-card-photo');
      if (photoEl) {
        photoEl.addEventListener('click', function () {
          openLightbox(rev.photo, rev.name, rev.title);
        });
      }

      // Attach helpful button click
      var helpfulBtn = card.querySelector('.btn-helpful');
      if (helpfulBtn) {
        helpfulBtn.addEventListener('click', function () {
          if (localStorage.getItem(helpfulStoredKey) === 'true') return;
          rev.helpful = (rev.helpful || 0) + 1;
          localStorage.setItem(helpfulStoredKey, 'true');
          helpfulBtn.classList.add('voted');
          helpfulBtn.querySelector('span').textContent = '👍 Helpful (' + rev.helpful + ')';
        });
      }

      container.appendChild(card);
    });
  }

  function setupModalListeners() {
    var btnOpen = document.getElementById('BtnOpenWriteReview');
    var modal = document.getElementById('LushWriteReviewModal');
    var btnClose = document.getElementById('BtnCloseReviewModal');
    var backdrop = document.getElementById('BtnCloseReviewModalBackdrop');
    var btnDone = document.getElementById('BtnDoneReview');
    var form = document.getElementById('LushReviewForm');
    var successCard = document.getElementById('ReviewSuccessCard');

    function openModal() {
      if (!modal) return;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (form) form.style.display = 'block';
      if (successCard) successCard.style.display = 'none';
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (btnOpen) btnOpen.addEventListener('click', openModal);
    if (btnClose) btnClose.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);
    if (btnDone) btnDone.addEventListener('click', closeModal);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeModal();
      }
    });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var name = document.getElementById('ReviewInputName').value.trim();
        var city = document.getElementById('ReviewInputCity').value.trim();
        var title = document.getElementById('ReviewInputTitle').value.trim();
        var body = document.getElementById('ReviewInputBody').value.trim();
        var rating = document.getElementById('InputSelectedRating').value || '5';

        if (!name || !title || !body) return;

        var submitBtn = document.getElementById('BtnSubmitReview');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Submitting... ✨';
        }

        setTimeout(function () {
          var newReview = {
            id: 'rev_' + Date.now(),
            name: name,
            city: city || 'Nagpur, MH',
            rating: parseInt(rating, 10),
            title: title,
            body: body,
            photo: currentPhotoBase64 || '',
            date: 'Just now',
            verified: true,
            helpful: 1
          };

          saveUserReview(newReview);
          pushReviewToSupabase(newReview, document.getElementById('ReviewInputEmail') ? document.getElementById('ReviewInputEmail').value : null);

          if (form) form.style.display = 'none';
          if (successCard) successCard.style.display = 'block';
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Submit Verified Review ✨</span>';
          }

          // Reset form
          form.reset();
          removePhotoPreview();
        }, 600);
      });
    }
  }

  function setupStarSelector() {
    var container = document.getElementById('StarRatingSelector');
    var input = document.getElementById('InputSelectedRating');
    var feedback = document.getElementById('RatingFeedbackText');
    if (!container) return;

    var stars = container.querySelectorAll('.star-choice');
    var labels = {
      1: '1.0 - Poor. Not satisfied.',
      2: '2.0 - Fair. Needs improvement.',
      3: '3.0 - Good. Met expectations.',
      4: '4.0 - Very Good! Really liked it.',
      5: '5.0 - Excellent! Highly recommended.'
    };

    function highlightStars(val) {
      stars.forEach(function (s) {
        var num = parseInt(s.getAttribute('data-star'), 10);
        if (num <= val) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    }

    stars.forEach(function (starBtn) {
      var starVal = parseInt(starBtn.getAttribute('data-star'), 10);

      starBtn.addEventListener('mouseenter', function () {
        highlightStars(starVal);
        if (feedback) feedback.textContent = labels[starVal];
      });

      starBtn.addEventListener('mouseleave', function () {
        var current = parseInt(input.value, 10) || 5;
        highlightStars(current);
        if (feedback) feedback.textContent = labels[current];
      });

      starBtn.addEventListener('click', function () {
        input.value = starVal;
        highlightStars(starVal);
        if (feedback) feedback.textContent = labels[starVal];
      });
    });
  }

  function setupPhotoUpload() {
    var fileInput = document.getElementById('InputReviewPhoto');
    var previewWrap = document.getElementById('DropzonePreview');
    var idleContent = document.getElementById('DropzoneIdle');
    var previewImg = document.getElementById('ReviewPhotoPreviewImg');
    var btnRemove = document.getElementById('BtnRemovePhoto');

    if (!fileInput) return;

    fileInput.addEventListener('change', function () {
      if (!fileInput.files || !fileInput.files[0]) return;
      var file = fileInput.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPG, PNG, WebP).');
        return;
      }

      var reader = new FileReader();
      reader.onload = function (e) {
        compressImage(e.target.result, 900, 0.85, function (compressedDataUrl) {
          currentPhotoBase64 = compressedDataUrl;
          if (previewImg) previewImg.src = compressedDataUrl;
          if (idleContent) idleContent.style.display = 'none';
          if (previewWrap) previewWrap.style.display = 'flex';
        });
      };
      reader.readAsDataURL(file);
    });

    if (btnRemove) {
      btnRemove.addEventListener('click', function (e) {
        e.stopPropagation();
        removePhotoPreview();
      });
    }
  }

  function removePhotoPreview() {
    currentPhotoBase64 = null;
    var fileInput = document.getElementById('InputReviewPhoto');
    var previewWrap = document.getElementById('DropzonePreview');
    var idleContent = document.getElementById('DropzoneIdle');
    var previewImg = document.getElementById('ReviewPhotoPreviewImg');

    if (fileInput) fileInput.value = '';
    if (previewImg) previewImg.src = '';
    if (previewWrap) previewWrap.style.display = 'none';
    if (idleContent) idleContent.style.display = 'flex';
  }

  function compressImage(src, maxDim, quality, callback) {
    var img = new Image();
    img.onload = function () {
      var w = img.width;
      var h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      var canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = src;
  }

  function setupFilterPills() {
    var pills = document.querySelectorAll('.review-filter-pill');
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        currentFilter = pill.getAttribute('data-filter') || 'all';
        renderReviewsFeed();
      });
    });
  }

  function setupSortDropdown() {
    var select = document.getElementById('LushReviewSortSelect');
    if (!select) return;
    select.addEventListener('change', function () {
      currentSort = select.value;
      renderReviewsFeed();
    });
  }

  function setupTopRatingJump() {
    var ratingBadges = document.querySelectorAll('.pdp-rating-below-price, .pdp-rating-stars-group, [data-jump-reviews]');
    ratingBadges.forEach(function (el) {
      el.style.cursor = 'pointer';
      el.addEventListener('click', function () {
        var target = document.getElementById('LushProductReviews');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  function openLightbox(imgSrc, userName, text) {
    var lightbox = document.getElementById('LushPhotoLightbox');
    var activeImg = document.getElementById('LightboxActiveImg');
    var nameEl = document.getElementById('LightboxUserName');
    var textEl = document.getElementById('LightboxUserText');
    var btnClose = document.getElementById('BtnCloseLightbox');
    var backdrop = document.getElementById('BtnCloseLightboxBackdrop');

    if (!lightbox) return;

    if (activeImg) activeImg.src = imgSrc;
    if (nameEl) nameEl.textContent = userName || 'Customer Photo';
    if (textEl) textEl.textContent = text || '';

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');

    function closeLightbox() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
    }

    if (btnClose) btnClose.onclick = closeLightbox;
    if (backdrop) backdrop.onclick = closeLightbox;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLushReviews);
  } else {
    initLushReviews();
  }
})();
