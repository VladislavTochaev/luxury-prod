class Modal {
  selectors = {
    modal: '[data-test-id="modal"]',
    modalCard: '[data-js-modal-card]',
    closeModal: '[data-test-id="close-modal"]',
    modalTitle: '[data-test-id="modal-title"]',
    modalDescription: '[data-test-id="modal-description"]',
    modalPrice: '[data-test-id="modal-price"]',
    modalImage: '[data-js-modal-image]',
    modalCategory: '[data-js-modal-category]',
    addToCartButton: '[data-test-id="add-to-cart"]',
  }

  stateAttributes = {
    ariaHidden: 'aria-hidden',
    closeModal: 'data-close-modal',
  }

  stateClasses = {
    isOpen: 'modal--open',
    isLock: 'is-lock',
  }

  storageKey = 'cart'
  notificationDuration = 2000

  constructor() {
    this.modalElement = this.createModal()
    this.addToCartButtonElement = this.modalElement.querySelector(this.selectors.addToCartButton)
    this.currentProduct = null
    this.bindEvents()
  }

  createModal() {
    const modalHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-hidden="true" data-test-id="modal">
        <div class="modal__overlay"></div>
        <article class="modal__card" data-js-modal-card tabindex="-1">
          <button class="modal__close" aria-label="Close modal" data-close-modal data-test-id="close-modal">
            ×
          </button>
          <div class="modal__content">
            <img class="modal__image" data-js-modal-image src="" alt="">
            <div class="modal__body">
              <header class="modal__header">
                <h2 class="modal__title" data-test-id="modal-title" id="modal-title"></h2>
                <span class="modal__category" data-js-modal-category></span>
              </header>
              <div class="modal__description" data-test-id="modal-description">
                <p></p>
              </div>
              <footer class="modal__footer">
                <span class="modal__price" data-test-id="modal-price"></span>
                <button class="modal__button" data-test-id="add-to-cart">Add to cart</button>
              </footer>
            </div>
          </div>
        </article>
      </div>
    `

    document.body.insertAdjacentHTML('beforeend', modalHTML)
    return document.querySelector(this.selectors.modal)
  }

  showModal = (event) => {
    const product = event.detail

    if (!product) {
      return
    }

    this.currentProduct = product
    this.fillModal(product)
    this.updateButtonState()
    this.open()
  }

  fillModal(product) {
    const elements = {
      title: this.modalElement.querySelector(this.selectors.modalTitle),
      category: this.modalElement.querySelector(this.selectors.modalCategory),
      description: this.modalElement.querySelector(`${this.selectors.modalDescription} p`),
      price: this.modalElement.querySelector(this.selectors.modalPrice),
      image: this.modalElement.querySelector(this.selectors.modalImage)
    }

    if (elements.title) {
      elements.title.textContent = product.title || ''
    }
    if (elements.category) {
      elements.category.textContent = product.type || ''
    }
    if (elements.description) {
      elements.description.textContent = product.description || ''
    }
    if (elements.price) {
      elements.price.textContent = this.formatPrice(product.price)
    }
    if (elements.image) {
      elements.image.src = product.image || ''
      elements.image.alt = product.title || 'Product image'
    }
  }

  formatPrice(price) {
    if (!price && price !== 0) return '$0'

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  isProductInCart(productId) {
    const cart = this.getCart()
    return cart.some((item) => item.id === productId)
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

  addToCart(product) {
    const cart = this.getCart()

    if (!cart.some(item => item.id === product.id)) {
      cart.push({...product})
      this.saveCart(cart)
    }
  }

  removeFromCart(productId) {
    const cart = this.getCart()
    const newCart = cart.filter(item => item.id !== productId)

    if (newCart.length !== cart.length) {
      this.saveCart(newCart)
    }
  }

  updateButtonState() {
    const buttonElement = this.modalElement.querySelector(this.selectors.addToCartButton)
    if (!buttonElement || !this.currentProduct) {
      return
    }

    const isInCart = this.isProductInCart(this.currentProduct.id)

    if (isInCart) {
      buttonElement.textContent = 'Remove from cart'
      buttonElement.dataset.state = 'remove'
    } else {
      buttonElement.textContent = 'Add to cart'
      buttonElement.dataset.state = 'add'
    }

    buttonElement.disabled = false
  }

  onAddToCartClick = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    if (!this.currentProduct) {
      return
    }

    const buttonElement = event.target
    const isInCart = this.isProductInCart(this.currentProduct.id)

    buttonElement.disabled = true

    if (isInCart) {
      buttonElement.textContent = 'Removed'
      this.removeFromCart(this.currentProduct.id)
      this.showNotification('Looking for something better?')

      await new Promise(resolve => setTimeout(resolve, this.notificationDuration))
      
      buttonElement.textContent = 'Add to cart'
      buttonElement.dataset.state = 'add'
    } else {
      buttonElement.textContent = 'Added'
      this.addToCart(this.currentProduct)
      this.showNotification('Great choice!')

      await new Promise(resolve => setTimeout(resolve, this.notificationDuration))

      buttonElement.textContent = 'Remove from cart'
      buttonElement.dataset.state = 'remove'
    }

    buttonElement.disabled = false
    const changeCartEvent = new CustomEvent('change-cart', {
      detail: {
        cart: this.getCart(),
        count: this.getCart().length,
        productId: this.currentProduct.id,
        action: isInCart ? 'remove' : 'add'
      }
    })
    document.dispatchEvent(changeCartEvent)
  }

  showNotification(message) {
    const notification = document.createElement('div')
    notification.className = 'notification'
    notification.textContent = message

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.animation = 'notification-slide-out 0.3s ease-out'
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification)
        }
      }, 300)
    }, this.notificationDuration)
  }

  open() {
    this.modalElement.classList.add(this.stateClasses.isOpen)
    this.modalElement.setAttribute(this.stateAttributes.ariaHidden, 'false')
    document.documentElement.classList.add(this.stateClasses.isLock)

    const modalCard = this.modalElement.querySelector(this.selectors.modalCard)

    if (modalCard) {
      modalCard.focus()
    }
  }

  close = () => {
    this.modalElement.classList.remove(this.stateClasses.isOpen)
    this.modalElement.setAttribute(this.stateAttributes.ariaHidden, 'true')
    document.documentElement.classList.remove(this.stateClasses.isLock)
  }

  onKeyDown = (event) => {
    if (event.key === 'Escape' && this.modalElement && this.modalElement.classList.contains(this.stateClasses.isOpen)) {
      this.close()
    }
  }

  bindEvents() {
    document.addEventListener('open-modal', this.showModal)
    document.addEventListener('click', (event) => {
      if (this.modalElement &&
        this.modalElement.classList.contains(this.stateClasses.isOpen) &&
        (event.target.hasAttribute(this.stateAttributes.closeModal) ||
          event.target.closest(`[${this.stateAttributes.closeModal}]`))) {
        this.close()
      }
    })
    document.addEventListener('keydown', this.onKeyDown)
    this.addToCartButtonElement.addEventListener('click', this.onAddToCartClick)
  }
}

export default Modal
