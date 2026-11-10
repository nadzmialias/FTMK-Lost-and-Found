# FTMK Lost & Found

A web-based lost-and-found management system for students at the **Faculty of Information and Communication Technology (FTMK), Universiti Teknikal Malaysia Melaka (UTeM)**.

This application allows students to report lost or found belongings, browse found-item listings, and track reports using a reference code. Found items are physically handled at designated collection points, while authorized administrators manage receipt and return.

**Project:** Software Project Management student project  
**Status:** Working prototype, with additional security and deployment testing required

## Features

| Module | Description |
|---|---|
| Homepage | Search found items and access reporting features |
| Report Found Item | Submit item details, select a collection point, and optionally upload a photo |
| Report Lost Item | Submit a missing-item report and receive a reference code |
| Browse Items | Search and filter found-item reports |
| Item Details | View item information, status, and collection point |
| Status Tracking | Track lost and found reports using a reference code |
| Admin Login | Authenticate authorized administrators using Supabase Auth |
| Admin Dashboard | Confirm item receipt and physical handover |
| Status History | Record item status changes |

## How the System Works

### 1. Report a Found Item

A student who finds an item:

1. Opens **Report Found Item**.
2. Enters the item name, category, description, location, and date found.
3. Selects an intended collection point.
4. Optionally uploads a photo.
5. Submits the report and receives a reference code.
6. Physically delivers the item to the selected collection point.

The initial item status is `REPORTED`.

### 2. Administrator Confirms Receipt

An authorized administrator:

1. Signs in through `/admin/login`.
2. Opens the Admin Dashboard.
3. Locates the reported item.
4. Confirms that the item has physically arrived.

The status changes from `REPORTED` to `AVAILABLE_FOR_COLLECTION`.

### 3. Owner Searches for Their Belonging

A student searching for a missing item:

1. Opens **Browse Items**.
2. Searches by keyword or available filters.
3. Opens a matching item's details.
4. Checks its collection status and designated collection point.
5. Visits the collection point when the item is available.

Ownership verification is performed in person rather than through an online claim form.

### 4. Administrator Confirms Return

After verifying ownership and completing the handover, an administrator marks the item as returned.

The status changes from `AVAILABLE_FOR_COLLECTION` to `RETURNED`.

### 5. Report a Lost Item

Students may also submit reports for belongings they have lost.

The system generates a reference code beginning with `FTMK-L-`, which can be used on the status-tracking page.

Lost-item reports are not publicly listed in Browse Found Items. Automatic matching between lost and found reports is not currently implemented.

## Item Statuses

| Status | Meaning |
|---|---|
| `REPORTED` | A report has been submitted |
| `AVAILABLE_FOR_COLLECTION` | An administrator has confirmed receipt of a found item |
| `RETURNED` | An administrator has confirmed physical handover |
| `CLAIM_REQUESTED` | Legacy status retained for historical records |

The standard found-item workflow is:

`REPORTED → AVAILABLE_FOR_COLLECTION → RETURNED`

## User Access

The application has two access categories:

**Public users:** Students can browse, report, and track items without creating an account.

**Administrators:** Authorized staff sign in with individual Supabase Auth accounts. Each account must have an active `ADMIN` profile in `staff_profiles`.

All authorized administrators share the same application role. Sensitive item-management actions must be checked on the backend.

## Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend development |
| TypeScript | Type-safe application code |
| Vite | Development and build tooling |
| Tailwind CSS | Styling and responsive layouts |
| React Router | Navigation |
| Lucide React | Icons |
| Supabase PostgreSQL | Database |
| Supabase Auth | Administrator authentication |
| Supabase Edge Functions | Server-side APIs |
| Supabase Storage | Found-item photo storage |

## Installation and Local Development

### Prerequisites

- Node.js and npm compatible with the project's package versions
- Git
- VS Code or another development environment
- Access to the configured Supabase project

### Clone the repository

```bash
git clone https://github.com/nadzmialias/FTMK-Lost-and-Found.git
cd FTMK-Lost-and-Found
```

The repository is private, so cloning requires authorized GitHub access.

### Install dependencies

```bash
npm ci
```

### Configure Supabase

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Never include service-role keys or secret credentials in frontend environment variables.

### Start the application

```bash
npm run dev
```

Open the development URL shown in the terminal, normally `http://localhost:5173`.

### Validate and build

```bash
npm run lint
npx tsc --noEmit -p tsconfig.app.json
npm run build
```

## Supabase Database

The current application uses these main tables:

| Table | Purpose |
|---|---|
| `items` | Lost and found item reports |
| `collection_points` | Designated physical collection locations |
| `staff_profiles` | Administrator authorization profiles |
| `status_history` | Item status-change history |
| `claims` | Historical claim records from the previous workflow |

The legacy `claims` table is not part of the current public ownership-verification workflow.

### Collection Points

The current prototype supports:

- FTMK Administration Office
- FICTS Student Club

Collection point availability is controlled through the database.

## Supabase Edge Functions

| Function | Purpose |
|---|---|
| `submit-found-item-v3` | Submit found-item reports with optional photo |
| `submit-lost-item-v2` | Submit lost-item reports without management tokens |
| `public-found-items-v2` | Retrieve public found-item listings and details |
| `track-item` | Retrieve report status and history |
| `admin-items` | Perform authorized administrator operations |

The older `submit-lost-item` function is temporarily retained for compatibility. It is not used by the updated Lost Item form.

Supabase Edge Functions and database configuration must be deployed separately. Cloning the frontend repository does not automatically reproduce the backend.

## Project Structure

```text
src/
├── components/
│   ├── Footer.tsx
│   └── Navbar.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── BrowseItemsPage.tsx
│   ├── ReportFoundPage.tsx
│   ├── ReportLostPage.tsx
│   ├── ItemDetailsPage.tsx
│   ├── TrackStatusPage.tsx
│   ├── AdminLoginPage.tsx
│   └── AdminDashboard.tsx
├── services/
│   ├── supabaseClient.ts
│   ├── foundReportService.ts
│   ├── lostReportService.ts
│   ├── publicItemServices.ts
│   ├── trackingService.ts
│   └── adminService.ts
├── App.tsx
└── main.tsx
```

This structure lists the principal active application files. Legacy prototype files may remain in the repository until cleanup is approved.

## Testing Checklist

- [ ] Submit found-item report without a photo
- [ ] Submit found-item report with a photo
- [ ] Confirm found-item report appears in Browse Items
- [ ] Submit lost-item report
- [ ] Generate valid reference codes
- [ ] Track both lost and found reports
- [ ] Log in as an authorized administrator
- [ ] Reject unauthorized administrator access
- [ ] Confirm receipt at a collection point
- [ ] Verify the available-for-collection status
- [ ] Confirm physical handover
- [ ] Verify the returned status and status history
- [ ] Run lint, TypeScript checks, and production build

The Lost Item reporting and tracking workflow has been tested successfully during development. Other checklist items require final end-to-end confirmation.

## Known Limitations

- No automatic matching between lost and found reports.
- No online ownership-claim submission.
- No in-app messaging between students and administrators.
- Lost-item reports are not publicly browsable.
- Physical verification and handover take place outside the application.
- Historical claim records and some legacy backend functionality remain.
- Rate limiting, abuse protection, authorization auditing, and privacy testing are required before public production deployment.
- Use fictional test data until the application's privacy and security requirements have been verified.

## Team Collaboration

Team members should create separate Git branches for changes, test locally, and submit pull requests for review.

Do not commit `.env.local`, secret keys, passwords, or real student information.

---

**FTMK Lost & Found**  
Digital Campus @ FTMK, UTeM  
Software Project Management Student Project
