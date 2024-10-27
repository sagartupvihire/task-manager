import Task from "../model/task.model.js";

export const addTask = async (req, res) => {
    const { title, description } = req.body;
    console.log(title, description,  "add tasks");
    

    if (!title || !description) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const task = new Task({
            author: req.userId,
            title,
            description,
            status: false
        });
        await task.save();
        res.status(201).json({ task });
    } catch (error) {
        console.log("error in add task");
        
        res.status(400).json({ message: error.message });
    }
}

export const getTask = async (req, res) => {
    
    const tasks = await Task.find({ author: req.userId });

    if (!tasks) {
        return res.status(404).json({ message: "Tasks not found" });
    }
    
    res.status(200).json(tasks );
}

export const changeStatus = async (req, res) => {
    const { taskId, status } = req.body;
    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(400).json({ message: "Task not found" });
        }

        if (task.author?.toString() !== req.userId.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        task.status = status;
        await task.save();
        res.status(200).json({ task });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const deleteTask = async (req, res) => {
    // Extracting task ID from request parameters
    const taskId = req.params.id;

    console.log("Received taskId for deletion:", taskId);
    console.log("Request parameters:", req.params);

    try {
        // Finding the task by ID
        const task = await Task.findById(taskId);
        // If the task is not found, return a 404 status

        console.log("Found task:", task);
        
        if (!task) {
            return res.status(404).json({ message: "Task not found" }); // Change to 404 for not found
        }

        // Check if the current user is the author of the task
        

        // Compare the task author with the authenticated user's ID
        if (task.author.toString() !== req.userId.toString()) {
            console.log("task.author:", task.author.toString(), "req.userId:", req.userId);
            
            return res.status(401).json({ requser: req.userId, authr: task.author, message: "Unauthorized" }); // Return 401 for unauthorized access
        }

        console.log("Deleting task:", task);

        // Deleting the task
        await Task.findByIdAndDelete(taskId);
        return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        // Log the error for debugging purposes
        console.error("Error while deleting task:", error);
        
        // Return a 500 status for server errors
        return res.status(500).json({ message: error.message });
    }
};




export const updateTask = async (req, res) => {
    const { taskId, title, description, status } = req.body;
    try {
        
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(400).json({ message: "Task not found" });
        }

        if (task.author.toString() !== req.userId.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.status = status;
        await task.save();
        res.status(200).json({ task });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getcompletedTask = async (req, res) =>{
    if(!req.userId){

        return res.status(400).json({ message: "User not found" });
    }

    const tasks = await Task.find({ author: req.userId, status: true });
    res.status(200).json({ tasks });

}

export const getuncompletedTask = async (req, res) =>{
    if(!req.userId){

        return res.status(400).json({ message: "User not found" }); 
    }  
    const tasks = await Task.find({ author: req.userId, status: false });
    res.status(200).json({ tasks });

}