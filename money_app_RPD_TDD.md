# Money App: Prototype Payment Settlement System

## 1. Project Overview
* **Problem Statement**: Create a prototype application for settling payments and tracking debts.
* **Objective**: To understand the end-to-end product development journey.
* **Scale**: High-usage environment scaling is not required for this prototype.
* **Data Lifecycle**: Initial development will use mock data, which will be abandoned during future database migration (The Great Reset).

## 2. Product Requirements
### Core Objectives
* Track all lending and borrowing activities.
* Manage transactions between individual users and within groups.
* Log and compute every transaction automatically.

### Functional Requirements
* **Relationship Management**: Add, maintain, and search for friends.
* **Group Management**: Create and manage specific groups for shared expenses.
* **Splitting Logic**:
    * Equal splits.
    * Percentage-based splits.
    * Split by shares/parts.
* **Reporting**: View total owed amounts across all transactions and groups.

### User Stories
* **Payer Assignment**: As a user, I want to assign a 'Payer' to an expense so the system knows who is owed.
* **Simplified Settlement**: As a user, I want to settle my total balance with a friend in one transaction rather than paying back every single event separately.
* **Net Visibility**: As a user, I want to see a Net Balance across all my groups to know my total cash position.

## 3. Constraints & Logic
* **Persistence**: Transactions must persist until they are formally closed.
* **Currency**: Single currency (Rupees) with a precision of 2 decimal points.
* **Identity**: Mock users and accounts will be assigned UUIDs.
* **Rounding Logic**: Any extra penny resulting from a split must be paid by the transaction owner/initiator.
* **Permissions**: 
    * Only the initiator can edit or delete a transaction.
    * Transactions can be edited even if balances are unpaid, but cannot be changed once completed or deleted.
* **Transparency**: All group members see total expenses and split logic, but only their personal balance is highlighted for action.
* **Performance**: Handle up to 1,000 concurrent entries with <200ms latency.

## 4. Technical Design
### Modules
1.  **User Module**: (TBD)
2.  **Connection Module**: 
    * Add Friend (Name, Email, or Phone).
    * Search Friend (Name, Email, or Phone).
    * Remove Friend / Update Friend Info.
3.  **Group Module**:
    * Group Management: Create, Update, and Archive.
    * Member Management: Add/Remove members (Removal allowed only if no contribution; Archival allowed after settlement).
4.  **Expense Manager**:
    * Personal, Ad-hoc, and Group Expenses.
    * Supports Single/Multi-player splits (Equal or by Share).
5.  **Report Module**: Provides totals for groups, friends, and transactions.

### Implementation Phases
* **Phase 1**: Use local file storage and develop robust business logic.
* **Phase 2**: Build a user-friendly GUI utilizing the established business logic.
* **Phase 3**: Migrate to a hosted central SQL Database.

## 5. Scope Definitions
* **Future Scope**: Build a network with other interns to create a unified system.
* **Out of Scope**: Real-world money movement. Values are numeric representations only.