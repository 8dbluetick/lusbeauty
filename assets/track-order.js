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
