import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap-utilities.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import 'bootstrap-icons/font/bootstrap-icons.css'
import Cart from "./ui/Cart";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Success} from "./ui/Success";
import {InvoiceDetails} from "./ui/InvoiceDetails";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Cart/>
    },
    {
        path: '/success',
        element: <Success/>
    },
    {
        path: '/order/:invoiceId',
        element: <InvoiceDetails/>
    }
]);

function App() {
    return (
        <main>
            <RouterProvider router={router}/>
        </main>
    );
}

export default App;
