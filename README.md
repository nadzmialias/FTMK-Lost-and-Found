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


### 6 Collection Points

The prototype supports the following collection points:

1. FTMK Administration Office.
2. FICTS Student Club.

A collection point must be active before it can be selected for a new Found Item report.


## 7. Known Limitations

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

