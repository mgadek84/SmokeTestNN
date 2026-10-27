import { test } from 'setup/page-setup';
import * as Komfort from '../pages/preferred-pom/komfort-page';

test.describe('Komfort smoke', () => {
  test('adds the first white mosaic to the cart @smoke', async () => {
    test.setTimeout(3 * 60 * 1000);

    await Komfort.openHomeAndAcceptCookies();
    await Komfort.openTilesFromCategories();
    await Komfort.chooseMosaics();
    await Komfort.filterByWhiteColor();
    const productName = await Komfort.openFirstProduct();
    await Komfort.increaseQuantityBy(4);
    await Komfort.addProductToCart();
    await Komfort.goToCart();
    await Komfort.verifyCart(productName, '5');
  });
});
