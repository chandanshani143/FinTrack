import { useState } from 'react';
import { toast } from "sonner"

const useFetch = (cb) => {
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);


    const fn = async (...args) => {
        setLoading(true);  // loading is true when the function is called
        setError(null);   // Reset error state before making the request

        try {
            const response = await cb(...args); // Call the callback function with the provided arguments
            setData(response);
            setError(null);
        } catch(error) {
            setError(error);
            toast.error(error.message);   // Display error message using Sonner
        } finally {
            setLoading(false);
        }
    }

    return { data, loading, error, fn, setData };   // returning the state and function
};

export default useFetch;