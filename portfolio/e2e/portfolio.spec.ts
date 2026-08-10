import { test, expect, type Page } from '@playwright/test'

/**
 * Guards the things a type-check cannot catch: missing translation keys,
 * runtime render errors, layout overflow, and whether the interactive
 * visualisations actually respond.
 */

const SECTION_IDS = ['top', 'about', 'experience', 'work', 'skills', 'awards', 'contact']

/** Untranslated keys leak into the DOM as their raw dot-path. */
const RAW_KEY_PATTERN =
  /\b(?:nav|hero|availability|about|projects|skills|certifications|awards|contact|footer|stats|experience|theme|a11y)\.[a-zA-Z0-9.]+/

function collectPageProblems(page: Page): string[] {
  const problems: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') {
      problems.push(`[${message.type()}] ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => problems.push(`[pageerror] ${error.message}`))
  return problems
}

test('renders every section without console errors', async ({ page }) => {
  const problems = collectPageProblems(page)

  await page.goto('/')
  await expect(page.locator('h1')).toBeVisible()

  for (const id of SECTION_IDS) {
    await expect(page.locator(`section#${id}`)).toHaveCount(1)
  }

  expect(problems).toEqual([])
})

test('every visible string is translated', async ({ page }) => {
  await page.goto('/')

  const body = (await page.textContent('body')) ?? ''
  expect(body).not.toMatch(RAW_KEY_PATTERN)

  // And again after switching locale. Asserted on script rather than on a
  // specific string: what matters is that the toggle swapped the language,
  // and pinning the headline copy makes every wording change a test failure.
  //
  // Addressed by test id, not by position: this used to take the first
  // `button[aria-label]` in the header, so adding the theme control ahead of it
  // silently retargeted the click and the locale never changed.
  await page.getByTestId('locale-toggle').click()
  await expect(page.locator('h1')).toHaveText(/[一-鿿]/)

  const zhBody = (await page.textContent('body')) ?? ''
  expect(zhBody).not.toMatch(RAW_KEY_PATTERN)
})

test('states availability above the fold, in both locales', async ({ page }) => {
  await page.goto('/')

  // The site's purpose is a job search: losing this status is a silent
  // regression that nothing else in the suite would notice.
  await expect(page.getByText('Open to work').first()).toBeVisible()

  await page.getByTestId('locale-toggle').click()
  await expect(page.getByText('開放新機會').first()).toBeVisible()
})

test('page never scrolls horizontally', async ({ page }) => {
  await page.goto('/')

  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  )
  expect(overflows).toBe(false)
})

test('lists all six selected projects', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('article')).toHaveCount(6)
})

test('intervening on a cause lowers the predicted risk', async ({ page }) => {
  await page.goto('/')

  const readout = page.locator('figure').first().locator('.h-display')
  await expect(readout).toContainText('0.95')

  await page.locator('g[role="button"]').first().click()

  // Cutting a cause must strictly reduce the downstream score.
  await expect(readout).not.toContainText('0.95')
  await expect(readout).toContainText('-')
})

test('attribution chart reorders when switching to correlation', async ({ page }) => {
  await page.goto('/')

  const chart = page.locator('article').first()
  const firstBarLabel = chart.locator('svg text').first()

  await expect(firstBarLabel).toHaveText('transfer ring')

  await chart.getByRole('button', { name: 'correlation' }).click()
  await expect(firstBarLabel).toHaveText('shared wallet')
})
