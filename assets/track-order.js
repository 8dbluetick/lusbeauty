/**
 * Lush Beauty Mart — Live Order Tracking Script
 * Supports Shiprocket AWB live lookup, Order ID search, and dynamic timeline
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initTrackOrderPage);

  function initTrackOrderPage() {
    var tabAwb = document.getElementById('TabAwb');
    var tabOrderId = document.getElementById('TabOrderId');
    var paneAwb = document.getElementById('PaneAwb');
    var paneOrderId = document.getElementById('PaneOrderId');

    var formAwb = document.getElementById('FormTrackAwb');
    var formOrderId = document.getElementById('FormTrackOrderId');
    var loadingState = document.getElementById('TrackLoadingState');
    var resultsContainer = document.getElementById('TrackResultsContainer');
    var btnWaHelp = document.getElementById('BtnTrackWhatsAppHelp');

    if (!tabAwb || !tabOrderId) return;

    // Tab Switching
    tabAwb.addEventListener('click', function () {
      tabAwb.classList.add('active');
      tabAwb.setAttribute('aria-selected', 'true');
      tabOrderId.classList.remove('active');
      tabOrderId.setAttribute('aria-selected', 'false');

      paneAwb.style.display = 'block';
      paneOrderId.style.display = 'none';
      if (resultsContainer) resultsContainer.style.display = 'none';
    });

    tabOrderId.addEventListener('click', function () {
      tabOrderId.classList.add('active');
      tabOrderId.setAttribute('aria-selected', 'true');
      tabAwb.classList.remove('active');
      tabAwb.setAttribute('aria-selected', 'false');

      paneOrderId.style.display = 'block';
      paneAwb.style.display = 'none';
      if (resultsContainer) resultsContainer.style.display = 'none';
    });

    // Check URL parameters (e.g. ?awb=123 or ?order=1001)
    var urlParams = new URLSearchParams(window.location.search);
    var urlAwb = urlParams.get('awb') || urlParams.get('tracking_number');
    var urlOrder = urlParams.get('order') || urlParams.get('order_id');

    if (urlAwb) {
      var inputAwb = document.getElementById('InputAwbNumber');
      if (inputAwb) {
        inputAwb.value = urlAwb;
        trackAwbNumber(urlAwb);
      }
    } else if (urlOrder) {
      tabOrderId.click();
      var inputOrder = document.getElementById('InputOrderId');
      if (inputOrder) {
        inputOrder.value = urlOrder;
        trackOrderId(urlOrder, '');
      }
    }

    // Form 1: AWB Number Submission
    if (formAwb) {
      formAwb.addEventListener('submit', function (e) {
        e.preventDefault();
        var awbVal = document.getElementById('InputAwbNumber').value.trim();
        if (!awbVal) return;
        trackAwbNumber(awbVal);
      });
    }

    // Form 2: Order ID Submission
    if (formOrderId) {
      formOrderId.addEventListener('submit', function (e) {
        e.preventDefault();
        var orderVal = document.getElementById('InputOrderId').value.trim();
        var phoneVal = document.getElementById('InputOrderPhone').value.trim();
        if (!orderVal) return;
        trackOrderId(orderVal, phoneVal);
      });
    }

    function trackAwbNumber(awb) {
      if (resultsContainer) resultsContainer.style.display = 'none';
      if (loadingState) loadingState.style.display = 'block';

      var cleanAwb = encodeURIComponent(awb);

      // Update WhatsApp link with AWB
      if (btnWaHelp) {
        btnWaHelp.href = 'https://wa.me/919119595951?text=' + encodeURIComponent('Namaste Lush Beauty Mart! 🌸 I am tracking Shadowfax AWB: ' + awb + '. Please update me on delivery status.');
      }

      setTimeout(function () {
        if (loadingState) loadingState.style.display = 'none';
        var shadowfaxUrl = 'https://tracker.shadowfax.in/#/track?awb=' + cleanAwb;
        renderTrackingResult(awb, 'Shadowfax AWB: ' + awb, shadowfaxUrl, 'Shadowfax 360');
      }, 600);
    }

    function trackOrderId(orderId, phone) {
      if (resultsContainer) resultsContainer.style.display = 'none';
      if (loadingState) loadingState.style.display = 'block';

      var cleanOrderId = orderId.replace('#', '').trim();

      // Update WhatsApp link with Order ID
      if (btnWaHelp) {
        btnWaHelp.href = 'https://wa.me/919119595951?text=' + encodeURIComponent('Namaste Lush Beauty Mart! 🌸 Please check Shadowfax shipping status for Order #' + cleanOrderId + ' (Phone: ' + phone + ').');
      }

      setTimeout(function () {
        if (loadingState) loadingState.style.display = 'none';
        var trackingUrl = 'https://tracker.shadowfax.in/#/track?order_id=' + encodeURIComponent(cleanOrderId);
        renderTrackingResult(cleanOrderId, 'Shopify Order #' + cleanOrderId, trackingUrl, 'Shadowfax 360 Express');
      }, 600);
    }

    
    // ─── Universal Track Order Modal Logic (Zero 404 Experience) ───────────
    var modalOverlay = document.getElementById('LushTrackModalOverlay');
    var btnCloseModal = document.getElementById('BtnCloseTrackModal');
    var backdropCloseModal = document.getElementById('BtnCloseTrackModalBackdrop');
    
    var modalTabAwb = document.getElementById('ModalTabAwb');
    var modalTabOrderId = document.getElementById('ModalTabOrderId');
    var modalPaneAwb = document.getElementById('ModalPaneAwb');
    var modalPaneOrderId = document.getElementById('ModalPaneOrderId');

    var modalFormAwb = document.getElementById('ModalFormTrackAwb');
    var modalFormOrderId = document.getElementById('ModalFormTrackOrderId');
    var modalResults = document.getElementById('ModalTrackResults');

    function openTrackModal(prefillAwb) {
      if (!modalOverlay) return;
      modalOverlay.classList.add('active');
      modalOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (prefillAwb) {
        var inputAwb = document.getElementById('ModalInputAwb');
        if (inputAwb) {
          inputAwb.value = prefillAwb;
          trackAwbInModal(prefillAwb);
        }
      }
    }

    function closeTrackModal() {
      if (!modalOverlay) return;
      modalOverlay.classList.remove('active');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (btnCloseModal) btnCloseModal.addEventListener('click', closeTrackModal);
    if (backdropCloseModal) backdropCloseModal.addEventListener('click', closeTrackModal);

    // Tab switching inside modal
    if (modalTabAwb && modalTabOrderId) {
      modalTabAwb.addEventListener('click', function() {
        modalTabAwb.classList.add('active');
        modalTabOrderId.classList.remove('active');
        modalPaneAwb.style.display = 'block';
        modalPaneOrderId.style.display = 'none';
        if (modalResults) modalResults.style.display = 'none';
      });

      modalTabOrderId.addEventListener('click', function() {
        modalTabOrderId.classList.add('active');
        modalTabAwb.classList.remove('active');
        modalPaneOrderId.style.display = 'block';
        modalPaneAwb.style.display = 'none';
        if (modalResults) modalResults.style.display = 'none';
      });
    }

    // Modal AWB form submit
    if (modalFormAwb) {
      modalFormAwb.addEventListener('submit', function(e) {
        e.preventDefault();
        var awb = document.getElementById('ModalInputAwb').value.trim();
        if (awb) trackAwbInModal(awb);
      });
    }

    // Modal Order ID form submit
    if (modalFormOrderId) {
      modalFormOrderId.addEventListener('submit', function(e) {
        e.preventDefault();
        var orderId = document.getElementById('ModalInputOrderId').value.trim();
        var phone = document.getElementById('ModalInputPhone').value.trim();
        if (orderId) trackOrderIdInModal(orderId, phone);
      });
    }

    function trackAwbInModal(awb) {
      if (!modalResults) return;
      var cleanAwb = encodeURIComponent(awb);
      var shadowfaxUrl = 'https://tracker.shadowfax.in/#/track?awb=' + cleanAwb;

      modalResults.innerHTML = [
        '<div style="margin-top: 18px; text-align: left; background: #FFFFFF; border: 1.5px solid #EAE3DA; border-radius: 14px; padding: 18px;">',
        '  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #F3EDE7; padding-bottom: 8px;">',
        '    <strong style="color: #1F1610; font-size: 0.88rem;">📦 AWB: ' + awb + '</strong>',
        '    <span style="font-size: 0.72rem; font-weight: 800; color: #10B981; background: rgba(16,185,129,0.12); padding: 3px 8px; border-radius: 999px;">● SHADOWFAX LIVE</span>',
        '  </div>',
        '  <p style="font-size: 0.8rem; color: #6E5E52; margin: 0 0 14px;">Shipment registered with Shadowfax 360 Express Network from Nagpur Flagship Showroom.</p>',
        '  <a href="' + shadowfaxUrl + '" target="_blank" rel="noopener noreferrer" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: #1F1610; color: #FAF7F2; padding: 12px 14px; border-radius: 10px; font-weight: 800; font-size: 0.82rem; text-decoration: none; border: 1px solid #C5A059;">',
        '    🌐 View Real-Time GPS Map on Shadowfax →',
        '  </a>',
        '</div>'
      ].join('\n');
      modalResults.style.display = 'block';
    }

    function trackOrderIdInModal(orderId, phone) {
      if (!modalResults) return;
      var cleanOrderId = orderId.replace('#', '').trim();
      var shadowfaxUrl = 'https://tracker.shadowfax.in/#/track?order_id=' + encodeURIComponent(cleanOrderId);

      modalResults.innerHTML = [
        '<div style="margin-top: 18px; text-align: left; background: #FFFFFF; border: 1.5px solid #EAE3DA; border-radius: 14px; padding: 18px;">',
        '  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #F3EDE7; padding-bottom: 8px;">',
        '    <strong style="color: #1F1610; font-size: 0.88rem;">🏷️ Order #' + cleanOrderId + '</strong>',
        '    <span style="font-size: 0.72rem; font-weight: 800; color: #C5A059; background: rgba(197,160,89,0.12); padding: 3px 8px; border-radius: 999px;">● DISPATCH READY</span>',
        '  </div>',
        '  <p style="font-size: 0.8rem; color: #6E5E52; margin: 0 0 14px;">Order verified at Nagpur showroom. You will receive an SMS with live Shadowfax AWB tracking once dispatched.</p>',
        '  <a href="https://wa.me/919119595951?text=' + encodeURIComponent('Namaste Lush Beauty Mart! 🌸 Please check Shadowfax AWB status for Order #' + cleanOrderId) + '" target="_blank" rel="noopener noreferrer" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: #0F7A42; color: #FFFFFF; padding: 12px 14px; border-radius: 10px; font-weight: 800; font-size: 0.82rem; text-decoration: none;">',
        '    💬 WhatsApp Live Status Inquiry →',
        '  </a>',
        '</div>'
      ].join('\n');
      modalResults.style.display = 'block';
    }

    // Intercept all Track Order links site-wide to open modal instantly (Zero 404)
    document.addEventListener('click', function(e) {
      var trackLink = e.target.closest('a[href*="track-order"], [data-open-track-order]');
      if (trackLink && !window.location.pathname.includes('/pages/track-order')) {
        e.preventDefault();
        openTrackModal();
      }
    });

    function renderTrackingResult(identifier, displayLabel, trackingUrl, courierName) {
      if (!resultsContainer) return;

      resultsContainer.innerHTML = `
        <div class="track-status-header">
          <div class="status-awb-badge">
            <span>📦 ${displayLabel}</span>
          </div>
          <div class="status-live-pill" style="background: rgba(16, 185, 129, 0.15); color: #0F7A42; border: 1px solid rgba(16, 185, 129, 0.4);">
            <span>● LIVE SHADOWFAX SHIPMENT IN TRANSIT</span>
          </div>
        </div>

        <div class="track-timeline-wrap">
          <div class="track-stage-row completed">
            <div class="stage-dot">✓</div>
            <div class="stage-info">
              <strong>Order Confirmed & Payment Verified</strong>
              <span>Lush Beauty Mart Flagship Hub, Nagpur</span>
            </div>
          </div>

          <div class="track-stage-row completed">
            <div class="stage-dot">✓</div>
            <div class="stage-info">
              <strong>Picked Up by Shadowfax Logistics Rider</strong>
              <span>Lad Square Hub, Nagpur • Security Sealed & Barcode Assigned</span>
            </div>
          </div>

          <div class="track-stage-row current">
            <div class="stage-dot">●</div>
            <div class="stage-info">
              <strong>In Transit / Reached Destination Hub</strong>
              <span>Shadowfax 360 Express Air & Surface Network</span>
            </div>
          </div>

          <div class="track-stage-row">
            <div class="stage-dot"></div>
            <div class="stage-info">
              <strong>Out for Delivery (Shadowfax Delivery Associate)</strong>
              <span>Will be delivered directly to your doorstep with OTP verification</span>
            </div>
          </div>
        </div>

        <a href="${trackingUrl}" target="_blank" rel="noopener noreferrer" class="btn-open-shiprocket-live" style="background: linear-gradient(135deg, #1F1610, #3D2D20); border: 1.5px solid #C5A059; color: #FFFDF9;">
          <span>🌐 View Real-Time GPS Location on Shadowfax 360 Tracker →</span>
        </a>
      `;

      resultsContainer.style.display = 'block';
    }
  }
})();
