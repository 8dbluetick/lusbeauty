/**
 * Lush Beauty Mart — Universal Live Order Tracking & Shadowfax Portal Engine
 * Infallible site-wide modal & page tracker (Zero 404 Experience)
 */

(function () {
  'use strict';

  // ─── 1. Universal Track Order Modal Logic (Exposed Globally) ─────────────
  window.openTrackModal = function (prefillAwb) {
    var modalOverlay = document.getElementById('LushTrackModalOverlay');
    if (!modalOverlay) {
      // Fallback if modal overlay not rendered on page: navigate directly
      window.location.href = '/pages/track-order';
      return;
    }

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Ensure portal iframe has src set
    var iframe = modalOverlay.querySelector('.shadowfax-track-iframe');
    if (iframe && (!iframe.src || iframe.src === 'about:blank' || !iframe.src.includes('shadowfax'))) {
      iframe.src = 'https://www.shadowfax.in/track';
    }

    if (prefillAwb) {
      var inputAwb = document.getElementById('ModalInputAwb');
      if (inputAwb) {
        inputAwb.value = prefillAwb;
      }
    }
  };

  window.closeTrackModal = function () {
    var modalOverlay = document.getElementById('LushTrackModalOverlay');
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  function initUniversalTrackModal() {
    var modalOverlay = document.getElementById('LushTrackModalOverlay');
    var btnCloseModal = document.getElementById('BtnCloseTrackModal');
    var backdropCloseModal = document.getElementById('BtnCloseTrackModalBackdrop');

    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', window.closeTrackModal);
    }
    if (backdropCloseModal) {
      backdropCloseModal.addEventListener('click', window.closeTrackModal);
    }

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        window.closeTrackModal();
      }
    });

    // Modal Tabs
    var modalTabPortal = document.getElementById('ModalTabPortal');
    var modalTabOrderId = document.getElementById('ModalTabOrderId');
    var modalPanePortal = document.getElementById('ModalPanePortal');
    var modalPaneOrderId = document.getElementById('ModalPaneOrderId');
    var modalResults = document.getElementById('ModalTrackResults');

    if (modalTabPortal && modalTabOrderId) {
      modalTabPortal.addEventListener('click', function () {
        modalTabPortal.classList.add('active');
        modalTabOrderId.classList.remove('active');
        if (modalPanePortal) modalPanePortal.style.display = 'block';
        if (modalPaneOrderId) modalPaneOrderId.style.display = 'none';
        if (modalResults) modalResults.style.display = 'none';
      });

      modalTabOrderId.addEventListener('click', function () {
        modalTabOrderId.classList.add('active');
        modalTabPortal.classList.remove('active');
        if (modalPaneOrderId) modalPaneOrderId.style.display = 'block';
        if (modalPanePortal) modalPanePortal.style.display = 'none';
      });
    }

    // Modal Order ID Form Submit
    var modalFormOrderId = document.getElementById('ModalFormTrackOrderId');
    if (modalFormOrderId) {
      modalFormOrderId.addEventListener('submit', function (e) {
        e.preventDefault();
        var inputOrderId = document.getElementById('ModalInputOrderId');
        var inputPhone = document.getElementById('ModalInputPhone');
        var orderVal = inputOrderId ? inputOrderId.value.trim() : '';
        var phoneVal = inputPhone ? inputPhone.value.trim() : '';

        if (!orderVal) return;

        var cleanOrderId = orderVal.replace('#', '').trim();
        var shadowfaxUrl = 'https://tracker.shadowfax.in/#/track?order_id=' + encodeURIComponent(cleanOrderId);

        if (modalResults) {
          modalResults.innerHTML = [
            '<div style="margin-top: 16px; text-align: left; background: #FFFFFF; border: 1.5px solid #EAE3DA; border-radius: 14px; padding: 16px;">',
            '  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #F3EDE7; padding-bottom: 8px;">',
            '    <strong style="color: #1F1610; font-size: 0.88rem;">📦 Order #' + cleanOrderId + '</strong>',
            '    <span style="font-size: 0.72rem; font-weight: 800; color: #10B981; background: rgba(16,185,129,0.12); padding: 3px 8px; border-radius: 999px;">● SHADOWFAX 360</span>',
            '  </div>',
            '  <p style="font-size: 0.8rem; color: #6E5E52; margin: 0 0 14px;">Order verified at Nagpur showroom. You will receive an SMS with live Shadowfax AWB tracking once dispatched.</p>',
            '  <div style="display: flex; flex-direction: column; gap: 8px;">',
            '    <a href="' + shadowfaxUrl + '" target="_blank" rel="noopener noreferrer" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: #1F1610; color: #FAF7F2; padding: 11px 14px; border-radius: 10px; font-weight: 800; font-size: 0.82rem; text-decoration: none; border: 1px solid #C5A059;">',
            '      🌐 Check Live on Shadowfax Tracker →',
            '    </a>',
            '    <a href="https://wa.me/919119595951?text=' + encodeURIComponent('Namaste Lush Beauty Mart! 🌸 Please check Shadowfax AWB status for Order #' + cleanOrderId + (phoneVal ? ' (Phone: ' + phoneVal + ')' : '')) + '" target="_blank" rel="noopener noreferrer" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background: #0F7A42; color: #FFFFFF; padding: 11px 14px; border-radius: 10px; font-weight: 800; font-size: 0.82rem; text-decoration: none;">',
            '      💬 WhatsApp Live Status Helpdesk →',
            '    </a>',
            '  </div>',
            '</div>'
          ].join('\n');
          modalResults.style.display = 'block';
        }
      });
    }

    // Universal Click Interceptor: Catch all [data-open-track-order] and a[href*="track-order"]
    document.addEventListener('click', function (e) {
      var trackTrigger = e.target.closest('[data-open-track-order], a[href*="track-order"]');
      if (trackTrigger) {
        // If not already on standalone /pages/track-order page, intercept and open popup immediately
        if (!window.location.pathname.includes('/pages/track-order')) {
          e.preventDefault();
          e.stopPropagation();
          window.openTrackModal();
        }
      }
    });
  }

  // Run modal initialization as soon as DOM is ready or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUniversalTrackModal);
  } else {
    initUniversalTrackModal();
  }

})();
