# Services Section

CRUD operations for managing a mechanic's service offerings and pricing.

## Structure

```
Services/
├── Services.jsx                # Main services page
├── index.js                    # Exports
├── README.md                   # This file
├── components/
│   └── ServicesManagement.jsx  # Service CRUD operations
├── hooks/
│   └── (Future: useServices.js)
└── utils/
    └── (Future: serviceValidation.js)
```

## Features

- **Add Services**: Create new service offerings with pricing
- **Edit Services**: Update service details and pricing
- **Delete Services**: Remove services from offerings
- **Toggle Active/Inactive**: Enable or disable services without deleting
- **Service Categories**: Organize by tire, battery, engine, etc.
- **Price Management**: Set base prices with validation (no negative values)

## Usage

```jsx
import Services from "@/pages/mechanic/Services";

<Services />;
```

## Service Structure

```js
{
  id: number,
  name: string,
  basePrice: number,
  category: 'tire' | 'battery' | 'engine' | 'electrical' | 'other',
  description: string,
  isActive: boolean
}
```
