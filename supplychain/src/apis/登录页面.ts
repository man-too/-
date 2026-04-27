import request from "@/utile";
interface loginparams{
    username:string,
    password:string
}
const login = (data:loginparams)=>request.post('/api/login',data);
export default login;
