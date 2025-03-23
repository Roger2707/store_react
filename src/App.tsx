import styled from 'styled-components';
import { Header } from './features/ui/Layout/Header';
import { Outlet, useLocation } from 'react-router-dom';
import { Home } from './features/pages/Home/Home';
import { useAppDispatch, useAppSelector } from './app/store/configureStore';
import { useCallback, useEffect, useState } from 'react';
import { fetchCurrentUser } from './app/store/accountSlice';
import { Loading } from './features/ui/Common/Loading';
import React from 'react';
import { getBasket } from './app/store/basketSlice';

function App() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loadingApp, setLoadingApp] = useState<boolean>(true);
  const {user} = useAppSelector(state => state.account);

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser());
      if(user && user?.basketId) {
        await dispatch(getBasket());
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, user]);

  useEffect(() => {
      initApp().then(() => setLoadingApp(false));
  }, [initApp]);

  return (
    <Container>
      {
        loadingApp ? <Loading message='Initializing App...' />
        :
        <React.Fragment>
          {
            !location.pathname.includes('admin') && <Header/>
          }      
          {
            location.pathname === '/' ?
            <Home/>
            :
            <Outlet />
          }
          {/* <Footer/> */}
        </React.Fragment>
      }
      </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  min-height: 100vh;
  background-color: rgb(230, 230, 250);
  overflow: hidden;
`

export default App;
