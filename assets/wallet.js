/**
 * Lush Beauty Mart — Loyalty Wallet JavaScript
 * File: assets/wallet.js
 *
 * Vanilla JS, no frameworks required.
 * Handles: balance loading, transaction history, point redemption,
 * discount code display & copy, nav badge update.
 */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     CONSTANTS & UTILITIES
  ───────────────────────────────────────────── */

  /** Points-to-rupees conversion: 10 points = ₹1 */
  const POINTS_TO_RUPEES = 0.10;
  const MIN_REDEEM = 200;
  const MAX_REDEEM = 500;

  /**
   * Format a date string into "22 Aug 2026" style.
   * @param {string} dateStr — ISO date string or any Date-parseable string
   * @returns {string}
   */
  function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch (_) {
      return dateStr;
    }
  }

  /**
   * Safely get an element by ID. Returns null if not found.
   * @param {string} id
   * @returns {HTMLElement|null}
   */
  function $id(id) {
    return document.getElementById(id);
  }

  /**
   * Show an element (removes display:none).
   * @param {HTMLElement} el
   */
  function show(el) {
    if (el) el.style.display = '';
  }

  /**
   * Hide an element (sets display:none).
   * @param {HTMLElement} el
   */
  function hide(el) {
    if (el) el.style.display = 'none';
  }

  /* ─────────────────────────────────────────────
     TRANSACTION HISTORY RENDERER
  ───────────────────────────────────────────── */

  /**
   * Renders the transaction history into #WalletHistoryContainer.
   * @param {Array<{type: string, points: number, description: string, date: string}>} history
   */
  function renderTransactionHistory(history) {
    const container = $id('WalletHistoryContainer');
    if (!container) return;

    if (!history || history.length === 0) {
      container.innerHTML = `
        <div class="wallet-history-empty">
          <span class="wallet-history-empty-icon">📋</span>
          <p>No transactions yet. Start shopping to earn your first points!</p>
          <a href="/collections/all" class="wallet-history-shop-link">Browse Products →</a>
        </div>
      `;
      return;
    }

    const rows = history.map((entry) => {
      const isEarn = entry.type === 'earn' || entry.points > 0;
      const typeClass = isEarn ? 'earn' : 'redeem';
      const icon = isEarn ? '✅' : '🔴';
      const sign = isEarn ? '+' : '-';
      const absPoints = Math.abs(entry.points);
      const formattedDate = formatDate(entry.date);
      const description = entry.description || (isEarn ? 'Points earned' : 'Points redeemed');

      return `
        <div class="wallet-history-item" role="listitem">
          <span class="wallet-history-icon" aria-hidden="true">${icon}</span>
          <div class="wallet-history-details">
            <span class="wallet-history-desc">${escapeHtml(description)}</span>
            <span class="wallet-history-date">${formattedDate}</span>
          </div>
          <span class="wallet-history-amount ${typeClass}" aria-label="${sign}${absPoints} points">
            ${sign}${absPoints} pts
          </span>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="wallet-history-list" role="list">
        ${rows.join('')}
      </div>
    `;
  }

  /**
   * Minimal HTML escape to prevent XSS in dynamic content.
   * @param {string} str
   * @returns {string}
   */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ─────────────────────────────────────────────
     BALANCE LOADER
  ───────────────────────────────────────────── */

  /**
   * Current balance held in memory (set after API call).
   * Used by redeem flow to validate available points.
   * @type {number}
   */
  let currentBalance = 0;

  /**
   * Fetches the customer's wallet balance from the server and populates the UI.
   * @param {string} customerId
   * @param {string} serverUrl
   */
  async function loadWalletBalance(customerId, serverUrl) {
    try {
      const response = await fetch(`${serverUrl}/api/balance/${customerId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Populate balance display
      const balance = typeof data.balance === 'number' ? data.balance : parseInt(data.balance, 10) || 0;
      const lifetime = typeof data.lifetime_earned === 'number' ? data.lifetime_earned : parseInt(data.lifetime_earned, 10) || 0;

      currentBalance = balance;

      const balanceEl = $id('WalletPointsBalance');
      const rupeesEl = $id('WalletRupeesValue');
      const lifetimeEl = $id('WalletLifetimePoints');

      if (balanceEl) balanceEl.textContent = balance.toLocaleString('en-IN');
      if (rupeesEl) rupeesEl.textContent = Math.floor(balance * POINTS_TO_RUPEES).toLocaleString('en-IN');
      if (lifetimeEl) lifetimeEl.textContent = lifetime.toLocaleString('en-IN');

      // Update nav badge if present
      updateNavBadge(balance);

      // Render transaction history
      renderTransactionHistory(data.history || []);

    } catch (err) {
      console.error('[LushWallet] Failed to load balance:', err);

      // Show error in balance area
      const balanceEl = $id('WalletPointsBalance');
      const rupeesEl = $id('WalletRupeesValue');
      const lifetimeEl = $id('WalletLifetimePoints');
      if (balanceEl) balanceEl.textContent = '—';
      if (rupeesEl) rupeesEl.textContent = '—';
      if (lifetimeEl) lifetimeEl.textContent = '—';

      // Show error in history container
      const container = $id('WalletHistoryContainer');
      if (container) {
        container.innerHTML = `
          <div class="wallet-history-error">
            <span aria-hidden="true">⚠️</span>
            Unable to load wallet data. Please refresh the page or try again later.
          </div>
        `;
      }
    }
  }

  /* ─────────────────────────────────────────────
     NAV BADGE UPDATER
  ───────────────────────────────────────────── */

  /**
   * Updates the #NavWalletPoints element in the header if it exists.
   * @param {number} balance
   */
  function updateNavBadge(balance) {
    const navBadge = $id('NavWalletPoints');
    if (navBadge) {
      navBadge.textContent = `${balance.toLocaleString('en-IN')} pts`;
    }
  }

  /* ─────────────────────────────────────────────
     REDEEM FLOW
  ───────────────────────────────────────────── */

  /**
   * Shows the redeem error message.
   * @param {string} message
   */
  function showRedeemError(message) {
    const errEl = $id('WalletRedeemError');
    if (!errEl) return;
    errEl.textContent = message;
    show(errEl);
  }

  /**
   * Hides the redeem error message.
   */
  function hideRedeemError() {
    hide($id('WalletRedeemError'));
  }

  /**
   * Sets the redeem button to loading state.
   * @param {HTMLButtonElement} btn
   * @param {boolean} loading
   */
  function setRedeemButtonLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
      btn.disabled = true;
      btn.dataset.originalText = btn.innerHTML;
      btn.innerHTML = `
        <span class="wallet-btn-spinner" aria-hidden="true"></span>
        Generating…
      `;
    } else {
      btn.disabled = false;
      if (btn.dataset.originalText) {
        btn.innerHTML = btn.dataset.originalText;
      }
    }
  }

  /**
   * Handles the redeem points button click.
   * @param {string} customerId
   * @param {string} serverUrl
   */
  async function handleRedeemClick(customerId, serverUrl) {
    hideRedeemError();
    hide($id('WalletCodeDisplay'));

    const input = $id('WalletRedeemInput');
    const btn = $id('BtnRedeemPoints');

    if (!input) return;

    const pointsToRedeem = parseInt(input.value, 10);

    // ── Validation ──
    if (isNaN(pointsToRedeem) || pointsToRedeem < MIN_REDEEM) {
      showRedeemError(`⚠️ Please enter at least ${MIN_REDEEM} points to redeem.`);
      input.focus();
      return;
    }
    if (pointsToRedeem > MAX_REDEEM) {
      showRedeemError(`⚠️ You can redeem a maximum of ${MAX_REDEEM} points per order.`);
      input.focus();
      return;
    }
    if (pointsToRedeem > currentBalance) {
      showRedeemError(`⚠️ You only have ${currentBalance} points available. Please enter a lower amount.`);
      input.focus();
      return;
    }

    // ── API Call ──
    setRedeemButtonLoading(btn, true);

    try {
      const response = await fetch(`${serverUrl}/api/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
          points_to_redeem: pointsToRedeem,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `Server error (${response.status})`);
      }

      // ── Success: Show discount code ──
      const codeEl = $id('WalletDiscountCode');
      if (codeEl && data.discount_code) {
        codeEl.textContent = data.discount_code;
      }

      // Update displayed balance
      const newBalance = typeof data.new_balance === 'number'
        ? data.new_balance
        : currentBalance - pointsToRedeem;

      currentBalance = newBalance;

      const balanceEl = $id('WalletPointsBalance');
      const rupeesEl = $id('WalletRupeesValue');
      if (balanceEl) balanceEl.textContent = newBalance.toLocaleString('en-IN');
      if (rupeesEl) rupeesEl.textContent = Math.floor(newBalance * POINTS_TO_RUPEES).toLocaleString('en-IN');

      updateNavBadge(newBalance);

      // Clear input and preview
      input.value = '';
      const redeemRupeesEl = $id('WalletRedeemRupees');
      if (redeemRupeesEl) redeemRupeesEl.textContent = '0';

      // Show code display
      show($id('WalletCodeDisplay'));
      $id('WalletCodeDisplay').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (err) {
      console.error('[LushWallet] Redeem error:', err);
      showRedeemError(`❌ ${err.message || 'Failed to generate discount code. Please try again.'}`);
    } finally {
      setRedeemButtonLoading(btn, false);
    }
  }

  /* ─────────────────────────────────────────────
     COPY CODE HANDLER
  ───────────────────────────────────────────── */

  /**
   * Handles the copy code button click.
   */
  function handleCopyCode() {
    const codeEl = $id('WalletDiscountCode');
    const copyBtn = $id('BtnCopyCode');
    if (!codeEl || !copyBtn) return;

    const code = codeEl.textContent.trim();
    if (!code || code === 'LUSH-XXXXXX') return;

    navigator.clipboard.writeText(code).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied! ✓';
      copyBtn.classList.add('btn-copy-code--success');
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove('btn-copy-code--success');
      }, 2000);
    }).catch((err) => {
      console.warn('[LushWallet] Clipboard copy failed:', err);
      // Fallback: select the text
      const range = document.createRange();
      range.selectNode(codeEl);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    });
  }

  /* ─────────────────────────────────────────────
     INPUT PREVIEW HANDLER
  ───────────────────────────────────────────── */

  /**
   * Updates the rupee preview as the user types in the redeem input.
   * @param {Event} event
   */
  function handleRedeemInputChange(event) {
    const value = parseInt(event.target.value, 10);
    const rupeesEl = $id('WalletRedeemRupees');
    if (!rupeesEl) return;

    if (isNaN(value) || value <= 0) {
      rupeesEl.textContent = '0';
    } else {
      rupeesEl.textContent = Math.floor(value * POINTS_TO_RUPEES).toFixed(0);
    }
  }

  /* ─────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────── */

  /**
   * Main initializer — runs on DOMContentLoaded.
   */
  function init() {
    // ── Read server config ──
    const configEl = $id('WalletServerConfig');
    if (!configEl) return; // Not on wallet page or customer not logged in

    const serverUrl = (configEl.dataset.serverUrl || '').trim().replace(/\/$/, '');
    const customerId = (configEl.dataset.customerId || '').trim();

    if (!serverUrl || !customerId || serverUrl === 'https://your-app.up.railway.app') {
      console.warn('[LushWallet] Wallet server URL not configured. Please set it in the Shopify Theme Editor under the Wallet Page section settings.');

      // Show placeholder data so the UI isn't completely broken in dev
      const balanceEl = $id('WalletPointsBalance');
      const rupeesEl = $id('WalletRupeesValue');
      const lifetimeEl = $id('WalletLifetimePoints');
      if (balanceEl) balanceEl.textContent = '—';
      if (rupeesEl) rupeesEl.textContent = '—';
      if (lifetimeEl) lifetimeEl.textContent = '—';

      const container = $id('WalletHistoryContainer');
      if (container) {
        container.innerHTML = `
          <div class="wallet-history-error">
            <span aria-hidden="true">⚙️</span>
            Wallet server not configured. Please contact the store admin.
          </div>
        `;
      }
      return;
    }

    // ── Load balance & history ──
    loadWalletBalance(customerId, serverUrl);

    // ── Redeem input: live rupee preview ──
    const redeemInput = $id('WalletRedeemInput');
    if (redeemInput) {
      redeemInput.addEventListener('input', handleRedeemInputChange);
    }

    // ── Redeem button ──
    const redeemBtn = $id('BtnRedeemPoints');
    if (redeemBtn) {
      redeemBtn.addEventListener('click', () => handleRedeemClick(customerId, serverUrl));
    }

    // ── Copy code button ──
    const copyBtn = $id('BtnCopyCode');
    if (copyBtn) {
      copyBtn.addEventListener('click', handleCopyCode);
    }
  }

  // Kick off on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already ready (e.g. script loaded with defer)
    init();
  }

})();
