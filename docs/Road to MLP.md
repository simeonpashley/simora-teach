# Road to MLP: Iterative Plan for Rose MLP

At each stage, the product must be enhanced with a potentially shippable increment that meets the Definition of Done and adds measurable value to the overall product.

Delivered in 4 distinct phases:
1. Basic Setup
2. Enhancements
3. Actions and Interactivity
4. Optimisation

## Plan

### **Stage 1: Basic Setup**

#### **Feature: Dashboard Overview**

1. **Key Functionality**: Provide an overview of key metrics (e.g., student count, pending tasks, upcoming meetings).
2. **Tasks**:
   - [x] Create a dashboard page at `/dashboard`.
   - [x] Fetch aggregated data from the database for:
     - Total number of students (`studentSchema`).
     - Count of pending milestones (`milestoneTrackerSchema`).
     - Count of IEPs nearing due dates (`iepSchema`).
     - Scheduled meetings (`communicationLogSchema`).
   - [ ] Display metrics in summary cards.
      #### **1. Student Overview**
      - [ ] Display the total number of students (`Total Students`).
      - [ ] Display the number of students with active SEN designations (`SEN Students`).
      - [ ] Display the number of students in EYFS stages (`EYFS Students`).
      - [ ] Display the count of active vs. inactive students (`Active vs. Inactive Students`).
      #### **2. Milestone Tracking**
      - [ ] Display the total number of milestones yet to be marked as "Developing" or "Secure" (`Pending Milestones`).
      - [ ] Display the percentage or count of milestones marked as "Secure" (`Completed Milestones`).
      - [ ] Display milestones that are past their expected completion date (`Overdue Milestones`).
      #### **3. IEP Management**
      - [ ] Display the number of ongoing Individual Education Plans (`Active IEPs`).
      - [ ] Display the count of IEPs with review dates within the next 30 days (`Upcoming IEP Reviews`).
      - [ ] Display the percentage of IEP goals marked as "Completed" (`Completed IEP Goals`).
      #### **4. Weekly and Termly Planning**
      - [ ] Display the total number of weekly planned activities (`Activities Planned This Week`).
      - [ ] Display the percentage of termly objectives marked as "On Track" (`Termly Progress`).
      - [ ] Display the number of planned activities not marked as completed within the expected timeframe (`Missed Activities`).
      #### **5. Communication Logs**
      - [ ] Display the number of logged communications in the past 7 days (`Recent Communications`).
      - [ ] Display the count of follow-up actions scheduled for the current week (`Follow-Ups Due`).
      - [ ] Display the percentage of parents involved in recent meetings or updates (`Parent Engagement`).
   - [ ] Implement navigation links to milestones, IEPs, and weekly planner pages.
   - [ ] Write unit tests to verify
   - [ ] Ensure all tests pass.

Yes, implementing navigation links to milestones, IEPs, and weekly planner pages will require a similar structured task list for each page to ensure the necessary functionality is delivered systematically.

Here's the markdown task list for implementing these pages:

---

### **Navigation Links Implementation Task List**

#### **1. Add Navigation Links**
- [ ] Add a navigation link to the **Milestones Tracker** page in the dashboard.
- [ ] Add a navigation link to the **IEPs Management** page in the dashboard.
- [ ] Add a navigation link to the **Weekly Planner** page in the dashboard.

---

### **Milestones Tracker Page**

#### **1. Basic Setup**
- [ ] Create a new page for **Milestones Tracker** at `/dashboard/milestones`.
- [ ] Fetch milestone data from the database using `milestoneTrackerSchema`.
- [ ] Display milestones in a table with the following columns:
  - [ ] Student Name
  - [ ] Milestone Name
  - [ ] Milestone Category
  - [ ] Status (Emerging, Developing, Secure)
  - [ ] Evidence (link or text snippet).

#### **2. Enhancements**
- [ ] Add filters for milestone category (e.g., Communication, Physical Development).
- [ ] Add sorting by milestone status.
- [ ] Implement pagination for large datasets.

#### **3. Actions and Interactivity**
- [ ] Add an inline editor to update milestone status and evidence.
- [ ] Write unit tests to verify:
  - [ ] Milestone data fetches correctly.
  - [ ] Filters, sorting, and pagination work as expected.
  - [ ] Inline editing updates the database and UI correctly.

---

### **IEPs Management Page**

#### **1. Basic Setup**
- [ ] Create a new page for **IEPs Management** at `/dashboard/ieps`.
- [ ] Fetch IEP data from the database using `iepSchema`.
- [ ] Display IEPs in a table with the following columns:
  - [ ] Student Name
  - [ ] Goal Name
  - [ ] Progress (%)
  - [ ] Status (In Progress, Completed)
  - [ ] Evidence (link or text snippet).
  - [ ] Due Date.

#### **2. Enhancements**
- [ ] Add search functionality for student name and goal name.
- [ ] Add sorting by status or progress.
- [ ] Implement pagination for large datasets.

#### **3. Actions and Interactivity**
- [ ] Add a button to create a new IEP, opening a modal with the following fields:
  - Goal Name
  - Description
  - Start Date
  - Due Date
  - Evidence (Markdown input or URL).
- [ ] Allow inline editing for progress and status updates.
- [ ] Write unit tests to verify:
  - [ ] IEP data fetches correctly.
  - [ ] Filters, sorting, and pagination work as expected.
  - [ ] Inline edits and modal save data as expected.

### **Weekly Planner Page**

#### **1. Basic Setup**
- [ ] Create a new page for **Weekly Planner** at `/dashboard/weekly-planner`.
- [ ] Fetch weekly plans from the database using `weeklyPlanningSchema`.
- [ ] Display plans in a calendar-like layout, grouped by week, with the following fields:
  - [ ] Week Start and End Dates.
  - [ ] Plan Details (e.g., activity descriptions).

#### **2. Enhancements**
- [ ] Add the ability to create new weekly plans, opening a modal with:
  - Week Start and End Dates.
  - Plan Details (rich text or Markdown).
- [ ] Add an inline editor to update plan details.

#### **3. Actions and Interactivity**
- [ ] Add bulk actions to delete or mark plans as completed.
- [ ] Write unit tests to verify:
  - [ ] Weekly plan data fetches correctly.
  - [ ] Calendar layout displays weekly plans as expected.
  - [ ] Inline editing and modal save data as expected.

---

### **Testing Tasks for All Pages**
1. Write unit tests to verify:
   - [ ] Data is fetched and displayed correctly for each page.
   - [ ] Actions like filtering, sorting, and pagination work as expected.
   - [ ] Inline editors and modals update data successfully.
2. Test the navigation flow:
   - [ ] Clicking a link on the dashboard navigates to the correct page.
   - [ ] Browser back and forward buttons behave as expected.
3. Run integration tests to confirm:
   - [ ] All pages work together without breaking the navigation or dashboard.

#### **Feature: Student Management**

1. **Key Functionality**: List students with filters and actions.
2. **Tasks**:
   - [ ] Create a student management page at `/dashboard/students`.
   - [ ] Fetch student data from `studentSchema`.
   - [ ] Display students in a table with columns for:
     - Name
     - SEN/EYFS status
     - Associated IEPs (count).
   - [ ] Add search functionality for filtering by name.
   - [ ] Add sorting by SEN/EYFS status.
   - [ ] Write unit tests to verify:
     - [ ] Data fetches correctly and renders in the table.
     - [ ] Search and sorting functionality works as expected.
   - [ ] Ensure all tests pass.

---

#### **Feature: EYFS Milestone Tracker**

1. **Key Functionality**: Track and update milestones for EYFS students.
2. **Tasks**:
   - [ ] Create a milestones page at `/dashboard/milestones`.
   - [ ] Fetch milestone data for all students from `milestoneTrackerSchema`.
   - [ ] Display milestones in a table with columns for:
     - Student Name
     - Milestone Name
     - Category
     - Status (Emerging, Developing, Secure).
   - [ ] Add filters for milestone category and status.
   - [ ] Write unit tests to verify:
     - [ ] Milestone data fetches correctly.
     - [ ] Filters work as expected.
   - [ ] Ensure all tests pass.

---

### **Stage 2: Enhancements**

#### **Feature: Dashboard Overview**

1. **Tasks**:
   - [ ] Add a graph to show progress trends for milestones or IEPs over the past term.
   - [ ] Implement loading and error states for the metrics.
   - [ ] Write unit tests to verify:
     - [ ] Graph displays correct data.
     - [ ] Loading and error states behave as expected.

---

#### **Feature: Student Management**

1. **Tasks**:
   - [ ] Add bulk actions for:
     - Sending reminders to parents.
     - Assigning group milestones.
   - [ ] Add pagination to limit the number of students displayed per page.
   - [ ] Write unit tests to verify:
     - [ ] Bulk actions perform correctly.
     - [ ] Pagination works and handles edge cases.
   - [ ] Ensure all tests pass.

---

#### **Feature: EYFS Milestone Tracker**

1. **Tasks**:
   - [ ] Add an inline editor to update milestone statuses.
   - [ ] Implement bulk actions for marking multiple milestones as secure.
   - [ ] Write unit tests to verify:
     - [ ] Inline editor updates milestones correctly.
     - [ ] Bulk actions trigger expected updates.
   - [ ] Ensure all tests pass.

---

### **Stage 3: Actions and Interactivity**

#### **Feature: SEN IEP Management**

1. **Key Functionality**: Add, update, and review IEPs for SEN students.
2. **Tasks**:
   - [ ] Create an IEP management page at `/dashboard/ieps`.
   - [ ] Fetch IEP data for students from `iepSchema`.
   - [ ] Display IEPs in a table with columns for:
     - Student Name
     - Goal Name
     - Progress (%)
     - Status.
   - [ ] Add a button to add a new IEP, opening a modal for:
     - Goal Name
     - Description
     - Due Date
     - Evidence (Markdown).
   - [ ] Allow inline editing of progress and status.
   - [ ] Write unit tests to verify:
     - [ ] IEP creation works and saves data correctly.
     - [ ] Inline edits update the database as expected.
   - [ ] Ensure all tests pass.

---

#### **Feature: Communication Log**

1. **Tasks**:
   - [ ] Add actions to:
     - Set follow-up reminders.
     - Send email confirmations to parents.
   - [ ] Implement sorting by communication type and date.
   - [ ] Write unit tests to verify:
     - [ ] Follow-up reminders save correctly.
     - [ ] Emails are sent successfully.
   - [ ] Ensure all tests pass.

---

### **Stage 4: Optimisation**

#### **Feature: Automated Reports**

1. **Tasks**:
   - [ ] Create a reports page at `/dashboard/reports`.
   - [ ] Allow educators to:
     - Generate milestone and IEP reports.
     - Export reports as PDFs.
   - [ ] Implement caching for frequently accessed reports.
   - [ ] Write unit tests to verify:
     - [ ] Report generation and export work as expected.
     - [ ] Caching optimises load times.
   - [ ] Ensure all tests pass.

---

#### **Feature: Overall Performance**

1. **Tasks**:
   - [ ] Audit queries for inefficiencies (e.g., excessive joins or large payloads).
   - [ ] Optimise data-fetching logic using pagination and indexed queries.
   - [ ] Add global loading and error handling for all pages.
   - [ ] Write unit tests to verify:
     - [ ] Optimised queries reduce load times.
     - [ ] Loading and error handling behave correctly.
   - [ ] Ensure all tests pass.

---

### **Conclusion**

This plan ensures iterative, measurable progress toward a polished MLP while maintaining focus on functionality, reliability, and real-world educator needs. Let me know if you’d like refinements to any stage!
