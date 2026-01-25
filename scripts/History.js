class History {
  selectors = {
    historyContent: '[data-js-history-content]',
    historyTitle: '[data-test-id="history-title"]',
  }

  storageKey = 'orderHistory'

  constructor() {
    this.historyContentElement = document.querySelector(this.selectors.historyContent)
    this.init()
  }

  init() {
    this.renderHistory()
    this.bindEvents()
  }

  getHistory() {
    try {
      const history = localStorage.getItem(this.storageKey)
      return history ? JSON.parse(history) : []
    } catch (error) {
      console.error('Error reading order history:', error)
      return []
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

  formatDate(dateString) {
    const date = new Date(dateString)

    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }

    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()

    return `${day}.${month}.${year}`
  }

  createEmptyHistory() {
    return `
      <div class="history__empty" data-test-id="orders-empty">
        <h2 class="history__empty-title">Order history is empty</h2>
      </div>
    `
  }

  createOrderItem(order) {
    const total = this.calculateOrderTotal(order)
    const formattedDate = this.formatDate(order.date)

    const productsHtml = order.items?.map(item => `
    <span class="history__product-chip">
      ${item.title || 'Product'}
    </span>
  `).join('') || ''

    return `
    <article class="history__item" data-test-id="orders-item">
      <header class="history__header">
        <div>
          <h2 class="history__order-number">
            Order ${order.id || `ORD-${Date.now()}`}
          </h2>
          <time class="history__date">${formattedDate}</time>
        </div>
      </header>

      <div class="history__products">
        ${productsHtml}
      </div>

      <footer class="history__footer">
        <span class="history__total-amount">Total: ${this.formatPrice(total)}</span>
      </footer>
    </article>
  `
  }

  calculateOrderTotal(order) {
    if (order.total !== undefined) {
      return order.total
    }

    if (!order.items || !Array.isArray(order.items)) {
      return 0
    }

    return order.items.reduce((sum, item) => {
      const price = typeof item.price === 'number' ? item.price : Number(item.price) || 0
      return sum + price
    }, 0)
  }

  renderHistory() {
    if (!this.historyContentElement) {
      return
    }

    const history = this.getHistory()

    if (!history || history.length === 0) {
      this.historyContentElement.innerHTML = this.createEmptyHistory()
      return
    }

    const sortedHistory = [...history].sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime()
      const dateB = new Date(b.date || 0).getTime()
      return dateB - dateA
    })

    const ordersHtml = sortedHistory.map(order => this.createOrderItem(order)).join('')

    this.historyContentElement.innerHTML = `
      <div class="history__list" data-test-id="orders-list">
        ${ordersHtml}
      </div>
    `
  }

  bindEvents() {
    window.addEventListener('storage', (event) => {
      if (event.key === this.storageKey) {
        this.renderHistory()
      }
    })

    document.addEventListener('DOMContentLoaded', () => {
      this.renderHistory()
    })
  }
}

export default History
