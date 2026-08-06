# SummitOps Intelligence

SummitOps Intelligence is a MERN-based operations reporting platform designed for mountain resort supervisors and managers.

The application combines maintenance data, labor information, operational notes, equipment availability, project updates, and seasonal-readiness information into clear weekly and seasonal management reports.

The purpose of SummitOps Intelligence is not to replace maintenance-management platforms such as MaintainX. Instead, it provides a reporting and decision-support layer that explains what happened operationally, where labor and resources were used, what caused delays, and which issues require management attention.

## Project Goals

SummitOps Intelligence is intended to help supervisors and managers answer questions such as:

* What work was completed this week?
* How much work remains open or overdue?
* Where were employee hours allocated?
* What equipment problems affected productivity?
* Which operational issues keep recurring?
* What projects are behind schedule?
* How did weather or events affect the department?
* What should management prioritize next week?
* How prepared is each area for seasonal opening or closing?

## Core Use Case

The application collects information from multiple sources:

```text
MaintainX work-order data
+ labor-hour data
+ equipment downtime
+ project updates
+ weather impacts
+ supervisor notes
= weekly and seasonal operations intelligence
```

Supervisors enter operational context and review department-level information.

Managers review, approve, compare, and distribute final reports.

## Intended Users

### Supervisors

Supervisors can:

* Create weekly reports
* Import work-order data
* Enter labor information
* Record accomplishments
* Document delays and blockers
* Add recurring operational problems
* Set priorities for the following week
* Submit reports for management review

### Managers

Managers can:

* Review submitted reports
* Compare departments and reporting periods
* Add management notes
* Approve or reopen reports
* Review trends and exceptions
* Export reports
* Distribute approved summaries

### Administrators

Administrators can:

* Manage users
* Manage departments
* Configure integrations
* View all reports
* Control application settings
* Manage scheduled jobs
* Review import and synchronization history

## Planned Features

### Weekly Operations Reporting

Weekly reports may include:

* Work orders opened
* Work orders completed
* Open backlog
* Overdue work
* Completion rate
* Labor hours
* Equipment downtime
* Major accomplishments
* Delays and blockers
* Recurring problems
* Management notes
* Priorities for the following week

### Labor Allocation

Labor reporting may compare:

* Scheduled hours
* Paid hours
* Work-order labor
* Routine operational work
* Project work
* Event-support hours
* Emergency work
* Weather-delay hours
* Overtime

### Equipment Availability

Equipment reporting may include:

* Available equipment
* Equipment out of service
* Downtime hours
* Operational impact
* Maintenance status
* Estimated return-to-service dates

### Recurring Problem Analysis

The application may identify:

* Frequently repeated work orders
* High-maintenance locations
* Repeated equipment failures
* Issues consuming excessive labor
* Problems that may require capital investment

### Seasonal Readiness

Seasonal-readiness reports may track:

* Grounds preparation
* Signage
* Parking areas
* Equipment availability
* Inspections
* Vendor dependencies
* Outstanding maintenance
* Department approvals
* Overall readiness by operational area

### Report Exports

Planned export options include:

* PDF reports
* CSV exports
* Email summaries
* Printable management reports

## Technology Stack

### Frontend

* React
* TypeScript
* Sass
* Vite
* React Router
* Axios

### Backend

* Node.js
* Express
* TypeScript
* MongoDB
* Mongoose

### Supporting Technologies

Planned supporting tools may include:

* JSON Web Tokens for authentication
* Zod or another validation library
* Multer for file uploads
* CSV parsing utilities
* Nodemailer for email reports
* PDF generation
* Scheduled jobs
* MaintainX API integration
* Workday or labor-data integration
* Weather data integration

## Project Structure

```text
summitops-intelligence/
│
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── index.ts
│   │   │
│   │   ├── controllers/
│   │   │   └── index.ts
│   │   │
│   │   ├── jobs/
│   │   │   └── index.ts
│   │   │
│   │   ├── middleware/
│   │   │   └── index.ts
│   │   │
│   │   ├── models/
│   │   │   └── index.ts
│   │   │
│   │   ├── routes/
│   │   │   └── index.ts
│   │   │
│   │   ├── services/
│   │   │   └── index.ts
│   │   │
│   │   ├── types/
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/
│   │   │   └── index.ts
│   │   │
│   │   ├── validators/
│   │   │   └── index.ts
│   │   │
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   ├── tests/
│   ├── package.json
│   └── .env
│
├── .gitignore
├── package.json
└── README.md
```

The exact structure may change as the application develops.

## Backend Architecture

The backend follows a layered structure:

```text
Route
↓
Middleware
↓
Controller
↓
Service
↓
Model
↓
MongoDB
```

### Routes

Routes define API endpoints and connect requests to middleware and controllers.

### Controllers

Controllers handle HTTP requests and responses.

Controllers should remain small and should not contain extensive business logic.

### Services

Services contain application business logic, including:

* Report generation
* Analytics calculations
* Data imports
* External API communication
* Email generation
* PDF generation
* Permission checks
* Report workflow logic

### Models

Models define MongoDB collections and document validation.

### Middleware

Middleware handles:

* Authentication
* Authorization
* Request validation
* Uploads
* Error handling
* Missing routes

### Validators

Validators verify request bodies, parameters, query values, and imported data before they reach application services.

### Jobs

Scheduled jobs handle tasks such as:

* Importing data
* Generating weekly reports
* Sending approved reports
* Archiving old records
* Synchronizing external integrations

### Index Files

Each backend subdirectory contains an `index.ts` file.

These index files provide a single import point for each application layer.

Example:

```ts
import {
  WeeklyReport,
  WorkOrderSnapshot,
  Department,
} from "../models/index.js";
```

Index files should not be imported from files located inside the same directory when doing so may create circular dependencies.

## Initial Data Models

The initial backend may contain the following models:

### User

Represents supervisors, managers, and administrators.

### Department

Represents an operational department or reporting group.

Examples:

* Grounds
* Facilities
* Lift Maintenance
* Mountain Operations
* Parking
* Events

### WeeklyReport

Stores calculated metrics and supervisor-provided operational context for a reporting period.

### WorkOrderSnapshot

Stores imported or synchronized work-order data used for historical reporting.

MaintainX or another external system should remain the primary source of truth for the original work order.

### LaborEntry

Stores normalized labor information imported from CSV files, spreadsheets, or approved third-party integrations.

### EquipmentIssue

Stores equipment downtime and operational-impact information not sufficiently represented by a work order alone.

### ImportRecord

Tracks imported files, synchronization attempts, results, and failures.

## Report Workflow

The initial report lifecycle is:

```text
Draft
↓
Submitted
↓
Approved
↓
Archived
```

### Draft

The supervisor can edit the report and supporting notes.

### Submitted

The report is awaiting management review.

### Approved

The report has been reviewed and accepted by a manager.

Approved reports should normally become read-only.

### Archived

The report remains available for historical comparisons but is no longer active.

Managers may also reopen reports when corrections are required.

## Data Sources

SummitOps Intelligence is designed to support multiple data sources.

### MaintainX

MaintainX data may initially be imported through CSV exports.

A direct API integration may be added after authorization and access are available.

Potential MaintainX information includes:

* Work orders
* Work-order status
* Priority
* Assigned department
* Asset
* Location
* Labor
* Created date
* Completion date
* Downtime
* Work-order category

### Labor Systems

Labor data may initially be imported through CSV or spreadsheet exports.

The backend should normalize labor data so that it is not tied directly to one provider.

Potential future providers may include:

* Workday
* Scheduling platforms
* Payroll exports
* Manual department summaries

### Weather

Weather information may eventually be stored with reporting periods to help explain:

* Delayed outdoor work
* Drainage problems
* Storm-response activity
* Equipment restrictions
* Event disruption
* Increased labor requirements

## Integration Strategy

External systems should be implemented through provider-specific adapters.

Example:

```text
services/
└── integrations/
    ├── maintainx/
    │   ├── maintainXClient.ts
    │   ├── maintainXNormalizer.ts
    │   └── index.ts
    │
    ├── labor/
    │   ├── csvLaborProvider.ts
    │   ├── workdayLaborProvider.ts
    │   ├── laborNormalizer.ts
    │   └── index.ts
    │
    └── index.ts
```

The rest of the application should operate on normalized internal data rather than provider-specific response formats.

## Initial API Design

### Authentication

```text
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/me
```

### Reports

```text
GET    /api/reports
GET    /api/reports/:reportId
POST   /api/reports
PATCH  /api/reports/:reportId
DELETE /api/reports/:reportId
```

### Report Workflow

```text
POST /api/reports/:reportId/calculate
POST /api/reports/:reportId/submit
POST /api/reports/:reportId/approve
POST /api/reports/:reportId/reopen
POST /api/reports/:reportId/archive
```

### Imports

```text
POST /api/imports/work-orders
POST /api/imports/labor
GET  /api/imports
GET  /api/imports/:importId
```

### Analytics

```text
GET /api/analytics/weekly
GET /api/analytics/trends
GET /api/analytics/labor
GET /api/analytics/backlog
GET /api/analytics/equipment
GET /api/analytics/recurring-problems
```

### Exports

```text
GET  /api/reports/:reportId/pdf
GET  /api/reports/:reportId/csv
POST /api/reports/:reportId/email
```

## MVP Scope

The first version should remain intentionally limited.

### MVP Features

* Create departments
* Create supervisors and managers
* Import mock or CSV work-order data
* Import labor totals
* Create a weekly report
* Calculate weekly work-order metrics
* Enter supervisor notes
* Submit a report
* Approve a report
* View a management summary
* Compare the current week with the previous week

### Features Not Required for the MVP

* Direct MaintainX API integration
* Direct Workday integration
* Advanced weather analytics
* Automated PDF delivery
* Complex capital-budget forecasting
* Mobile push notifications
* Real-time synchronization
* Full equipment-management functionality
* Replacement of existing maintenance systems

## Recommended Development Order

```text
1. Environment configuration
2. Database connection
3. Error-handling middleware
4. Department model
5. User model and authentication
6. Work-order snapshot model
7. CSV or mock-data import
8. Weekly report model
9. Analytics service
10. Report API
11. Basic report frontend
12. Submit and approval workflow
13. Labor import
14. Historical comparisons
15. Exports and scheduled reports
16. External integrations
```

The application should be developed as vertical features rather than building the entire backend before connecting it to the frontend.

For example:

```text
Import work orders
→ calculate metrics
→ return report through API
→ display report in React
```

## Environment Variables

Create `.env` files inside the client and server directories.

Do not commit real `.env` files.

### Server `.env.example`

```env
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/summitops-intelligence

JWT_ACCESS_SECRET=replace-with-a-secure-secret
JWT_REFRESH_SECRET=replace-with-a-secure-secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_FROM=

MAINTAINX_API_URL=
MAINTAINX_API_KEY=

WORKDAY_API_URL=
WORKDAY_CLIENT_ID=
WORKDAY_CLIENT_SECRET=
```

### Client `.env.example`

```env
VITE_API_URL=http://localhost:5000/api
```

Only environment variables beginning with `VITE_` are exposed to the Vite frontend.

Never place private API keys or database credentials in the client environment file.

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd summitops-intelligence
```

Install root dependencies:

```bash
npm install
```

Install client dependencies:

```bash
cd client
npm install
```

Install server dependencies:

```bash
cd ../server
npm install
```

## Running the Application

The exact scripts depend on the root `package.json`.

A typical setup may use:

```bash
npm run dev
```

This command should start both the client and server during development.

The applications may also be started separately.

### Client

```bash
cd client
npm run dev
```

### Server

```bash
cd server
npm run dev
```

## Available Scripts

Potential root scripts:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix server\" \"npm run dev --prefix client\"",
    "client": "npm run dev --prefix client",
    "server": "npm run dev --prefix server",
    "build": "npm run build --prefix client && npm run build --prefix server",
    "test": "npm run test --prefix server"
  }
}
```

Adjust these scripts to match the actual project configuration.

## Security and Privacy

SummitOps Intelligence may eventually process internal operational and employee-related information.

The application should follow these principles:

* Store only the information required for reporting
* Avoid storing Social Security numbers
* Avoid storing employee addresses
* Avoid storing benefits information
* Avoid importing unrelated payroll information
* Use pseudonymous employee identifiers when possible
* Restrict data by role and department
* Protect all private API endpoints
* Validate imported data
* Log administrative changes
* Encrypt secrets through environment variables
* Avoid placing real company information in a public repository
* Do not use Mount Snow or Vail Resorts branding without permission

## Data Ownership

External systems should remain the source of truth for their own records.

Examples:

* MaintainX remains the source of truth for maintenance work orders
* Workday remains the source of truth for approved employee time
* SummitOps Intelligence stores normalized snapshots and calculated reporting data

The application should not silently modify external maintenance, payroll, or employee records.

## Project Naming

The application is currently named:

**SummitOps Intelligence**

The repository name should use lowercase and hyphens:

```text
summitops-intelligence
```

The name is intentionally not tied to one mountain, resort, or employer so the platform can be adapted to other operations.

## Project Status

SummitOps Intelligence is currently in early development.

Current priorities:

* Finalize the backend foundation
* Define initial MongoDB models
* Build CSV import functionality
* Generate the first weekly operations report
* Create a basic management dashboard

## Disclaimer

SummitOps Intelligence is an independent software project.

It is not currently affiliated with, endorsed by, or officially connected to Mount Snow, Vail Resorts, MaintainX, Workday, or any other third-party platform mentioned in this documentation.

Third-party names are used only to describe potential integrations and operational use cases.

## License

Add the selected license before publicly distributing the project.

For a private or proprietary project, do not add an open-source license until the intended ownership and distribution terms are clear.
