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

type Credentials = {
    username: string
    password: string
}

export async function login(credentials: Credentials) {
    if (credentials.username.length === 0) {
        alert("Please enter username")
        return false
    }
    else if (credentials.password.length === 0) {
        alert("please enter password")
        return false
    }
    let url = `${rootpath}/sessions`
    const response = await axios.post(url, credentials)
    //response is a promise
    return response.data
}