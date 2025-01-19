## Implementation Plan for Rose by Simora MLP

### **Stage 1: Basic Setup**

#### **Feature: Dashboard Overview**
1. **Key Functionality**: Provide an overview of key metrics (e.g., student count, pending tasks, upcoming meetings).
2. **Tasks**:
   - [ ] Create a dashboard page at `/dashboard`.
   - [ ] Fetch aggregated data from the database for:
     - Total number of students (`studentSchema`).
     - Count of pending milestones (`milestoneTrackerSchema`).
     - Count of IEPs nearing due dates (`iepSchema`).
     - Scheduled meetings (`communicationLogSchema`).
   - [ ] Display metrics in summary cards.
   - [ ] Implement navigation links to milestones, IEPs, and weekly planner pages.
   - [ ] Write unit tests to verify:
     - [ ] Metrics are fetched correctly.
     - [ ] Cards render the correct values without errors.
   - [ ] Ensure all tests pass.

---

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
