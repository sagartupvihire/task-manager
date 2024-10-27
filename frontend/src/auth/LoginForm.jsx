/* eslint-disable no-unused-vars */
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { useState } from "react";
import { Loader } from "lucide-react";

const LoginForm = () => {

    const queryClient = useQueryClient();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please fill in both fields');
            return;
        }
        loginMutation({ email, password });
    }
    
    const { mutate: loginMutation, isLoading } = useMutation({
        mutationFn: async ({ email, password }) => {
            try {
                const res = await axiosInstance.post('/auth/login', { email, password });
                console.log(res.data);
                return res.data;
            } catch (error) {
                console.error(error);
                throw error; // Re-throw to handle in onError
            }
        },
        onSuccess: (data) => {
            toast.success('Login successful');
            console.log(data);
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    });
 
    

return (
    <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left">
                <h1 className="text-5xl font-bold">Login now!</h1>
                <p className="py-6">
                    Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                    quasi. In deleniti eaque aut repudiandae et a id nisi.
                </p>
            </div>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                <form className="card-body" onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input type="email" placeholder="email" className="input input-bordered" onChange={(e) => setEmail(e.target.value)} value={email} required />
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input type="password" placeholder="password" className="input input-bordered" onChange={(e) => setPassword(e.target.value)} value={password} required />
                        <label className="label">
                            <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                        </label>
                    </div>
                    <div className="form-control mt-6">
                        <button className="btn btn-primary" disabled={isLoading} type="submit" >
                        {isLoading ? <Loader className="animate-spin h-5 w-5" /> : 'Login'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
)
}

export default LoginForm
