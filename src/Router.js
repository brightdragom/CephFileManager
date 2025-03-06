import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import App from './App';

const Router = () => {
	return (
        <BrowserRouter>                                      
            <Routes>                                             
                <Route path='/Home' element={<Home />} />            
                <Route path='/' element={<App />} />       
            </Routes>
        </BrowserRouter>
	);
};
export default Router;
