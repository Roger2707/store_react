export interface UserDTO {
    userName: string;
    fullName: string;
    email: string;
    imageUrl: string;
    publicId: string;
    dob: Date;
    phoneNumber: string;
    
    token: string;
    basketId?: number;
    role?: string;
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