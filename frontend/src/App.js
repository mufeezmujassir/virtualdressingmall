
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useCallback } from 'react';
import SummaryApi from './common';
import Context from './context';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './store/userSlice';




function App() {
  const dispatch = useDispatch()
  
  const fetchUserDetails = useCallback(async () => {
    const dataResponse = await fetch(SummaryApi.current_user.url, {
      method: SummaryApi.current_user.method,
      credentials: 'include'
    });

    const dataApi = await dataResponse.json();

    if (dataApi.success) {
      dispatch(setUserDetails(dataApi.data));
    }
  }, [dispatch]);

  

  useEffect(()=>{
    /**user Details */
    fetchUserDetails();
    /**user Details cart product */
  },[fetchUserDetails]);
  return (
    <>
      <Context.Provider value={{
          fetchUserDetails// user detail fetch 
         
      }}>
        <ToastContainer 
          position='top-center'
        />
        
        <Header/>
        <main className='min-h-[calc(100vh-120px)] pt-40'>
          <Outlet/>
        </main>
        <Footer/>
      </Context.Provider>
      <ToastContainer/>
    </>
  );
}

export default App;