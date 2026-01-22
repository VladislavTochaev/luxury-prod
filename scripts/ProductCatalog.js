class ProductCatalog {
  selectors = {
    productList: '[data-test-id="product-list"]',
  }

  constructor() {
    this.productListElement = document.querySelector(this.selectors.productList)
    this.originalContent = this.productListElement.innerHTML
    this.render()
  }

  async loadProducts() {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      const response = await fetch('/solution/data.json')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.products
    } catch(error) {
      console.log('Error loading products:', error)
    }
  }

  formatPrice(price) {
    const priceNumber = Number(price)

    if (isNaN(priceNumber)) {
      return `$${price}`
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(priceNumber)
  }

  createProductCard(product) {
    return `
      <li class="products__item">
        <article class="product-card product-card--grid">
          <div class="product-card__media">
            <img
              class="product-card__image"
              src="${product.image}"
              alt="${product.title}"
              loading="lazy"
            />
          </div>
          <div class="product-card__body">
            <h3 class="product-card__category">${product.type}</h3>
            <p class="product-card__title">${product.title}</p>
            <span class="product-card__price">${this.formatPrice(product.price)}</span>
          </div>
        </article>
      </li>
    `
  }

  createErrorState() {
    return `
      <li class="products__item products__item--error">
        <div class="error-state">
          <svg class="error-state__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="error-state__title">Failed to load products</h3>
          <p class="error-state__message">Please try again later or check your connection.</p>
          <button 
            class="error-state__button product-card__button" 
            onclick="window.location.reload()"
            type="button"
          >
            Try Again
          </button>
        </div>
      </li>
    `
  }

  async render() {
    try {
      const products = await this.loadProducts()

      if (products && products.length > 0) {
        const productCards = products.map((product) => this.createProductCard(product)).join('')
        this.productListElement.innerHTML = productCards
      } else {
        this.productListElement.innerHTML = this.createErrorState()
      }
    } catch (error) {
      console.log('Render error:', error)
      this.productListElement.innerHTML = this.createErrorState()
    }
  }
}

export default ProductCatalog
