export interface User {
    fullName: string;
    email: string;
    token: string;
    role?: string;

    dob: Date | null | undefined;
    phoneNumber: string;
    imageUrl: string;
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

export interface UserAddressDTO {
    id: number; // primary key

    city : string;
    district: string;
    ward: string;
    streetAddress: string;
    postalCode: string;
    country: string;
}

export interface UserCookie {
    FullName: string;
    Email: string;
    Token: string;
}