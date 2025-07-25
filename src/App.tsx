import styled from 'styled-components';
import { Header } from './features/ui/Layout/Header';
import { Outlet, useLocation } from 'react-router-dom';
import { Home } from './features/pages/Home/Home';
import { useAppDispatch, useAppSelector } from './app/store/configureStore';
import { useCallback, useEffect, useState } from 'react';
import { fetchCurrentUser } from './app/store/userSlice';
import { Loading } from './features/ui/Common/Loading';
import { getBasket } from './app/store/basketSlice';
import { Container } from './features/ui/Layout/Container';
import { Footer } from './features/ui/Layout/Footer';
import { useSignalIROrderStatusHub } from './features/Hooks/useSignalRNotiHub';
import { fetchCategoryAsync, setCategoriesDropdown } from './app/store/categorySlice';
import { fetchBrandsAsync, setBrandsDropdown } from './app/store/brandSlice';

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loadingApp, setLoadingApp] = useState<boolean>(true);
  const { user } = useAppSelector(state => state.user);

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      await dispatch(fetchCategoryAsync());
      await dispatch(fetchBrandsAsync());

      // set dropdown data
      dispatch(setCategoriesDropdown(null))
      dispatch(setBrandsDropdown(null))
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (user?.basketId) {
      dispatch(getBasket());
    }
  }, [user, dispatch]);

  useEffect(() => {
    initApp().then(() => setLoadingApp(false));
  }, [initApp]);

  const token = user?.token ?? null;
  useSignalIROrderStatusHub(token);

  return (
    <AppStyle>
      {
        loadingApp ? <Loading message='Initializing App...' />
          :
          <>
            {!location.pathname.includes('admin') && <Header />}
            {
              location.pathname === '/' ?
                <Home />
                :
                (
                  location.pathname.includes('admin') ?
                    <Outlet />
                    :
                    <Container>
                      <Outlet />
                    </Container>
                )
            }
            <Footer />
          </>
      }
    </AppStyle>
  );
}

const AppStyle = styled.div`
    display: flex;
    flex-direction: column;

    width: 100%;
    min-height: 100vh;
    background-color: #e9e6ed;
    overflow: hidden;
`

export default App;
