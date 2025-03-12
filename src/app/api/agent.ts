import axios, { AxiosError, AxiosResponse } from "axios"
import { router } from "../router/Routes";
import { ProductParams, ProductUpsert } from "../models/Product";
import { convertKeysToLowerCase, icons } from "../utils/helper";
import { toast } from "react-toastify";
import { Category } from "../models/Category";
import { Brand } from "../models/Brand";
import { PromotionUpsert } from "../models/Promotion";
import { ChangePasswordDTO, ForgetPasswordDTO, ResetPasswordDTO, SignInRequest, SignUpRequest, UserAddressDTO, UserProfileUpdate } from "../models/User";
import { store } from "../store/configureStore";

const sleep = () => new Promise(resolve => setTimeout(resolve, 500))

axios.defaults.baseURL = 'http://localhost:5110/api/';
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

// Add Token to Headers
axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async response => {
    await sleep();
    const {data, status} = response;
    if(status === 200) {
        toast.success(data.title, {icon: icons.success});
    }
    return response;
}, (error: AxiosError) => {
    const {data, status} = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if(data.title) {  
                toast.error(data.title, {icon: icons.error});
            }
            else {
                // Handle Input Validations
                const validationErrors = convertKeysToLowerCase(data);
                            
                Object.keys(validationErrors).forEach(field => {
                    const errorMessage = validationErrors[field][0]; // get first error in array
                    
                    // get input has error by Id
                    const inputElement = document.getElementById(field);
                    
                    if (inputElement) {
                      // Display error
                      const errorElement = inputElement.nextElementSibling;
                      if(errorElement) {
                        errorElement.textContent = errorMessage;
                        errorElement.classList.add('error-message');

                        setTimeout(() => {
                            errorElement.textContent = "";
                            errorElement.classList.remove('error-message');
                        }, 3000);
                      }
                    }
                });
            }
            break;
        case 401:
            console.log(data.title);
            break;
        case 403:
            console.log('You are not allowed to do that!');
            break;
        case 404:
            
            break;
        case 500:
            router.navigate('/server-error', {state: {error: data}});
            break;
        default:
            break;
    }
    return Promise.reject(error.response);
})

const requests = {
    get: (url: string, params?: any) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    del: (url: string) => axios.delete(url).then(responseBody),

    postForm: (url: string, data: FormData) => axios.post(url, data, {
        headers: {'Content-type': 'multipart/form-data'}
    }).then(responseBody),

    putForm: (url: string, data: FormData) => axios.put(url, data, {
        headers: {'Content-type': 'multipart/form-data'}
    }).then(responseBody)
}

const getFormData = (data: any) => {
    const formData = new FormData();    
    for(const key in data)
    {
        if(key === 'imageUrl') {
            data['imageUrl']?.forEach((file: File) => {
                formData.append("imageUrl", file);
            })
        }
        else
            formData.append(key, data[key]);
    }

    return formData;
}

const Product = {
    list: (params: ProductParams) => requests.get('products/get-products-page', params),
    details: (id: number) => requests.get(`products/get-product-detail?id=${id}`),
    technologies: (productId: number) => requests.get(`products/get-technologies?productId=${productId}`),
    
    create: (product: ProductUpsert) => requests.postForm('products/create', getFormData(product)),
    update: (id: number, product: ProductUpsert) => requests.putForm(`products/update?id=${id}`, getFormData(product)),
    delete: (id: number) => requests.del(`products/?id=${id}`),
    changeStatus: (id: number) => requests.post(`products/change-status?id=${id}`, {})
}

const Categories = {
    list: () => requests.get('category/get-all'),
    details: (id: number) => requests.get(`category/get-category-detail/${id}`),

    create: (category: Category) => requests.post(`category/create?id=${category.id}&name=${category.name}`, category),
    update: (category: Category) => requests.put(`category/update?id=${category.id}&name=${category.name}`, category),
    delete: (id: number) => requests.del(`category/delete?id=${id}`),
}

const Brands = {
    list: () => requests.get('brands/get-all'),
    details: (id: number) => requests.get(`brands/get-brand-detail/${id}`),

    create: (brand: Brand) => requests.postForm('brands/create', getFormData(brand)),
    update: (id: number, brand: Brand) => requests.putForm(`brands/update?id=${id}`, getFormData(brand)),
    delete: (id: number) => requests.del(`brands/delete?id=${id}`),
}

const Promotions = {
    getAll: (start: string, end: string) => requests.get(`promotions/get-all?start=${start}&end=${end}`),

    create: (promotion: PromotionUpsert) => requests.postForm(`promotions/create`, getFormData(promotion)),
    update: (id:number, promotion: PromotionUpsert) => requests.putForm(`promotions/update?id=${id}`, getFormData(promotion)),
    delete: (id: number) => requests.del(`promotions/delete?id=${id}`),
}

const Account = {
    signIn: (request: SignInRequest) => requests.post(`users/log-in`, request),
    signUp: (request: SignUpRequest) => requests.post(`users/sign-up`, request),
    logOut: () => requests.post(`users/log-out`, {}),
    currentUser: () => requests.get(`users/current-user`),

    ////////////////////////////////////////////////////////////////////////////////
    forgetPassword: (request: ForgetPasswordDTO) => requests.post(`users/forget-password`, request),
    resetPassword: (request: ResetPasswordDTO) => requests.post(`users/reset-password`, request),

    //////////////////////////////////////////////////////////////////////////////////
    updateUserProfile: (userProfileDTO: UserProfileUpdate) => requests.putForm(`users/update-profile`, getFormData(userProfileDTO)),
    changePassword: (passwordDTO: ChangePasswordDTO) => requests.post(`users/change-password`, passwordDTO),

    /////////////////////////////////////////////////////////////////////////////////////
    getUserAddress: () => requests.get(`user-address/get-user-address`),
    upsertUserAddress : (userAddressDTO: UserAddressDTO) => requests.postForm(`user-address/upsert-user-address`, getFormData(userAddressDTO)),
    deleteUserAddress : (id: number) => requests.del(`user-address/delete-user-address?id=${id}`),
}

const Location = {
    getCities : () => requests.get(`location/get-cities`),
    getDistricts : (cityCode: number) => requests.get(`location/get-districts?cityCode=${cityCode}`),
    getWards : (districtCode: number) => requests.get(`location/get-wards?districtCode=${districtCode}`),
}

const Basket = {
    get: () => requests.get(`baskets/get-basket`),
    upsert : (productId: number, mode: number) => requests.post(`baskets/upsert-basket?productId=${productId}&mode=${mode}`, {}),
    toggleStatusItem : (itemId: number) => requests.post(`baskets/toggle-status-item?itemId=${itemId}`, {}),
}

const Order = {
    get : (orderId: number) => requests.get(`orders/get-order?orderId=${orderId}`),
    list : () => requests.get(`orders/get-orders`),
    create: (userAddressId: number) => requests.post(`orders/create-order?userAddressId=${userAddressId}`, {}),
}

const agent = {
    Product,
    Categories,
    Brands,
    Promotions,
    Account,
    Location,
    Basket,
    Order
}

export default agent;