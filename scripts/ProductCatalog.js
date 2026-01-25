class ProductCatalog {
  selectors = {
    productList: '[data-test-id="product-list"]',
    productCard: '[data-test-id="product-card"]',
    searchInput: '#search-products',
    searchSuggestions: '[data-test-id="search-suggestions"]',
    filterInputs: '[name="category"]',
    filterOption: '[data-test-id="filter"]',
    suggestionItem: '[data-test-id="suggestion-item"]',
  }

  stateClasses = {
    searchSuggestions: 'search-suggestions',
    searchSuggestionsLoading: 'search-suggestions__loading',
    searchSuggestionsItem: 'search-suggestions__item',
  }

  stateAttributes = {
    test: 'data-test-id',
    productId: 'data-product-id',
  }

  storageKey = 'products'
  suggestionTimeout = null

  constructor() {
    this.productListElement = document.querySelector(this.selectors.productList)
    this.searchInputElement = document.querySelector(this.selectors.searchInput)
    this.filterInputElements = document.querySelectorAll(this.selectors.filterInputs)
    this.products = []
    this.filteredProducts = []

    this.init()
  }

  async init() {
    this.bindEvents()
    this.restoreFiltersFromURL()
    await this.loadProducts()
  }

  async loadProducts() {
    const cachedData = this.getProductsFromLocalStorage()

    if (cachedData && cachedData.length > 0) {
      this.products = cachedData
      this.renderProducts()
      return
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      const response = await fetch('/data.json')

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      this.products = data.products || []

      this.saveProductsToLocalStorage(this.products)
      this.renderProducts()
    } catch(error) {
      console.log('Error loading products:', error)
      this.showErrorState()
    }
  }

  getProductsFromLocalStorage() {
    try {
      const data = localStorage.getItem(this.storageKey)
      if (!data) {
        return null
      }

      const products = JSON.parse(data)
      return Array.isArray(products) && products.length > 0 ? products : null
    } catch (error) {
      console.log('Error loading products from local storage')
      return null
    }
  }

  saveProductsToLocalStorage(products) {
    localStorage.setItem(this.storageKey, JSON.stringify(products))
  }

  getOrderHistory() {
    try {
      const history = localStorage.getItem('orderHistory')
      return history ? JSON.parse(history) : []
    } catch (error) {
      return []
    }
  }

  getBoughtProductIds() {
    const history = this.getOrderHistory()
    const boughtIds = new Set()

    history.forEach((order) => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          boughtIds.add(item.id)
        })
      }
    })

    return boughtIds
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
    const boughtProductIds = this.getBoughtProductIds()
    const isBought = boughtProductIds.has(product.id)
    const productType = product.type.toUpperCase()

    return `
    <li class="products__item">
      <article class="product-card product-card--grid ${isBought ? 'product-card--bought' : ''}"
        data-product-id="${product.id}" 
        data-test-id="product-card"
      >
        <div class="product-card__media">
          <img
            class="product-card__image"
            src="${product.image}"
            alt="${product.title}"
            loading="lazy"
          />
          ${isBought ? '<span class="product-card__bought-label">BOUGHT</span>' : ''}
        </div>
        <div class="product-card__body">
          <h3 class="product-card__category" data-test-id="product-type">${productType}</h3>
          <p class="product-card__title" data-test-id="product-title">${product.title}</p>
          <span class="product-card__price" data-test-id="product-price">${this.formatPrice(product.price)}</span>
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

  renderProducts() {
    if (!this.productListElement) {
      return
    }

    if (!this.products || this.products.length === 0) {
      this.showErrorState()
      return
    }

    this.productListElement.innerHTML = ''

    this.applyFilters()

    if (this.filteredProducts.length === 0) {
      return
    }

    const productCards = this.filteredProducts.map(product => this.createProductCard(product)).join('')
    this.productListElement.innerHTML = productCards
  }

  showErrorState() {
    if (this.productListElement) {
      this.productListElement.innerHTML = this.createErrorState()
    }
  }

  getSelectedFilters() {
    const selectedFilters = []
    this.filterInputElements.forEach(input => {
      if (input.checked) {
        selectedFilters.push(input.value.toLowerCase())
      }
    })
    return selectedFilters
  }

  applyFilters() {
    if (!this.products || this.products.length === 0) {
      return
    }

    const searchTerm = this.searchInputElement ? this.searchInputElement.value.toLowerCase() : ''
    const selectedFilters = this.getSelectedFilters()

    this.filteredProducts = this.products.filter((product) => {
      const matchesSearch = !searchTerm ||
        product.title.toLowerCase().includes(searchTerm)

      const matchesCategory = selectedFilters.length === 0 ||
        selectedFilters.includes(product.type.toLowerCase())

      return matchesSearch && matchesCategory
    })
  }

  updateURL() {
    const searchTerm = this.searchInputElement ? this.searchInputElement.value : ''
    const selectedFilters = this.getSelectedFilters()

    const params = new URLSearchParams()

    if (searchTerm) {
      params.set('search', searchTerm)
    }

    if (selectedFilters.length > 0) {
      params.set('filters', selectedFilters.join(','))
    }

    const queryString = params.toString()
    const newURL = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname

    window.history.replaceState({}, '', newURL)
  }

  restoreFiltersFromURL() {
    const params = new URLSearchParams(window.location.search)
    const searchTerm = params.get('search')
    const filtersParam = params.get('filters')

    if (searchTerm && this.searchInputElement) {
      this.searchInputElement.value = searchTerm
    }

    if (filtersParam) {
      const filters = filtersParam.split(',')
      this.filterInputElements.forEach((inputElement) => {
        inputElement.checked = filters.includes(inputElement.value.toLowerCase())
      })
    }
  }

  getSearchSuggestions(searchTerm) {
    if (!searchTerm || !this.products) {
      return []
    }

    const suggestions = this.products
      .filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.title.localeCompare(b.title))
      .slice(0, 3)

    return suggestions
  }

  showSearchSuggestions(suggestions) {
    this.removeSearchSuggestions()

    if (suggestions.length === 0) {
      return
    }

    const suggestionsContainer = document.createElement('div')
    suggestionsContainer.classList.add(this.stateClasses.searchSuggestions)
    suggestionsContainer.setAttribute(this.stateAttributes.test, 'search-suggestions')

    suggestions.forEach(product => {
      const suggestionItem = document.createElement('div')
      suggestionItem.classList.add(this.stateClasses.searchSuggestionsItem)
      suggestionItem.setAttribute(this.stateAttributes.test, 'suggestion-item')
      suggestionItem.setAttribute(this.stateAttributes.productId, product.id)
      suggestionItem.textContent = product.title
      suggestionsContainer.appendChild(suggestionItem)
    })

    if (this.searchInputElement && this.searchInputElement.parentNode) {
      const parent = this.searchInputElement.parentNode
      parent.style.position = 'relative'
      parent.appendChild(suggestionsContainer)
    }
  }

  removeSearchSuggestions() {
    const existingSuggestions = document.querySelector(this.selectors.searchSuggestions)
    if (existingSuggestions) {
      existingSuggestions.remove()
    }
  }

  handleSearchInput() {
    if (this.suggestionTimeout) {
      clearTimeout(this.suggestionTimeout)
    }

    const searchTerm = this.searchInputElement.value

    if (!searchTerm) {
      this.removeSearchSuggestions()
      this.applyFilters()
      this.renderProducts()
      this.updateURL()
      return
    }

    const loadingItem = document.createElement('div')
    loadingItem.classList.add(this.stateClasses.searchSuggestionsLoading)
    loadingItem.textContent = 'Loading...'

    const suggestionsContainer = document.createElement('div')
    suggestionsContainer.classList.add(this.stateClasses.searchSuggestions)
    suggestionsContainer.setAttribute(this.stateAttributes.test, 'search-suggestions')
    suggestionsContainer.appendChild(loadingItem)

    this.removeSearchSuggestions()

    if (this.searchInputElement && this.searchInputElement.parentNode) {
      const parent = this.searchInputElement.parentNode
      parent.style.position = 'relative'
      parent.appendChild(suggestionsContainer)
    }

    this.suggestionTimeout = setTimeout(() => {
      const suggestions = this.getSearchSuggestions(searchTerm)

      if (suggestions.length > 0) {
        this.showSearchSuggestions(suggestions)
      } else {
        this.removeSearchSuggestions()
      }
    }, 1500)
  }

  handleSuggestionClick(productId) {
    const product = this.products.find(p => p.id === productId)
    if (!product) {
      return
    }

    this.filterInputElements.forEach(input => {
      input.checked = false
    })

    if (this.searchInputElement) {
      this.searchInputElement.value = product.title
    }

    this.removeSearchSuggestions()

    this.applyFilters()
    this.renderProducts()
    this.updateURL()


    const boughtProductIds = this.getBoughtProductIds()
    if (!boughtProductIds.has(productId)) {
      const modalEvent = new CustomEvent('open-modal', {
        detail: product,
        bubbles: true,
      })
      document.dispatchEvent(modalEvent)
    }
  }

  handleSearchKeyDown(event) {
    if (event.key === 'Enter') {
      this.removeSearchSuggestions()
      this.applyFilters()
      this.renderProducts()
      this.updateURL()
    }
  }

  onProductCardClick(event) {
    const cardElement = event.target.closest(this.selectors.productCard)

    if (cardElement) {
      const productId = cardElement.dataset.productId
      const boughtProductIds = this.getBoughtProductIds()

      if (boughtProductIds.has(productId)) {
        return
      }

      const clickedProduct = this.products.find((product) => product.id === productId)

      if (clickedProduct) {
        const modalEvent = new CustomEvent('open-modal', {
          detail: clickedProduct,
          bubbles: true,
        })
        document.dispatchEvent(modalEvent)
      }
    }
  }

  bindEvents() {
    if (this.productListElement) {
      this.productListElement.addEventListener('click', (event) => this.onProductCardClick(event))
    }

    if (this.searchInputElement) {
      this.searchInputElement.addEventListener('input', () => this.handleSearchInput())
      this.searchInputElement.addEventListener('keydown', (event) => this.handleSearchKeyDown(event))
      this.searchInputElement.addEventListener('blur', () => {
        setTimeout(() => this.removeSearchSuggestions(), 100)
      })
    }

    if (this.filterInputElements.length > 0) {
      this.filterInputElements.forEach(inputElement => {
        inputElement.addEventListener('change', () => {
          this.applyFilters()
          this.renderProducts()
          this.updateURL()
        })
      })
    }

    document.addEventListener('click', (event) => {
      const suggestionItem = event.target.closest(this.selectors.suggestionItem)
      if (suggestionItem) {
        event.preventDefault()
        const productId = suggestionItem.dataset.productId
        this.handleSuggestionClick(productId)
      }
    })


    document.addEventListener('click', (event) => {
      if (!event.target.closest('.search-suggestions') &&
        event.target !== this.searchInputElement) {
        this.removeSearchSuggestions()
      }
    })
  }
}

export default ProductCatalog
