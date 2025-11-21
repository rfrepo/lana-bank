# Transaction Table Component - Usage Guide

## Overview

The Transaction Table component system provides a scalable, maintainable way to display transaction history data. It follows the **Single Responsibility Principle (SRP)** where each component has one clear purpose, making the codebase easier to understand, test, and extend.

## Architecture Concepts

### 1. Single Responsibility Principle (SRP)

Each component in this system has one job:
- **Renderers**: Handle rendering logic for one transaction type
- **Registry**: Maps transaction types to their renderers
- **Column Builders**: Create individual column definitions
- **Table Component**: Renders the table structure
- **Hook**: Fetches and manages transaction data

This separation makes it easy to:
- Test each piece independently
- Modify one transaction type without affecting others
- Add new transaction types without touching existing code

### 2. Strategy Pattern

The system uses a **Strategy Pattern** through the renderer registry:
- Different transaction types (Deposit, Withdrawal, etc.) have different rendering strategies
- The table doesn't need to know about specific types - it just asks the registry for the right renderer
- New transaction types can be added by creating a renderer and registering it

### 3. Composition Pattern

Columns are built using **function composition**:
- Each column has a `create-*` function that builds its definition
- Each column has a `with-*` function that conditionally adds it based on `columnOrder`
- The `compose` function chains these together declaratively

## Component Structure

```
components/transaction-table/
├── types.ts                          # Base types and interfaces
├── renderer-config.ts                # Renderer configuration factory
├── transaction-table.tsx             # Main table component
├── transaction-table-card.tsx        # Card wrapper component
├── renderers/                        # Transaction type renderers
│   ├── types.ts                      # Renderer interface
│   ├── deposit-entry-renderer.tsx    # Handles DepositEntry rendering
│   ├── withdrawal-entry-renderer.tsx # Handles WithdrawalEntry rendering
│   ├── disbursal-entry-renderer.tsx # Handles DisbursalEntry rendering
│   ├── payment-entry-renderer.tsx   # Handles PaymentEntry rendering
│   └── registry.ts                   # Maps types to renderers
└── columns/                          # Column building logic
    ├── types.ts                      # Column dependencies
    ├── compose.ts                    # Function composition helper
    ├── build-columns.ts              # Main column builder hook
    ├── create-date-column.ts         # Date column definition
    ├── create-type-column.ts         # Type column definition
    ├── create-amount-column.ts       # Amount column definition
    ├── create-status-column.ts       # Status column definition
    └── builders/                     # Conditional column builders
        ├── with-date-column.ts       # Conditionally adds date column
        ├── with-type-column.ts       # Conditionally adds type column
        ├── with-amount-column.ts     # Conditionally adds amount column
        └── with-status-column.ts      # Conditionally adds status column
```

## Key Components Explained

### Renderers (`renderers/`)

**Purpose**: Each renderer handles rendering logic for one transaction type.

**Why Separate Files?**
- **SRP**: Each renderer only knows about one transaction type
- **Testability**: Can test deposit rendering without testing withdrawals
- **Maintainability**: Changes to deposit display don't affect withdrawal display

**Example**:
```typescript
// deposit-entry-renderer.tsx
export class DepositEntryRenderer implements TransactionEntryRenderer {
  renderAmount(entry: HistoryNode): React.ReactNode {
    if (entry.__typename !== TransactionEntryType.DEPOSIT) return "-"
    return <Balance amount={entry.deposit.amount} currency="usd" />
  }
  // ... other methods
}
```

### Registry (`renderers/registry.ts`)

**Purpose**: Maps transaction entry types to their renderers.

**Why a Registry?**
- **Decoupling**: Table doesn't need to know about specific types
- **Extensibility**: Add new types by registering them, no table changes needed
- **Performance**: Single lookup instead of switch statements

**How It Works**:
```typescript
// Registry knows: "DepositEntry" → DepositEntryRenderer
const renderer = registry.getRenderer(entry)
const amount = renderer.renderAmount(entry)
```

### Renderer Config (`renderer-config.ts`)

**Purpose**: Provides factory methods to create renderer configurations.

**Why Two Config Types?**
- **Single Type Tables**: When you know all entries are the same type (e.g., deposits-only page)
- **Mixed Type Tables**: When entries can be different types (e.g., transaction history)

**Usage**:
```typescript
// For mixed transaction history
const config = RendererConfigFactory.forMixedHistory()

// For deposits-only table
const config = RendererConfigFactory.forDeposits()
```

### Column Builders (`columns/builders/`)

**Purpose**: Conditionally add columns based on `columnOrder` configuration.

**Why Separate Builders?**
- **SRP**: Each builder only handles one column
- **Composability**: Can mix and match columns easily
- **Testability**: Test column logic independently

**How Composition Works**:
```typescript
// compose chains builders together
const buildColumns = compose(
  withDateColumn,    // Adds date if in columnOrder
  withTypeColumn,    // Adds type if in columnOrder
  withAmountColumn,  // Adds amount if in columnOrder
  withStatusColumn   // Adds status if in columnOrder
)

// Result: columns array with only requested columns in correct order
const columns = buildColumns(deps, [])
```

### Column Creation (`columns/create-*-column.ts`)

**Purpose**: Define how each column renders its data.

**Why Separate from Builders?**
- **Separation of Concerns**: Creation logic separate from conditional logic
- **Reusability**: Can create columns without conditional logic if needed
- **Clarity**: Clear distinction between "what" (creation) and "when" (builder)

### Transaction Table Component (`transaction-table.tsx`)

**Purpose**: Renders the table using provided columns and data.

**Responsibilities**:
- Filter valid entries using renderer validation
- Apply custom filters if provided
- Handle navigation URLs
- Pass data to underlying DataTable component

**Why This Design?**
- **Presentation Only**: Doesn't know about data fetching or column building
- **Flexible**: Accepts pre-built columns and data
- **Reusable**: Can be used with any renderer config

### Transaction Table Card (`transaction-table-card.tsx`)

**Purpose**: Wraps the table in a Card component with title/description.

**Why Separate?**
- **SRP**: Card wrapper separate from table logic
- **Optional**: Table can be used without card if needed
- **Consistency**: Standard card layout across the app

## Usage Examples

### Example 1: Basic Transaction History Table

```typescript
import { TransactionTableCard } from "@/components/transaction-table"
import { useTransactionHistory } from "@/hooks/transaction-history"
import { useTransactionColumns } from "@/components/transaction-table/columns/build-columns"
import { RendererConfigFactory } from "@/components/transaction-table/renderer-config"
import { useTranslations } from "next-intl"

export function TransactionHistory({ depositAccountId }: { depositAccountId: string }) {
  const t = useTranslations("DepositAccount.transactions")
  
  // Fetch transaction data
  const { data, loading } = useTransactionHistory({
    source: { type: 'depositAccount', depositAccountId },
  })

  // Configure renderers for mixed transaction types
  const rendererConfig = RendererConfigFactory.forMixedHistory()
  
  // Build columns based on renderer config
  const columns = useTransactionColumns({
    translationNamespace: "DepositAccount.transactions",
  }, rendererConfig)

  return (
    <TransactionTableCard
      title={t("title")}
      description={t("description")}
      data={data}
      columns={columns}
      rendererConfig={rendererConfig}
      loading={loading}
      emptyMessage={t("table.empty")}
    />
  )
}
```

### Example 2: Custom Column Order

```typescript
const columns = useTransactionColumns({
  translationNamespace: "Transactions",
  columnOrder: ['date', 'amount', 'type'], // Custom order, status excluded
}, rendererConfig)
```

### Example 3: Custom Renderers

```typescript
const columns = useTransactionColumns({
  translationNamespace: "Transactions",
  customRenderers: {
    amount: (entry) => <CustomAmountDisplay entry={entry} />,
    status: (entry) => <CustomStatusBadge entry={entry} />,
  },
}, rendererConfig)
```

### Example 4: Filter Transactions

```typescript
<TransactionTableCard
  data={data}
  columns={columns}
  rendererConfig={rendererConfig}
  filter={(entry) => entry.__typename !== 'PaymentEntry'} // Hide payments
/>
```

### Example 5: Custom Navigation

```typescript
<TransactionTableCard
  data={data}
  columns={columns}
  rendererConfig={rendererConfig}
  navigateTo={(entry) => `/custom-route/${entry.id}`} // Override default navigation
/>
```

## Adding a New Transaction Type

To add a new transaction type (e.g., `RefundEntry`):

1. **Create the renderer**:
```typescript
// renderers/refund-entry-renderer.tsx
export class RefundEntryRenderer implements TransactionEntryRenderer {
  renderType(t) { return t("table.types.refund") }
  renderAmount(entry) { return <Balance amount={entry.refund.amount} /> }
  // ... implement other methods
}
```

2. **Register it**:
```typescript
// renderers/registry.ts
this.register(TransactionEntryType.REFUND, new RefundEntryRenderer())
```

3. **Add the type constant**:
```typescript
// renderers/types.ts
export const TransactionEntryType = {
  // ... existing types
  REFUND: "RefundEntry",
} as const
```

That's it! The table will automatically handle the new type.

## Type Safety

The system uses TypeScript constants to prevent typos:

```typescript
// ✅ Type-safe
TransactionEntryType.DEPOSIT

// ❌ Compile error if typo
TransactionEntryType.DEPOSITTT
```

## Performance Considerations

- **Single-type tables**: Use `RendererConfigFactory.forDeposits()` - no registry lookup needed
- **Mixed-type tables**: Registry lookup is O(1) - very fast
- **Column memoization**: Columns are memoized based on dependencies
- **Entry filtering**: Happens once in useMemo, not on every render

## Testing Strategy

Each component can be tested independently:

- **Renderers**: Test rendering logic for each transaction type
- **Registry**: Test lookup and registration
- **Column Builders**: Test conditional column addition
- **Table Component**: Test filtering and navigation
- **Hook**: Test data fetching and transformation

## Rationale Summary

| Design Decision | Rationale |
|----------------|-----------|
| Separate renderer files | Single Responsibility - each handles one transaction type |
| Registry pattern | Decoupling - table doesn't need to know about types |
| Column builders | Composability - mix and match columns easily |
| Compose function | Declarative - clear column building flow |
| Type constants | Type safety - prevent typos at compile time |
| Config factory | Convenience - easy to create common configurations |
| Separate card wrapper | Optional - table can be used standalone |

## Common Patterns

### Pattern 1: Transaction History (Mixed Types)
```typescript
const config = RendererConfigFactory.forMixedHistory()
const columns = useTransactionColumns({ translationNamespace: "..." }, config)
```

### Pattern 2: Single Type Table
```typescript
const config = RendererConfigFactory.forDeposits()
const columns = useTransactionColumns({ translationNamespace: "..." }, config)
```

### Pattern 3: Custom Configuration
```typescript
const config = { 
  type: RendererConfigType.SINGLE, 
  renderer: new CustomRenderer() 
}
```

This architecture provides a solid foundation that's easy to understand, test, and extend while maintaining type safety and performance.

