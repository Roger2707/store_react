import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router/Routes';
import { Provider } from 'react-redux';
import { store } from './app/store/configureStore';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store} >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        toastClassName="custom-toast" // Áp dụng lớp tùy chỉnh cho toast
        bodyClassName="custom-toast-body" // Lớp tùy chỉnh cho nội dung của toast
        progressClassName="custom-toast-progress" 
      />

      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
