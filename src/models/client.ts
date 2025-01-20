export interface Contact {
  email: string;
  phone: string;
  isPrimary: boolean;
}

export class Client {
  id?: string;
  fullName?: string;
  dateOfBirth?: string;
  isActive?: boolean;
  addresses?: string[];
  contacts?: Contact[];

  constructor(
    id?: string,
    fullName?: string,
    dateOfBirth?: string,
    isActive?: boolean,
    addresses?: string[],
    contacts?: Contact[]
  ) {
    this.id = id;
    this.fullName = fullName;
    this.dateOfBirth = dateOfBirth;
    this.isActive = isActive;
    this.addresses = addresses || [];
    this.contacts = contacts || [];
  }
}