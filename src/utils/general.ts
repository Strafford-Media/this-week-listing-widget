export const copyText = async (text: string) => {
  try {
    return navigator.clipboard.writeText(text)
  } catch (e) {
    const currentActiveElement = document.activeElement as HTMLElement
    const ta = document.createElement('textarea')
    ta.style.position = 'fixed'
    ta.style.top = '-9999px'
    ta.style.left = '-9999px'
    ta.style.opacity = '0'

    document.body.append(ta)

    ta.value = text
    ta.focus()
    ta.select()

    try {
      document.execCommand('copy')
      document.body.removeChild(ta)
      currentActiveElement.focus()
    } catch (err) {
      console.error('Sorry, unable to copy on this browser')
      throw new Error('This browser does not allow copying right now')
    }
  }
}
