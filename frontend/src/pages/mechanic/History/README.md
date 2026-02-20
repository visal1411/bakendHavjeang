# History Section

View and manage past completed service jobs with search and filtering capabilities.

## Structure

```
History/
├── History.jsx                 # Main history page
├── index.js                    # Exports
├── README.md                   # This file
├── components/
│   └── ServiceHistory.jsx      # History view with filters
├── hooks/
│   └── (Future: useServiceHistory.js)
└── utils/
    └── (Future: historyFilters.js)
```

## Features

- **Search Jobs**: Find specific jobs by customer name, vehicle, or service
- **Filter by Status**: View completed or cancelled jobs
- **Filter by Date**: Search jobs by date range
- **View Details**: See full job details including earnings
- **Export History**: Download job history as PDF/CSV
- **Earnings Summary**: Calculate total earnings for filtered period
- **Customer Contact**: Access customer information from past jobs

## Usage

```jsx
import History from "@/pages/mechanic/History";

<History />;
```

## Job History Structure

```js
{
  id: number,
  date: string,
  customer: {
    name: string,
    phone: string,
    location: string
  },
  service: string,
  vehicle: string,
  earnings: number,
  status: 'completed' | 'cancelled',
  rating: number,
  review: string
}
```
