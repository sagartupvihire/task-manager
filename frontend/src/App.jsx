/* eslint-disable no-unused-vars */

import toast, { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import SignUpForm from './auth/SignUpForm.jsx';
import { QueryClient, useQuery } from '@tanstack/react-query';
import { axiosInstance } from './lib/axios.js';
import HomePage from './components/HomePage.jsx';
import LoginForm from './auth/LoginForm.jsx';
import { useEffect } from 'react';

function App() {
    const navigate = useNavigate();
    
    const { data: authUser, isLoading } = useQuery({
        queryKey: ['authUser'],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get('/auth/me');
                return res.data;
            } catch (error) {
                console.error("Error fetching auth user:", error);
                if (error.message === "Network Error") {
                    toast.error("Network error: Unable to reach the server.");
                } else {
                    toast.error(error.response?.data?.message || "Failed to fetch user data.");
                }
                return null;
            }
        },
        staleTime: 0,                 // Refetch immediately on component load
        refetchOnWindowFocus: true,
        onSuccess: (data) => {
            console.log('User data fetched successfully.', data);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    // Redirect to home if authUser is populated
    useEffect(() => {
        if (authUser) {
            navigate('/');
        }
    }, [authUser, navigate]);

    if (isLoading) {
        return <div>Loading...</div>; // Optional: add a loading spinner or indicator here
    }

    return (
        <>
            <Routes>
                <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
                <Route path="/signup" element={authUser ? <Navigate to="/" /> : <SignUpForm />} />
                <Route path="/login" element={authUser ? <Navigate to="/" /> : <LoginForm />} />
            </Routes>
            <Toaster />
        </>
    );
}

export default App;
