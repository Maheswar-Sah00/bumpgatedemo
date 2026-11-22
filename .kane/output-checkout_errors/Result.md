---
test: ../checkout_errors_test.md
status: passed
started: 2026-11-22T02:48:16.154Z
duration_s: 149
session_id: 10c18d6c-5401-4505-bd7d-70fb80f87264
---

# Checkout explains what is wrong — Result

## Add a product and go to checkout ✓ passed (46.2s)
md5: af44b5e1e4cdd6c733ebe5e277b6a0f6
Click "Add to cart" on the first product, click "Cart" in the header, then click "Go to checkout".

## Submit with a missing name and a bad email ✓ passed (40.5s)
md5: b3e26581c985d609960dc0f21ccdfb3f
Leave "Full name" empty, type "not-an-email" into "Email", then click the "Place order" button.

## See the errors ✓ passed (19.9s)
md5: a00a519dfbcf75d621eb2ae68f2756fa
Verify the message "Please enter your name" is shown.
Verify the message "Enter a valid email address" is shown.
