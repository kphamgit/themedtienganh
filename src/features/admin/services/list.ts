import axios from "axios";


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
export async function updateQuestion(id: string | undefined, body: {instruction: string}) {
    //console.log(" in updateQuestion id ",id )
    //console.log(" in updateQuestion id ",body )
    const url = `${rootpath}/api/questions/${id}`
    console.log("HEE url", url)
    const response = await axios.put(url, body)
    return response
    //return "test"
  }