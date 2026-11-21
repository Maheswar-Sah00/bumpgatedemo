---
mode: testing
max_steps: 30
---

# Checkout explains what is wrong

## Add a product and go to checkout
Click "Add to cart" on the first product, click "Cart" in the header, then click "Go to checkout".

## Submit with a missing name and a bad email
Leave "Full name" empty, type "not-an-email" into "Email", then click the "Place order" button.

## See the errors
Verify the message "Please enter your name" is shown.
Verify the message "Enter a valid email address" is shown.
