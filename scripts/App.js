import ThemeSwitcher from './ThemeSwitcher.js'
import ProductCatalog from './ProductCatalog.js'
import Modal from './Modal.js'
import Cart from './Cart.js'
import Profile from './Profile.js'
import History from './History.js'

new ThemeSwitcher()
new Modal()
new Cart()

if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
  new ProductCatalog()
}

if (window.location.pathname.includes('profile.html')) {
  new Profile()
}

if (window.location.pathname.includes('history.html')) {
  new History()
}
