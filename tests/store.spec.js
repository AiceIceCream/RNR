import { test, expect } from '@playwright/test';

test.describe('RNR OnlineShop — High-Performance Sportswear', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should display RNR OnlineShop, Shopping & Retail, Sportswear, and Engineered for Speed headline', async ({ page }) => {
    // Brand title & tagline
    await expect(page.getByText('RNR OnlineShop').first()).toBeVisible();
    await expect(page.locator('.brand-tagline')).toBeVisible();
    await expect(page.locator('.brand-origin')).toHaveText('SPORTSWEAR');

    // Sportswear Headline
    await expect(page.getByRole('heading', { name: /Engineered for Speed/i })).toBeVisible();

    // Verify card codes like ATLR-MNL-01 are removed
    await expect(page.getByText('ATLR-MNL-01')).toHaveCount(0);
  });

  test('should open product preview modal and display verified reviews', async ({ page }) => {
    // Click 'Preview' on the first product
    const previewBtn = page.getByRole('button', { name: 'Preview' }).first();
    await previewBtn.click();

    // Modal should be visible
    await expect(page.getByText(/GARMENT PREVIEW/i)).toBeVisible();

    // Fill review form with email verification
    await page.getByPlaceholder('Your Full Name').fill('Juan Athlete');
    await page.getByPlaceholder('Your Email Address').fill('juan.athlete@gmail.com');
    await page.getByPlaceholder(/Share your fit/i).fill('Incredible quality and fit for high-intensity training!');

    // Submit review
    await page.getByRole('button', { name: 'Submit Verified Review' }).click();

    // Verify review appeared in list
    await expect(page.getByText('Juan Athlete')).toBeVisible();
    await expect(page.getByText('Incredible quality and fit for high-intensity training!')).toBeVisible();

    // Add to bag from preview modal
    await page.getByRole('button', { name: /Add to Shopping Bag/i }).click();

    // Shopping bag drawer should open
    await expect(page.getByRole('heading', { name: /Shopping Bag/i })).toBeVisible();
  });

  test('should log into admin portal with admin / admin12345 and inspect inventory', async ({ page }) => {
    await page.getByRole('button', { name: 'Admin Portal' }).click();

    // Verify redesigned login without placeholder text
    const usernameInput = page.locator('input[type="text"]');
    const passwordInput = page.locator('input[type="password"]');

    await usernameInput.fill('admin');
    await passwordInput.fill('admin12345');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Admin dashboard should open
    await expect(page.getByText('RNR ONLINESHOP // SPORTS OPERATIONS')).toBeVisible();

    // Check inventory tab
    await page.getByRole('button', { name: /Inventory & Catalog/i }).click();
    await expect(page.getByRole('heading', { name: /Real-Time Inventory Levels/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Upload from Device' })).toBeVisible();
  });

  test('should support multiple images and gallery navigation for multi-image products', async ({ page }) => {
    // Log into admin and create product with 2 images
    await page.getByRole('button', { name: 'Admin Portal' }).click();
    await page.locator('input[type="text"]').fill('admin');
    await page.locator('input[type="password"]').fill('admin12345');
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByRole('button', { name: /Inventory & Catalog/i }).click();

    await page.locator('.admin-card input[type="text"]').first().fill('Aero Multi-Photo Jersey');
    await page.locator('.admin-card input[type="number"]').first().fill('950');

    // Add 2 image URLs
    await page.getByRole('button', { name: 'Image Web URL' }).click();
    const urlInput = page.locator('.admin-url-add-row input');
    await urlInput.fill('https://images.unsplash.com/photo-1521572267360-ee0c2909d518');
    await page.getByRole('button', { name: /Add URL/i }).click();
    await urlInput.fill('https://images.unsplash.com/photo-1503342217505-b0a15ec3261c');
    await page.getByRole('button', { name: /Add URL/i }).click();

    await expect(page.getByText('2 Image(s) Attached')).toBeVisible();
    await page.getByRole('button', { name: /Publish to Store Catalog/i }).click();

    // Return to store and preview
    await page.getByRole('button', { name: /Back to Store/i }).click();
    await expect(page.getByRole('heading', { name: 'Aero Multi-Photo Jersey' })).toBeVisible();

    // Click Preview
    const card = page.locator('.item-card').filter({ hasText: 'Aero Multi-Photo Jersey' });
    await expect(card.locator('.card-multi-img-badge')).toBeVisible();
    await card.getByRole('button', { name: 'Preview' }).click();

    // Multi-photo navigation
    await expect(page.locator('.preview-thumbs-strip')).toBeVisible();
    await expect(page.locator('.preview-counter-pill')).toHaveText('1 / 2');
    await page.locator('.preview-nav-btn.next').click();
    await expect(page.locator('.preview-counter-pill')).toHaveText('2 / 2');
  });

  test('should support multiple image options in admin product creator', async ({ page }) => {
    await page.getByRole('button', { name: 'Admin Portal' }).click();
    await page.locator('input[type="text"]').fill('admin');
    await page.locator('input[type="password"]').fill('admin12345');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await page.getByRole('button', { name: /Inventory & Catalog/i }).click();

    // Switch to URL mode and add image URL
    await page.getByRole('button', { name: 'Image Web URL' }).click();
    const urlInput = page.locator('.admin-url-add-row input');
    await urlInput.fill('https://images.unsplash.com/photo-1521572267360-ee0c2909d518');
    await page.getByRole('button', { name: /Add URL/i }).click();

    // Verify image attached in admin grid
    await expect(page.getByText('1 Image(s) Attached')).toBeVisible();
    await expect(page.locator('.admin-image-card')).toHaveCount(1);
  });

  test('should have consistent admin stock form and allow deleting a product with confirmation', async ({ page }) => {
    await page.getByRole('button', { name: 'Admin Portal' }).click();
    await page.locator('input[type="text"]').fill('admin');
    await page.locator('input[type="password"]').fill('admin12345');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await page.getByRole('button', { name: /Inventory & Catalog/i }).click();

    // Verify stock size matrix labels and styled publish button
    await expect(page.getByText('SIZE S')).toBeVisible();
    await expect(page.getByText('SIZE M')).toBeVisible();
    await expect(page.getByRole('button', { name: /Publish to Store Catalog/i })).toBeVisible();

    // Verify product exists before deleting
    await expect(page.getByText('Maroon Gold Athletic Dri-FIT Tee')).toBeVisible();

    // Click Delete on first product
    const deleteBtn = page.getByRole('button', { name: 'Delete' }).first();
    await deleteBtn.click();

    // Confirmation modal should appear
    const confirmBtn = page.getByRole('button', { name: 'Confirm Delete' });
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click();

    // Toast feedback appears
    await expect(page.locator('.toast-msg')).toBeVisible();
  });

  test('should allow selecting color variations and checkout with Bank Payment', async ({ page }) => {
    // Check top status bar text matches requirements
    await expect(page.getByText('GCASH / BANK PAYMENT AVAILABLE')).toBeVisible();
    await expect(page.getByText('PAY VIA GCASH OR BANK PAYMENT (₱ PHP)')).toBeVisible();

    // Click Black color swatch on first card (Maroon Gold Athletic Dri-FIT Tee)
    const blackSwatch = page.locator('.item-card').first().locator('.color-swatch-btn[title="Black"]');
    await expect(blackSwatch).toBeVisible();
    await blackSwatch.click();

    // Open preview modal
    const previewBtn = page.getByRole('button', { name: 'Preview' }).first();
    await previewBtn.click();

    // Swatches should be visible inside modal
    await expect(page.getByText('Choose Color:')).toBeVisible();
    await expect(page.locator('.preview-details-side .selected-variation-value')).toHaveText('Black');

    // Switch color to White inside modal
    const whiteModalSwatch = page.locator('.preview-details-side .color-swatch-btn[title="White"]');
    await whiteModalSwatch.click();
    await expect(page.locator('.preview-details-side .selected-variation-value')).toHaveText('White');

    // Add to bag
    await page.getByRole('button', { name: /Add to Shopping Bag/i }).click();

    // Bag drawer opens and reflects White variation
    await expect(page.getByRole('heading', { name: /Shopping Bag/i })).toBeVisible();
    await expect(page.locator('.cart-drawer').getByText(/COLOR: White/i)).toBeVisible();

    // Proceed to Checkout
    await page.getByRole('button', { name: /Proceed to Checkout/i }).click();

    // Verify payment options: GCash and Bank Payment are present, COD is NOT present
    await expect(page.getByRole('button', { name: /Bank Payment \(BDO \/ BPI \/ Maya\)/i })).toBeVisible();
    await expect(page.getByText('Cash on Delivery')).toHaveCount(0);

    // Select Bank Payment
    await page.getByRole('button', { name: /Bank Payment \(BDO \/ BPI \/ Maya\)/i }).click();

    // Verify bank account details appear
    await expect(page.getByText(/BDO Unibank/i)).toBeVisible();
    await expect(page.getByText(/Secondary \(BPI\)/i)).toBeVisible();

    // Fill customer info and bank reference
    await page.getByPlaceholder(/Juan dela Cruz/i).fill('Test Buyer');
    await page.getByPlaceholder(/buyer@example.com/i).fill('testbuyer@example.com');
    await page.locator('.modal-body input[type="tel"]').fill('09171234567');
    await page.getByPlaceholder(/Metro Manila/i).fill('Manila');
    await page.getByPlaceholder(/House\/Unit/i).fill('123 Divisoria St');
    const bankRefInput = page.getByPlaceholder(/BDO-98124801/i);
    await bankRefInput.fill('BDO-12345678');

    // Place order
    await page.getByRole('button', { name: /Confirm & Queue Order/i }).click();

    // Order Success modal confirms order, email, and reference
    await expect(page.getByText('Order Queued Successfully')).toBeVisible();
    await expect(page.getByText('testbuyer@example.com').first()).toBeVisible();
    await expect(page.getByText('BDO-12345678')).toBeVisible();
    await expect(page.getByText(/PENDING BANK TRANSFER VERIFICATION/i)).toBeVisible();
  });

  test('should allow admin to configure available color variations and render them in store', async ({ page }) => {
    await page.getByRole('button', { name: 'Admin Portal' }).click();
    await page.locator('input[type="text"]').fill('admin');
    await page.locator('input[type="password"]').fill('admin12345');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await page.getByRole('button', { name: /Inventory & Catalog/i }).click();

    // Fill new garment title and price
    await page.locator('.admin-card input[type="text"]').first().fill('Pro Speed Performance Dri-FIT');
    await page.locator('.admin-card input[type="number"]').first().fill('799');

    // Verify Available Color Variations section is present
    await expect(page.getByText('Available Color Variations')).toBeVisible();

    // Toggle Royal Blue preset color
    await page.locator('.admin-color-preset-pill').filter({ hasText: 'Royal Blue' }).click();

    // Add custom color "Charcoal"
    await page.getByPlaceholder(/Or enter custom color name/i).fill('Charcoal');
    await page.getByRole('button', { name: '+ Add Color' }).click();

    // Verify Charcoal chip appeared in Selected Color Variations
    await expect(page.locator('.admin-color-chip').filter({ hasText: 'Charcoal' })).toBeVisible();

    // Publish product
    await page.getByRole('button', { name: /Publish to Store Catalog/i }).click();

    // Go back to store
    await page.getByRole('button', { name: /Back to Store/i }).click();

    // Find created product in catalog
    const newCard = page.locator('.item-card').filter({ hasText: 'Pro Speed Performance Dri-FIT' });
    await expect(newCard).toBeVisible();

    // Verify Royal Blue and Charcoal color swatches are rendered on the product card
    await expect(newCard.locator('.color-swatch-btn[title="Royal Blue"]')).toBeVisible();
    await expect(newCard.locator('.color-swatch-btn[title="Charcoal"]')).toBeVisible();
  });

  test('should provide an adaptive and convenient shopping experience on phone displays', async ({ page }) => {
    // Set mobile phone viewport (iPhone 14 / Pixel standard: 390x844)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    // Check no horizontal scrollbar on mobile viewport
    const isOverflowing = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(isOverflowing).toBe(false);

    // Verify 2-column mobile grid has cards displayed nicely
    const cards = page.locator('.item-card');
    await expect(cards.first()).toBeVisible();

    // Add first item to bag (drawer auto-opens)
    const addBtn = page.getByRole('button', { name: /Add to Bag/i }).first();
    await addBtn.click();

    // Cart drawer opens and fills mobile screen width
    const cartDrawer = page.locator('.cart-drawer');
    await expect(cartDrawer).toBeVisible();

    // Close cart drawer to continue browsing
    await page.getByRole('button', { name: '[CLOSE]' }).click();
    await expect(cartDrawer).not.toBeVisible();

    // Verify mobile floating quick bag bar appears at bottom of screen while browsing
    const mobileFloatingBar = page.locator('.mobile-floating-cart-bar');
    await expect(mobileFloatingBar).toBeVisible();
    await expect(mobileFloatingBar.getByText(/1 item in Bag/i)).toBeVisible();
    await expect(mobileFloatingBar.getByRole('button', { name: /View Bag & Checkout/i })).toBeVisible();

    // Tap quick checkout button in floating bar to re-open cart
    await mobileFloatingBar.getByRole('button', { name: /View Bag & Checkout/i }).click();
    await expect(cartDrawer).toBeVisible();

    // Close cart drawer again
    await page.getByRole('button', { name: '[CLOSE]' }).click();
    await expect(cartDrawer).not.toBeVisible();

    // Open product preview modal on phone
    const previewBtn = page.getByRole('button', { name: 'Preview' }).first();
    await previewBtn.click();

    // Modal opens as mobile bottom sheet without breaking screen width
    const modal = page.locator('.preview-modal-card');
    await expect(modal).toBeVisible();
    const modalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(modalOverflow).toBe(false);

    // Close preview modal
    await page.getByRole('button', { name: '[CLOSE]' }).click();
    await expect(modal).not.toBeVisible();
  });

  test('should require customer email at checkout, dispatch receipt on admin verification, and email courier tracking on dispatch', async ({ page }) => {
    // Add item to bag
    await page.getByRole('button', { name: /Add to Bag/i }).first().click();

    // Proceed to checkout
    await page.getByRole('button', { name: /Proceed to Checkout/i }).click();

    // Verify email field is present and required
    const emailInput = page.locator('.modal-body input[type="email"]');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('required', '');

    // Fill checkout form
    await page.getByPlaceholder(/Juan dela Cruz/i).fill('Maria Santos');
    await emailInput.fill('maria.santos@athlete.ph');
    await page.locator('.modal-body input[type="tel"]').fill('09181234567');
    await page.getByPlaceholder(/Metro Manila/i).fill('Pasig City');
    await page.getByPlaceholder(/House\/Unit/i).fill('45 Amber St, Ortigas');

    // Input GCash reference
    await page.locator('.gcash-ref-input-box input').fill('1029384756102');

    // Confirm and queue order
    await page.getByRole('button', { name: /Confirm & Queue Order/i }).click();

    // Order Success modal confirms order and displays email notification recipient
    await expect(page.getByText('Order Queued Successfully')).toBeVisible();
    await expect(page.getByText('maria.santos@athlete.ph').first()).toBeVisible();

    // Close success modal
    await page.getByRole('button', { name: '[CLOSE]' }).click();

    // Log into admin portal
    await page.getByRole('button', { name: 'Admin Portal' }).click();
    await page.locator('input[type="text"]').fill('admin');
    await page.locator('input[type="password"]').fill('admin12345');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Go to Order Queue
    await page.getByRole('button', { name: /Order Queue/i }).click();

    // Verify order exists in table with customer email
    await expect(page.getByText('Maria Santos')).toBeVisible();
    await expect(page.locator('.admin-table').getByText('maria.santos@athlete.ph')).toBeVisible();

    // Verify payment and send official receipt
    const verifyBtn = page.getByRole('button', { name: /Verify & Send Receipt/i }).first();
    await expect(verifyBtn).toBeVisible();
    await verifyBtn.click();

    // Toast feedback appears and badge reflects receipt sent
    await expect(page.locator('.toast-msg')).toBeVisible();
    await expect(page.getByText(/✓ Receipt Emailed/i)).toBeVisible();

    // Open dispatch modal
    const dispatchBtn = page.getByRole('button', { name: /Dispatch & Email Tracking/i }).first();
    await expect(dispatchBtn).toBeVisible();
    await dispatchBtn.click();

    // Dispatch modal shows confirmed recipient email
    await expect(page.getByRole('heading', { name: 'Dispatch & Email Tracking' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Confirm Dispatch & Send Tracking Email/i })).toBeVisible();

    // Confirm dispatch
    await page.getByRole('button', { name: /Confirm Dispatch & Send Tracking Email/i }).click();

    // Order table reflects dispatched tracking
    await expect(page.getByText(/✓ Tracking Emailed \(RNT Express\)/i)).toBeVisible();

    // View sent email preview
    const viewEmailBtn = page.getByRole('button', { name: /View Email/i }).first();
    await expect(viewEmailBtn).toBeVisible();
    await viewEmailBtn.click();

    // Email simulation modal opens showing tracking details and how to track parcel
    await expect(page.getByText(/CUSTOMER EMAIL NOTIFICATION \/\/ DISPATCH SIMULATION/i)).toBeVisible();
    await expect(page.getByText(/How to Track Your Order:/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Track Your Parcel Online/i })).toBeVisible();

    // Close email preview
    await page.getByRole('button', { name: /Close Email Notification Preview/i }).click();
  });

  test('should display real Email Delivery settings tab, step-by-step setup guide, and configuration inputs in admin portal', async ({ page }) => {
    // Open admin portal
    await page.getByRole('button', { name: 'Admin Portal' }).click();
    await page.locator('input[type="text"]').fill('admin');
    await page.locator('input[type="password"]').fill('admin12345');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Click Email Delivery tab
    const emailTabBtn = page.getByRole('button', { name: /Email Delivery \(Gmail\)/i });
    await expect(emailTabBtn).toBeVisible();
    await emailTabBtn.click();

    // Verify settings guide and form are rendered
    await expect(page.getByRole('heading', { name: /Real Email Delivery Settings \(Gmail \/ EmailJS\)/i })).toBeVisible();
    await expect(page.getByText(/Quick 3-Minute Setup Guide/i)).toBeVisible();
    await expect(page.getByPlaceholder(/service_gmaildelivery/i)).toBeVisible();
    await expect(page.getByPlaceholder(/5xYzAbCdE12345/i)).toBeVisible();
    await expect(page.getByPlaceholder(/template_receipt_verified/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Save EmailJS Configuration/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Send Real Test Email/i })).toBeVisible();

    // Fill credentials and save
    await page.getByPlaceholder(/service_gmaildelivery/i).fill('service_test_rnr');
    await page.getByPlaceholder(/5xYzAbCdE12345/i).fill('pk_test_12345');
    await page.getByPlaceholder(/template_receipt_verified/i).fill('template_receipt_01');
    await page.getByRole('button', { name: /Save EmailJS Configuration/i }).click();

    // Toast feedback appears
    await expect(page.locator('.toast-msg')).toBeVisible();
    await expect(page.getByText(/🟢 Real Gmail Delivery Active/i)).toBeVisible();
  });

  test('should provide customer Track Order button, track by code, and hide real email transmission when not logged in as admin', async ({ page }) => {
    // 1. Verify Track Order button is visible in header navigation for customer
    const trackOrderNavBtn = page.locator('.track-order-nav-btn');
    await expect(trackOrderNavBtn).toBeVisible();

    // 2. Open Track Order modal from header
    await trackOrderNavBtn.click();
    await expect(page.getByText('CUSTOMER ORDER STATUS // TRACKING PORTAL')).toBeVisible();

    // 3. Test non-existent tracking code
    const trackInput = page.locator('#track-order-input');
    await trackInput.fill('INVALID-TRACK-999');
    await page.getByRole('button', { name: /Track Order →/i }).click();
    await expect(page.getByRole('heading', { name: 'No Order Found' })).toBeVisible();
    await expect(page.getByText(/INVALID-TRACK-999/)).toBeVisible();

    // Close tracker
    await page.locator('.track-order-modal-card .close-btn').click();

    // 4. Customer places an order
    await page.getByRole('button', { name: /Add to Bag/i }).first().click();
    await page.getByRole('button', { name: /Proceed to Checkout/i }).click();

    await page.getByPlaceholder(/Juan dela Cruz/i).fill('Carlos Yulo');
    await page.locator('.modal-body input[type="email"]').fill('carlos.yulo@gymnastics.ph');
    await page.locator('.modal-body input[type="tel"]').fill('09191234567');
    await page.getByPlaceholder(/Metro Manila/i).fill('Manila City');
    await page.getByPlaceholder(/House\/Unit/i).fill('Rizal Memorial Sports Complex');
    await page.locator('.gcash-ref-input-box input').fill('GCASH-CY-888999');

    await page.getByRole('button', { name: /Confirm & Queue Order/i }).click();

    // 5. Verify Order Success modal displays tracking code and Track Now button
    await expect(page.getByText('Order Queued Successfully')).toBeVisible();
    await expect(page.getByText('YOUR ORDER TRACKING CODE')).toBeVisible();
    await expect(page.getByRole('button', { name: /Copy Code/i })).toBeVisible();

    // Verify "Send Real Email" button is NOT present since admin is not logged in
    await expect(page.getByText(/Send Real Email/i)).toHaveCount(0);

    // Read the generated order code
    const orderCodeText = (await page.locator('.customer-tracking-code').textContent()).trim();
    expect(orderCodeText).toMatch(/RNR-SPT-\d+/);

    // Click "Track This Order Status Now"
    await page.getByRole('button', { name: /Track This Order Status Now/i }).click();

    // Verify tracker displays the customer's order in Pending Admin Verification state
    await expect(page.getByText('CUSTOMER ORDER STATUS // TRACKING PORTAL')).toBeVisible();
    await expect(page.locator('.track-result-ord-id')).toHaveText(`ORDER #${orderCodeText}`);
    await expect(page.getByText(/AWAITING ADMIN PAYMENT VERIFICATION/i)).toBeVisible();
    await expect(page.getByText(/Carlos Yulo/)).toBeVisible();
    await expect(page.getByText(/GCASH-CY-888999/)).toBeVisible();

    // Close tracker
    await page.getByRole('button', { name: /Close Tracker/i }).click();

    // 6. Admin logs in to verify the payment
    await page.getByRole('button', { name: 'Admin Portal' }).click();
    await page.locator('input[type="text"]').fill('admin');
    await page.locator('input[type="password"]').fill('admin12345');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await page.getByRole('button', { name: /Order Queue/i }).click();
    await expect(page.getByText('Carlos Yulo')).toBeVisible();

    // Admin verifies payment
    const verifyBtn = page.getByRole('button', { name: /Verify & Send Receipt/i }).first();
    await verifyBtn.click();
    await expect(page.getByText(/✓ Receipt Emailed/i)).toBeVisible();

    // Admin opens email view - verify email content is displayed for review and duplicate send button is removed
    const viewEmailBtn = page.getByRole('button', { name: /View Email/i }).first();
    await viewEmailBtn.click();
    await expect(page.getByText(/CUSTOMER EMAIL NOTIFICATION \/\/ DISPATCH SIMULATION/i)).toBeVisible();
    await expect(page.getByText(/✓ EMAIL NOTIFICATION DISPATCHED/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Send Real Email to Customer's Gmail/i })).toHaveCount(0);
    await page.getByRole('button', { name: /Close Email Notification Preview/i }).click();

    // Admin dispatches package
    const dispatchBtn = page.getByRole('button', { name: /Dispatch & Email Tracking/i }).first();
    await dispatchBtn.click();
    await page.getByRole('button', { name: /Confirm Dispatch & Send Tracking Email/i }).click();
    await expect(page.getByText(/✓ Tracking Emailed/i)).toBeVisible();

    // 7. Return to Store as customer and track order again
    await page.getByRole('button', { name: /Back to Store/i }).click();
    await page.locator('.track-order-nav-btn').click();

    await page.locator('#track-order-input').fill(orderCodeText);
    await page.getByRole('button', { name: /Track Order →/i }).click();

    // Verify customer sees Dispatched status and courier tracking
    await expect(page.getByText(/PACKAGE DISPATCHED \/\/ LIVE COURIER TRACKING ACTIVE/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Track Live on RNT Express Portal →/i })).toBeVisible();
  });

  test('should display Lulus-inspired editorial homepage with Bike1 and Bike2 models, pose switcher, and Shop Now button', async ({ page }) => {
    // 1. Verify headline matches Lulus composition
    await expect(page.getByRole('heading', { name: /YOU'VE BEEN WARMED/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Engineered for Speed/i })).toBeVisible();

    // 2. Verify Shop Now button is present
    const shopNowBtn = page.getByRole('button', { name: /SHOP NOW →/i }).first();
    await expect(shopNowBtn).toBeVisible();

    // 3. Verify logo functions as home button
    const logoHomeBtn = page.locator('.brand-home-btn');
    await expect(logoHomeBtn).toBeVisible();
    await logoHomeBtn.click();

    // 4. Verify search, extra nav buttons, and hero secondary category links are removed
    await expect(page.locator('.header-search-wrap')).toHaveCount(0);
    await expect(page.locator('.header-nav-menu')).toHaveCount(0);
    await expect(page.locator('.subnav-category-bar')).toHaveCount(0);
    await expect(page.locator('.lulus-secondary-links')).toHaveCount(0);

    // 5. Verify Cycling Model poses (Bike 1 and Bike 2) are interactive
    await expect(page.getByText(/CYCLING MODEL POSES:/i)).toBeVisible();
    const poseBike2Btn = page.getByRole('button', { name: /Bike 2: Coastal Endurance/i });
    await expect(poseBike2Btn).toBeVisible();
    await poseBike2Btn.click();
    await expect(poseBike2Btn).toHaveClass(/active/);

    // Switch back to Bike 1
    const poseBike1Btn = page.getByRole('button', { name: /Bike 1: Road Aero Pace/i });
    await expect(poseBike1Btn).toBeVisible();
    await poseBike1Btn.click();
    await expect(poseBike1Btn).toHaveClass(/active/);

    // 6. Verify Model Spotlight Section for Bike 1 & Bike 2
    await expect(page.getByText(/THE CYCLING LOOKBOOK \/\/ BIKE 1 & BIKE 2 SIGNATURE POSES/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: /Bike 1: Road Aero Pace/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Bike 2: Coastal Endurance/i })).toBeVisible();

    // 7. Verify floating help button
    await expect(page.locator('.floating-help-btn')).toBeVisible();
  });
});


