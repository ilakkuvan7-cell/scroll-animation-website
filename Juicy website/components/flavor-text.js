/**
 * flavor-text.js
 * Standalone vanilla JavaScript flavor-details UI component.
 *
 * Requirements satisfied:
 * - 100% transparent background (no card, no panel, no border, no blur)
 * - Injects all required typography (Fraunces & Plus Jakarta Sans) and CSS automatically
 * - Positioned vertically centered: left 6%, top 50%, translateY(-50%)
 * - Pure white typography with luxury easing transitions
 * - Global window.updateFlavorDetails(progress) API
 * - Mapping:
 *     0.00 – 0.24 = hide all flavor details (group landing scene)
 *     0.24 – 0.48 = Strawberries & Cream
 *     0.48 – 0.72 = Blackberry
 *     0.72 – 1.00 = Cherry
 * - Previous text fades and moves slightly upward
 * - Next text rises from below and fades in
 * - Reversing scroll order works seamlessly
 */
(function () {
  'use strict';

  // 1. Flavor Data Definition
  const FLAVORS = [
    {
      id: 'strawberries-cream',
      flavorName: 'Strawberries & Cream',
      description:
        'A nostalgic swirl of sun-ripened summer strawberries and velvety Madagascar vanilla cream. Infused with prebiotic plant fiber and fresh organic citrus notes.',
      rating: 4.9,
      reviewCount: 1840,
      tagline: 'Prebiotic Botanical Soda',
      price: '$35.99 / 12-pack',
      sizes: ['12 fl oz (12-Pack)', '12 fl oz (24-Pack)', 'Single Can'],
      primaryButtonText: 'ORDER NOW',
      secondaryButtonText: 'SEE ALL FLAVORS',
    },
    {
      id: 'blackberry',
      flavorName: 'Blackberry',
      description:
        'Bold, wild-harvested Pacific Northwest blackberries with a crisp mineral sparkle. Deep, tart, and layered with a subtle twist of fresh botanical sage.',
      rating: 4.8,
      reviewCount: 920,
      tagline: 'Wild Mountain Harvest',
      price: '$35.99 / 12-pack',
      sizes: ['12 fl oz (12-Pack)', '12 fl oz (24-Pack)', 'Single Can'],
      primaryButtonText: 'ORDER NOW',
      secondaryButtonText: 'EXPLORE FLAVORS',
    },
    {
      id: 'cherry',
      flavorName: 'Cherry',
      description:
        'Rich, succulent tart Montmorency cherries blended with sweet dark amarena and effervescent bubbles. Pure fruit depth without any artificial lingering sweetness.',
      rating: 4.9,
      reviewCount: 2450,
      tagline: 'Heritage Orchard Blend',
      price: '$35.99 / 12-pack',
      sizes: ['12 fl oz (12-Pack)', '12 fl oz (24-Pack)', 'Single Can'],
      primaryButtonText: 'ORDER NOW',
      secondaryButtonText: 'SEE ALL FLAVORS',
    },
  ];

  // Selected size storage per flavor id
  const selectedSizes = {
    'strawberries-cream': '12 fl oz (12-Pack)',
    'blackberry': '12 fl oz (12-Pack)',
    'cherry': '12 fl oz (12-Pack)',
  };

  let currentFlavorId = null;
  let rootElement = null;

  // 2. Inject Google Fonts dynamically
  function injectFonts() {
    if (!document.getElementById('flavor-text-fonts')) {
      const link = document.createElement('link');
      link.id = 'flavor-text-fonts';
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700..900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap';
      document.head.appendChild(link);
    }
  }

  // 3. Inject Component CSS
  function injectStyles() {
    if (document.getElementById('flavor-text-styles')) return;

    const style = document.createElement('style');
    style.id = 'flavor-text-styles';
    style.textContent = `
#flavor-text-container {
  position: fixed;

  left: 6%;
  top: 50%;
  bottom: auto;

  transform: translateY(-50%);

  max-width: 680px;
  width: 42vw;

  z-index: 9999;
  pointer-events: auto;

  background: transparent !important;
  border: none !important;
  box-shadow: none !important;

  margin: 0;
  padding: 0;

  box-sizing: border-box;

  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
}

.flavor-text-stage {
  position: relative;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  margin: 0;
  padding: 0;
}

.flavor-text-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  margin: 0;
  padding: 0;
}

/* Transitions: smooth luxury deceleration curve [0.16, 1, 0.3, 1] */
.flavor-text-enter {
  animation: flavorEnter 0.48s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.flavor-text-exit {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  animation: flavorExit 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes flavorEnter {
  0% {
    opacity: 0;
    transform: translateY(24px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes flavorExit {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px);
  }
}

/* Staggered entry for individual elements */
.flavor-text-enter .flavor-elem-1 {
  animation: itemRise 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.04s both;
}
.flavor-text-enter .flavor-elem-2 {
  animation: itemRise 0.50s cubic-bezier(0.16, 1, 0.3, 1) 0.08s both;
}
.flavor-text-enter .flavor-elem-3 {
  animation: itemRise 0.50s cubic-bezier(0.16, 1, 0.3, 1) 0.14s both;
}
.flavor-text-enter .flavor-elem-4 {
  animation: itemRise 0.48s cubic-bezier(0.16, 1, 0.3, 1) 0.20s both;
}
.flavor-text-enter .flavor-elem-5 {
  animation: itemRise 0.48s cubic-bezier(0.16, 1, 0.3, 1) 0.26s both;
}

@keyframes itemRise {
  0% {
    opacity: 0;
    transform: translateY(14px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.flavor-stars {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.flavor-stars svg {
  width: 17px;
  height: 17px;
  fill: #FCD34D;
  color: #FCD34D;
}

.flavor-rating-num {
  font-weight: 700;
  color: #FFFFFF;
  font-variant-numeric: tabular-nums;
}

.flavor-rating-sep {
  color: rgba(255, 255, 255, 0.4);
}

.flavor-review-count {
  color: rgba(255, 255, 255, 0.8);
  font-variant-numeric: tabular-nums;
}

.flavor-tagline {
  color: #FFFFFF;
  text-transform: uppercase;
  font-size: 11px;
  letter-spacing: 0.12em;
  font-weight: 600;
}

.flavor-title {
  font-family: 'Fraunces', Georgia, serif;
  font-size: clamp(4rem, 6vw, 5.8rem);
  font-weight: 900;
  color: #FFFFFF;
  line-height: 0.95;
  letter-spacing: -0.04em;
  margin: 0 0 20px 0;
  text-wrap: balance;
  background: transparent !important;
}

.flavor-description {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  font-size: 1.3rem;
  font-weight: 400;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.90);
  margin: 0 0 28px 0;
  max-width: 600px;
  background: transparent !important;
}

/* 4. Size Selector */
.flavor-sizes-wrapper {
  width: 100%;
  margin-bottom: 26px;
  background: transparent !important;
}

.flavor-sizes-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 10px;
}

.flavor-sizes-label {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.10em;
  font-weight: 700;
  color: #ffffff;
}

.flavor-price-label {
  display: none;
}

.flavor-sizes-buttons {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.flavor-size-btn {
  padding: 10px 17px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Plus Jakarta Sans', sans-serif;
  border-radius: 999px;
  border: 1.5px solid rgba(255, 255, 255, 0.75);
  background: transparent;
  color: #ffffff;
  cursor: pointer;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.flavor-size-btn:hover {
  background: rgba(255, 255, 255, 0.16);
}

.flavor-size-btn.active {
  background: #ffffff !important;
  color: #111111 !important;
  border-color: #ffffff !important;
  font-weight: 700 !important;
}

.flavor-actions-row {
  display: flex;
  align-items: center;
  gap: 22px;
  width: 100%;
  padding-top: 2px;
  background: transparent !important;
}

.flavor-primary-btn {
  padding: 14px 30px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 700;
  color: #111111;
  background: #ffffff;
  border: none;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  transition: background 0.2s ease, transform 0.2s ease;
}

.flavor-primary-btn:hover {
  background: #F3F4F6;
  transform: translateY(-1px);
}

.flavor-secondary-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.15s ease;
}

.flavor-secondary-link:hover {
  color: rgba(255, 255, 255, 0.8);
}

.flavor-secondary-link svg {
  width: 16px;
  height: 16px;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.flavor-secondary-link:hover svg {
  transform: translateX(6px);
}

/* FULL SCREEN / LARGE DESKTOP FIX */
@media (min-width: 1200px) {
  #flavor-text-container {
    left: 6%;
    width: 44vw;
    max-width: 760px;
    top: 50%;
    bottom: auto;
    transform: translateY(-50%);
  }

  .flavor-rating-row {
    font-size: 16px;
    margin-bottom: 14px;
  }

  .flavor-stars svg {
    width: 17px;
    height: 17px;
  }

  .flavor-tagline {
    font-size: 13px;
  }

  .flavor-title {
    font-size: clamp(4.8rem, 5.4vw, 6.3rem);
    line-height: 0.92;
    margin-bottom: 22px;
  }

  .flavor-description {
    font-size: clamp(1.2rem, 1.35vw, 1.45rem);
    line-height: 1.55;
    max-width: 650px;
    margin-bottom: 28px;
  }

  .flavor-sizes-label {
    font-size: 14px;
  }

  .flavor-size-btn {
    padding: 11px 19px;
    font-size: 15px;
  }

  .flavor-primary-btn {
    padding: 16px 34px;
    font-size: 16px;
  }

  .flavor-secondary-link {
    font-size: 16px;
  }
}
`;

    document.head.appendChild(style);
  }

  // 4. Create and return HTML for a flavor
  function createFlavorHtml(flavor) {
    const activeSize = selectedSizes[flavor.id] || flavor.sizes[0];

    // Build stars SVGs
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
      starsHtml += `
        <svg viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
      `;
    }

    // Build size buttons
    const sizeButtonsHtml = flavor.sizes
      .map((size) => {
        const isActive = size === activeSize;
        return `
          <button
            type="button"
            class="flavor-size-btn ${isActive ? 'active' : ''}"
            data-size="${size}"
          >
            ${size}
          </button>
        `;
      })
      .join('');

    return `
      <div class="flavor-text-block">
        <!-- 1. Rating & Tagline -->
        <div class="flavor-rating-row flavor-elem-1">
          <span class="flavor-stars">${starsHtml}</span>
          <span class="flavor-rating-num">${flavor.rating.toFixed(1)}</span>
          <span class="flavor-rating-sep">·</span>
          <span class="flavor-review-count">(${Number(flavor.reviewCount).toLocaleString()} reviews)</span>
          ${
            flavor.tagline
              ? `<span class="flavor-rating-sep">|</span><span class="flavor-tagline">${flavor.tagline}</span>`
              : ''
          }
        </div>

        <!-- 2. Main Title -->
        <h1 class="flavor-title flavor-elem-2">${flavor.flavorName}</h1>

        <!-- 3. Description -->
        <p class="flavor-description flavor-elem-3">${flavor.description}</p>

        <!-- 4. Size Selector -->
        <div class="flavor-sizes-wrapper flavor-elem-4">
          <div class="flavor-sizes-header">
            <span class="flavor-sizes-label">Select Size</span>
            ${flavor.price ? `<span class="flavor-price-label">${flavor.price}</span>` : ''}
          </div>
          <div class="flavor-sizes-buttons">
            ${sizeButtonsHtml}
          </div>
        </div>

        <!-- 5. Actions: Primary & Secondary -->
        <div class="flavor-actions-row flavor-elem-5">
          <button type="button" class="flavor-primary-btn" id="flavor-order-btn">
            ${flavor.primaryButtonText}
          </button>
          <button type="button" class="flavor-secondary-link" id="flavor-explore-btn">
            <span>${flavor.secondaryButtonText}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </div>
    `;
  }

  // 5. Attach event handlers to newly mounted flavor elements
  function attachEventHandlers(container, flavor) {
    // Size button selection
    const sizeButtons = container.querySelectorAll('.flavor-size-btn');
    sizeButtons.forEach((btn) => {
      btn.addEventListener('click', function () {
        const newSize = this.getAttribute('data-size');
        selectedSizes[flavor.id] = newSize;

        sizeButtons.forEach((b) => b.classList.remove('active'));
        this.classList.add('active');

        window.dispatchEvent(
          new CustomEvent('flavorSizeChange', {
            detail: { flavor: flavor.flavorName, size: newSize },
          })
        );
      });
    });

    // Primary ORDER NOW button
    const orderBtn = container.querySelector('#flavor-order-btn');
    if (orderBtn) {
      orderBtn.addEventListener('click', function () {
        const size = selectedSizes[flavor.id] || flavor.sizes[0];
        window.dispatchEvent(
          new CustomEvent('flavorOrderClick', {
            detail: { flavor: flavor.flavorName, size: size },
          })
        );
      });
    }

    // Secondary link
    const exploreBtn = container.querySelector('#flavor-explore-btn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', function () {
        window.dispatchEvent(
          new CustomEvent('flavorExploreClick', {
            detail: { flavor: flavor.flavorName },
          })
        );
      });
    }
  }

  // 6. Ensure Root Container Exists in DOM
  function ensureRoot() {
    if (!rootElement || !document.body.contains(rootElement)) {
      rootElement = document.getElementById('flavor-text-container');
      if (!rootElement) {
        rootElement = document.createElement('div');
        rootElement.id = 'flavor-text-container';
        document.body.appendChild(rootElement);
      }
    }
  }

  // 7. Core Update Function
  function updateFlavorDetails(progress) {
    ensureRoot();

    const p = Math.max(0, Math.min(1, Number(progress) || 0));

    // Mapping:
    // 0.00 – 0.24 = hide all flavor details (group landing scene)
    // 0.24 – 0.48 = Strawberries & Cream
    // 0.48 – 0.72 = Blackberry
    // 0.72 – 1.00 = Cherry
    let targetFlavor = null;
    if (p >= 0.72) {
      targetFlavor = FLAVORS[2]; // Cherry
    } else if (p >= 0.48) {
      targetFlavor = FLAVORS[1]; // Blackberry
    } else if (p >= 0.24) {
      targetFlavor = FLAVORS[0]; // Strawberries & Cream
    }

    const nextId = targetFlavor ? targetFlavor.id : null;

    // No change in active state
    if (nextId === currentFlavorId) return;

    currentFlavorId = nextId;

    const existingBlock = rootElement.querySelector('.flavor-text-stage');

    // Fade out previous text upward
    if (existingBlock) {
      existingBlock.classList.remove('flavor-text-enter');
      existingBlock.classList.add('flavor-text-exit');
      setTimeout(() => {
        if (existingBlock.parentNode === rootElement) {
          rootElement.removeChild(existingBlock);
        }
      }, 380);
    }

    // Mount next flavor and rise smoothly from below
    if (targetFlavor) {
      const stage = document.createElement('div');
      stage.className = 'flavor-text-stage flavor-text-enter';
      stage.innerHTML = createFlavorHtml(targetFlavor);
      attachEventHandlers(stage, targetFlavor);
      rootElement.appendChild(stage);
    }
  }

  // 8. Auto-initialize on load
  function init() {
    injectFonts();
    injectStyles();
    ensureRoot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global function as required
  window.updateFlavorDetails = updateFlavorDetails;
})();