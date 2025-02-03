# Backend Planning Documentation

## Database Collections Schema

### User Schema
The User schema defines the users in the system.
- **name** (String, required) - The full name of the user.
- **email** (String, required, unique) - The email address of the user.
- **phoneNumar** (String, required, unique) - The phone number of the user.
- **password** (String, required) - The password for authentication.
- **role** (String, required, enum: SuperAdmin, CompanyAdmin, Employee) - The role assigned to the user.
- **company** (ObjectId, references Company, nullable) - The company associated with the user.
- **timestamps** - Automatically stores creation and update times.

### Company Schema
The Company schema represents different companies within the system.
- **name** (String, required, unique) - The company's name.
- **phoneNumar** (String, required, unique) - The company's contact number.
- **email** (String, required, unique) - The company's email address.
- **industry** (String, optional) - The industry the company operates in.
- **image** - Stores the company's image details:
  - **public_id** (String, required) - The image's public ID.
  - **url** (String, required) - The image's URL.
- **owner** (ObjectId, references User, required) - The user who owns the company.
- **employees** (Array<ObjectId>, references User) - List of employees in the company.
- **isActive** (Boolean, default: false) - Indicates if the company is active.
- **timestamps** - Automatically stores creation and update times.

### Employee Schema
The Employee schema associates a user with an employee profile.
- **user** (ObjectId, references User, required) - The associated user.
- **image** - Stores the employee's image details:
  - **public_id** (String, required) - The image's public ID.
  - **url** (String, required) - The image's URL.
- **Address** (String, required) - The employee's address.
- **Designation** (String, required) - The employee's job designation.
- **company** (ObjectId, references Company, required) - The company the employee belongs to.
- **role** (ObjectId, references Role, required) - The role assigned to the employee.
- **verify** (String, enum: Pending, Verify, Rejected, default: Pending) - Verification status.
- **isActive** (Boolean, default: false) - Whether the employee is active.
- **timestamps** - Automatically stores creation and update times.

### Task Schema
The Task schema is used to manage tasks within the system.
- **title** (String, required) - The task title.
- **description** (String, optional) - A detailed task description.
- **assignedTo** (ObjectId, references User, required) - The user assigned to the task.
- **createdBy** (ObjectId, references User, required) - The user who created the task.
- **status** (String, enum: Pending, In Progress, Completed, default: Pending) - The current status of the task.
- **priority** (String, enum: Low, Medium, High, default: Medium) - The priority level of the task item.
- **dueDate** (Date, optional) - The deadline for the task.
- **timestamps** - Automatically stores creation and update times.

### Lead Schema
The Lead schema tracks potential clients or business opportunities.
- **name** (String, required) - The lead's name.
- **email** (String, required) - The lead's email address.
- **phone** (String, optional) - The lead's phone number.
- **status** (String, enum: New, Contacted, Qualified, Converted, Closed, default: New) - Lead status.
- **assignedTo** (ObjectId, references User, optional) - The user handling the lead.
- **company** (ObjectId, references Company, required) - The company associated with the lead.
- **timestamps** - Automatically stores creation and update times.

### Meeting Schema
The Meeting schema is used to schedule and track meetings.
- **title** (String, required) - The meeting title.
- **participants** (Array<ObjectId>, references User) - List of users attending the meeting.
- **scheduledTime** (Date, required) - The scheduled meeting time.
- **agenda** (String, optional) - The meeting agenda.
- **company** (ObjectId, references Company, required) - The company hosting the meeting.
- **timestamps** - Automatically stores creation and update times.

### Role Schema
The Role schema defines roles within a company.
- **name** (String, required, unique) - The role name.
- **permissions** - Defines CRUD (Create, Read, Update, Delete) permissions for different features:
  - **leads** (Object with Boolean fields) - Permissions for lead management.
  - **tasks** (Object with Boolean fields) - Permissions for task management.
  - **meetings** (Object with Boolean fields) - Permissions for meeting management.
- **company** (ObjectId, references Company, required) - The company to which the role belongs.
- **timestamps** - Automatically stores creation and update times.

### Todo Schema
The Todo schema is used to manage personal or work-related to-do tasks.
- **task** (String, required) - The description of the to-do task.
- **user** (ObjectId, references User, required) - The user to whom the to-do item belongs.
- **status** (String, enum: Pending, In Progress, Completed, default: Pending) - The status of the to-do item.
- **priority** (String, enum: Low, Medium, High, default: Medium) - The priority level of the to-do item.
- **dueDate** (Date, optional) - The deadline for completing the task.
- **timestamps** - Automatically stores creation and update times.

This documentation provides a structured overview of the database schema, detailing field data types, requirements, and relationships between different entities in the system.
