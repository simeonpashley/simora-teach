# **Dashboard Features and Screens with Testing**

## **1. Hub Screen**

### Stage 1: Basic Setup

[ ] Create a dashboard page at `dashboard` using the existing layout.
[ ] Display key metrics from the database, such as:
   [ ] Total Students
   [ ] Total Active Students
   [ ] Average Maths/Reading/Writing scores (calculated from trackers).
   [ ] Number of Pending Communications
   [ ] Upcoming Weekly Plans.
[ ] Add navigation links to other sections like Students, Communications, and Planning.
[ ] Write unit tests to verify:
   [ ] Metrics are fetched and displayed correctly.
   [ ] Navigation links point to the correct destinations.
[ ] Ensure all tests pass before proceeding.

### Stage 1.2: Add Refresh and Customisation

[ ] Add a "Refresh" button to reload metrics dynamically.
[ ] Implement date range filters to adjust metrics (e.g., filter by term).
[ ] Write unit tests to verify:
   [ ] Metrics update correctly with filters or refresh.
[ ] Ensure all tests pass before marking this feature as complete.

### Stage 2: Add Summary Widgets

[ ] Implement widgets/cards that summarise:
   [ ] Maths Progress Overview (average score across all students).
   [ ] Reading Progress Overview.
   [ ] Writing Progress Overview.
[ ] Fetch data dynamically from the database for these summaries.
[ ] Write unit tests to verify:
   [ ] Summary widgets display the correct data.
   [ ] Database queries for metrics are accurate.
[ ] Ensure all tests pass before proceeding.

### Stage 3: Customisation and Filtering

[ ] Add date range filters to adjust the data shown in the hub.
[ ] Include a "Refresh" button to reload the dashboard data dynamically.
[ ] Write unit tests to verify:
   [ ] Date range filters update the displayed data correctly.
   [ ] Refresh button reloads the data without errors.
[ ] Ensure all tests pass before marking this feature as complete.

---

## **2. Students Management Screen**

Table package: @tanstack/react-table https://tanstack.com/table/latest/docs/introduction

### Stage 1: Basic Setup

[x] Create a dashboard page at `dashboard/students` that uses the existing layout.
[x] Use the Table component to display the students' list with columns: Checkbox, ID, Name, and an Edit icon.
[x] Use the Table component and ensure support for dynamic data loading.
[x] Write unit tests to verify:
   [x] Data is fetched and displayed correctly.
   [x] Table renders without errors for different data sets (e.g., empty list, large dataset).
[x] Ensure all tests pass before proceeding.

### Stage 2: Advanced Table Features

[x] Add search functionality to search for students by name.
[x] Add sorting functionality for columns like ID and Name.
[x] Implement pagination to limit the number of rows displayed at a time.
[x] Implement filtering to allow filtering students by `status`.
[x] Create or update unit tests to verify:
   [x] Sorting, filtering, and search functionalities work as expected.
   [x] Pagination works correctly, including edge cases (e.g., last page, empty results).
[x] Run tests individually then fix
[x] Run tests project wide then fix
[x] Ensure all tests pass before proceeding.

### Stage 3: Actions for Selected Rows

[x] Add row-level checkboxes and a "Select All" checkbox in the header.
[x] Display a row above the table with actions for selected rows.
[ ] Implement the Delete action for selected rows with confirmation before proceeding.
[ ] Add an Export action to export selected rows as a CSV file.
[ ] Write unit tests to verify:
   [ ] Bulk actions (Delete, Export) behave correctly.
   [ ] Confirmation modal works as expected.
[ ] Ensure all tests pass before proceeding.

### Stage 4: Edit Student Details

[ ] Add an Edit icon to each row that opens a modal when clicked.
[ ] Populate the modal with the student’s details for editing.
[ ] Implement Save functionality in the modal to update the database and refresh the table.
[ ] Add Cancel functionality to close the modal without saving changes.
[ ] Write unit tests to verify:
   [ ] Data is saved correctly and reflected in the table.
   [ ] Cancel action restores the previous state without saving.
[ ] Ensure all tests pass before proceeding.

### Stage 5: Add Student Form

[ ] Add a "New Student" button to open a modal or dedicated form page.
[ ] Implement functionality to create a new student and refresh the table.
[ ] Write unit tests to verify:
   [ ] New students are added correctly to the database.
   [ ] Table updates after adding a new student.
[ ] Ensure all tests pass before marking this feature as complete.

## **3. Communication Log Screen**

### Stage 1: Basic Setup

[ ] Create a page at `dashboard/communications` to display a log of communications.
[ ] Fetch and display data with columns: Date, Student Name, Communication Type, and Notes.
[ ] Add CRUD functionality for communication logs.
[ ] Include a "New Communication" button to add a new log entry.
[ ] Write unit tests to verify:
   [ ] Communication logs are fetched and displayed correctly.
   [ ] "New Communication" button triggers the appropriate action.
[ ] Ensure all tests pass before proceeding.

### Stage 2: Add Filtering and Search

[ ] Add filtering options to filter communications by type (e.g., Email, Call).
[ ] Include a search bar to search logs by Student Name or Notes.
[ ] Implement a "Follow-Up" action for flagged communications.
[ ] Write unit tests to verify:
   [ ] Filtering and search functionalities work correctly.
   [ ] Edge cases (e.g., no matches found) are handled gracefully.
[ ] Ensure all tests pass before proceeding.

### Stage 3: Add Communication Entry Form

[ ] Add a modal or dedicated form page to add a new communication entry.
[ ] Include fields for Date, Student (selectable from a dropdown), Communication Type, and Notes.
[ ] Write unit tests to verify:
   [ ] New communication entries are saved correctly.
   [ ] Validation works for required fields.
[ ] Ensure all tests pass before proceeding.

### Stage 4: Edit and Delete Logs

[ ] Add Edit and Delete icons to each row.
[ ] Implement functionality to edit a log in a modal.
[ ] Add confirmation for deleting log entries.
[ ] Write unit tests to verify:
   [ ] Edit and Delete actions update the database and UI correctly.
   [ ] Confirmation modal works as expected.
[ ] Ensure all tests pass before marking this feature as complete.

## **4. Weekly Planning Screen**

### Stage 1: Basic Setup

[ ] Create a page at `dashboard/planning/weekly` to display the weekly plan.
[ ] Fetch and display a list of weekly plans with columns: Week Start, Week End, and Plan Details.
[ ] Add CRUD functionality for weekly plans.
[ ] Write unit tests to verify:
   [ ] Weekly plans are fetched and displayed correctly.
   [ ] Weekly plans are saved and displayed correctly.
   [ ] Page renders without errors for various data conditions (e.g., no plans, many plans).
[ ] Ensure all tests pass before proceeding.

### Stage 2: Add CRUD Functionality

[ ] Add a "New Weekly Plan" button to open a form or modal for creating a weekly plan.
[ ] Include fields for Week Start, Week End, and Plan Details.
[ ] Implement Save functionality to add a new plan to the database and refresh the table.
[ ] Implement Edit and Delete functionality for existing plans:
   [ ] Edit opens a modal with pre-filled details.
   [ ] Delete shows a confirmation modal before proceeding.
[ ] Write unit tests to verify:
   [ ] New plans are created correctly.
   [ ] Existing plans are updated or deleted as expected.
   [ ] Validation works for required fields (e.g., Week Start, Week End).
[ ] Ensure all tests pass before proceeding.

### Stage 3: Advanced Features

[ ] Add filtering to view plans for specific weeks or months.
[ ] Include a search bar to search within Plan Details.
[ ] Write unit tests to verify:
   [ ] Filtering and search work correctly.
   [ ] Edge cases (e.g., no matching results) are handled gracefully.
[ ] Ensure all tests pass before marking this feature as complete.

---

## **5. Termly Planning Screen**

### Stage 1: Basic Setup

[ ] Create a page at `dashboard/planning/termly` to display the termly plan.
[ ] Fetch and display a list of termly plans with columns: Term Start, Term End, and Plan Details.
[ ] Add CRUD functionality for termly plans.
[ ] Write unit tests to verify:
   [ ] Termly plans are fetched and displayed correctly.
   [ ] Page renders without errors for various data conditions (e.g., no plans, many plans).
[ ] Ensure all tests pass before proceeding.

### Stage 2: Add CRUD Functionality

[ ] Add a "New Termly Plan" button to open a form or modal for creating a termly plan.
[ ] Include fields for Term Start, Term End, and Plan Details.
[ ] Implement Save functionality to add a new plan to the database and refresh the table.
[ ] Implement Edit and Delete functionality for existing plans:
   [ ] Edit opens a modal with pre-filled details.
   [ ] Delete shows a confirmation modal before proceeding.
[ ] Write unit tests to verify:
   [ ] New plans are created correctly.
   [ ] Existing plans are updated or deleted as expected.
   [ ] Validation works for required fields (e.g., Term Start, Term End).
[ ] Ensure all tests pass before proceeding.

### Stage 3: Advanced Features

[ ] Add filtering to view plans for specific terms or date ranges.
[ ] Include a search bar to search within Plan Details.
[ ] Write unit tests to verify:
   [ ] Filtering and search work correctly.
   [ ] Edge cases (e.g., no matching results) are handled gracefully.
[ ] Ensure all tests pass before marking this feature as complete.

---

## **6. Subject Overviews (Maths, Reading, Writing)**

### Stage 1: Basic Setup

[ ] Create separate pages for each subject overview, e.g.:
   [ ] `dashboard/overview/maths`
   [ ] `dashboard/overview/reading`
   [ ] `dashboard/overview/writing`
[ ] Fetch and display summary data for each subject:
   [ ] Average Score
   [ ] Latest Assessment Details
   [ ] Total Students Assessed
   [ ] Display weekly goals and progress for each subject.
[ ] Add a tracker for worksheet completion.
[ ] Write unit tests to verify:
   [ ] Summary data is fetched and displayed correctly.
   [ ] Weekly goals and progress are calculated correctly.
   [ ] Worksheet completion statuses are updated.
   [ ] Pages render without errors for various conditions (e.g., no data, many students).
[ ] Ensure all tests pass before proceeding.

### Stage 2: Display Student Performance

[ ] Display a table showing individual student performance with columns:
   [ ] Student Name
   [ ] Assessment
   [ ] Score
   [ ] Date
[ ] Add sorting functionality for columns like Score and Date.
[ ] Write unit tests to verify:
   [ ] Student performance data is displayed correctly.
   [ ] Sorting works as expected for numeric and date columns.
[ ] Ensure all tests pass before proceeding.

### Stage 3: Add Performance Details

[ ] Add an Edit icon to each row that opens a modal with detailed performance data for the student.
[ ] Include editable fields for metrics like Assessment Name, Score, and Date.
[ ] Implement Save functionality to update the database and refresh the table.
[ ] Write unit tests to verify:
   [ ] Performance data is updated correctly and reflected in the table.
   [ ] Save and Cancel actions work as expected.
[ ] Ensure all tests pass before marking this feature as complete.

---

## **7. Data Trackers**

#### **General Functionality for Data Trackers**

### Stage 1: Setup Data Tracker Pages

[ ] Create pages for data trackers (e.g., `dashboard/maths-tracker`, `dashboard/reading-tracker`).
[ ] Fetch and display tracker data as a table with columns:
   [ ] Student Name
   [ ] Metric Name
   [ ] Metric Value
   [ ] Recorded Date
[ ] Write unit tests to verify:
   [ ] Tracker data is fetched and displayed correctly.
   [ ] Table renders without errors for different conditions (e.g., no data, large datasets).
[ ] Ensure all tests pass before proceeding.

### Stage 2: Add Data Tracker CRUD Functionality

[ ] Add buttons to create, edit, and delete tracker entries.
[ ] Use modals for adding or editing entries with fields for:
   [ ] Student Name (dropdown)
   [ ] Metric Name
   [ ] Metric Value
   [ ] Recorded Date
[ ] Implement Save functionality for new and edited entries.
[ ] Add a confirmation modal for deleting tracker entries.
[ ] Write unit tests to verify:
   [ ] New entries are saved correctly.
   [ ] Existing entries are updated or deleted as expected.
   [ ] Validation works for required fields (e.g., Metric Name, Value).
[ ] Ensure all tests pass before proceeding.

### Stage 3: Advanced Features

[ ] Add filtering to view specific metrics or students.
[ ] Implement sorting for columns like Metric Value and Recorded Date.
[ ] Write unit tests to verify:
   [ ] Filtering and sorting work as expected.
   [ ] Edge cases (e.g., no matching results) are handled gracefully.
[ ] Ensure all tests pass before marking the feature as complete.

## **Analysis of Sheets and Their Requirements**

[ ] **Hub**:
   [ ] Appears to be a central dashboard with links or summary information.
   [ ] **Feature**: Include key metrics (e.g., student count, averages from other trackers, links to other sections).

[ ] **Student Overview**:
   [ ] Likely contains student-related data (e.g., first name, additional information).
   [ ] **Feature**: CRUD functionality for managing student profiles and displaying additional details.

[ ] **Communication Log**:
   [ ] Empty in the data provided, but columns suggest tracking communication with students or parents.
   [ ] **Feature**: CRUD functionality for logging communications, filtering by type, and follow-up actions.

[ ] **TimetableWeekly Planning**:
   [ ] A schedule with time slots and additional notes.
   [ ] **Feature**: Weekly planner functionality, allowing time slot entries and "job lists" for the week.

[ ] **Termly Planning**:
   [ ] Structured weekly plans for subjects (Maths, Reading, etc.).
   [ ] **Feature**: CRUD functionality for termly planning with support for subject-specific weekly breakdowns.

[ ] **Subject Overviews (Maths, Reading, Writing)**:
   [ ] Contains a weekly breakdown for each subject, with columns suggesting targets and worksheets.
   [ ] **Feature**: Subject-specific trackers with support for setting weekly goals and tracking worksheet completion.

[ ] **Data Trackers (Maths, Reading, Writing, RWI Phonics)**:
   [ ] Contains student-specific performance metrics.
   [ ] Includes calculated fields like averages (`#DIV/0!` in empty data).
   [ ] **Feature**: Student progress tracking with automatic average calculation.

[ ] **RWI Phonics Data Tracker**:
   [ ] Tracks specific phonics elements (e.g., `ck`, `au`).
   [ ] **Feature**: Specialised tracker for phonics with fields for individual phoneme completion.

[ ] **Writing Data Tracker**:
   [ ] Tracks student writing skills, possibly tied to performance levels.
   [ ] **Feature**: Writing progress tracking, including level assessments and skills.

--------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------

# PII Encryption Implementation Plan

### **Stage 1: Basic Setup**

#### Tasks

[ ] **Encrypt PII on Insert**:
   [ ] Modify the API layer to encrypt sensitive fields (e.g., name, email) using `crypto` in TypeScript.
   [ ] Update Drizzle ORM migrations to add encrypted columns.

     EXAMPLE:

     typescript
     import { pgTable, serial, text } from 'drizzle-orm/pg-core';

     export const users = pgTable('users', {
       id: serial('id').primaryKey(),
       encrypted_name: text('encrypted_name'),
     });

[ ] **Modify Insertion Logic**:
   [ ] Update API to encrypt data before inserting it into Postgres.

     EXAMPLE:

     typescript
     const encryptedName = encrypt('John Doe'); // Custom function for AES-256 encryption
     await db.insert(users).values({ encrypted_name: encryptedName });

[ ] **Decrypt PII on Fetch**:
   [ ] Fetch encrypted PII from the database and decrypt it on the server.

     EXAMPLE:

     typescript
     const user = await db.select(users.encrypted_name).where(users.id.eq(1)).execute();
     const decryptedName = decrypt(user[0]?.encrypted_name || '');

[ ] **Create a Test Endpoint**:
   [ ] Create an API route (`/api/test-encryption`) to test data insertion and retrieval.

#### Testing Tasks

[ ] Write unit tests:
   [ ] Verify encryption logic by encrypting and decrypting sample data.
   [ ] Validate database writes include encrypted fields.
   [ ] Validate API returns decrypted data.
[ ] Perform integration tests:
   [ ] Simulate insert and fetch operations via `/api/test-encryption`.

---

### **Stage 2: Enhancements**

#### Tasks

[ ] **Support Client-Side Encryption**:
   [ ] Implement client-side encryption using the WebCrypto API.

     typescript
     async function encryptClientData(data: string, key: CryptoKey): Promise<string> {
       const iv = crypto.getRandomValues(new Uint8Array(12));
       const encrypted = await crypto.subtle.encrypt(
         { name: 'AES-GCM', iv },
         key,
         new TextEncoder().encode(data)
       );
       return JSON.stringify({ iv: Array.from(iv), ciphertext: Array.from(new Uint8Array(encrypted)) });
     }

   [ ] Update the API to handle pre-encrypted data from the client.

[ ] **Update API to Handle Decryption**:
   [ ] Add logic to store encrypted blobs in Postgres without further server-side encryption.

[ ] **Add Key Management**:
   [ ] Use a passphrase or token to derive keys securely on the client.

#### Testing Tasks

[ ] Write unit tests:
   [ ] Validate client-side encryption using mock data.
   [ ] Verify compatibility between client-side encrypted data and server decryption.
[ ] Perform end-to-end tests:
   [ ] Insert encrypted data via the client and verify correctness via the API.
   [ ] Run `pnpm test` to ensure no regressions.

---

### **Stage 3: Actions and Interactivity**

#### Tasks

[ ] **Implement CRUD Operations with Encryption**:
   [ ] **Create**: Encrypt data on the client and insert it via the API.
   [ ] **Read**: Fetch encrypted data and decrypt it on the client.
   [ ] **Update**: Support client-side encryption for updates, re-encrypting modified fields.
   [ ] **Delete**: Remove encrypted data securely from the database.

[ ] **Update Forms**:
   [ ] Ensure all forms encrypt PII before submission using WebCrypto.

[ ] **Add Error Handling**:
   [ ] Display meaningful error messages for encryption/decryption failures.

#### Testing Tasks

[ ] Write unit tests:
   [ ] Test CRUD operations with encrypted data.
   [ ] Validate error handling for invalid keys or corrupted data.
[ ] Perform integration tests:
   [ ] Simulate user interactions (e.g., create, update, delete) and verify encrypted database writes.
   [ ] Run `pnpm test` to ensure all tests pass.

---

### **Stage 4: Optimisation**

#### Tasks

[ ] **Improve Performance**:
   [ ] Use indexed columns for encrypted fields (e.g., hash columns for searching).

     typescript
     export const users = pgTable('users', {
       encrypted_name: text('encrypted_name'),
       name_hash: text('name_hash').index(),
     });

   [ ] Store a SHA-256 hash of PII for lookup purposes.

[ ] **Add Pagination**:
   [ ] Implement server-side pagination for fetching encrypted data efficiently.

[ ] **Harden Security**:
   [ ] Use environment variables for keys and secrets.
   [ ] Audit the application for plaintext PII exposure.

[ ] **Accessibility and Usability**:
   [ ] Ensure error messages and loading states meet accessibility standards.

#### Testing Tasks

[ ] Write unit tests:
   [ ] Verify search and pagination work with encrypted fields.
   [ ] Test hash-based lookups for encrypted data.
[ ] Perform system-wide tests:
   [ ] Run `pnpm test` to ensure all performance and security optimizations are functional.

---

### **Stage 5: Deployment and Monitoring**

#### Tasks

[ ] Deploy the application to the staging environment.
[ ] Enable logging for encryption/decryption failures using tools like DataDog or Sentry.
[ ] Monitor system performance and error rates post-deployment.

#### Testing Tasks

[ ] Perform smoke tests in staging:
   [ ] Test end-to-end functionality (CRUD, client encryption, server decryption).
[ ] Validate logging and error alerts for encryption-related issues.
