export interface UserDTO {
    id: number
    userName: string;
    fullName: string;
    email: string;
    imageUrl: string;
    publicId: string;
    dob: Date;
    phoneNumber: string;
    provider: string;
    
    token: string;
    basketId?: number;
    role?: string;
    userAddresses: UserAddressDTO[];
}

export interface ShippingAdressDTO {
    city : string;
    district: string;
    ward: string;
    streetAddress: string;
    postalCode: string;
    country: string;
    isSaveAddress: boolean;
}

export interface UserAddressDTO {
    id: number; // primary key
    city : string;
    district: string;
    ward: string;
    streetAddress: string;
    postalCode: string;
    country: string;
    guidId: string;
}

export interface SignInRequest {
    username: string;
    password: string;
}

export interface SignUpRequest {
    username: string;
    fullname: string;
    email: string;
    phoneNumber: string;
}

export interface ForgetPasswordDTO {
    email: string;
}

export interface ResetPasswordDTO {
    email: string;
    token: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface ChangePasswordDTO {
    currentPassword: string;
    newPassword: string;
    confirmedNewPassword: string;
}

export interface GoogleAuthRequest  {
    authCode: string;
}