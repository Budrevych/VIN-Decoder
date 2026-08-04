# 🚘 VIN Decoder — Vehicle Identification Number Lookup SPA

A fast, intuitive, and feature-rich Single Page Application (SPA) designed to decode vehicle VIN codes and inspect official vehicle specification variables using the public **NHTSA** (National Highway Traffic Safety Administration) API.

Developed as a technical assessment for the **Junior Frontend Developer (ABP)** position.

---

## 🔗 Live Application Link
- **Deployed App**: [https://vin-decoder-six-delta.vercel.app/](https://vin-decoder-six-delta.vercel.app/)

---

## ✨ Features & Functionality

### 1. Main Page `/` (VIN Decoder):
- **VIN Input Form**: Supports strict real-time client validation:
  - Non-empty field check.
  - Length constraint (1 to 17 characters in accordance with requirements).
  - Forbidden letters check (`I`, `O`, `Q` and special characters).
  - Input normalization (automatic `trim()` and upper-casing).
- **Error Handling & State Management**:
  - Inline validation error messages directly under the input field.
  - Separate error blocks for HTTP/network failures and official API messages (`Message`).
  - Loading spinner state with request cancellation support (`AbortController`).
  - Toast notification on successful decoding.
- **Two-Level Results Display**:
  - **Level 1 (Summary Card)**: High-level overview of key vehicle attributes (Make, Model, Year, Vehicle Type, Plant Country, Populated Field Count).
  - **Level 2 (Detailed Table)**: Complete, interactive list of all non-empty variable-value pairs.
- **Last 3 Decoded VINs History (localStorage)**:
  - Stores up to 3 recent successful decodings with timestamp, summary, and filtered results.
  - Clicking any history badge **instantly displays the cached result without making a secondary network request**.

### 2. Variables Catalog `/variables`:
- Complete directory of all ~150 official NHTSA vehicle variables.
- **Paginated Grid View**: Displays **15 cards by default** for optimal UI performance and layout stability.
- **Load More Pagination Button**: Clicking the **"📥 Load Next 15 Variables"** button dynamically appends the next batch of 15 variables to the list and tracks remaining counts.
- **Real-Time Client Search**: Instant search filtering by variable name, group, or description without extra server roundtrips (automatically resets pagination to the top 15 results).

### 3. Variable Details `/variables/:variableId`:
- Dedicated route for inspecting full variable documentation.
- **Safe HTML Sanitization**: Strips HTML tags from API descriptions safely without `dangerouslySetInnerHTML`.
- **Lookup Values Support**: Automatically fetches allowable options if the variable type is `lookup`.
- **In-Memory Caching**: Direct link access or page refreshes on `/variables/:id` work seamlessly via in-memory caching.

---

## 🛠 Tech Stack
- **Framework**: React 18, TypeScript, Vite
- **Routing**: React Router v6
- **Styling**: Vanilla CSS (CSS Custom Properties, Flexbox, Grid, Dark Theme, Responsive 420px to 1440px+)
- **API Handling**: Fetch API, AbortController, In-Memory Caching
- **State & Storage**: `localStorage` API

---

## 🚀 How to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Budrevych/VIN-Decoder.git
   cd VIN-Decoder
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   You can start the project using **either** of the following commands:
   ```bash
   npm run dev
   # OR
   npm run start
   ```
   The app will be available at `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```

