import { useState, useEffect } from "react";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

const useAxiosFetch1Save = <T>(url: string, params?: AxiosRequestConfig) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  let rootpath = ''

  if (process.env.NODE_ENV === "development") {
    rootpath = 'http://localhost:5001'
  }
  else if (process.env.NODE_ENV === "production") {
    rootpath = 'https://kphamenglish-f26e8b4d6e4b.herokuapp.com'
  }
  else {
    console.log("invalid NODE_ENV ")
  }
/*
  const config: AxiosRequestConfig = {
      url: props.url,
      method: props.method, // or 'POST', 'PUT', 'DELETE', etc.
      baseURL: rootpath + '/api',
      data: props.body
    };
*/
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        //console.log("useAxiosFetch1 url = ", url)
        const response: AxiosResponse<T> = await axios.get(rootpath + '/api/' + url, params);
        //console.log("useAxiosFetch1 response = ", response)
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error getting the data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useAxiosFetch1Save;