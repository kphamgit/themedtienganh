import axios from "axios"

let rootpath = ''
if (process.env.NODE_ENV === "production") {
    rootpath = 'https://fullstack-kp-f6a689f4a15c.herokuapp.com'
    //rootpath = 'https://www.tienganhtuyhoa.com'
}
else if (process.env.NODE_ENV === "development"){
    rootpath = 'http://localhost:5001'
    
}
else {
    console.log("invalid NODE_ENV ")
}

type ClassProps = 
    {
        class_id: number,
        class_name: string,
        users: StudentProps[] | undefined
    }

    type StudentProps = 
    {
       
            id: number,
            user_name: string
            full_name: string
            role: string
            level: string
            classId: number
            message: string
            password: string
        
    }

export async function getAClass(id: string): Promise<ClassProps> {
    //console.log("in getAClass")
  
    const url = `${rootpath}/api/classes/${id}`
    const response = await axios.get(url)
   // console.log("UUUU response.data", response.data)
    return response.data
  
  }

  export async function getAGame(id: string | undefined) {
    const url = `${rootpath}/api/matching_games/${id}` 
    const response = await axios.get(url)
    return response.data
  
  }

  export async function upload_form_data_to_s3(formData: any, config: any) {
    const url = `${rootpath}/api/uploads/do_upload_single` 
    //console.log(" in list upload..url =", url)
    //console.log("form data: ", formData)
     axios.post(url, formData, config).then((response) => {
       return response;
     });
  }