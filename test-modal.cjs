// Test the MultiImportModal by loading the deployed page
const { chromium } = require('playwright')

;(async () => {
  const browser = await chromium.launch({ headless: true })
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
  const page = await ctx.newPage()

  page.on('console', msg => console.log('[console]', msg.type(), msg.text()))
  page.on('pageerror', err => console.log('[pageerror]', err.message))

  await page.goto('https://fenglaoban173.github.io/CRM-app/#/m/1563', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)

  console.log('--- after load ---')
  console.log('URL:', page.url())
  console.log('title:', await page.title())

  const buttonText = await page.locator('button:has-text("多开户导入")').count()
  console.log('Found "多开户导入" button count:', buttonText)

  if (buttonText > 0) {
    await page.locator('button:has-text("多开户导入")').click()
    await page.waitForTimeout(800)
    console.log('--- after click ---')

    // Check for modal
    const modalTitle = await page.locator('h3:has-text("多开户导入")').count()
    console.log('Modal title count:', modalTitle)

    const overlayCount = await page.locator('.bg-black\\/40').count()
    console.log('Overlay (bg-black/40) count:', overlayCount)

    const bodyHTML = await page.evaluate(() => document.body.innerHTML.length)
    console.log('Body HTML length:', bodyHTML)

    // Screenshot
    await page.screenshot({ path: 'C:/tmp/modal-test.png' })
    console.log('Screenshot saved')
  } else {
    // Dump some visible content
    const visibleButtons = await page.locator('button').allTextContents()
    console.log('Visible buttons:', visibleButtons.slice(0, 20))
  }

  await browser.close()
})()
