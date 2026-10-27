import { click, gotoURL, hover } from 'utils/action-utils';
import {
  expectElementToBeChecked,
  expectElementToBeVisible,
  expectElementToContainText,
  expectElementToHaveValue,
  expectPageToHaveURL,
} from 'utils/assert-utils';
import { getText } from 'utils/element-utils';
import { getLocator } from 'utils/locator-utils';
import { getPage } from 'utils/page-utils';
import { BIG_TIMEOUT, MAX_TIMEOUT, SMALL_TIMEOUT } from 'utils/timeout-constants';

const HOME_URL = 'https://komfort.pl/';
const longWait = { timeout: BIG_TIMEOUT };

// Homepage category card. The top menu uses a different link (`klink=menu`).
const tilesInCategories = () => getLocator('a[href="/st/plytki?klink=homepage"]');
const mosaicsTile = () => getLocator('a[href="/k/mozaiki"]').filter({ hasText: 'Mozaiki' }).first();
// "Białe" on the tile color filter. A second filter is also labeled Kolor, but its option is "Biała".
const whiteColor = () => getLocator('label[for="kolor_plytki-biale"]');
const whiteColorInput = () => getLocator('#kolor_plytki-biale');
const firstProduct = () => getLocator('.product-card-item').first();
const increaseQuantity = () => getLocator('button[aria-label="Zwiększ ilość"]').first();
const quantityLabel = () => increaseQuantity().locator('xpath=preceding-sibling::*[1]');
const addToCartButton = () => getLocator('[data-testid="productpage-addtobasket"]').first();
const cartQuantity = () => getLocator('[data-testid="qty-input"]').first();

/**
 * Opens komfort.pl and accepts the cookie banner when it is shown.
 */
export async function openHomeAndAcceptCookies(): Promise<void> {
  await gotoURL(HOME_URL, { timeout: MAX_TIMEOUT });
  const allowAll = getLocator('#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll');
  const shown = await allowAll
    .waitFor({ state: 'visible', timeout: SMALL_TIMEOUT })
    .then(() => true)
    .catch(() => false);
  if (shown) {
    await click(allowAll, longWait);
  }
}

/**
 * Opens Płytki from the Kategorie section on the home page.
 */
export async function openTilesFromCategories(): Promise<void> {
  await click(tilesInCategories(), longWait);
  await getPage().waitForURL(/\/st\/plytki/, longWait);
}

/**
 * Chooses Mozaiki on the tiles page.
 */
export async function chooseMosaics(): Promise<void> {
  await click(mosaicsTile(), longWait);
  await getPage().waitForURL(/\/k\/mozaiki/, longWait);
}

/**
 * Selects Kolor: Białe and waits until the filtered listing is shown.
 */
export async function filterByWhiteColor(): Promise<void> {
  await click(whiteColor(), longWait);
  await getPage().waitForURL(/kolor_plytki=biale/, longWait);
  await expectElementToBeChecked(whiteColorInput(), longWait);
  await expectElementToBeVisible(firstProduct(), longWait);
}

/**
 * Hovers the first filtered product and opens it with Sprawdź.
 * @returns The product title from the listing card.
 */
export async function openFirstProduct(): Promise<string> {
  const title = firstProduct().locator('h3.product-title').first();
  const name = (await getText(title, longWait)).replace(/\s+/g, ' ').trim();
  await hover(firstProduct().locator('.group').first(), longWait);
  await click(firstProduct().getByRole('button', { name: /sprawdź/i }), longWait);
  await getPage().waitForURL(/\/p\//, longWait);
  return name;
}

/**
 * Clicks "+" the given number of times. Quantity starts at 1.
 * @param times - How many times to press the increase button.
 */
export async function increaseQuantityBy(times: number): Promise<void> {
  for (let added = 1; added <= times; added += 1) {
    await click(increaseQuantity(), longWait);
    await expectElementToContainText(quantityLabel(), new RegExp(`${1 + added}\\s*szt`), longWait);
  }
}

/**
 * Adds the current product to the cart.
 */
export async function addProductToCart(): Promise<void> {
  await click(addToCartButton(), longWait);
  await expectElementToContainText(getLocator('body'), 'Produkt dodano do koszyka', longWait);
}

/**
 * Opens Koszyk from the confirmation dialog.
 */
export async function goToCart(): Promise<void> {
  const proceed = getLocator('a, button').filter({ hasText: 'Przejdź do koszyka' }).first();
  await click(proceed, longWait);
  await getPage().waitForURL(/\/cart/, longWait);
}

/**
 * Checks that Koszyk contains the product once, at the expected quantity.
 * @param productName - Title captured from the listing.
 * @param quantity - Expected cart quantity.
 */
export async function verifyCart(productName: string, quantity: string): Promise<void> {
  await expectPageToHaveURL(/\/cart/, longWait);
  await expectElementToContainText(getLocator('body'), 'Twój koszyk', longWait);
  await expectElementToContainText(getLocator('body'), productName, longWait);
  await expectElementToContainText(getLocator('body'), /Produkty w koszyku \(1\)/, longWait);
  await expectElementToHaveValue(cartQuantity(), quantity, longWait);
}
