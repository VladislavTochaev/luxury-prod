class Cart {
  selectors = {
    cart: '[data-test-id="menu-cart"]',
    cartCounter: '[data-test-id="cart-badge"]',
    cartList: '[data-test-id="cart-list"]',
    cartTotal: '[data-test-id="cart-total"]',
    cartEmpty: '[data-test-id="cart-empty"]',
    cartItem: '[data-test-id="cart-item"]',
    cartInfo: '[data-js-cart-info]',
    cartRemove: '[data-test-id="cart-remove"]',
    checkoutButton: '[data-test-id="checkout-button"]',
    removeConfirmModal: '[data-test-id="remove-confirm-modal"]',
    modal: '[data-test-id="modal"]',
    modalClose: '[data-test-id="modal-close"]',
    cancelCheckoutButton: '[data-test-id="cancel-checkout-button"]',
    cartHr: '[data-js-cart-hr]',
  }

  stateAttributes = {
    ariaHidden: 'aria-hidden',
    ariaLabel: 'aria-label',
    test: 'data-test-id',
    role: 'role',
    ariaModal: 'aria-modal',
    modalClose: 'modal-close',
    modalAction: 'data-js-modal-action',
  }

  stateClasses = {
    isOpen: 'modal--open',
    isLock: 'is-lock',
    visuallyHidden: 'visually-hidden',
    modal: 'modal',
    iconCart: 'header__menu-icon--cart',
    counterCart: 'cart__counter',
    notification: 'notification',
    cartCancelButton: 'cart__cancel-button',
  }

  storageKey = 'cart'
  userProfileKey = 'userProfile'
  orderHistoryKey = 'orderHistory'

  constructor() {
    this.cartElement = document.querySelector(this.selectors.cart)
    this.cartCountElement = this.cartElement?.querySelector(this.selectors.cartCounter)
    this.cartListElement = document.querySelector(this.selectors.cartList)
    this.cartTotalElement = document.querySelector(this.selectors.cartTotal)
    this.checkoutButtonElement = document.querySelector(this.selectors.checkoutButton)

    this.isCartPage = window.location.pathname.includes('cart.html')
    this.init()
  }

  init() {
    if (this.isCartPage) {
      this.cartHrElement = document.querySelector(this.selectors.cartHr)
      this.initCartPage()
    }

    this.updateCounter()
    this.bindEvents()
  }

  getCart() {
    try {
      const cart = localStorage.getItem(this.storageKey)
      return cart ? JSON.parse(cart) : []
    } catch (error) {
      return []
    }
  }

  saveCart(cart) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(cart))
    } catch (error) {
      console.error('Error saving cart:', error)
    }
  }

  formatPrice(price) {
    if (!price && price !== 0) {
      return '$0'
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  removeFromCart(productId) {
    const cart = this.getCart()
    const updatedCart = cart.filter(item => item.id !== productId)

    this.saveCart(updatedCart)
    this.updateCounter()
    this.dispatchChangeEvent()

    if (this.isCartPage) {
      this.renderCart()
    }
  }

  getCartCount() {
    const cart = this.getCart()
    return cart.length
  }

  getCartTotal() {
    const cart = this.getCart()
    return cart.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0
      return total + price
    }, 0)
  }

  updateCounter = () => {
    if (!this.cartCountElement) {
      return
    }

    const cartCount = this.getCartCount()

    if (cartCount > 0) {
      this.cartCountElement.classList.remove(this.stateClasses.visuallyHidden)
      this.cartCountElement.textContent = cartCount.toString()

      const itemWord = cartCount === 1 ? 'item' : 'items'
      this.cartElement.title = `Cart, ${cartCount} ${itemWord}`
      this.cartElement.setAttribute(this.stateAttributes.ariaLabel, `Cart, ${cartCount} ${itemWord}`)
    } else {
      this.cartCountElement.classList.add(this.stateClasses.visuallyHidden)
      this.cartCountElement.textContent = ''

      this.cartElement.title = 'Cart'
      this.cartElement.setAttribute(this.stateAttributes.ariaLabel, 'Cart')
    }
  }

  createCartItem(product) {
    const price = typeof product.price === 'number' ? product.price : Number(product.price) || 0

    return `
    <li class="cart__item">
      <article class="product-card product-card--long" data-test-id="cart-item" data-product-id="${product.id}">
        <div class="product-card__media">
          <img
            class="product-card__image"
            src="${product.image}"
            alt="${product.title || 'Product'}"
            loading="lazy"
            width="100"
            height="100"
          />
        </div>
        <div class="product-card__body">
          <h3 class="product-card__title">${product.title || 'Product'}</h3>
          <span class="product-card__price">${this.formatPrice(price)}</span>
        </div>
        <button
          class="product-card__button"
          type="button"
          data-test-id="cart-remove"
          data-product-id="${product.id}"
        >
          Remove
        </button>
      </article>
    </li>
  `
  }

  renderCart() {
    if (!this.isCartPage || !this.cartListElement) {
      return
    }

    const cart = this.getCart()

    if (cart.length === 0) {
      this.showEmptyCart()
      this.cartHrElement.classList.add(this.stateClasses.visuallyHidden)
      return
    }

    this.cartHrElement.classList.remove(this.stateClasses.visuallyHidden)
    this.cartListElement.innerHTML = ''

    cart.forEach(product => {
      this.cartListElement.insertAdjacentHTML('beforeend', this.createCartItem(product))
    })

    if (this.cartTotalElement) {
      const total = this.getCartTotal()
      this.cartTotalElement.textContent = this.formatPrice(total)
    }

    this.toggleCartInfo(cart.length > 0)
    this.addCartEventListeners()
  }

  showEmptyCart() {
    if (!this.isCartPage) {
      return
    }

    if (this.cartListElement) {
      this.cartListElement.innerHTML = `
        <div class="cart__empty" data-test-id="cart-empty">
          <p class="cart__empty-text">Cart is empty</p>
        </div>
      `
    }

    this.toggleCartInfo(false)
  }

  toggleCartInfo(show) {
    const cartInfo = document.querySelector(this.selectors.cartInfo)
    if (cartInfo) {
      cartInfo.style.display = show ? 'flex' : 'none'
    }
  }

  addCartEventListeners() {
    const removeButtons = document.querySelectorAll(this.selectors.cartRemove)
    removeButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const productId = event.target.dataset.productId
        if (productId) {
          this.showRemoveConfirmation(productId)
        }
      })
    })

    if (this.checkoutButtonElement) {
      this.checkoutButtonElement.addEventListener('click', () => {
        this.handleCheckout()
      })
    }
  }

  showRemoveConfirmation(productId) {
    const existingModal = document.querySelector(this.selectors.removeConfirmModal)
    if (existingModal) {
      existingModal.remove()
    }

    const modal = document.createElement('div')
    modal.classList.add(this.stateClasses.modal)
    modal.setAttribute(this.stateAttributes.test, 'remove-confirm-modal')
    modal.setAttribute(this.stateAttributes.role, 'dialog')
    modal.setAttribute(this.stateAttributes.ariaModal, 'true')
    modal.setAttribute(this.stateAttributes.ariaHidden, 'false')

    modal.innerHTML = `
      <div class="modal__overlay"></div>
      <article class="modal__card" data-test-id="modal" tabindex="-1">
        <button class="modal__close" aria-label="Close modal" data-test-id="modal-close">×</button>
        <div class="modal__content">
          <div class="modal__body">
            <h2 class="modal__title">Remove item?</h2>
            <p class="modal__description">Are you sure you want to remove this item from your cart?</p>
            <footer class="modal__footer">
              <button class="modal__button modal__button--confirm" data-js-modal-action="confirm">Yes, remove</button>
              <button class="modal__button modal__button--cancel" data-js-modal-action="cancel">Cancel</button>
            </footer>
          </div>
        </div>
      </article>
    `

    document.body.appendChild(modal)
    modal.classList.add(this.stateClasses.isOpen)
    document.documentElement.classList.add(this.stateClasses.isLock)

    const modalCard = modal.querySelector(this.selectors.modal)
    if (modalCard) {
      modalCard.focus()
    }

    const handleModalClick = (event) => {
      if (event.target.hasAttribute(this.stateAttributes.modalClose) || event.target.closest(this.selectors.modalClose) || event.target.getAttribute(this.stateAttributes.modalAction) === 'cancel') {
        this.closeModal(modal)
      } else if (event.target.getAttribute(this.stateAttributes.modalAction) === 'confirm') {
        this.removeFromCart(productId)
        this.showNotification('Looking for something better?')
        this.closeModal(modal)
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        this.closeModal(modal)
      }
    }

    modal.addEventListener('click', handleModalClick)
    document.addEventListener('keydown', handleKeyDown)

    this.currentModal = modal
    this.currentModalKeyHandler = handleKeyDown
  }

  closeModal(modal) {
    if (!modal) {
      return
    }

    modal.classList.remove(this.stateClasses.isOpen)
    modal.setAttribute(this.stateAttributes.ariaHidden, 'true')
    document.documentElement.classList.remove(this.stateClasses.isLock)

    document.removeEventListener('keydown', this.currentModalKeyHandler)

    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal)
      }
    }, 300)
  }

  showNotification(message) {
    const notificationElement = document.createElement('div')
    notificationElement.classList.add(this.stateClasses.notification)
    notificationElement.textContent = message

    document.body.appendChild(notificationElement)

    setTimeout(() => {
      notificationElement.style.animation = 'notification-slide-out 0.3s ease-out'
      setTimeout(() => {
        if (notificationElement.parentNode) {
          notificationElement.parentNode.removeChild(notificationElement)
        }
      }, 300)
    }, 2000)
  }

  handleCheckout() {
    if (!this.checkoutButtonElement) {
      return
    }

    const userProfile = this.getUserProfile()

    if (!userProfile || !userProfile.name || !userProfile.email) {
      window.location.href = 'profile.html'
      return
    }

    this.checkoutButtonElement.disabled = true
    this.checkoutButtonElement.textContent = 'Processing...'

    const existingCancelButton = document.querySelector(this.selectors.cancelCheckoutButton)
    if (existingCancelButton) {
      existingCancelButton.remove()
    }

    const cancelButton = document.createElement('button')
    cancelButton.classList.add(this.stateClasses.cartCancelButton)
    cancelButton.textContent = 'Cancel'
    cancelButton.setAttribute(this.stateAttributes.test, 'cancel-checkout-button')

    const cartInfo = document.querySelector(this.selectors.cartInfo)
    if (cartInfo) {
      cartInfo.appendChild(cancelButton)
    }

    cancelButton.addEventListener('click', () => {
      this.cancelCheckout()
    })

    this.currentCheckoutTimer = setTimeout(() => {
      this.completeCheckout()
    }, 1500)

    this.currentCancelButton = cancelButton
  }

  cancelCheckout() {
    if (this.currentCheckoutTimer) {
      clearTimeout(this.currentCheckoutTimer)
      this.currentCheckoutTimer = null
    }

    if (this.checkoutButtonElement) {
      this.checkoutButtonElement.disabled = false
      this.checkoutButtonElement.textContent = 'Place order'
    }

    if (this.currentCancelButton) {
      this.currentCancelButton.remove()
      this.currentCancelButton = null
    }
  }

  completeCheckout() {
    if (this.currentCheckoutTimer) {
      clearTimeout(this.currentCheckoutTimer)
      this.currentCheckoutTimer = null
    }

    const userProfile = this.getUserProfile()

    if (!userProfile || !userProfile.name || !userProfile.email) {
      this.showNotification('Please log in to place an order')

      if (this.checkoutButtonElement) {
        this.checkoutButtonElement.disabled = false
        this.checkoutButtonElement.textContent = 'Place order'
      }

      if (this.currentCancelButton) {
        this.currentCancelButton.remove()
        this.currentCancelButton = null
      }

      return
    }

    this.saveOrderToHistory()
    this.saveCart([])
    this.updateCounter()
    this.dispatchChangeEvent()

    if (this.currentCancelButton) {
      this.currentCancelButton.remove()
      this.currentCancelButton = null
    }

    window.location.href = 'history.html'
  }

  saveOrderToHistory() {
    try {
      const cart = this.getCart()
      const total = this.getCartTotal()
      const userProfile = this.getUserProfile()

      if (cart.length === 0) {
        return
      }

      const order = {
        id: `ORD--${Date.now()}`,
        date: new Date().toISOString(),
        items: cart,
        total: total,
        customer: {
          name: userProfile?.name,
          email: userProfile?.email
        }
      }

      const historyStr = localStorage.getItem(this.orderHistoryKey)
      const history = historyStr ? JSON.parse(historyStr) : []

      history.unshift(order)

      localStorage.setItem(this.orderHistoryKey, JSON.stringify(history))

    } catch (error) {
      console.error('Error saving order to history:', error)
    }
  }

  getUserProfile() {
    try {
      const profile = localStorage.getItem(this.userProfileKey)
      return profile ? JSON.parse(profile) : null
    } catch (error) {
      console.error('Error reading user profile:', error)
      return null
    }
  }

  initCartPage() {
    this.renderCart()
    this.updateCheckoutButton()
  }

  updateCheckoutButton() {
    if (!this.checkoutButtonElement) return

    const cart = this.getCart()
    const userProfile = this.getUserProfile()
    const isUserLoggedIn = userProfile && userProfile.name && userProfile.email

    if (cart.length === 0) {
      this.checkoutButtonElement.style.display = 'none'
      const existingCancelButton = document.querySelector('[data-test-id="cancel-checkout-button"]')
      if (existingCancelButton) {
        existingCancelButton.remove()
      }
    } else if (!isUserLoggedIn) {
      this.checkoutButtonElement.textContent = 'Login to place an order'
      this.checkoutButtonElement.disabled = false
      this.checkoutButtonElement.style.display = 'block'

      this.checkoutButtonElement.onclick = () => {
        window.location.href = 'profile.html'
      }

      const existingCancelButton = document.querySelector('[data-test-id="cancel-checkout-button"]')
      if (existingCancelButton) {
        existingCancelButton.remove()
      }
    } else {
      this.checkoutButtonElement.textContent = 'Place order'
      this.checkoutButtonElement.disabled = false
      this.checkoutButtonElement.style.display = 'block'

      this.checkoutButtonElement.onclick = () => {
        this.handleCheckout()
      }
    }
  }

  dispatchChangeEvent() {
    const event = new CustomEvent('change-cart')
    document.dispatchEvent(event)
  }

  bindEvents() {
    document.addEventListener('change-cart', () => {
      this.updateCounter()
      if (this.isCartPage) {
        this.renderCart()
        this.updateCheckoutButton()
      }
    })

    document.addEventListener('DOMContentLoaded', () => {
      this.updateCounter()
      if (this.isCartPage) {
        this.renderCart()
        this.updateCheckoutButton()
      }
    })

    window.addEventListener('storage', (event) => {
      if (event.key === this.storageKey) {
        this.updateCounter()
        if (this.isCartPage) {
          this.renderCart()
          this.updateCheckoutButton()
        }
      }
    })
  }
}

export default Cart
