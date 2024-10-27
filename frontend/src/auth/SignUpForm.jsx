/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
const signUpForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const queryClient = useQueryClient();

    const {mutate : signupMutate, isLoading} = useMutation({
        mutationFn: async (data) => {
            const res = await axiosInstance.post('/auth/signup', data);
            console.log(res);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
            toast.success('Signup successful');
        },

        onError: (error) => {
            toast.error(error.response.data.message || 'An error occurred');
        }
    })
    
    const handlesummit = (e) => {
        e.preventDefault();
        console.log(name, email, password);
        signupMutate({ name, email, password });
    }

    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col ">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Signup</h1>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <form className="card-body" onSubmit={handlesummit}>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder="name" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" onChange={(e) => setEmail(e.target.value)} value={email} placeholder="email" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="password" className="input input-bordered" required />
                            <label className="label">
                                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                            </label>
                        </div>
                        <div className="form-control mt-6">
                            <button type="submit" className="btn btn-primary">Signup</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default signUpForm;
