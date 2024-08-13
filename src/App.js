// import React, {  useEffect ,useContext } from 'react';
import Register from './pages/Register';
import { createBrowserRouter, /*useNavigate*/ Outlet, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
// import { AuthContext } from './context/AuthContext';
import Images from './pages/Images';
import NavBar from './components/NavBar';
import About from './pages/About';
import TechInfo from './pages/TechInfo';
import FAQ from './pages/FAQ';
import Footer from './components/Footer';
import Simulation from './pages/Simulation';
import WhatsAppShortcut from './components/WhatsAppShortcut';
import './App.css';
import { Accessibility } from 'accessibility/dist/main';

var options = {
    session: {
        persistent: false
    }
};

options.icon = {
    circular: true,
    position: {
        bottom: { size: 2, units: 'vh' },
        left: { size: 2, units: '%' },
        type: 'fixed'
    }
};

var labels = {
    resetTitle: 'reset',
    closeTitle: 'close',
    menuTitle: 'אפשרויות נגישות',
    increaseText: 'הגדלת הטקסט',
    decreaseText: 'הקטנת הטקסט',
    increaseTextSpacing: 'העלאת המרווח בטקסט',
    decreaseTextSpacing: 'הורדת המרווח בטקסט',
    increaseLineHeight: 'הגדלת קו גובה',
    decreaseLineHeight: 'הקטנת גובה הקו',
    invertColors: 'היפוך צבעים',
    grayHues: 'גווני אפור',
    underlineLinks: 'הוספת קו תחתון לקישורים',
    bigCursor: 'סמן גדול',
    readingGuide: 'מדריך קריאה',
    disableAnimations: 'ביטול אנימציות'
};

options.labels = labels;

window.addEventListener('load', function() {
    new Accessibility(options);
}, false);


const App = () => {

    // const {currentUser} = useContext(AuthContext);

    // const RequireAuth = ({children})=>{
    //     return currentUser ? children : <Navigate to = '/login'/>;
    // };  


    const Layout = () =>{
        return(
            <div className='app d-flex flex-column vh-100'>
                <NavBar/>
                <div className="flex-grow-1">
                    <Outlet/>
                </div>
                <WhatsAppShortcut />
                <Footer/>
            </div>
        );
    };

    const router = createBrowserRouter([

        {
            path : '/',
            element :<Layout/>,
            children:[
                // add the nav bar to all the pages
                {
                    path:"/",
                    element:<Home/>
                },
                {
                    path:"/home",
                    element:<Home/>
                },
                {
                    path:"/about",
                    element: <About/>
                },
                {
                    path:"/register",
                    element: <Register/>
                },
                {
                    path:"/login",
                    element: <Login/>
                },
                {
                    path:"/quesans",
                    element: <FAQ/>
                },
                {
                    path:"/tech",
                    element: <TechInfo/>
                },
                {
                    path:"/images",
                    element: <Images/>
                },
                {
                    path:"/simulation",
                    element: <Simulation/>,
                },

            ]
        },
        {
            path: "/register",
            element: <Register/>,
        },
        {
            path: "/login",
            element: <Login/>
        },
        {
            path: "/home",
            element: <Home/>    
        },
        {
            path: "/images",
            element: <Images/>,
        },
        {
            path: "/quesans",
            element: <FAQ/>,
        },
        {
            path:"/simulation",
            element: <Simulation/>,
        },
     


    ]);

    return (
                
            <RouterProvider router={router}>
                <Layout/>
            </RouterProvider>

        );
};

export default App;