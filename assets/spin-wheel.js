/**
 * Lush Beauty Mart — Spin to Win Fortune Wheel Logic
 * Canvas-based wheel, physics rotation, confetti celebration & discount application
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initSpinWheel);

  function initSpinWheel() {
    var overlay = document.getElementById('LushWheelOverlay');
    var launcher = document.getElementById('LushWheelLauncher');
    var configEl = document.getElementById('LushWheelConfig');
    var canvas = document.getElementById('LushWheelCanvas');

    if (!overlay || !canvas || !configEl) return;

    var config;
    try {
      config = JSON.parse(configEl.textContent);
    } catch (e) {
      console.error('Error parsing Lush Wheel config:', e);
      return;
    }

    var slices = config.slices || [];
    if (slices.length === 0) return;

    var numSlices = slices.length;
    var sliceAngle = (2 * Math.PI) / numSlices;
    var ctx = canvas.getContext('2d');
    var currentRotation = 0;
    var isSpinning = false;
    var hasSpun = localStorage.getItem('lush_wheel_has_spun') === 'true';

    // Draw Wheel on Canvas
    function drawWheel(angle) {
      var width = canvas.width;
      var height = canvas.height;
      var centerX = width / 2;
      var centerY = height / 2;
      var radius = centerX - 10;

      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);

      for (var i = 0; i < numSlices; i++) {
        var startAngle = i * sliceAngle;
        var endAngle = startAngle + sliceAngle;
        var slice = slices[i];

        // Draw Wedge Slice
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = slice.color;
        ctx.fill();

        // Wedge Inner Border (Gold Outline)
        ctx.strokeStyle = 'rgba(197, 160, 89, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw Prize Text
        ctx.save();
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = slice.textColor;
        ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 4;
        ctx.fillText(slice.label, radius - 26, 8);
        ctx.restore();
      }

      // Outer Gold Rim on Canvas
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = '#C5A059';
      ctx.lineWidth = 8;
      ctx.stroke();

      ctx.restore();
    }

    // Initial Wheel Render
    drawWheel(0);

    // Auto-Open Timer Logic
    var autoOpen = overlay.dataset.autoOpen === 'true';
    var delaySec = parseInt(overlay.dataset.delay || '3', 10);

    if (autoOpen && !hasSpun && !sessionStorage.getItem('lush_wheel_dismissed')) {
      setTimeout(function () {
        openWheelModal();
      }, delaySec * 1000);
    }

    // Modal Control Functions
    function openWheelModal() {
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeWheelModal() {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      sessionStorage.setItem('lush_wheel_dismissed', 'true');
    }

    // Event Listeners
    if (launcher) {
      launcher.addEventListener('click', openWheelModal);
    }

    var btnClose = document.getElementById('BtnCloseWheel');
    if (btnClose) {
      btnClose.addEventListener('click', closeWheelModal);
    }

    var backdrop = document.getElementById('LushWheelBackdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeWheelModal);
    }

    var btnContinue = document.getElementById('BtnContinueBrowsing');
    if (btnContinue) {
      btnContinue.addEventListener('click', closeWheelModal);
    }

    // Spin Handlers
    var btnActionSpin = document.getElementById('BtnActionSpin');
    var btnCenterSpin = document.getElementById('BtnCenterSpin');

    if (btnActionSpin) btnActionSpin.addEventListener('click', handleSpin);
    if (btnCenterSpin) btnCenterSpin.addEventListener('click', handleSpin);

    function handleSpin() {
      if (isSpinning) return;
      isSpinning = true;

      if (btnActionSpin) {
        btnActionSpin.disabled = true;
        btnActionSpin.textContent = 'SPINNING... 🍀';
      }

      // Pick a random winning index
      var winningIndex = Math.floor(Math.random() * numSlices);
      var winningPrize = slices[winningIndex];

      // Physics Calculation:
      // Ticker is at the top (angle: -Math.PI / 2 or 270 deg)
      // We want the winning slice center to align with the top needle
      var minSpins = 6; // Full 360 rotations
      var targetAngleForSlice = (numSlices - winningIndex - 0.5) * sliceAngle - (Math.PI / 2);
      
      var targetRotation = (minSpins * 2 * Math.PI) + targetAngleForSlice + (Math.random() * 0.2 - 0.1);

      var startTime = null;
      var duration = 4500; // 4.5 seconds spin
      var startRotation = currentRotation % (2 * Math.PI);
      var totalRotationDelta = targetRotation - startRotation;

      var ticker = document.getElementById('WheelTicker');
      var lastSlicePass = 0;

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function animateSpin(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var easeProgress = easeOutCubic(progress);

        currentRotation = startRotation + totalRotationDelta * easeProgress;
        drawWheel(currentRotation);

        // Ticker wobble animation
        var currentSliceProg = Math.floor(currentRotation / sliceAngle);
        if (currentSliceProg !== lastSlicePass && ticker) {
          ticker.classList.add('ticking');
          setTimeout(function () {
            ticker.classList.remove('ticking');
          }, 80);
          lastSlicePass = currentSliceProg;
        }

        if (progress < 1) {
          requestAnimationFrame(animateSpin);
        } else {
          isSpinning = false;
          localStorage.setItem('lush_wheel_has_spun', 'true');
          showWinResult(winningPrize);
        }
      }

      requestAnimationFrame(animateSpin);
    }

    // Show Winning Celebration Result
    function showWinResult(prize) {
      var interactiveWrap = document.getElementById('WheelInteractiveWrap');
      var resultWrap = document.getElementById('WheelResultWrap');
      var winPrizeText = document.getElementById('WinPrizeText');
      var winCouponCode = document.getElementById('WinCouponCode');
      var btnApply = document.getElementById('BtnApplyCoupon');

      if (interactiveWrap) interactiveWrap.style.display = 'none';
      if (resultWrap) resultWrap.style.display = 'block';

      if (winPrizeText) winPrizeText.textContent = prize.label + ' UNLOCKED!';
      if (winCouponCode) winCouponCode.textContent = prize.code;

      // Link to apply discount code directly to cart/checkout
      if (btnApply) {
        btnApply.href = '/discount/' + encodeURIComponent(prize.code) + '?redirect=/collections/all';
      }

      // Trigger Confetti Explosion
      launchConfetti();
    }

    // Copy to Clipboard Logic
    var btnCopy = document.getElementById('BtnCopyCoupon');
    if (btnCopy) {
      btnCopy.addEventListener('click', function () {
        var codeEl = document.getElementById('WinCouponCode');
        var labelEl = document.getElementById('CopyCouponLabel');
        if (!codeEl) return;

        var code = codeEl.textContent.trim();
        navigator.clipboard.writeText(code).then(function () {
          btnCopy.classList.add('copied');
          if (labelEl) labelEl.textContent = 'COPIED! ✓';
          setTimeout(function () {
            btnCopy.classList.remove('copied');
            if (labelEl) labelEl.textContent = 'COPY';
          }, 2500);
        });
      });
    }

    // Lightweight Celebratory Confetti Simulation
    function launchConfetti() {
      var confettiCanvas = document.getElementById('ConfettiCanvas');
      if (!confettiCanvas) return;

      var cCtx = confettiCanvas.getContext('2d');
      var parent = confettiCanvas.parentElement;
      confettiCanvas.width = parent.clientWidth;
      confettiCanvas.height = parent.clientHeight;

      var particles = [];
      var colors = ['#C5A059', '#1F1610', '#E2878D', '#16A34A', '#FAF7F2', '#EAB308'];

      for (var i = 0; i < 60; i++) {
        particles.push({
          x: confettiCanvas.width / 2,
          y: confettiCanvas.height / 2,
          r: Math.random() * 6 + 3,
          d: Math.random() * 60,
          color: colors[Math.floor(Math.random() * colors.length)],
          tilt: Math.floor(Math.random() * 10) - 10,
          tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
          tiltAngle: 0,
          vx: (Math.random() - 0.5) * 12,
          vy: (Math.random() - 0.7) * 12,
          gravity: 0.25
        });
      }

      var animationFrame;
      var cStartTime = Date.now();

      function drawConfetti() {
        cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        for (var i = 0; i < particles.length; i++) {
          var p = particles[i];
          p.tiltAngle += p.tiltAngleIncremental;
          p.y += p.vy;
          p.x += p.vx;
          p.vy += p.gravity;

          cCtx.beginPath();
          cCtx.lineWidth = p.r;
          cCtx.strokeStyle = p.color;
          cCtx.moveTo(p.x + p.tilt + p.r / 2, p.y);
          cCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
          cCtx.stroke();
        }

        if (Date.now() - cStartTime < 3500) {
          animationFrame = requestAnimationFrame(drawConfetti);
        } else {
          cCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
          cancelAnimationFrame(animationFrame);
        }
      }

      drawConfetti();
    }
  }
})();
