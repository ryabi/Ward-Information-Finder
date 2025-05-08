export interface WardMember {
  id: number;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  post: string;
  bio?: string | null;
  email?: string;
  phone?: string;
}

export interface MunicipalityMember {
  id: number;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phoneNumber: string;
  address: Address;
  photo: string;
  biography: string;
  dateOfBirth: string;
  appointmentDate: string;
}

export interface Ward {
  id: number;
  wardNo: string;
  municipalityName: string;
  address: string;
  contactNumber: string;
  email: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface Address {
  country: string;
  municipality: string;
  placeName: string;
  wardNo: string;
}