# Test results — EP-05 Opportunity Filter

## Automated logic tests

Executed with the Node.js built-in test runner:

```bash
npm test
```

**Result: 9 passed, 0 failed.** The tests cover:

1. Empty filters return the full list.
2. Text search across opportunity/company/owner/product and accent-insensitive Vietnamese matching, including `Đ/đ`.
3. Combined stage, product and owner filters use AND logic.
4. Inclusive minimum and maximum value boundaries.
5. Inclusive ISO close-date boundaries.
6. Invalid value/date ranges are rejected by validation.
7. Saved filter JSON serializes/restores, with safe fallback for malformed stored data.
8. Sorting by numeric value and ISO date without mutating the original array.
9. CSV BOM, headers and double-quote escaping.

## Source syntax

The JSX source syntax check with TypeScript's parser completed without diagnostics.

## Production build status

`npm install --no-audit --no-fund` was attempted in the project creation environment but timed out while waiting for the npm registry. Therefore a Vite production build could not be verified here. Please run `npm install` and `npm run build` after opening the project in an environment with npm registry access.

## Manual UI checklist

- [ ] Type a keyword in the search field; results and result count update.
- [ ] Use Ctrl+K / Cmd+K to focus quick search.
- [ ] Combine stage, value range, close-date range, product and owner.
- [ ] Verify invalid value/date ranges show validation and cannot be applied/saved.
- [ ] Save a named filter, apply it, reload the page and confirm it persists.
- [ ] Delete a saved filter and confirm it disappears.
- [ ] Sort value/date columns and move between pages.
- [ ] Export CSV with active filters and verify the exported rows match the current results.
- [ ] Verify empty results can be recovered using “Xóa tất cả bộ lọc”.
