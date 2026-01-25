class Profile {
  selectors = {
    profileContainer: '[data-test-id="profile"]',
    profileForm: '[data-js-profile-form]',
    nameInput: '[data-test-id="profile-name"]',
    nameInputError: '[data-test-id="profile-name-error"]',
    emailInput: '[data-test-id="profile-email"]',
    emailInputError: '[data-test-id="profile-email-error"]',
    notificationsContainer: '[data-test-id="profile-notifications"]',
    saveButton: '[data-test-id="profile-save"]',
    notification: '[data-test-id="profile-notification"]',
  }
  
  stateAttributes = {
    test: 'data-test-id',
    ariaLive: 'aria-live',
  }
  
  stateClasses = {
    profileError: 'profile__error',
    profileInputError: 'profile__input--error',
    visuallyHidden: 'visually-hidden',
  }

  storageKey = 'userProfile'

  constructor() {
    this.profileContainerElement = document.querySelector(this.selectors.profileContainer)
    this.profileFormElement = this.profileContainerElement.querySelector(this.selectors.profileForm)
    this.nameInputElement = this.profileContainerElement.querySelector(this.selectors.nameInput)
    this.emailInputElement = this.profileContainerElement.querySelector(this.selectors.emailInput)
    this.saveButtonElement = this.profileContainerElement.querySelector(this.selectors.saveButton)
    this.notificationsContainer = document.querySelector(this.selectors.notificationsContainer)
    this.notificationElement = document.querySelector(this.selectors.notification)
    this.notificationsCheckboxElement = this.notificationsContainer
      ? this.notificationsContainer.querySelector('input[type="checkbox"]')
      : null

    this.init()
  }

  init() {
    this.createErrorElements()
    this.loadSavedData()
    this.bindEvents()
  }

  createErrorElements() {
    if (this.nameInputElement) {
      let nameError = this.nameInputElement.parentNode.querySelector(this.selectors.nameInputError)
      if (!nameError) {
        nameError = document.createElement('div')
        nameError.classList.add(this.stateClasses.profileError, this.stateClasses.visuallyHidden)
        nameError.setAttribute(this.stateAttributes.test, 'profile-name-error')
        nameError.setAttribute(this.stateAttributes.ariaLive, 'polite')
        this.nameInputElement.parentNode.appendChild(nameError)
      }
      this.nameErrorElement = nameError
    }

    if (this.emailInputElement) {
      let emailError = this.emailInputElement.parentNode.querySelector(this.selectors.emailInputError)
      if (!emailError) {
        emailError = document.createElement('div')
        emailError.classList.add(this.stateClasses.profileError, this.stateClasses.visuallyHidden)
        emailError.setAttribute(this.stateAttributes.test, 'profile-email-error')
        emailError.setAttribute(this.stateAttributes.ariaLive, 'polite')
        this.emailInputElement.parentNode.appendChild(emailError)
      }
      this.emailErrorElement = emailError
    }
  }

  loadSavedData() {
    try {
      const savedData = localStorage.getItem(this.storageKey)
      if (savedData) {
        const profile = JSON.parse(savedData)

        if (profile.name && this.nameInputElement) {
          this.nameInputElement.value = profile.name
        }
        if (profile.email && this.emailInputElement) {
          this.emailInputElement.value = profile.email
        }
        if (profile.notifications !== undefined && this.notificationsCheckboxElement) {
          this.notificationsCheckboxElement.checked = profile.notifications
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error)
    }
  }

  validateName() {
    const value = this.nameInputElement?.value.trim() || ''

    if (!value) {
      this.showError(this.nameInputElement, this.nameErrorElement, 'Name is required')
      return false
    }

    this.clearError(this.nameInputElement, this.nameErrorElement)
    return true
  }

  validateEmail() {
    const value = this.emailInputElement?.value.trim() || ''

    if (!value) {
      this.showError(this.emailInputElement, this.emailErrorElement, 'E-mail is required')
      return false
    }

    const atIndex = value.indexOf('@')

    if (atIndex === -1 || atIndex === 0 || atIndex === value.length - 1) {
      this.showError(this.emailInputElement, this.emailErrorElement, 'E-mail must contain @')
      return false
    }

    const afterAt = value.substring(atIndex + 1)

    const dotCount = (afterAt.match(/\./g) || []).length

    if (dotCount > 1) {
      this.showError(this.emailInputElement, this.emailErrorElement, 'E-mail format is invalid')
      return false
    }

    if (dotCount === 1) {
      const dotIndex = afterAt.indexOf('.')
      if (dotIndex === 0 || dotIndex === afterAt.length - 1) {
        this.showError(this.emailInputElement, this.emailErrorElement, 'E-mail format is invalid')
        return false
      }
    }

    this.clearError(this.emailInputElement, this.emailErrorElement)
    return true
  }

  showError(inputElement, errorElement, message) {
    if (inputElement) {
      inputElement.classList.add(this.stateClasses.profileInputError)
      inputElement.focus()
    }

    if (errorElement) {
      errorElement.textContent = message
      errorElement.classList.remove(this.stateClasses.visuallyHidden)
    }
  }

  clearError(inputElement, errorElement) {
    if (inputElement) {
      inputElement.classList.remove(this.stateClasses.profileInputError)
    }

    if (errorElement) {
      errorElement.textContent = ''
      errorElement.classList.add(this.stateClasses.visuallyHidden)
    }
  }

  handleSubmit() {
    const isNameValid = this.validateName()
    const isEmailValid = this.validateEmail()

    if (!isNameValid || !isEmailValid) {
      return
    }

    this.saveProfile()
  }

  saveProfile() {
    const profileData = {
      name: this.nameInputElement?.value.trim() || '',
      email: this.emailInputElement?.value.trim() || '',
      notifications: this.notificationsCheckboxElement?.checked || false
    }

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(profileData))
      this.showNotification('Data saved')

      document.dispatchEvent(new CustomEvent('profile-updated', {
        detail: profileData
      }))

    } catch (error) {
      this.showNotification('Error saving data', 'error')
    }
  }

  showNotification(message, type = 'success') {
    if (!this.notificationElement) {
      return
    }

    this.notificationElement.textContent = message

    this.notificationElement.style.backgroundColor = type === 'error'
      ? 'var(--color-error)'
      : 'var(--color-success)'

    this.notificationElement.classList.remove(this.stateClasses.visuallyHidden)

    setTimeout(() => {
      this.notificationElement.classList.add(this.stateClasses.visuallyHidden)
    }, 2000)
  }

  bindEvents() {
    if (this.saveButtonElement) {
      this.profileFormElement.addEventListener('submit', (event) => {
        event.preventDefault()
        this.handleSubmit()
      })
    }

    if (this.nameInputElement) {
      this.nameInputElement.addEventListener('input', () => {
        this.clearError(this.nameInputElement, this.nameErrorElement)
      })
    }

    if (this.emailInputElement) {
      this.emailInputElement.addEventListener('input', () => {
        this.clearError(this.emailInputElement, this.emailErrorElement)
      })
    }
  }
}

export default Profile
