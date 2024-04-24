import {useSearchParams} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {InvoiceService} from "../service/invoiceService";

export const Success = () => {
    const [params, _] = useSearchParams()
    const [object, setObject] = useState(undefined)
    useEffect(() => {
        const j = async () => {
            const _object = await InvoiceService.findInvoice(params.get('invoiceId'))
            setObject(_object)
        }
        j()
    }, []);
    return(
        <div className="container">
            <h1>Success!</h1>
            <h2>invoice-id: {object ? object['invoiceId'] : ''}</h2>
        </div>
    )
}