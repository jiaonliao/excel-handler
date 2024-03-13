import './App.css';
import * as React from 'react';
import {NextUIProvider} from "@nextui-org/react";
import Navigation from "./views/Navigation";
import {Route, Routes} from "react-router-dom";
import ExcelTemplate from "./views/ExcelTemplate";
import UploadExcel from "./views/UploadExcel";
import { Toaster } from 'sonner'
function App() {
    return (
        <NextUIProvider>
            <Toaster />
            <Navigation/>
            <div className={"p-10"}>
                <Routes>
                    <Route path="/" element={<ExcelTemplate/>}/>
                    <Route path="/excel-template" element={<ExcelTemplate/>}/>
                    <Route path="/upload-excel" element={<UploadExcel/>}/>
                </Routes>
            </div>
        </NextUIProvider>
    );
}

export default App;
