# Angular URL Builder & History

## Overview

This project is a small Angular application to build URLs with dynamic UTM parameters and custom query params, view a live preview, copy URLs, and maintain a history of the last 5 URLs. The application demonstrates **reactive forms**, **signals + computed**, and lazy history rendering using `@defer`.

---

## Angular Version

* This project uses **Angular 19.2**.
* Uses **Standalone Components**, **Signals**, and **Computed Signals**

---

## Installation

1. Clone the repository:

```bash
git clone <repo-url>
cd <project-folder>
```

2. Install dependencies:

```bash
npm install
```

3. Run the app locally:

```bash
ng serve
```

Open your browser at `http://localhost:4200`.

---

## Architecture Notes

* **Components**

  * `UrlBuilderFormComponent`: Reactive form with dynamic params, signals, and computed final URL.
  * `UrlHistoryComponent`: Displays last 5 saved URLs, filterable with signals.

* **Services**

  * `HttpService`: Maintains `historyItems` signal, filtered history, and `selectedItem` signal for preloading form values.
  * `GenericModalService`: Handles success/error modals.

* **State Management**

  * Signals are used for reactive values (`formValue`, `finalUrl`, `urlLength`, `historyItems`, `filteredHistory`, `selectedItem`).
  * Computed signals automatically recompute dependent values (e.g., final URL preview, character count).

* **Utilities**

  * `uuidGenerator()`: Generates unique IDs for saved URLs.
  * `urlValidator()`: Validates URL inputs.
  * `HighlightUrlPipe`: Highlights portions of the URL wrapped in `**` using `<b>` tags.

* **Lazy Loading**

  * `@defer` is used to load the history component only when history items exist.

---

## Features

* Dynamic URL builder with reactive form.
* Live URL preview (signals + computed).
* Highlighted UTM and query params in URL preview.
* Copy URL to clipboard.
* Save URLs to local storage (keep last 5).
* Filterable history list using signals.
* Click history item to preload form values.

---

## Commands

```bash
# Install dependencies
npm install

# Serve locally
ng serve

# Build for production
ng build
```

---

## Time Spent

* Approximately **3–6 hours** for full implementation, including signals, computed, and history handling.

---

## TODOs / Next Improvements

* Add **unit tests** for form, signals, and history.
* Add **server-side persistence** for URL history.
* Enhance UI/UX: responsive design, animations, improved highlighting.
* Add optional **export history** to JSON/CSV.

---

## Notes

* Signals must be initialized in a **constructor or injection context**.
* Computed signals automatically recompute when dependent signals change.
* `@defer` is used for **lazy rendering** of the history panel when items exist.
