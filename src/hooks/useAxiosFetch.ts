import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig, AxiosError } from "axios";

axios.defaults.baseURL = "http://localhost:8080/api";

//const useAxios = <T>({ url, method = 'get', data, config }: UseAxiosOptions<T>): UseAxiosResult<T> => {
interface DataResponse<T> {
  data: T | null; 
  loading: boolean; 
  error: AxiosError | null
}

export const useAxiosFetch = <T>(props: {url: string, method: string, body? : {} }): DataResponse<T> => {
//console.log("useAxiosFetch url = ", props.url)
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  let rootpath = ''

  if (process.env.NODE_ENV === "development") {
    rootpath = 'http://localhost:5001'
  }
  else if (process.env.NODE_ENV === "production") {
    rootpath = 'https://kphamenglish-f26e8b4d6e4b.herokuapp.com'
    //rootpath = 'https://www.tienganhtuyhoa.com'
  }
  else {
    console.log("invalid NODE_ENV ")
  }

  useEffect(() => {
    const config: AxiosRequestConfig = {
      url: props.url,
      method: props.method, // or 'POST', 'PUT', 'DELETE', etc.
      baseURL: rootpath + '/api',
      data: props.body
    };
    const fetchData = async (): Promise<void> => {
      try {
        //console.log("useAxiosFetch config = ", config)
          const response = await axios(config)
          //console.log("useAxiosFetch response = ", response)
          setData(response.data)
        } catch (err) {
          if (axios.isAxiosError(err)) {
            setError(err);
          } else {
            setError(new AxiosError('An error occurred', undefined, undefined, undefined, undefined));
          }
        } finally {
          setLoading(false);
        }
    }
    fetchData();
 // }, []);
}, [props.method, props.url, props.body, rootpath]);

  /*
  useEffect(() => {
    const config: AxiosRequestConfig = {
      url: props.url,
      method: props.method, // or 'POST', 'PUT', 'DELETE', etc.
      baseURL: rootpath + '/api',
      data: props.body
    };
    const fetchData = async (): Promise<void> => {
      try {
          const response = await axios(config)
          console.log("useAxiosFetch response = ", response)
          setData(response.data)
        } catch (err) {
          if (axios.isAxiosError(err)) {
            setError(err);
          } else {
            setError(new AxiosError('An error occurred', undefined, undefined, undefined, undefined));
          }
        } finally {
          setLoading(false);
        }
    }
    fetchData();
  }, [props.method, props.url, props.body, rootpath]);
*/

  //return { data, error, loading } as const;
  return { data: data, loading, error };
};

