/* eslint-disable react/prop-types */
import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";

const TaskItem = ({ task }) => {
    return (
        <div className="overflow-x-auto">
            <table className="table">
                {/* Head */}
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Table Row */
                    console.log(task)
                    }
                    
                    <tr key={task._id}>
                        <td>{task.title}</td>
                        <td>{task.description}</td>
                        <td>{task.status ? "Complete" : "Incomplete"}</td>
                        <td>
                            <Button variant="outline" size="sm" className="mr-2">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                            <Button variant="outline" size="sm" className="mr-2">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default TaskItem;
