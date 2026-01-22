# Luxury Shop

[[_TOC_]]

## Background

You are a frontend developer at a small company specializing in exclusive products for high-net-worth customers. Your team is launching a new digital store called **«Luxury»**, where yachts, private jets, mansions, and even entire islands will be sold. A true premium service.

Your task is to develop the first prototype of the frontend part of the application, including the key screens and core functionality. Investors are already waiting for the MVP, but the backend developer is still busy with a previous project, and the information security specialist has asked you to avoid third-party libraries while he is diagnosing some issue. You will have to work with what is available.

---

## Technical requirements

### Tooling restrictions

- Only **vanilla HTML, CSS, JavaScript** are allowed.
- The following are **strictly forbidden**:
    - React, Vue, Svelte, Angular, and similar frameworks;
    - TypeScript;
    - jQuery, Bootstrap, or any third-party libraries;
    - NPM packages (except those already present in the repository).

> ⚠️ **Warning**: Violating the tooling restrictions will result in the work being invalidated.

### Editable files restrictions

Inside the solution directory, you may edit the pre-created index.html file and create any additional files you need. The pre-created CSS files may also be edited, but we recommend using the styles provided in them.

> ⚠️ **Warning**: you are only allowed to edit the contents of the **solution** folder, except for the **data.json** file. Commits with changes to other files and folders will be rejected.

---

## Design

The designer has prepared mockups for all screens. Screenshots with descriptions are provided below. For visual regression tests to pass, your implementation must match the mockups as closely as possible.

Good news: the designer followed the company’s standard design system, so some of the required styles are already available. They are located in your project directory.

The client requires the interface to be in English.

### Home page — Product list

Overall product list view:

<img src="tests/snapshots/product-list/display.spec.ts-snapshots/product-list-chromium-linux.png" width="300">

Loading state (skeletons):

<img src="tests/snapshots/product-list/display.spec.ts-snapshots/product-list-skeleton-chromium-linux.png" width="300">

Filters with one selected category:

<img src="tests/snapshots/product-search/filtering.spec.ts-snapshots/filters-chromium-linux.png" width="300">

Product card:

<img src="tests/snapshots/product-list/display.spec.ts-snapshots/product-card-chromium-linux.png" width="300">

Product card skeleton:

<img src="tests/snapshots/product-list/display.spec.ts-snapshots/product-card-skeleton-chromium-linux.png" width="300">

Purchased product card:

<img src="tests/snapshots/product-list/bought-products.spec.ts-snapshots/bought-product-card-chromium-linux.png" width="300">

Overall mobile layout:

<img src="tests/snapshots/product-list/display.spec.ts-snapshots/product-list-mobile-chromium-linux.png" width="200">

Product list on mobile with hover state on a product card:

<img src="tests/snapshots/product-list/display.spec.ts-snapshots/product-list-hover-chromium-linux.png" width="300">

Loading recommendations on mobile after entering text in the search field:

<img src="tests/snapshots/product-search/search.spec.ts-snapshots/search-suggestions-loading-chromium-linux.png" width="300">

Search with active recommendations on mobile:

<img src="tests/snapshots/product-search/search.spec.ts-snapshots/search-suggestions-active-chromium-linux.png" width="300">

### Product Details (Modal)

Product details view:

<img src="tests/snapshots/product-modal/opening.spec.ts-snapshots/modal-open-chromium-linux.png" width="300">

Product details on mobile:

<img src="tests/snapshots/product-modal/opening.spec.ts-snapshots/modal-mobile-chromium-linux.png" width="200">

### Cart

Empty cart:

<img src="tests/snapshots/cart/display.spec.ts-snapshots/cart-empty-chromium-linux.png" width="300">

Cart with products:

<img src="tests/snapshots/cart/display.spec.ts-snapshots/cart-items-chromium-linux.png" width="300">

Confirmation modal when removing an item from the cart:

<img src="tests/snapshots/cart/item-management.spec.ts-snapshots/cart-remove-modal-chromium-linux.png" width="300">

Order in progress (after clicking the checkout button):

<img src="tests/snapshots/cart/checkout.spec.ts-snapshots/cart-processing-chromium-linux.png" width="300">

Cart with products on mobile:

<img src="tests/snapshots/cart/display.spec.ts-snapshots/cart-mobile-chromium-linux.png" width="200">

Cart item card on mobile:

<img src="tests/snapshots/cart/display.spec.ts-snapshots/cart-item-chromium-linux.png" width="300">

### Profile

Overall profile view:

<img src="tests/snapshots/profile/save-data.spec.ts-snapshots/profile-inputs-empty-chromium-linux.png" width="300">

Name and e-mail validation, checkbox focus:

<img src="tests/snapshots/profile/validation.spec.ts-snapshots/profile-inputs-error-chromium-linux.png" width="300">

Inactive "new products notifications" checkbox:

<img src="tests/snapshots/profile/save-data.spec.ts-snapshots/profile-checkbox-unchecked-chromium-linux.png" width="300">

Active "new products notifications" checkbox:

<img src="tests/snapshots/profile/save-data.spec.ts-snapshots/profile-checkbox-checked-chromium-linux.png" width="300">

Filled name and e-mail fields (with focus) on mobile:

<img src="tests/snapshots/profile/save-data.spec.ts-snapshots/profile-inputs-filled-chromium-linux.png" width="300">

### Order history

Empty history:

<img src="tests/snapshots/history/display.spec.ts-snapshots/orders-empty-chromium-linux.png" width="300">

History with multiple orders:

<img src="tests/snapshots/history/display.spec.ts-snapshots/orders-history-chromium-linux.png" width="300">

History with multiple orders on mobile:

<img src="tests/snapshots/history/display.spec.ts-snapshots/order-mobile-chromium-linux.png" width="300">

### Dark theme

Dark theme on the home page:

<img src="tests/snapshots/theme/save-theme.spec.ts-snapshots/dark-theme-chromium-linux.png" width="300">

Dark theme during loading (skeletons):

<img src="tests/snapshots/theme/save-theme.spec.ts-snapshots/dark-skeletons-chromium-linux.png" width="300">

Dark theme in the profile:

<img src="tests/snapshots/profile/save-data.spec.ts-snapshots/dark-theme-profile-chromium-linux.png" width="300">

Dark theme in the cart with products:

<img src="tests/snapshots/cart/display.spec.ts-snapshots/dark-theme-cart-chromium-linux.png" width="300">

Dark theme in a non-empty order history on mobile:

<img src="tests/snapshots/history/display.spec.ts-snapshots/dark-theme-orders-chromium-linux.png" width="300">

---

## Functionality

Below are the behavior scenarios for all application screens. Your application must strictly follow these requirements. If some details are not explicitly described:

- Check whether their behavior is implicitly defined in the open tests or mockups.
- If not, choose the implementation at your own discretion.

### Navigation and address bar

- The current section must be reflected in the URL path: `/` for catalog, `/cart.html` for cart, `/profile.html` for profile, `/history.html` for order history.
- When reloading the page or navigating directly to a section URL, the corresponding screen must open.
- The top of the page contains the store name, navigation sections, a theme toggle button, and a product search.
- The URL in the address bar must change when navigating within the site via section buttons.
- Product search must work in any section. See «Filters and search» for detailed behavior.

---

### Part 1. Product list

Path: /

The home page displays a list of exclusive products: yachts, planes, mansions, and islands. Product data is loaded from solution/data.json on the first visit and saved in localStorage. If the data.json file is missing or invalid, the page must display the message: "Failed to load products".

#### Core logic

- When the page loads, **skeletons** are shown until data loading is complete. Since there is no backend, loading must be simulated with a timer. Skeletons must be shown for at least 1.5 seconds and until data is loaded from data.json.
- After loading, a grid of product cards is displayed. Products must be rendered in the same order as in data.json.
- Each product card contains:
    - type (yacht, plane, etc.);
    - image;
    - name;
    - price.
- Clicking a product card opens a **modal with product details**.
- On hover, the card is visually «lifted» and a shadow appears.
- If a product has already been purchased (exists in any order in history), it must be marked as purchased and clicking it must have no effect.

#### Filters and search

- Filters by product type (Yacht, Plane, Mansion, Island)
    - If at least one filter is selected, only products matching the selected types are shown. Example: selecting both "Yacht" and "Plane" shows all yachts and planes.
    - If no filters are selected, all products are shown.
- Search input by product name. The search is case-insensitive ("Yacht" and "yacht" are equivalent).
- When typing into the search field, display the text "Loading..." under the field for 1.5 seconds. Then show **recommendations** (suggestions). The suggestions should be generated as follows:
    1. Take all known products.
    2. Filter products, leaving only those with names containing the search string.
    3. Sort the resulting list alphabetically by name.
    4. If there are more than 3 items, keep only the first 3.
- When the search field loses focus (by clicking on a different part of the screen), the recommendations disappear.
- If text is entered into the search field on the Product List page and the Enter key is pressed, the product list is filtered by name. Category filters are still applied.
- If a recommendation is clicked:
    1. Category filters are reset.
    2. The name of the selected recommended product is inserted into the search field.
    3. If the Product List page is active, products are filtered (products with names that do not include the text from the field are hidden).
    4. If the selected product is not purchased, the product details modal opens. If it is purchased, the modal does not open.
- Filters and search are duplicated in query parameters: `search` for the search text and `filters` (a comma-separated list of types) for the selected filters. When the page is reloaded or a link with query parameters is opened, the filter and search state are restored. When the search is cleared or filters are disabled, the corresponding parameters are removed from the URL.

Since products are filtered rather than sorted, product cards must not be displayed in alphabetical order — the order from data.json must be preserved. In other words:

- In recommendations, sorting is always alphabetical.
- In the product list, sorting always follows the order from data.json, but some products may be hidden due to filters and search.

---

### Part 2. Product card (modal)

Opens when clicking on a product card. Modal content:

- Large image.
- Name.
- Type.
- Description.
- Price.
- Button to add or remove the product:
    - Behavior when clicking while the product is not added to the cart:
        - The button text changes to "Added", and the button becomes disabled for 2 seconds. Then the text changes to "Remove from cart", and the button becomes active.
        - A notification "Great choice!" appears on the screen for 2 seconds. It should be noticeable but not cover the entire screen.
    - Behavior when clicking while the product is already added to the cart:
        - The button text changes to "Removed", and the button becomes disabled for 2 seconds. Then the text changes to "Add to cart", and the button becomes active.
        - A "Looking for something better?" notification appears for 2 seconds. It should be noticeable but not cover the entire screen.
    - The modal does not close after either adding or removing the product.
    - When any change occurs (adding or removing a product), the cart icon in the header updates with the number of items in the cart. If there are no items in the cart, the counter is not displayed.

The modal is closed by:

- Clicking the close (×) button.
- Clicking on the overlay (background).
- Pressing the Esc key.

---

### Part 3. Cart

Path: /cart.html

Accessible via the cart icon in the header (on all pages).

#### Logic:

- Cart data is stored in localStorage. When refreshing the page, the cart must be preserved.
- The cart displays the following:
    - A list of products with image, name, and price.
    - The total amount (displayed only if there are products in the cart).
    - A "Place order" button (displayed only if there are products in the cart and the user is authorized. A user is considered authorized if they have filled in and saved their name and email in the profile).
    - If the user is not authorized, the "Login to place an order" button is displayed instead of the "Place order" button.
    - A "Remove" button for each product.
- When clicking to remove a product the following happens:
    - A confirmation modal is displayed.
    - If the user confirms the removal, the product is removed from the list, the total amount is updated, or the empty cart message is shown.
    - After removal, a notification "Looking for something better?" appears on the screen for 2 seconds.
- When clicking the "Login to place an order" button, the user is redirected to the profile page.
- When clicking the checkout button, the following happens:
    - The checkout button becomes disabled.
    - A "Cancel" checkout button is displayed for 1.5 seconds. If it is clicked, the checkout process is canceled and the checkout button becomes active again.
    - After 1.5 seconds, the user is redirected to /history.html, where the latest order appears.
    - If the cart is opened again, it will be empty.
- If the cart is empty, the message "Cart is empty" is displayed.

---

### Part 4. Profile

Path: /profile.html

Accessible via the profile icon in the header (on all pages).

#### Form contains:

- "Name" field (required).
- "E-mail" field (required, with format validation: the e-mail must contain exactly one @ character, and no more than one dot after it).
- "Receive notifications about new products" checkbox.
- "Save" button.

It is recommended not to use native validation error messages, as they may interfere with test execution.

#### Logic:

- Data is stored in localStorage. When the page is reopened, the fields must be restored.
- When clicking the save button the following can happen:
    - Fields are validated.
    - If there are validation errors, error messages are displayed under the fields (as shown in the design).
    - On success, the data is saved and the message "Data saved" is displayed for 2 seconds.

---

### Part 5. Order history

Path: /history.html

Accessible via the history icon in the header (on all pages).

#### Logic:

- When placing an order (from the cart), the current cart contents are moved to the order history.
- Each order contains:
    - Order number in the format `ORD-<number>`, where number is the [Timestamp](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now) of the moment the "Place order" button was clicked.
    - Order date in the format DD.MM.YYYY by the user's timezone.
    - A list of products.
    - The total amount.
- If there are no orders, the message "Order history is empty" is displayed.
- Data is stored in `localStorage` and persists between sessions.
- Orders are displayed in reverse chronological order (the most recent order at the top).

---

### Part 6. Dark theme

- A theme toggle (sun/moon) is located in the application header.
- The default theme is light.
- When switching themes:
    - The theme updates instantly.
    - The selected theme is saved in `localStorage`.
    - When the application is reopened, the saved theme is applied.
- All screens must display correctly in both themes (colors, contrast, icons).

---

## Scoring system

The solution will be evaluated using automated tests — both functional and screenshot-based. The scoring criteria are listed below.

| Section                           | Points |
| :-------------------------------- | :----: |
| Product list (product-list)       |   14   |
| Search, filters (product-search)  |   17   |
| Product modal (product-modal)     |   12   |
| Cart (cart)                       |   18   |
| Profile, validation (profile)     |   13   |
| Order history (history)           |   9    |
| Theme switching (theme)           |   5    |
| Section transitions (integration) |   12   |

> 💡 **Important**:
>
> - Passing open tests does not guarantee the maximum score — some checks are hidden.
> - Screenshot tests verify visual compliance with reference images. It is strongly recommended to run screenshot tests only via Docker; otherwise, local results may be invalid due to environment differences (Linux, Chromium).
> - Screenshots are taken at specific screen sizes. You can find which ones by inspecting the test code. Remember: open tests are an additional source of information describing the required behavior.
> - All `data-test-id` attributes must be added strictly according to the instructions below — otherwise, tests will fail.

---

## Element identifiers for tests

To successfully pass automated tests, use the `data-test-id` attribute with the values listed below.

### Home page

| Element                  | `data-test-id`       |
| ------------------------ | -------------------- |
| Product list container   | `product-list`       |
| Product card             | `product-card`       |
| Product name in the card | `product-title`      |
| Product type             | `product-type`       |
| Product price            | `product-price`      |
| Product card skeleton    | `skeleton-card`      |
| Search input             | `search-input`       |
| Suggestions container    | `search-suggestions` |
| Suggestion element       | `suggestion-item`    |
| Each filter element      | `filter`             |

### Modal

| Element                 | `data-test-id`      |
| ----------------------- | ------------------- |
| Modal                   | `modal`             |
| Close button            | `modal-close`       |
| Product title           | `modal-title`       |
| Product description     | `modal-description` |
| Product price           | `modal-price`       |
| Add to cart button      | `add-to-cart`       |
| Remove from cart button | `remove-from-cart`  |

### Cart

| Element                | `data-test-id`           |
| ---------------------- | ------------------------ |
| Cart container         | `cart-list`              |
| Item in cart           | `cart-item`              |
| Remove item button     | `cart-remove`            |
| Confirmation modal     | `remove-confirm-modal`   |
| Total amount           | `cart-total`             |
| Checkout button        | `checkout-button`        |
| Cancel checkout button | `cancel-checkout-button` |
| Empty cart container   | `cart-empty`             |

### Profile

| Element                         | `data-test-id`          |
| ------------------------------- | ----------------------- |
| Profile container               | `profile`               |
| Name field                      | `profile-name`          |
| Email field                     | `profile-email`         |
| Notification checkbox container | `profile-notifications` |
| Save button                     | `profile-save`          |

### Order history

| Element                 | `data-test-id` |
| ----------------------- | -------------- |
| Orders container        | `orders-list`  |
| Order element           | `orders-item`  |
| Empty history container | `orders-empty` |

### Menu

| Element                | `data-test-id` |
| ---------------------- | -------------- |
| Shop section button    | `menu-shop`    |
| Cart section button    | `menu-cart`    |
| Profile section button | `menu-profile` |
| History section button | `menu-history` |
| Cart items counter     | `cart-badge`   |
| Theme toggle           | `theme-toggle` |

---

## Good luck with the assignment! 🎉

**We wish you success in creating a truly luxurious digital experience!** 💎🚤✈️🏝️🤑
