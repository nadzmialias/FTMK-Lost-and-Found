# FTMK Lost & Found

A web-based lost-and-found application for students at the **Faculty of Information and Communication Technology (FTMK), Universiti Teknikal Malaysia Melaka (UTeM)**.

FTMK Lost & Found provides a central place to report lost or found belongings, search found-item reports, request ownership claims, and track item status using a reference code. This is a **Software Project Management student project** developed as a working prototype.

> **Current project status:** The reporting, browsing, ownership-claim, finder-management, and tracking modules have been implemented in stages. Some workflows have been tested, but the complete application and all edge cases still require end-to-end verification. Photo upload, production-level abuse prevention, and some handover arrangements are not yet complete. Use **synthetic test data only** until privacy and security checks are finished.

## Table of Contents

1. [Features](#features)
2. [How to Use the Application](#how-to-use-the-application)
   - [A. Report a Found Item](#a-report-a-found-item)
   - [B. Browse and Search Found Items](#b-browse-and-search-found-items)
   - [C. Claim a Found Item](#c-claim-a-found-item)
   - [D. Manage a Found-Item Claim (Finder)](#d-manage-a-found-item-claim-finder)
   - [E. Report a Lost Item](#e-report-a-lost-item)
   - [F. Track a Report](#f-track-a-report)
3. [Example End-to-End Walkthrough](#example-end-to-end-walkthrough)
4. [Run the Project Locally](#run-the-project-locally)
5. [Supabase Setup](#supabase-setup)
6. [Project Structure](#project-structure)
7. [Team Collaboration with GitHub](#team-collaboration-with-github)
8. [Testing Checklist](#testing-checklist)
9. [Known Limitations and Safety Notes](#known-limitations-and-safety-notes)

## Features

| Feature | Description | Status |
| --- | --- | --- |
| Home | Navigation and entry points for reporting, browsing, and tracking | Implemented |
| Report Found Item | Submit found-item details and receive a reference code and private management link | Implemented; submission tested |
| Browse Found Items | Search and filter found-item reports by keyword, category, location, and status | Implemented; tested with real Supabase records |
| Item Details | View a found item's public information and verification question | Implemented; tested |
| Ownership Claim | Submit an answer to the finder's verification question | Implemented; successful claim tested |
| Finder Claim Management | View, approve, or reject a claim and confirm physical handover with a private link | Implemented in development; verify full workflow |
| Report Lost Item | Submit a lost-item report and receive a reference code | Implemented; verify full workflow |
| Track Status | Enter a reference code to see the report's status and status history | Implemented in development; verify route and Edge Function |
| Photo Upload | Upload optional item photos to Supabase Storage | Not yet connected |

### Status meanings

| Item status | Meaning |
| --- | --- |
| `REPORTED` | The item has been reported. |
| `CLAIM_REQUESTED` | An ownership claim has been submitted; the finder may need to review it or arrange handover. |
| `RETURNED` | The finder has confirmed that the item was returned. |

Claims have separate statuses: `PENDING`, `APPROVED`, and `REJECTED`. **Approving a claim does not mean the item has been physically returned.**

## How to Use the Application

Open the deployed website, or start the local development server and visit **http://localhost:5173/**. The local address is an example: Vite may choose another port if 5173 is in use.

No user account or login is required for the prototype. However, the **finder's private management link must be kept confidential**.

### A. Report a Found Item

Use this when you find someone else's belongings at FTMK.

1. From the homepage, click **I Found Something**, or select **Report Item** and navigate to **Report Found Item**.
2. Enter the **item name**, such as `Scientific Calculator`.
3. Choose a **category**, such as `Electronics`.
4. Write a short **description** that helps the owner recognize the item, but do not reveal sensitive identifiers or the verification answer.
5. Select the **location found** and **date found**.
6. Enter **Where Is the Item Kept?**, such as `FTMK Faculty Office`, using an agreed safe collection location.
7. Set a **verification question** that the rightful owner should know, then enter the **expected answer**. Do not include the answer in the public description.
8. **Leave the optional photo empty for now**. Photo upload is not yet connected to storage.
9. Click **Submit Report**. Wait for the confirmation page; do not assume it was saved until it says **Report Submitted Successfully!**
10. **Copy the reference code**, formatted like `FTMK-F-XXXXXXXXXXXX`.
11. **Copy and privately save the management link** shown below the reference code. It lets the finder manage claims later. Treat it like a password.

> The reference code and private management link serve different purposes. The reference code is for tracking; the private link authorizes finder-management actions. **Do not share the private link publicly or include it in screenshots or issues.**

### B. Browse and Search Found Items

Use this when you are looking for a belonging you may have lost.

1. Click **Browse Items** in the navigation bar.
2. Wait for the list of reported **found** items to load.
3. Enter a keyword in **Search**, such as `calculator` or `water bottle`.
4. Optionally narrow the results using the **Category**, **Location**, and **Status** dropdowns.
5. Click **Clear Filters** to reset the search, or **Refresh** to retrieve the latest reports.
6. Select **View Details & Claim** on a matching item.

**Note:** The Browse Found Items page lists reports with type `FOUND`, not `LOST`. If no cards appear, there may be no found-item records or no records matching the filters.

### C. Claim a Found Item

Use this when you recognize your belonging in the found-item list.

1. Open **Browse Items** and select **View Details & Claim** on the item.
2. Review the item's public details, including name, category, location, and date.
3. If the item is still accepting claims, find the **Verification Question** panel.
4. Enter your answer in **Your Answer**.
5. Click **Submit Ownership Claim**.
6. If the server verifies your answer, you should see **Claim Submitted!**
7. The claim will have status `PENDING`, and the item's status will change to `CLAIM_REQUESTED`.
8. The finder must still review the claim and coordinate a safe handover. A matching answer alone does not complete the return.

If your answer is incorrect or the item already has an active claim, the application should reject the request. Do not attempt repeated guesses. This prototype does not yet provide a built-in messaging or claimant-contact system.

### D. Manage a Found-Item Claim (Finder)

Use this if **you are the person who reported the found item** and saved its private management link.

1. Open the **private management link** obtained after submitting the found-item report. It should look like `/manage/FTMK-F-XXXXXXXXXXXX#token=...`.
2. Confirm that the **Manage Found Item** page displays the correct report.
3. Look under **Ownership Claims**. Click the refresh control if someone has just submitted a claim.
4. For a `PENDING` claim, choose one of the following:
   - **Approve:** The claim changes to `APPROVED`, but the item remains `CLAIM_REQUESTED` until handover is confirmed.
   - **Reject:** The claim changes to `REJECTED`, and the item returns to `REPORTED` so it can receive a new claim.
5. If you approve the claim, arrange the return through an agreed safe process, such as a designated collection point. The application does not currently provide in-app messaging or verified claimant identity.
6. **Only after the item has actually been handed over**, click **Confirm Item Returned** and accept the confirmation prompt.
7. The item's status should now be `RETURNED`. The status tracker should reflect this change.

**Important:** Do not mark an item returned merely because you approved the claim. If you lose the private management link, the original token cannot be recovered from its database hash; use a new synthetic report for testing.

### E. Report a Lost Item

Use this when you cannot find your own belongings.

1. From the homepage, click **I Lost Something**, or open **Report Lost Item**.
2. Enter the **item name** and choose a **category**.
3. Describe your item without entering passwords, student card numbers, or other sensitive personal information.
4. Select the **last seen location** and **date lost**.
5. Click **Submit Lost Report**.
6. On successful submission, copy the reference code, formatted like `FTMK-L-XXXXXXXXXXXX`.
7. Save the private management link if shown, and keep it confidential.
8. Use **Track Status** to look up the report later.

Lost-item reports are stored separately by their `LOST` report type and **do not appear in Browse Found Items**. Automatic matching between lost and found reports is not currently implemented.

### F. Track a Report

Use this to check what has happened to a report after submission.

1. Click **Track Status** in the top navigation bar.
2. Enter the reference code from the report confirmation screen, for example `FTMK-F-XXXXXXXXXXXX` or `FTMK-L-XXXXXXXXXXXX`.
3. Click **Track Item**.
4. Review the displayed **item name**, **report type**, **current status**, and **status history**.
5. Repeat the lookup after a finder reviews or returns an item to see the newest status.

Depending on the installed routing configuration, a tracking URL may also support `/track/FTMK-F-XXXXXXXXXXXX`. The general `/track` page is the standard entry point.

**History example:** `REPORTED → CLAIM_REQUESTED → RETURNED`. If a claim is rejected, the history may instead show `CLAIM_REQUESTED → REPORTED` before a later claim.

## Example End-to-End Walkthrough

Use fictional details for a team demonstration:

1. **Finder:** Report a found `Casio Scientific Calculator` in the `Electronics` category, found at `FTMK Computer Lab` and kept at an agreed faculty collection point.
2. **Finder:** Set the verification question to `What is the calculator model?` and enter a fictional expected answer such as `fx-570EX`.
3. **Finder:** Submit the form. Record the **reference code** and keep the **private management link** separately.
4. **Owner (simulated):** Open **Browse Items**, search `calculator`, and select **View Details & Claim**.
5. **Owner:** Enter the correct verification answer and submit the claim. Confirm that the item changes to `CLAIM_REQUESTED`.
6. **Finder:** Open the private management link, refresh the claims list, and click **Approve**.
7. **Finder:** Simulate an agreed handover and click **Confirm Item Returned**.
8. **Both testers:** Open **Track Status**, enter the public reference code, and verify the final `RETURNED` status and history.

For a second test, create a different found-item report and **reject** its pending claim. Verify the item returns to `REPORTED`.

## Run the Project Locally

### Prerequisites

- **Node.js** and **npm** compatible with the installed Vite version.
- **Git**, for cloning and version control.
- A Supabase project with the required database schema and deployed Edge Functions.
- Visual Studio Code or another code editor.

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/FTMK-Lost-and-Found.git
cd FTMK-Lost-and-Found
```

Replace `YOUR_USERNAME` with the repository owner's actual GitHub username.

### 2. Install dependencies

```bash
npm ci
```

### 3. Configure environment variables

Create a `.env.local` file in the project root. You may copy `.env.example` as a starting point:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Get these values from the **Supabase project dashboard**. Use a **publishable** key only. Never put a Supabase secret/service-role key or `ANSWER_HASH_SECRET` into `VITE_` variables, `.env.local`, frontend source code, or GitHub.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed by Vite, typically **http://localhost:5173/**.

### 5. Validate the code

```bash
npm run lint
npx tsc --noEmit -p tsconfig.app.json
```

### 6. Build for production

```bash
npm run build
```

A successful build creates the output in `dist/`.

## Supabase Setup

The frontend requires an existing Supabase backend. **Cloning GitHub files alone does not reproduce the database or deployed Edge Functions.**

### Main database tables

- `items`: reports for both `FOUND` and `LOST` items; contains reference codes, current status, and protected report-management/verification fields.
- `claims`: ownership claim records, including `PENDING`, `APPROVED`, and `REJECTED` statuses.
- `status_history`: records report status transitions.

The tables should have Row Level Security (RLS) enabled. Direct browser access to private columns should remain restricted; server-side Edge Functions should explicitly select only permitted public fields.

### Edge Functions used by the application

| Function | Purpose |
| --- | --- |
| `submit-found-item` | Save found-item reports and issue reference codes/private management tokens |
| `submit-lost-item` | Save lost-item reports |
| `get-found-items` | Return safe public found-item listings |
| `get-found-item` | Return one found item's public details and verification question |
| `submit-claim` | Verify an answer on the server and create a pending claim |
| `manage-found-claim` | Enforce private token checks for viewing/reviewing claims and confirming return |
| `track-item` | Return safe public status and history for a reference code |

The backend also relies on database triggers for initial and changed status-history records, and a database function for transactional finder-management actions.

**Server secrets:** The Edge Functions use server-side credentials such as `SUPABASE_SERVICE_ROLE_KEY` and `ANSWER_HASH_SECRET`. These must only exist in the Supabase server environment. Keep the *same* `ANSWER_HASH_SECRET` for both report creation and verification; changing it will break verification of previously created answers.

**Deployment note:** Some endpoints are configured without JWT verification to support the no-login MVP. This does **not** make them secure by itself. The backend still needs strict input validation, privacy filtering, authorization for sensitive actions, request rate limits, and abuse protection before public deployment.

## Project Structure

```text
ftmk-lost-and-found/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ItemCard.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── BrowseItemsPage.tsx
│   │   ├── ReportFoundPage.tsx
│   │   ├── ReportLostPage.tsx
│   │   ├── ItemDetailsPage.tsx
│   │   ├── ManageFoundItemPage.tsx
│   │   └── TrackStatusPage.tsx
│   ├── services/
│   │   ├── supabaseClient.ts
│   │   ├── itemService.ts
│   │   ├── claimService.ts
│   │   ├── managementService.ts
│   │   └── trackingService.ts
│   ├── types/
│   ├── data/
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── vite.config.ts
```

The structure above is the **intended** project layout. If your actual files differ slightly, match the imports and filenames in your repository (for example, `itemServices.ts` versus `itemService.ts`).

## Team Collaboration with GitHub

1. Clone the repository and install the dependencies.
2. Obtain the Supabase **project URL and publishable key** from the team, and create your own `.env.local`.
3. Pull the latest stable changes before developing:

   ```bash
   git switch main
   git pull origin main
   ```

4. Create a feature branch:

   ```bash
   git switch -c feature/my-feature
   ```

5. Make changes, run lint/type checks, then commit and push:

   ```bash
   git add .
   git commit -m "feat: describe the change"
   git push -u origin feature/my-feature
   ```

6. Open a Pull Request on GitHub and request review before merging into `main`.

**Never commit** `.env.local`, database passwords, service-role keys, answer-hashing secrets, private management links, or real student records.

## Testing Checklist

- [ ] Report a found item with valid details; verify a reference code is issued and a database record is saved.
- [ ] Reject missing or invalid fields in the found-item form.
- [ ] Browse found items and filter by keyword, category, location, and status.
- [ ] Open item details; verify that private database fields are not exposed.
- [ ] Submit a correct ownership answer; confirm a pending claim is created.
- [ ] Submit an incorrect answer; confirm no claim is created.
- [ ] Attempt a duplicate pending claim; confirm it is blocked.
- [ ] Open the finder management page using the correct private link.
- [ ] Attempt management with an invalid token; confirm access is denied.
- [ ] Approve a pending claim without marking the item returned.
- [ ] Confirm handover; verify the item changes to `RETURNED`.
- [ ] Reject a separate pending claim; verify the item reopens as `REPORTED`.
- [ ] Report a lost item; verify the report is saved with type `LOST`.
- [ ] Track both lost and found reference codes.
- [ ] Confirm status history reflects the actual sequence of changes.
- [ ] Run `npm run lint`, TypeScript checks, and `npm run build`.
- [ ] Record testing evidence and issues in Jira.

## Known Limitations and Safety Notes

- **Prototype only:** Use synthetic/non-sensitive data during development and demonstration.
- **No login:** Finder-management access relies on a private, unguessable link. Anyone possessing that link may be able to manage the report.
- **No in-app messaging:** A safe handover procedure must be agreed outside the application for the prototype.
- **No automatic matching:** Lost-item reports are not automatically matched with found-item reports.
- **No photo storage yet:** The optional photo field is not connected to Supabase Storage.
- **Limited claim proof:** Correctly answering a question does not by itself establish the claimant's identity. The finder should independently verify before handover.
- **Public tracking privacy:** Anyone with a report's reference code can look up its public status. Do not place sensitive information in public report fields.
- **Production readiness:** Rate limiting, bot protection, secure token recovery/revocation, robust transaction/concurrency tests, accessibility review, and privacy testing remain necessary before public release.

---

**FTMK Lost & Found**  
Digital Campus @ FTMK, Universiti Teknikal Malaysia Melaka (UTeM)  
Software Project Management student project.
