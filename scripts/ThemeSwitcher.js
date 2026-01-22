class ThemeSwitcher {
  selectors = {
    switchThemeButton: '[data-test-id="theme-toggle"]',
    sunIcon: '[data-js-sun-icon]',
    moonIcon: '[data-js-moon-icon]',
  }

  themes = {
    dark: 'dark',
    light: 'light',
  }

  stateClasses = {
    isDarkTheme: 'dark-theme',
    themeSwitching: 'theme-switching',
  }

  storageKey = 'theme'

  constructor() {
    this.switchThemeButtonElement = document.querySelector(this.selectors.switchThemeButton)
    this.sunIcon = this.switchThemeButtonElement.querySelector(this.selectors.sunIcon)
    this.moonIcon = this.switchThemeButtonElement.querySelector(this.selectors.moonIcon)
    this.setInitialTheme()
    this.bindEvents()
  }

  get isDarkThemeCached() {
    return localStorage.getItem(this.storageKey) === this.themes.dark
  }

  setInitialTheme() {
    document.documentElement.classList.toggle(
      this.stateClasses.isDarkTheme,
      this.isDarkThemeCached
    )

    this.animateIcons(this.isDarkThemeCached)
  }

  onClick = () => {
    localStorage.setItem(
      this.storageKey,
      this.isDarkThemeCached ? this.themes.light : this.themes.dark
    )

    document.documentElement.classList.toggle(this.stateClasses.isDarkTheme)
    this.animateIcons(!this.isDarkThemeCached)
  }

  animateIcons(isDark) {
    this.switchThemeButtonElement.classList.add(this.stateClasses.themeSwitching)

    setTimeout(() => {
      this.switchThemeButtonElement.classList.remove(this.stateClasses.themeSwitching)
    }, 300)
  }

  bindEvents() {
    this.switchThemeButtonElement.addEventListener('click', this.onClick)
  }
}

export default ThemeSwitcher
