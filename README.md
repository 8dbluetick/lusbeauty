# Lush Beauty Mart — Shopify 2.0 Theme

> **“Where Beauty Meets Quality”**

A modern, luxury, mobile-first Shopify 2.0 theme built for **Lush Beauty Mart**, Nagpur’s premier retail & wholesale beauty, cosmetics, artificial jewellery, handbags, and accessories destination.

---

## 🏬 Physical Store Profile (Nagpur)
- **Store Name**: Lush Beauty Mart
- **Address**: Below Hotel Maitrayee, Near Lad Square, Metro Station Pillar No. 213, 214, North Ambazari Road, Gandhi Nagar, Nagpur – 440 010
- **Phone**: `+91 9119595951`
- **WhatsApp**: `+91 9119595951`
- **Instagram**: [@lushbeautymart](https://instagram.com/lushbeautymart)
- **Timings**: Monday – Sunday: 10:30 AM to 9:30 PM

---

## 🎨 Theme Architecture (Shopify 2.0 Compliant)

```
lusbeauty/
├── layout/
│   └── theme.liquid                  # Master HTML with JSON-LD Schema & styles
├── templates/
│   ├── index.json                    # Homepage modular sections order
│   ├── product.json                  # Product details page
│   ├── collection.json               # Collection catalog page
│   ├── cart.json                     # Dedicated shopping cart page
│   ├── 404.json                      # 404 Error page
│   ├── search.json                   # Product search results
│   ├── page.contact.json             # Contact form template
│   └── list-collections.json         # All departments & categories
├── sections/
│   ├── announcement-bar.liquid       # Top bar with Nagpur store & free shipping
│   ├── header.liquid                 # Sticky navbar & mobile drawer
│   ├── hero-banner.liquid            # Lifestyle hero section
│   ├── featured-categories.liquid    # 6 Category cards (Skincare, Cosmetics, Jewellery, Bags)
│   ├── trending-products.liquid      # Filterable collection grid
│   ├── promotional-offers.liquid     # Coupon cards with tap-to-apply
│   ├── new-arrivals-carousel.liquid  # Horizontal scrollable product carousel
│   ├── store-experience.liquid       # Nagpur physical store & Google Maps card
│   ├── wholesale-banner.liquid       # B2B salon & wholesale callout
│   ├── instagram-feed.liquid         # 3x3 @lushbeautymart social grid
│   ├── contact-form.liquid           # Contact & enquiry form
│   ├── main-product.liquid           # Full product gallery & variant options
│   ├── main-collection.liquid        # Filterable collection catalog
│   ├── main-cart.liquid              # Shopping bag summary
│   ├── main-search.liquid            # Search page
│   ├── main-page.liquid              # Standard rich-text page
│   └── footer.liquid                 # Brand story, address & support links
├── snippets/
│   ├── product-card.liquid           # Reusable luxury product card
│   ├── cart-drawer.liquid            # AJAX slide-out cart with WhatsApp order
│   ├── quick-view-modal.liquid       # Product quick preview dialog
│   ├── wholesale-modal.liquid        # B2B wholesale quotation form
│   ├── whatsapp-widget.liquid        # Floating WhatsApp button (9119595951)
│   ├── mobile-bottom-nav.liquid      # Mobile bottom navigation bar
│   └── meta-tags.liquid              # OpenGraph & SEO tags
├── assets/
│   ├── theme.css                     # Luxury cream/gold/chocolate design system
│   └── theme.js                      # AJAX cart, quick view, WhatsApp builder
├── config/
│   ├── settings_schema.json          # Theme customizer settings definitions
│   └── settings_data.json            # Preset brand defaults
└── locales/
    └── en.default.json               # Translation dictionary
```

---

## 🚀 How to Import into Shopify Admin

1. Open **Shopify Admin** → **Online Store** → **Themes**.
2. Click **Add theme** → **Connect from GitHub**.
3. Select the repository **`8dbluetick/lusbeauty`** (branch: `main`).
4. Click **Connect**. Shopify will automatically validate the directory structure and install the theme!
