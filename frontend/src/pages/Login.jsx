import { useState } from "react";
import api from '../api'

const Login = ()=>{
    const[email, setEmail]= useState("")
    const[password, setPassword]= useState("")
    
    const handleLogin=  async(e)=>{
         e.preventDefault();

         try {

            const response = await api.post("/auth/login",{
                email,
                password
            })

            // console.log(response.data);
            
         } catch (error) {
            console.log(error.response?.data);
            
         }
         
    }
    return  (
        <div>

             <h1>Login Page</h1>
             <form onSubmit={handleLogin}>
                <div>
                    <label>Email</label>
                    <input type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    />
                </div>

                <button type="submit">Login</button>
             </form>

        </div>
    )
}

export default Login;