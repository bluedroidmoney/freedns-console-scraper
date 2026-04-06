# freedns-console-scraper
A powerful, browser-based JavaScript scraper to extract, sort, and export all domains from the FreeDNS shared domain registry directly from the console to a .txt file.

## 🚀 Features
- **Pure JavaScript**: Runs entirely in the browser.
- **Auto-Pagination**: Crawls through every page of the registry automatically.
- **Smart Sorting**: Organizes domains alphabetically.
- **Export Ready**: Generates a clean `.txt` file of the entire list of domains available to use.

## 🛠 How to Use
1. Go to the FreeDNS [Shared Domain Registry](https://freedns.afraid.org/domain/registry/).
2. Open the Developer Console by pressing `F12` (or `Cmd + Opt + J` on macOS / `Ctrl + Shift + J` on Windows/Linux).
3. Copy the code from `scraper.js` and paste it into the console.
4. Wait for the process to complete; your file will download automatically!

## 📦 File Structure
- `scraper.js`: The main script logic.
- `scraper-bookmarklet.js`: Bookmarklet version of `scraper.js`.
- `LICENSE`: MIT License.
