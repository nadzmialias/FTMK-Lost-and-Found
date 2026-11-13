# FTMK Lost & Found

**Digital Campus @ FTMK, UTeM**

FTMK Lost & Found is a web-based application developed for the Software Project Management course at Universiti Teknikal Malaysia Melaka (UTeM).

The application provides a centralised platform for students at the Faculty of Information and Communication Technology (FTMK) to report lost or found belongings, browse item listings, and locate designated collection points.

Found items are managed through an administrator-controlled collection process, while lost-item reports allow finders to contact the owner directly.

**Live Website:** https://ftmk-lost-and-found.vercel.app

**Project Status:** Working student prototype

## 1. Project Objectives

The project aims to:

1. Provide a centralised platform for reporting lost and found items within FTMK.
2. Help students search for and identify missing belongings.
3. Allow finders to contact owners through publicly shared contact information.
4. Manage found-item collection and return through authorised administrators.
5. Provide reference-code tracking for Found Item reports.
6. Reduce reliance on informal reporting through social media and messaging groups.

## 2. Main Features

| Feature | Description |
|---|---|
| Homepage | Provides access to reporting, browsing, and searching features. |
| Report Lost Item | Allows students to submit missing-item details and public contact information. |
| Browse Lost Items | Displays searchable lost-item reports with selectable and copyable owner contact details. |
| Report Found Item | Allows finders to submit item details, choose a collection point, and optionally upload a photo. |
| Browse Found Items | Displays found-item reports with category, status, and keyword filters. |
| Item Details | Shows item information, location, collection point, and collection status. |
| Status Tracking | Allows users to track Found Item reports using a reference code. |
| Administrator Login | Authenticates authorised administrators through Supabase Auth. |
| Administrator Dashboard | Allows administrators to confirm receipt and return of found items. |
| Status History | Records item status changes for tracking and accountability. |

Students can access the public reporting and browsing features without creating an account.

## 3. System Workflow

### 3.1 Lost Item Reporting

Students who have lost an item can submit a Lost Item report.

**Process:**

1. Open the Report Lost Item page.
2. Enter the item name, category, description, last seen location, and date lost.
3. Provide an email address or phone number.
4. Agree to the public contact information consent statement.
5. Submit the report.
6. View the report in the public Lost Items directory.

The Lost Items directory allows other students to search for missing-item reports and copy the owner's contact information.

Finders can then communicate with the owner outside the application.

**Reference Code:** Lost Item reports do not display a reference code to the user. A unique internal reference code is still generated and stored in Supabase for database identification.

There is no automatic matching or online ownership-claim process for Lost Item reports.

### 3.2 Found Item Reporting

Students who find an item can submit a Found Item report.

**Process:**

1. Open the Report Found Item page.
2. Enter the item name, category, description, location found, and date found.
3. Optionally upload an item photo in JPEG, PNG, or WebP format, up to 3 MB.
4. Select the intended collection point.
5. Submit the report.
6. Save the generated reference code.
7. Physically hand over the item to the selected collection point.

The initial status is `REPORTED`.

Submitting a Found Item report does not automatically confirm that the item has arrived at the collection point.

### 3.3 Administrator Confirms Receipt

An authorised administrator signs in to the system and opens the Admin Dashboard.

After physically receiving the reported item, the administrator selects **Confirm Receipt**.

The status changes:

`REPORTED → AVAILABLE_FOR_COLLECTION`

The item is then displayed as ready for collection at its confirmed collection point.

### 3.4 Owner Collects the Item

Students can browse the Found Items directory to search for their missing belongings.

When a matching item is available for collection, the owner visits the confirmed collection point and provides evidence of ownership.

An authorised administrator performs ownership verification in person before handing over the item.

After the item has been returned, the administrator selects **Confirm Handover**.

The status changes:

`AVAILABLE_FOR_COLLECTION → RETURNED`

The public listing then displays the item as returned.

### 3.5 Found Item Status Tracking

Found Item reporters receive a unique reference code after successfully submitting their report.

Reference codes use the following format:

`FTMK-F-XXXXXXXXXXXX`

Users can enter this code on the Track Status page to view the report's current status and recorded status history.

The tracking interface is primarily intended for Found Item reports. Although the underlying API also supports internally generated Lost Item reference codes, new Lost Item reporters are not shown those codes.

## 4. Item Statuses

The standard Found Item workflow uses three statuses.

| Status | Description |
|---|---|
| `REPORTED` | The item has been reported but its receipt at the collection point has not been confirmed. |
| `AVAILABLE_FOR_COLLECTION` | An administrator has physically received the item and confirmed its availability. |
| `RETURNED` | An administrator has verified ownership and confirmed the item was returned. |

**Status Flow:**

`REPORTED → AVAILABLE_FOR_COLLECTION → RETURNED`

All status changes are recorded in the `status_history` table.

Lost Item reports are initially stored with `REPORTED` status. The current Lost Item workflow does not provide a separate recovery-confirmation action.

## 5. User Roles and Access

### Public Users

Public users can:

- Submit Lost Item reports.
- Submit Found Item reports.
- Browse Lost Items and Found Items.
- Search and filter item listings.
- View and copy contact details shared in Lost Item reports.
- View Found Item details and collection information.
- Track Found Item reports using reference codes.

Public users do not need to register or log in.

### Administrators

Administrators must sign in using an authorised Supabase Auth account with an active `ADMIN` profile in the `staff_profiles` table.

Administrators can:

- View found-item records.
- Search and filter found items.
- Confirm physical receipt of found items.
- Confirm successful handover after ownership verification.
- View item status information.

Administrator permissions are verified on the backend.

The current dashboard focuses on Found Item management.

## 6. Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| TypeScript | Application development |
| Vite | Development server and production builds |
| Tailwind CSS | Styling and responsive layouts |
| React Router | Client-side navigation |
| Lucide React | Interface icons |
| Supabase PostgreSQL | Database |
| Supabase Auth | Administrator authentication |
| Supabase Edge Functions | Backend API endpoints |
| Supabase Storage | Found-item photo storage |
| GitHub | Source-code version control |
| Vercel | Frontend hosting and deployment |
| Jira | Project planning and task management |

## 7. Installation and Local Development

### 7.1 Prerequisites

Before running the application, ensure that the following are available:

- Node.js and npm compatible with the project dependencies.
- Git.
- Visual Studio Code or another code editor.
- Authorised access to the GitHub repository.
- Access to the configured Supabase project.

### 7.2 Clone the Repository

```bash
git clone https://github.com/nadzmialias/FTMK-Lost-and-Found.git

cd FTMK-Lost-and-Found
```

The repository is private. Only authorised collaborators can clone it.

### 7.3 Install Dependencies

```bash
npm ci
```

### 7.4 Configure Environment Variables

Create a `.env.local` file in the project root.

Add the following values:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

Replace the placeholders with the corresponding Supabase project configuration.

Do not expose Supabase secret keys or service-role keys in frontend environment variables.

### 7.5 Start the Development Server

```bash
npm run dev
```

Open the local development URL displayed in the terminal.

The default Vite development address is usually:

`http://localhost:5173`

### 7.6 Code Validation and Production Build

Run ESLint:

```bash
npm run lint
```

Build the application:

```bash
npm run build
```

The build command performs TypeScript build checks and generates the production files in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

## 8. Supabase Database

The application uses four main tables in the public database schema.

| Table | Description |
|---|---|
| `items` | Stores Lost Item and Found Item reports, reference codes, statuses, and related information. |
| `collection_points` | Stores designated physical collection locations and their availability. |
| `staff_profiles` | Stores administrator profiles and authorisation information. |
| `status_history` | Records item status changes and their timestamps. |

### 8.1 Items Table

The `items` table stores information for both Lost Item and Found Item reports.

Important fields include:

- `item_id`
- `reference_code`
- `report_type`
- `item_name`
- `category`
- `description`
- `location`
- `item_date`
- `photo_url`
- `contact_detail`
- `status`
- `collection_point_id`
- `received_at`
- `received_by`
- `returned_at`
- `returned_by`
- `created_at`
- `updated_at`

The `report_type` field distinguishes `LOST` and `FOUND` reports.

### 8.2 Collection Points

The prototype supports the following collection points:

1. FTMK Administration Office.
2. FICTS Student Club.

A collection point must be active before it can be selected for a new Found Item report.

### 8.3 Database Security

Row Level Security (RLS) is enabled on the main public tables.

The application retrieves selected public item information through dedicated Edge Functions, while sensitive administrative actions require verified administrator authentication.

## 9. Supabase Edge Functions

The frontend currently uses these six Edge Functions.

| Edge Function | Purpose |
|---|---|
| `submit-found-item-v3` | Validates and saves Found Item reports, including optional photo uploads. |
| `submit-lost-item-v3` | Validates and saves Lost Item reports, contact details, and public listing consent. |
| `public-found-items-v2` | Retrieves public Found Item listings and individual item details. |
| `public-lost-items-v1` | Retrieves Lost Item reports eligible for public display. |
| `track-item` | Retrieves item information and status history using a reference code. |
| `admin-items` | Verifies administrator access and performs authorised Found Item management operations. |

The older `submit-lost-item` and `submit-lost-item-v2` endpoints are deprecated and no longer accept report submissions.

**Note:** The deployed Supabase Edge Functions and database configuration are currently maintained separately from the frontend repository. Cloning the GitHub repository does not automatically recreate the backend environment.

## 10. Project Structure

```text
FTMK-Lost-and-Found/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── context/
│   │   ├── AdminAuthProvider.tsx
│   │   └── adminAuthContext.ts
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ReportLostPage.tsx
│   │   ├── LostItemsPage.tsx
│   │   ├── ReportFoundPage.tsx
│   │   ├── BrowseItemsPage.tsx
│   │   ├── ItemDetailsPage.tsx
│   │   ├── TrackStatusPage.tsx
│   │   ├── AdminLoginPage.tsx
│   │   └── AdminDashboard.tsx
│   ├── services/
│   │   ├── supabaseClient.ts
│   │   ├── lostReportService.ts
│   │   ├── publicLostItemService.ts
│   │   ├── foundReportService.ts
│   │   ├── publicItemServices.ts
│   │   ├── trackingService.ts
│   │   └── adminService.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── package.json
├── package-lock.json
├── vercel.json
└── README.md
```

## 11. Testing Checklist

The following test cases should be completed and documented before the final project demonstration.

### Lost Item Module

- [ ] Submit a valid Lost Item report.
- [ ] Verify required-field validation.
- [ ] Verify contact information and consent validation.
- [ ] Confirm that the report appears in the Lost Items directory.
- [ ] Search and filter Lost Item listings.
- [ ] Copy the owner's email or phone number.
- [ ] Confirm that the success page does not display a reference code.

### Found Item Module

- [ ] Submit a Found Item report without a photo.
- [ ] Submit a Found Item report with a valid photo.
- [ ] Verify collection-point selection.
- [ ] Confirm that a reference code is generated.
- [ ] Verify that the item appears in the Found Items directory.
- [ ] Search and filter Found Item listings.
- [ ] Track the item using its reference code.

### Administrator Module

- [ ] Log in with a valid administrator account.
- [ ] Reject unauthorised administrator access.
- [ ] Confirm receipt of a reported item.
- [ ] Verify the Available for Collection status.
- [ ] Confirm an item has been returned.
- [ ] Verify the Returned status.
- [ ] Check status history after administrative updates.

### Code Validation

- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] Test the application on desktop and mobile screen sizes.

Checklist items should be marked complete only after their results have been verified.

## 12. Known Limitations

The current system is a student prototype and has the following limitations:

- No automatic matching between Lost Item and Found Item reports.
- No in-app messaging between users.
- No online ownership-claim approval process.
- No self-service feature for Lost Item owners to mark an item as recovered or withdraw a public listing.
- Lost Item contact details are publicly visible after consent and may be copied by other users.
- Administrator management currently focuses on Found Item records.
- Ownership verification and physical handover are performed outside the application.
- Application-level rate limiting and abuse protection for public submissions require further improvement.
- Additional security, privacy, usability, and end-to-end testing are recommended before wider public use.

## 13. Team Collaboration

The application is developed as a three-member student project.

The team uses:

- **Jira** to organise project tasks, responsibilities, and progress.
- **GitHub** for source-code sharing and version control.
- **WhatsApp** for team communication.
- **Vercel** for frontend deployment.
- **Supabase** for backend services and database management.

Team members should use separate Git branches when making changes, review changes before merging, and verify that the application builds successfully.

Secret keys, passwords, `.env.local` files, and confidential student information must not be committed to the repository.

## 14. Project Information

**Project Name:** FTMK Lost & Found

**Theme:** Digital Campus

**Course:** Software Project Management

**Institution:** Universiti Teknikal Malaysia Melaka (UTeM)

**Faculty:** Faculty of Information and Communication Technology (FTMK)

**Team:** L

This application was developed as an academic student project to demonstrate project planning, implementation, collaboration, and software project management practices.
