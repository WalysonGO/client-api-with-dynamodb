export const mocks = [
  {
    fullName: "Alice Smith",
    dateOfBirth: "1985-05-15",
    isActive: true,
    addresses: ["789 Oak Street"],
    contacts: [
      {
        email: "alice.smith@example.com",
        phone: "555-123-4567",
        isPrimary: true,
      },
    ],
  },
  {
    fullName: "Bob Johnson",
    dateOfBirth: "1978-09-20",
    isActive: true,
    addresses: ["456 Elm Street", "789 Pine Avenue"],
    contacts: [
      {
        email: "bob.johnson@example.com",
        phone: "555-987-6543",
        isPrimary: true,
      },
      {
        email: "secondary.contact@example.com",
        phone: "555-111-2222",
        isPrimary: false,
      },
    ],
  },
  {
    fullName: "Eva Miller",
    dateOfBirth: "1992-12-10",
    isActive: false,
    addresses: [],
    contacts: [
      {
        email: "eva.miller@example.com",
        phone: "555-333-4444",
        isPrimary: true,
      },
    ],
  },
];
