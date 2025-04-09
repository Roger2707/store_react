import axios, { AxiosError, AxiosResponse } from "axios"
import { router } from "../router/Routes";
import { ProductParams, ProductSearch, ProductUpsert } from "../models/Product";
import { convertKeysToLowerCase, icons } from "../utils/helper";
import { toast } from "react-toastify";
import { Category } from "../models/Category";
import { Brand } from "../models/Brand";
import { ChangePasswordDTO, ForgetPasswordDTO, GoogleAuthRequest, ResetPasswordDTO, SignInRequest, SignUpRequest, UserAddressDTO, UserProfileUpdate } from "../models/User";
import { store } from "../store/configureStore";
import { ImageUploadDTO } from "../models/ImageUpload";
import { WarehouseSearch } from "../models/Warehouse";
import { StockUpsertDTO } from "../models/Stock";
import { BasketUpsertParam } from "../models/Basket";

const sleep = () => new Promise(resolve => setTimeout(resolve, 500))

axios.defaults.baseURL = 'http://localhost:5110/api/';
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

// Add Token to Headers
axios.interceptors.request.use(config => {
    const token = store.getState().account.user?.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

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
            // Validation Inputs
            if(data.errors) {
                const validationErrors = convertKeysToLowerCase(data.errors);
                Object.keys(validationErrors).forEach(field => {
                    const errorMessage = validationErrors[field][0]; // get first error in array              
                    // get input has error by Id
                    if(field.includes('.')) field = field.split('.')[1];
                    const inputElement = document.getElementById(field);

                    console.log(inputElement);
                    console.log(field);
                              
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
            else if(data.title) {  
                toast.error(data.title, {icon: icons.error});
            } 
            else {
                console.log(data);
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
});

const requests = {
    get: (url: string, params?: any) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) =>  axios.put(url, body).then(responseBody),
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
        if(key === 'files') {
            data['files']?.forEach((file: File) => {
                formData.append("files", file);
            })
        }
        else formData.append(key, data[key]);
    }
    return formData;
}

const Upload = {
    upload: (params: ImageUploadDTO) => requests.postForm('uploads/upload-images', getFormData(params))
}

const Product = {
    list: (params: ProductParams) => requests.get('products/get-products-page', params),
    singleDTO: (id: string) => requests.get(`products/get-product-dto?id=${id}`),

    detail: (id: string) => requests.get(`products/get-product-single-detail?productDetailId=${id}`),
    details: (params: ProductSearch) => requests.get(`products/get-product-single-details`, params),
    
    create: (product: ProductUpsert) => requests.post('products/create', product),
    update: (product: ProductUpsert) => requests.put(`products/update`, product),
    changeStatus: (id: string) => requests.post(`products/change-status?id=${id}`, {})
}

const Categories = {
    list: () => requests.get('category/get-all'),
    details: (id: string) => requests.get(`category/get-category-detail/${id}`),

    create: (category: Category) => requests.post(`category/create`, getFormData(category)),
    update: (category: Category) => requests.put(`category/update`, getFormData(category)),
    delete: (id: string) => requests.del(`category/delete?id=${id}`),
}

const Brands = {
    list: () => requests.get('brands/get-all'),
    details: (id: string) => requests.get(`brands/get-brand-detail/${id}`),

    create: (brand: Brand) => requests.postForm('brands/create', getFormData(brand)),
    update: (brand: Brand) => requests.putForm(`brands/update`, getFormData(brand)),
    delete: (id: string) => requests.del(`brands/delete?id=${id}`),
}

const Promotions = {
    getAll: () => requests.get(`promotions/get-all`),

    create: (promotion: any) => requests.postForm(`promotions/create`, getFormData(promotion)),
    update: (promotion: any) => requests.putForm(`promotions/update`, getFormData(promotion)),
    delete: (id: string) => requests.del(`promotions/delete?id=${id}`),
}

const Account = {
    signIn: (request: SignInRequest) => requests.post(`users/log-in`, request),
    signUp: (request: SignUpRequest) => requests.post(`users/sign-up`, request),
    logOut: () => requests.post(`users/log-out`, {}),
    currentUser: () => requests.get(`users/current-user`),
    oAuthLogin: (request: GoogleAuthRequest) => requests.post(`users/external-login`, request),

    ////////////////////////////////////////////////////////////////////////////////
    forgetPassword: (request: ForgetPasswordDTO) => requests.post(`users/forget-password`, request),
    resetPassword: (request: ResetPasswordDTO) => requests.post(`users/reset-password`, request),

    //////////////////////////////////////////////////////////////////////////////////
    updateUserProfile: (userProfileDTO: UserProfileUpdate) => requests.putForm(`users/update-profile`, getFormData(userProfileDTO)),
    changePassword: (passwordDTO: ChangePasswordDTO) => requests.post(`users/change-password`, passwordDTO),
}

const Location = {
    getCities : () => requests.get(`location/get-cities`),
    getDistricts : (cityCode: number) => requests.get(`location/get-districts?cityCode=${cityCode}`),
    getWards : (districtCode: number) => requests.get(`location/get-wards?districtCode=${districtCode}`),
}

const Technology = {
    list: (productId: string) => requests.get(`technologies/get-technologies-by-product?productId=${productId}`),
}
const Basket = {
    get: () => requests.get(`baskets/get-basket`),
    upsert : (basketUpsertDTO : BasketUpsertParam) => requests.post(`baskets/upsert-basket`, basketUpsertDTO),
    toggleStatusItem : (itemId: string) => requests.post(`baskets/toggle-status-item?itemId=${itemId}`, {}),
}

const Order = {
    get : (orderId: number) => requests.get(`orders/get-order?orderId=${orderId}`),
    list : () => requests.get(`orders/get-orders`),
    create: (userAddressId: number) => requests.post(`orders/create-order?userAddressId=${userAddressId}`, {}),
}

const Warehouse = {
    list: () => requests.get(`warehouses/get-all`),
    listByCondition: (params: WarehouseSearch) => requests.get(`warehouses/get-all-by-condition`, params),
    detail: (id: string) => requests.get(`warehouses/get-warehouse-detail?warehouseId=${id}`),

    // 
    productQuantity: (productDetailId: string) => requests.get(`warehouses/get-product-quantity-in-warehouse?productDetailId=${productDetailId}`),
}

const Stocks = {
    getStockOfProduct: (productId: string) => requests.get(`stocks/get-stock-product-detail?productId=${productId}`),
    getStockTransactionsOfProduct: (productId: string) => requests.get(`stocks/get-stock-transactions?productId=${productId}`),
    upsertStock: (request: StockUpsertDTO) => requests.post(`stocks/upsert-stock`, request)
}

const agent = {
    Upload,
    Product,
    Categories,
    Brands,
    Promotions,
    Account,
    Location,
    Basket,
    Order,
    Technology,
    Warehouse,
    Stocks
}

export default agent;