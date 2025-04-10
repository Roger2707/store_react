export interface UserDTO {
    userName: string;
    fullName: string;
    email: string;
    token: string;
    role?: string;

    dob: Date;
    phoneNumber: string;
    imageUrl: string;
    basketId?: number;

    userAddresses: UserAddressDTO[];
}

export interface UserAddressDTO {
    id: number; // primary key

    city : string;
    district: string;
    ward: string;
    streetAddress: string;
    postalCode: string;
    country: string;
}

export interface UserProfileUpdate {
    fullName: string;
    dob: Date | null | undefined;
    phoneNumber: string;
    imageUrl: File | undefined | null;
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