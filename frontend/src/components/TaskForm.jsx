/* eslint-disable react/prop-types */

import { Loader2, Plus } from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';

const TaskForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');


    const { mutate: addTaskMutation, isLoading } = useMutation({
        mutationFn: async (data) => await axiosInstance.post('/task/addtask', data),
        onSuccess: () => {
            setTitle('');
            setDescription('');
            toast.success('Task added successfully');
        },
        onError: (error) => {
            toast.error(error.response.data.message || 'Failed to add task');
        },

    })
    const onSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !description.trim()) {
            toast.error('Please fill in both fields');
            return;
        }
        addTaskMutation({ title, description });
        setTitle('');
        setDescription('');
    };
    return (
        <form onSubmit={onSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="input input-bordered mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter task title"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className=" input input-bordered mt-1 pt-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter task description"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {  isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Plus className="w-4 h-4" />
                    )}
                    {isLoading ? "Adding..." : "Add Task"}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;