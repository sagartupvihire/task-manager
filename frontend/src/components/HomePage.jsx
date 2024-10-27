import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navbar from "./Navbar";

function App() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editingTask, setEditingTask] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const queryClient = useQueryClient();

    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const res = await axiosInstance.get("/task/gettask");

            console.log(res.data);
            return res.data;
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to fetch tasks");
        },
    });

    const addTaskMutation = useMutation({
        mutationKey: ["addTask"],
        mutationFn: async (data) => {
            const res = await axiosInstance.post("/task/addtask", data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Task added successfully");
            setTitle("");
            setDescription("");
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to add task");
        },
    });

    const { mutate: deleteTaskMutation, isLoading: isDeleting } = useMutation({
        mutationKey: ["deleteTask"],
        mutationFn: async (id) => {
            const res = await axiosInstance.post(`/task/delete/${id}`);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Task deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to delete task");
        },
    });

    const { mutate: updateTaskMutation, isLoading: isUpdating } = useMutation({
        mutationKey: ["updateTask"],
        mutationFn: async (data) => {
            const res = await axiosInstance.post(`/task/update/${data.taskId}`, data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Task updated successfully");
            setEditingTask(null);
            setEditTitle("");
            setEditDescription("");
            
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update task");
        },
    });

    const onSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) {
            toast.error("Please fill in both fields");
            return;
        }
        addTaskMutation.mutate({ title, description });
    };

    const handleEdit = (task) => {
        setEditingTask(task._id);
        setEditTitle(task.title);
        setEditDescription(task.description);
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
        setEditTitle("");
        setEditDescription("");
    };

    const handleUpdate = (taskId) => {
        if (!editTitle.trim() || !editDescription.trim()) {
            toast.error("Please fill in both fields");
            return;
        }
        updateTaskMutation({
            taskId,
            title: editTitle,
            description: editDescription,
        });
    };

    const handleStatusUpdate = (task) => {
        updateTaskMutation({
            taskId: task._id,
            status: !task.status,
            title: task.title,
            description: task.description,
        });
    };

    return (
        <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <Navbar/>
            <div className="max-w-4xl mx-auto">
                <form onSubmit={onSubmit} className="bg-card shadow-lg rounded-lg p-6 mb-8">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium">
                                Title
                            </label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="mt-1"
                                placeholder="Enter task title"
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium">
                                Description
                            </label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1"
                                placeholder="Enter task description"
                                rows={3}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading || addTaskMutation.isLoading}
                        >
                            {addTaskMutation.isLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                            ) : (
                                <Plus className="w-4 h-4 mr-2" />
                            )}
                            {addTaskMutation.isLoading ? "Adding..." : "Add Task"}
                        </Button>
                    </div>
                </form>

                <div className="bg-card shadow-lg rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-left"></TableHead>
                                <TableHead className="text-center">Title</TableHead>
                                <TableHead className="text-center">Description</TableHead>
                                <TableHead className="text-center">Status</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tasks.map((task) => (
                                <TableRow key={task._id} className={`${task.status ? "line-through" : ""}`}>
                                    <TableCell className="font-medium"><input type="checkbox" defaultChecked={task.status} checked={task.status} className="checkbox" onChange={() => handleStatusUpdate(task)} /></TableCell>
                                    <TableCell>
                                        {editingTask === task._id ? (
                                            <Input
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                className="max-w-sm"
                                            />
                                        ) : (
                                            task.title
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingTask === task._id ? (
                                            <Input
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                className="max-w-sm"
                                            />
                                        ) : (
                                            task.description
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant={task.status ? "default" : "secondary"}
                                            size="sm"
                                            onClick={() => handleStatusUpdate(task)}
                                        >
                                            {task.status ? "Complete" : "Incomplete"}
                                        </Button>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {editingTask === task._id ? (
                                            <>
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() => handleUpdate(task._id)}
                                                    disabled={isUpdating}
                                                    className="mr-2"
                                                >
                                                    {isUpdating ? (
                                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                    ) : (
                                                        "Save"
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={handleCancelEdit}
                                                    disabled={isUpdating}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(task)}
                                                    className="mr-2"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteTaskMutation(task._id)}
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </Button>
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

export default App;