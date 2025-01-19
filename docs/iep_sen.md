### **1. SEN and IEP Relationships**

#### **SEN (Special Educational Needs)**
- **Definition**: Students with SEN require additional or tailored support to access the curriculum effectively.
- **Triggers**:
  - Identification of learning difficulties, disabilities, or behavioural challenges.
  - Assessment by teachers, SENCOs (Special Educational Needs Coordinators), or external professionals.
  - Assignment to an SEN category (e.g., mild learning disability, ASD, ADHD).
- **Flexibility**:
  - SEN status can be **temporary or long-term**.
  - Students may move **into SEN** (e.g., after an injury or newly identified needs) or **out of SEN** (e.g., after successful intervention).

#### **IEPs (Individual Education Plans)**
- **Definition**: A structured plan created for students with SEN to outline goals, support strategies, and progress monitoring.
- **Triggers**:
  - Often, but not always, linked to SEN status.
  - Required for students who need specific, measurable interventions beyond standard classroom differentiation.
  - Goals can be academic (e.g., improving literacy), social (e.g., developing communication skills), or behavioural.
- **Flexibility**:
  - IEPs are **reviewed regularly** (e.g., termly, annually).
  - Goals may change or the IEP may be discontinued if the student no longer requires it.

---

### **2. Practical Implications for the System**

To accurately represent these real-world dynamics, your schema and logic must accommodate:
1. **Association with SEN/IEP**:
   - Not all students will have SEN or an IEP.
   - Students may have:
     - SEN without an IEP.
     - An IEP without being classified as SEN (e.g., temporary intervention plans).
     - Both SEN and an IEP.

2. **Flexibility to Add/Remove**:
   - SEN status and IEPs can change over time.
   - Historical tracking of changes (e.g., a student was SEN last year but is not now) is valuable for insights.

3. **Multiple IEPs Over Time**:
   - A student may have **multiple IEPs** if their needs or goals evolve.

4. **Shared Access**:
   - SEN and IEP data must be visible to multiple stakeholders (e.g., class teachers, SENCOs, administrators).

---

### **3. Schema Updates**

To support these relationships and transitions, here’s how the schema could evolve:

#### **Student Table**
Include SEN status as a field with flexibility for changes.

```typescript
export const studentSchema = pgTable('student', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizationSchema.id).notNull(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  dateOfBirth: timestamp('date_of_birth', { mode: 'date' }),
  enrollmentDate: timestamp('enrollment_date', { mode: 'date' }),
  status: text('status'), // E.g., Active, Graduated
  senStatus: text('sen_status'), // E.g., None, SEN Support, EHCP (Education, Health, and Care Plan)
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
```

#### **IEP Table**
Allow multiple IEPs per student with timestamps for tracking historical data.

```typescript
export const iepSchema = pgTable('iep', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id').references(() => studentSchema.id).notNull(),
  goalName: text('goal_name').notNull(),
  description: text('description').notNull(),
  progress: bigint('progress', { mode: 'number' }).default(0).notNull(),
  status: text('status').notNull(), // E.g., In Progress, Completed
  evidence: text('evidence'), // Markdown or URL
  startDate: timestamp('start_date', { mode: 'date' }).notNull(),
  endDate: timestamp('end_date', { mode: 'date' }), // Optional: Allows for closure
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
```

---

### **4. User Experience (UX) and Workflow**

#### **Adding SEN/IEP Status**
- Teachers can mark a student as SEN and optionally link an IEP.
- The system should support workflows like:
  1. Create an IEP for a new SEN student.
  2. Update an existing IEP during reviews.
  3. Mark an IEP as completed or discontinued.

#### **Removing SEN/IEP Status**
- When a student no longer requires SEN support or an IEP:
  - SEN status is updated to "None."
  - IEPs can be closed but remain in the database for historical reference.

#### **Tracking Progress**
- Use progress fields in `iepSchema` to monitor achievements over time.
- Store changes with timestamps for auditing.

---

### **5. Reporting**
- Aggregate reports should include:
  - SEN student counts and their distribution across statuses.
  - Progress summaries for active and closed IEPs.
  - Historical data to track how many students transition out of SEN/IEP.
