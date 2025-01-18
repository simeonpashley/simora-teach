## Student Management

### Stage 1: Basic Table Setup

1. Create a dashboard page at `dashboard/students` that uses the existing dashboard layout.
2. Fetch a list of students from the database using Drizzle ORM.
3. Use the Table component to display the students' list with columns: Checkbox, ID, Name, and an Edit icon.
4. Ensure the table can handle dynamic data loading.

### Stage 2: Table Enhancements

1. Add sorting functionality for columns like ID and Name.
2. Implement filtering to allow filtering students by `status`.
3. Add search functionality to allow searching for students by name.
4. Implement pagination to limit the number of rows displayed at a time.

### Stage 3: Actions for Selected Rows

1. Add checkboxes to each row and a "Select All" checkbox in the header.

**DONE UP TO HERE**

2. When one or more rows are selected, display a row above the table with actions for the selected rows.
3. Implement a Delete action that deletes the selected rows, with confirmation before proceeding.
4. Add an Export action to export selected rows as a CSV file.

### Stage 4: Row Editing

1. Add an Edit icon to each row that opens a modal when clicked.
2. Populate the modal with the student’s details, allowing fields like Name and Status to be edited.
3. Implement Save functionality in the modal to update the database and refresh the table.
4. Add Cancel functionality to close the modal without saving changes.
5. Display a confirmation dialog when the Save button is clicked.

### Stage 5: Optimisation and Feedback

1. Display loading states for the table and modal during data fetching or saving.
2. Handle errors gracefully, with user-friendly error messages for failed operations.
3. Ensure database queries are efficient and support batched updates or inserts where applicable.
4. Test for accessibility, including keyboard navigation and screen reader support.

Here’s the updated **application design implementation plan** with testing tasks integrated into each stage for every feature and screen. This ensures features are tested as they are developed.

---

## **Dashboard Features and Screens with Testing**

### **1. Hub Screen**

```markdown
### Stage 1: Basic Setup
1. Create a dashboard page at `dashboard/hub` using the existing layout.
2. Display key metrics from the database, such as:
   - Total Students
   - Total Active Students
   - Number of Pending Communications
   - Upcoming Weekly Plans.
3. Add navigation links to other sections like Students, Communications, and Planning.
4. Write unit tests to verify:
   - Metrics are fetched and displayed correctly.
   - Navigation links point to the correct destinations.
5. Ensure all tests pass before proceeding.

### Stage 2: Add Summary Widgets
1. Implement widgets/cards that summarise:
   - Maths Progress Overview (average score across all students).
   - Reading Progress Overview.
   - Writing Progress Overview.
2. Fetch data dynamically from the database for these summaries.
3. Write unit tests to verify:
   - Summary widgets display the correct data.
   - Database queries for metrics are accurate.
4. Ensure all tests pass before proceeding.

### Stage 3: Customisation and Filtering
1. Add date range filters to adjust the data shown in the hub.
2. Include a "Refresh" button to reload the dashboard data dynamically.
3. Write unit tests to verify:
   - Date range filters update the displayed data correctly.
   - Refresh button reloads the data without errors.
4. Ensure all tests pass before marking this feature as complete.
```

---

### **2. Students Management Screen**

```markdown
### Stage 1: Basic Setup
1. Create a dashboard page at `dashboard/students` that uses the existing layout.
2. Fetch and display a list of students with columns: ID, First Name, Last Name, Date of Birth, and Status.
3. Use the Table component and ensure support for dynamic data loading.
4. Write unit tests to verify:
   - Data is fetched and displayed correctly.
   - Table renders without errors for different data sets (e.g., empty list, large dataset).
5. Ensure all tests pass before proceeding.

### Stage 2: Advanced Table Features
1. Add sorting functionality for columns like ID and Name.
2. Implement filtering to allow filtering students by `status`.
3. Add search functionality to search for students by name.
4. Implement pagination to limit the number of rows displayed at a time.
5. Write unit tests to verify:
   - Sorting, filtering, and search functionalities work as expected.
   - Pagination works correctly, including edge cases (e.g., last page, empty results).
6. Ensure all tests pass before proceeding.

### Stage 3: Actions for Selected Rows
1. Add row-level checkboxes and a "Select All" checkbox in the header.
2. Display a row above the table with actions for selected rows.
3. Implement the Delete action for selected rows with confirmation before proceeding.
4. Add an Export action to export selected rows as a CSV file.
5. Write unit tests to verify:
   - Bulk actions (Delete, Export) behave correctly.
   - Confirmation modal works as expected.
6. Ensure all tests pass before proceeding.

### Stage 4: Edit Student Details
1. Add an Edit icon to each row that opens a modal when clicked.
2. Populate the modal with the student’s details for editing.
3. Implement Save functionality in the modal to update the database and refresh the table.
4. Add Cancel functionality to close the modal without saving changes.
5. Write unit tests to verify:
   - Data is saved correctly and reflected in the table.
   - Cancel action restores the previous state without saving.
6. Ensure all tests pass before proceeding.

### Stage 5: Add Student Form
1. Add a "New Student" button to open a modal or dedicated form page.
2. Implement functionality to create a new student and refresh the table.
3. Write unit tests to verify:
   - New students are added correctly to the database.
   - Table updates after adding a new student.
4. Ensure all tests pass before marking this feature as complete.
```

---

### **3. Communication Log Screen**

```markdown
### Stage 1: Basic Setup
1. Create a page at `dashboard/communications` to display a log of communications.
2. Fetch and display data with columns: Date, Student Name, Communication Type, and Notes.
3. Include a "New Communication" button to add a new log entry.
4. Write unit tests to verify:
   - Communication logs are fetched and displayed correctly.
   - "New Communication" button triggers the appropriate action.
5. Ensure all tests pass before proceeding.

### Stage 2: Add Filtering and Search
1. Add filtering options to filter communications by type (e.g., Email, Call).
2. Include a search bar to search logs by Student Name or Notes.
3. Write unit tests to verify:
   - Filtering and search functionalities work correctly.
   - Edge cases (e.g., no matches found) are handled gracefully.
4. Ensure all tests pass before proceeding.

### Stage 3: Add Communication Entry Form
1. Add a modal or dedicated form page to add a new communication entry.
2. Include fields for Date, Student (selectable from a dropdown), Communication Type, and Notes.
3. Write unit tests to verify:
   - New communication entries are saved correctly.
   - Validation works for required fields.
4. Ensure all tests pass before proceeding.

### Stage 4: Edit and Delete Logs
1. Add Edit and Delete icons to each row.
2. Implement functionality to edit a log in a modal.
3. Add confirmation for deleting log entries.
4. Write unit tests to verify:
   - Edit and Delete actions update the database and UI correctly.
   - Confirmation modal works as expected.
5. Ensure all tests pass before marking this feature as complete.
```

Here’s the continuation for the **Planning Screens** and **Subject Overviews**, maintaining the structured format and testing integration.

---

### **4. Weekly Planning Screen**

```markdown
### Stage 1: Basic Setup
1. Create a page at `dashboard/planning/weekly` to display the weekly plan.
2. Fetch and display a list of weekly plans with columns: Week Start, Week End, and Plan Details.
3. Write unit tests to verify:
   - Weekly plans are fetched and displayed correctly.
   - Page renders without errors for various data conditions (e.g., no plans, many plans).
4. Ensure all tests pass before proceeding.

### Stage 2: Add CRUD Functionality
1. Add a "New Weekly Plan" button to open a form or modal for creating a weekly plan.
2. Include fields for Week Start, Week End, and Plan Details.
3. Implement Save functionality to add a new plan to the database and refresh the table.
4. Implement Edit and Delete functionality for existing plans:
   - Edit opens a modal with pre-filled details.
   - Delete shows a confirmation modal before proceeding.
5. Write unit tests to verify:
   - New plans are created correctly.
   - Existing plans are updated or deleted as expected.
   - Validation works for required fields (e.g., Week Start, Week End).
6. Ensure all tests pass before proceeding.

### Stage 3: Advanced Features
1. Add filtering to view plans for specific weeks or months.
2. Include a search bar to search within Plan Details.
3. Write unit tests to verify:
   - Filtering and search work correctly.
   - Edge cases (e.g., no matching results) are handled gracefully.
4. Ensure all tests pass before marking this feature as complete.
```

---

### **5. Termly Planning Screen**

```markdown
### Stage 1: Basic Setup
1. Create a page at `dashboard/planning/termly` to display the termly plan.
2. Fetch and display a list of termly plans with columns: Term Start, Term End, and Plan Details.
3. Write unit tests to verify:
   - Termly plans are fetched and displayed correctly.
   - Page renders without errors for various data conditions (e.g., no plans, many plans).
4. Ensure all tests pass before proceeding.

### Stage 2: Add CRUD Functionality
1. Add a "New Termly Plan" button to open a form or modal for creating a termly plan.
2. Include fields for Term Start, Term End, and Plan Details.
3. Implement Save functionality to add a new plan to the database and refresh the table.
4. Implement Edit and Delete functionality for existing plans:
   - Edit opens a modal with pre-filled details.
   - Delete shows a confirmation modal before proceeding.
5. Write unit tests to verify:
   - New plans are created correctly.
   - Existing plans are updated or deleted as expected.
   - Validation works for required fields (e.g., Term Start, Term End).
6. Ensure all tests pass before proceeding.

### Stage 3: Advanced Features
1. Add filtering to view plans for specific terms or date ranges.
2. Include a search bar to search within Plan Details.
3. Write unit tests to verify:
   - Filtering and search work correctly.
   - Edge cases (e.g., no matching results) are handled gracefully.
4. Ensure all tests pass before marking this feature as complete.
```

---

### **6. Subject Overviews (Maths, Reading, Writing)**

```markdown
### Stage 1: Basic Setup
1. Create separate pages for each subject overview, e.g.:
   - `dashboard/maths-overview`
   - `dashboard/reading-overview`
   - `dashboard/writing-overview`
2. Fetch and display summary data for each subject:
   - Average Score
   - Latest Assessment Details
   - Total Students Assessed
3. Write unit tests to verify:
   - Summary data is fetched and displayed correctly.
   - Pages render without errors for various conditions (e.g., no data, many students).
4. Ensure all tests pass before proceeding.

### Stage 2: Display Student Performance
1. Display a table showing individual student performance with columns:
   - Student Name
   - Assessment
   - Score
   - Date
2. Add sorting functionality for columns like Score and Date.
3. Write unit tests to verify:
   - Student performance data is displayed correctly.
   - Sorting works as expected for numeric and date columns.
4. Ensure all tests pass before proceeding.

### Stage 3: Add Performance Details
1. Add an Edit icon to each row that opens a modal with detailed performance data for the student.
2. Include editable fields for metrics like Assessment Name, Score, and Date.
3. Implement Save functionality to update the database and refresh the table.
4. Write unit tests to verify:
   - Performance data is updated correctly and reflected in the table.
   - Save and Cancel actions work as expected.
5. Ensure all tests pass before marking this feature as complete.
```

---

### **7. Data Trackers**

#### **General Functionality for Data Trackers**

```markdown
### Stage 1: Setup Data Tracker Pages
1. Create pages for data trackers (e.g., `dashboard/maths-tracker`, `dashboard/reading-tracker`).
2. Fetch and display tracker data as a table with columns:
   - Student Name
   - Metric Name
   - Metric Value
   - Recorded Date
3. Write unit tests to verify:
   - Tracker data is fetched and displayed correctly.
   - Table renders without errors for different conditions (e.g., no data, large datasets).
4. Ensure all tests pass before proceeding.

### Stage 2: Add Data Tracker CRUD Functionality
1. Add buttons to create, edit, and delete tracker entries.
2. Use modals for adding or editing entries with fields for:
   - Student Name (dropdown)
   - Metric Name
   - Metric Value
   - Recorded Date
3. Implement Save functionality for new and edited entries.
4. Add a confirmation modal for deleting tracker entries.
5. Write unit tests to verify:
   - New entries are saved correctly.
   - Existing entries are updated or deleted as expected.
   - Validation works for required fields (e.g., Metric Name, Value).
6. Ensure all tests pass before proceeding.

### Stage 3: Advanced Features
1. Add filtering to view specific metrics or students.
2. Implement sorting for columns like Metric Value and Recorded Date.
3. Write unit tests to verify:
   - Filtering and sorting work as expected.
   - Edge cases (e.g., no matching results) are handled gracefully.
4. Ensure all tests pass before marking the feature as complete.
```

Based on the provided summary of the sheets and their content, here is an analysis of the features and calculations required for your application. The goal is to ensure all formulas and functionalities from the Excel file are replicated.

---

### **Analysis of Sheets and Their Requirements**

1. **Hub**:
   - Appears to be a central dashboard with links or summary information.
   - **Feature**: Include key metrics (e.g., student count, averages from other trackers, links to other sections).

2. **Student Overview**:
   - Likely contains student-related data (e.g., first name, additional information).
   - **Feature**: CRUD functionality for managing student profiles and displaying additional details.

3. **Communication Log**:
   - Empty in the data provided, but columns suggest tracking communication with students or parents.
   - **Feature**: CRUD functionality for logging communications, filtering by type, and follow-up actions.

4. **TimetableWeekly Planning**:
   - A schedule with time slots and additional notes.
   - **Feature**: Weekly planner functionality, allowing time slot entries and "job lists" for the week.

5. **Termly Planning**:
   - Structured weekly plans for subjects (Maths, Reading, etc.).
   - **Feature**: CRUD functionality for termly planning with support for subject-specific weekly breakdowns.

6. **Subject Overviews (Maths, Reading, Writing)**:
   - Contains a weekly breakdown for each subject, with columns suggesting targets and worksheets.
   - **Feature**: Subject-specific trackers with support for setting weekly goals and tracking worksheet completion.

7. **Data Trackers (Maths, Reading, Writing, RWI Phonics)**:
   - Contains student-specific performance metrics.
   - Includes calculated fields like averages (`#DIV/0!` in empty data).
   - **Feature**: Student progress tracking with automatic average calculation.

8. **RWI Phonics Data Tracker**:
   - Tracks specific phonics elements (e.g., `ck`, `au`).
   - **Feature**: Specialised tracker for phonics with fields for individual phoneme completion.

9. **Writing Data Tracker**:
   - Tracks student writing skills, possibly tied to performance levels.
   - **Feature**: Writing progress tracking, including level assessments and skills.

---

### **Implementation Plan for Application Features**

Here is a task-oriented implementation plan, ensuring formulas and functionality are included:

---

### **1. Dashboard (Hub)**

```markdown
### Stage 1: Setup the Hub Screen
1. Create a dashboard page at `dashboard/hub` that links to all major sections (e.g., Students, Communication Log, Data Trackers).
2. Display key metrics such as:
   - Total Students
   - Average Maths/Reading/Writing scores (calculated from trackers).
   - Pending Communications (from Communication Log).
3. Write unit tests to verify:
   - Metrics are calculated correctly.
   - Links navigate to the correct pages.
4. Ensure all tests pass before proceeding.

### Stage 2: Add Refresh and Customisation
1. Add a "Refresh" button to reload metrics dynamically.
2. Implement date range filters to adjust metrics (e.g., filter by term).
3. Write unit tests to verify:
   - Metrics update correctly with filters or refresh.
4. Ensure all tests pass before marking this feature as complete.
```

---

### **2. Students Management**

```markdown
### Stage 1: Basic Setup
1. Create a page at `dashboard/students` to display student data:
   - Columns: ID, First Name, Last Name, Additional Information.
2. Add CRUD functionality for students (Add, Edit, Delete).
3. Write unit tests to verify:
   - Student data is displayed and modified correctly.
4. Ensure all tests pass before proceeding.

### Stage 2: Advanced Features
1. Add search, sorting, and filtering options for student data.
2. Include bulk actions (e.g., delete multiple students).
3. Write unit tests to verify:
   - Search, sorting, and filtering work as expected.
   - Bulk actions update the database correctly.
4. Ensure all tests pass before proceeding.
```

---

### **3. Communication Log**

```markdown
### Stage 1: Basic Setup
1. Create a page at `dashboard/communications` to log communications:
   - Columns: Date, Student Name, Communication Type, Notes, Follow-Up.
2. Add CRUD functionality for communication logs.
3. Write unit tests to verify:
   - Logs are saved, displayed, and updated correctly.
4. Ensure all tests pass before proceeding.

### Stage 2: Filtering and Follow-Up Actions
1. Add filters for communication type and follow-up status.
2. Implement a "Follow-Up" action for flagged communications.
3. Write unit tests to verify:
   - Filtering and follow-up actions behave as expected.
4. Ensure all tests pass before marking this feature as complete.
```

---

### **4. Weekly and Termly Planning**

```markdown
### Stage 1: Weekly Planning
1. Create a page at `dashboard/planning/weekly` to manage weekly plans:
   - Time Slots: Columns for start and end times.
   - Notes Section: "Job List" for the week.
2. Add CRUD functionality for weekly plans.
3. Write unit tests to verify:
   - Weekly plans are saved and displayed correctly.
4. Ensure all tests pass before proceeding.

### Stage 2: Termly Planning
1. Create a page at `dashboard/planning/termly` to manage termly plans:
   - Columns: Week Commencing, Maths, Reading, Writing, etc.
2. Add CRUD functionality for termly plans.
3. Write unit tests to verify:
   - Termly plans are saved and displayed correctly.
4. Ensure all tests pass before proceeding.
```

---

### **5. Subject and Data Trackers**

```markdown
### Stage 1: Subject Overviews
1. Create pages for Maths, Reading, and Writing Overviews.
2. Display weekly goals and progress for each subject.
3. Add a tracker for worksheet completion.
4. Write unit tests to verify:
   - Weekly goals and progress are calculated correctly.
   - Worksheet completion statuses are updated.
5. Ensure all tests pass before proceeding.

### Stage 2: Data Trackers
1. Create pages for subject data trackers (Maths, Reading, Writing, RWI Phonics).
2. Display student performance metrics with automatic average calculations.
3. Add CRUD functionality for adding/editing metrics.
4. Write unit tests to verify:
   - Metrics are calculated and displayed correctly.
   - Validation for metric inputs works as expected.
5. Ensure all tests pass before marking this feature as complete.
```

## PII Encryption Implementation Plan

### **Stage 1: Basic Setup**

#### Tasks

1. **Encrypt PII on Insert**:
   - Modify the API layer to encrypt sensitive fields (e.g., name, email) using `crypto` in TypeScript.
   - Update Drizzle ORM migrations to add encrypted columns.

     EXAMPLE:

     ```typescript
     import { pgTable, serial, text } from 'drizzle-orm/pg-core';

     export const users = pgTable('users', {
       id: serial('id').primaryKey(),
       encrypted_name: text('encrypted_name'),
     });
     ```

2. **Modify Insertion Logic**:
   - Update API to encrypt data before inserting it into Postgres.

     EXAMPLE:

     ```typescript
     const encryptedName = encrypt('John Doe'); // Custom function for AES-256 encryption
     await db.insert(users).values({ encrypted_name: encryptedName });
     ```

3. **Decrypt PII on Fetch**:
   - Fetch encrypted PII from the database and decrypt it on the server.

     EXAMPLE:

     ```typescript
     const user = await db.select(users.encrypted_name).where(users.id.eq(1)).execute();
     const decryptedName = decrypt(user[0]?.encrypted_name || '');
     ```

4. **Create a Test Endpoint**:
   - Create an API route (`/api/test-encryption`) to test data insertion and retrieval.

#### Testing Tasks

1. Write unit tests:
   - Verify encryption logic by encrypting and decrypting sample data.
   - Validate database writes include encrypted fields.
   - Validate API returns decrypted data.
2. Perform integration tests:
   - Simulate insert and fetch operations via `/api/test-encryption`.

---

### **Stage 2: Enhancements**

#### Tasks

1. **Support Client-Side Encryption**:
   - Implement client-side encryption using the WebCrypto API.

     ```typescript
     async function encryptClientData(data: string, key: CryptoKey): Promise<string> {
       const iv = crypto.getRandomValues(new Uint8Array(12));
       const encrypted = await crypto.subtle.encrypt(
         { name: 'AES-GCM', iv },
         key,
         new TextEncoder().encode(data)
       );
       return JSON.stringify({ iv: Array.from(iv), ciphertext: Array.from(new Uint8Array(encrypted)) });
     }
     ```

   - Update the API to handle pre-encrypted data from the client.

2. **Update API to Handle Decryption**:
   - Add logic to store encrypted blobs in Postgres without further server-side encryption.

3. **Add Key Management**:
   - Use a passphrase or token to derive keys securely on the client.

#### Testing Tasks

1. Write unit tests:
   - Validate client-side encryption using mock data.
   - Verify compatibility between client-side encrypted data and server decryption.
2. Perform end-to-end tests:
   - Insert encrypted data via the client and verify correctness via the API.
   - Run `pnpm test` to ensure no regressions.

---

### **Stage 3: Actions and Interactivity**

#### Tasks

1. **Implement CRUD Operations with Encryption**:
   - **Create**: Encrypt data on the client and insert it via the API.
   - **Read**: Fetch encrypted data and decrypt it on the client.
   - **Update**: Support client-side encryption for updates, re-encrypting modified fields.
   - **Delete**: Remove encrypted data securely from the database.

2. **Update Forms**:
   - Ensure all forms encrypt PII before submission using WebCrypto.

3. **Add Error Handling**:
   - Display meaningful error messages for encryption/decryption failures.

#### Testing Tasks

1. Write unit tests:
   - Test CRUD operations with encrypted data.
   - Validate error handling for invalid keys or corrupted data.
2. Perform integration tests:
   - Simulate user interactions (e.g., create, update, delete) and verify encrypted database writes.
   - Run `pnpm test` to ensure all tests pass.

---

### **Stage 4: Optimisation**

#### Tasks

1. **Improve Performance**:
   - Use indexed columns for encrypted fields (e.g., hash columns for searching).

     ```typescript
     export const users = pgTable('users', {
       encrypted_name: text('encrypted_name'),
       name_hash: text('name_hash').index(),
     });
     ```

   - Store a SHA-256 hash of PII for lookup purposes.

2. **Add Pagination**:
   - Implement server-side pagination for fetching encrypted data efficiently.

3. **Harden Security**:
   - Use environment variables for keys and secrets.
   - Audit the application for plaintext PII exposure.

4. **Accessibility and Usability**:
   - Ensure error messages and loading states meet accessibility standards.

#### Testing Tasks

1. Write unit tests:
   - Verify search and pagination work with encrypted fields.
   - Test hash-based lookups for encrypted data.
2. Perform system-wide tests:
   - Run `pnpm test` to ensure all performance and security optimizations are functional.

---

### **Stage 5: Deployment and Monitoring**

#### Tasks

1. Deploy the application to the staging environment.
2. Enable logging for encryption/decryption failures using tools like DataDog or Sentry.
3. Monitor system performance and error rates post-deployment.

#### Testing Tasks

1. Perform smoke tests in staging:
   - Test end-to-end functionality (CRUD, client encryption, server decryption).
2. Validate logging and error alerts for encryption-related issues.
