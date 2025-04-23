import axios, { AxiosError, AxiosResponse } from "axios"
import { router } from "../router/Routes";
import { ProductParams, ProductSearch, ProductUpsert } from "../models/Product";
import { convertKeysToLowerCase, icons } from "../utils/helper";
import { toast } from "react-toastify";
import { Category } from "../models/Category";
import { Brand } from "../models/Brand";
import { ChangePasswordDTO, ForgetPasswordDTO, GoogleAuthRequest, ResetPasswordDTO, SignInRequest, SignUpRequest, UserDTO } from "../models/User";
import { store } from "../store/configureStore";
import { ImageUploadDTO, SingleImageUploadDTO } from "../models/ImageUpload";
import { Warehouse, WarehouseSearch } from "../models/Warehouse";
import { StockUpsertDTO } from "../models/Stock";
import { BasketUpsertParam } from "../models/Basket";
import { RatingDTO } from "../models/Rating";

const sleep = () => new Promise(resolve => setTimeout(resolve, 500))

axios.defaults.baseURL = 'http://localhost:5110/api/';
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

// Add Token to Headers
axios.interceptors.request.use(config => {
    const token = store.getState().user.user?.token;
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
                    if (inputElement) {
                      // Display error
                      const errorElement = inputElement.nextElementSibling;
                      
                      if(errorElement) {
                        console.log(errorElement);
                        
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
            toast.error(data.Message, {icon: icons.error});
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
    upload: (params: ImageUploadDTO) => requests.postForm('uploads/upload-images', getFormData(params)),
    uploadSingle: (params: SingleImageUploadDTO) => requests.postForm('uploads/upload-image', getFormData(params))
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

const User = {
    signIn: (request: SignInRequest) => requests.post(`users/log-in`, request),
    signUp: (request: SignUpRequest) => requests.post(`users/sign-up`, request),
    currentUser: () => requests.get(`users/current-user`),
    oAuthLogin: (request: GoogleAuthRequest) => requests.post(`users/external-login`, request),

    ////////////////////////////////////////////////////////////////////////////////
    forgetPassword: (request: ForgetPasswordDTO) => requests.post(`users/forget-password`, request),
    resetPassword: (request: ResetPasswordDTO) => requests.post(`users/reset-password`, request),
    changePassword: (passwordDTO: ChangePasswordDTO) => requests.post(`users/change-password`, passwordDTO),

    //////////////////////////////////////////////////////////////////////////////////
    updateUser: (userDTO: UserDTO) => requests.put(`users/update-profile`, userDTO),
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
    getAll: () => requests.get(`orders/get-all`),
    getOrdersOwn : () => requests.get(`orders/get-orders-of-user`),
    getByOrderId : (orderId: number) => requests.get(`orders/get-order?orderId=${orderId}`),
    getByClientSecret: (clientSecret: string) => requests.get(`orders/get-order-by-client-secret?clientSecret=${clientSecret}`),
    create: (userAddressId: number) => requests.post(`orders/create-order?userAddressId=${userAddressId}`, {}),
}

const Warehouses = {
    list: () => requests.get(`warehouses/get-all`),
    listByCondition: (params: WarehouseSearch) => requests.get(`warehouses/get-all-by-condition`, params),
    detail: (id: string) => requests.get(`warehouses/get-warehouse-detail?warehouseId=${id}`),

    create: (warehouse: Warehouse) => requests.postForm('warehouses/create', getFormData(warehouse)),
    update: (warehouse: Warehouse) => requests.putForm(`warehouses/update`, getFormData(warehouse)),
    delete: (id: string) => requests.del(`warehouses/delete?warehouseId=${id}`),

    // 
    productQuantity: (productDetailId: string) => requests.get(`warehouses/get-product-quantity-in-warehouse?productDetailId=${productDetailId}`),
}

const Stocks = {
    getStockOfProduct: (productId: string) => requests.get(`stocks/get-stock-product-detail?productId=${productId}`),
    getStockTransactionsOfProduct: (productId: string) => requests.get(`stocks/get-stock-transactions?productId=${productId}`),
    upsertStock: (request: StockUpsertDTO) => requests.post(`stocks/upsert-stock`, request)
}

const Rating = {
    getProductRating: (productId: string) => requests.get(`ratings/get-product-rating?productId=${productId}`),
    getProductDetailRating: (productDetailId: string) => requests.get(`ratings/get-product-detail-rating?productDetailId=${productDetailId}`),
    set: (p : RatingDTO) => requests.post(`ratings/gset-rating`, p),
}

const agent = {
    Upload,
    Product,
    Categories,
    Brands,
    Promotions,
    User,
    Location,
    Basket,
    Order,
    Technology,
    Warehouses,
    Stocks,
    Rating
}

export default agent;