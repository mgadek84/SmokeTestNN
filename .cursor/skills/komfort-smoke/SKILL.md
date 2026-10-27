---
name: komfort-smoke
description: Run or update the single komfort.pl smoke test in this Playwright TypeScript repo. Use when the task is the Komfort cart smoke flow, its locators, or running that one test.
---

# Komfort smoke

One test only: `tests/specs/komfort-smoke.spec.ts`. Do not repair or run the other specs unless asked.

## Flow

1. Open https://komfort.pl/ and accept cookies (`Zezwól na wszystkie`).
2. Click **Płytki** in the Kategorie section: `a[href="/st/plytki?klink=homepage"]`. Not the top menu.
3. Choose **Mozaiki**: `a[href="/k/mozaiki"]`.
4. In filters, check **Kolor** **Białe**: `label[for="kolor_plytki-biale"]`. Skip the other Kolor option **Biała**.
5. Hover the first `.product-card-item` and click **Sprawdź**.
6. Click **Zwiększ ilość** four times. Quantity starts at 1, so the cart must show 5. Then **Dodaj do koszyka**.
7. In the confirmation dialog, click **Przejdź do koszyka**.
8. On `/cart`, check the product name, "Twój koszyk", "Produkty w koszyku (1)", and `[data-testid="qty-input"]` equal to `5`.

## Run

```bash
npm run test:komfort
```

That runs only `tests/specs/komfort-smoke.spec.ts` on the chromium project. The default action timeout is 5 seconds; pass `BIG_TIMEOUT` when a click waits on the shop.
