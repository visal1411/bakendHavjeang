# Profile Section

View and edit mechanic profile information, business details, and settings.

## Structure

```
Profile/
├── Profile.jsx                 # Main profile page
├── index.js                    # Exports
├── README.md                   # This file
├── components/
│   └── MechanicProfile.jsx     # Profile editing component
├── hooks/
│   └── (Future: useProfile.js)
└── utils/
    └── (Future: profileValidation.js)
```

## Features

- **Personal Information**: Edit name, phone, email
- **Business Info**: Update business name, description, location
- **Service Area**: Set operating radius
- **Trip Fee**: Configure base trip fee (validated, no negatives)
- **Experience**: Update years of experience
- **Specializations**: Add/remove service specializations
- **Operating Hours**: Set business hours
- **Profile Photo**: Upload/change profile picture
- **Verification Status**: View verification badge status

## Usage

```jsx
import Profile from "@/pages/mechanic/Profile";

<Profile />;
```

## Profile Structure

```js
{
  personalInfo: {
    name: string,
    phone: string,
    email: string,
    photo: string
  },
  businessInfo: {
    businessName: string,
    description: string,
    location: string,
    serviceRadius: number,
    baseTripFee: number,
    yearsExperience: number
  },
  specializations: string[],
  operatingHours: {
    [day]: { open: string, close: string, isOpen: boolean }
  },
  verification: {
    isVerified: boolean,
    verifiedSince: string
  }
}
```
