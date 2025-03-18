"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface TaskFormPopupProps {
  fetchTasks: () => void;
  taskId?: string; // Optional task ID for update mode
}

export default function TaskFormPopup({ fetchTasks, taskId }: TaskFormPopupProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch task details if in update mode
  useEffect(() => {
    if (taskId && isOpen) {
      const fetchTask = async () => {
        setLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const task = response.data;
          setTitle(task.title);
          setDescription(task.description);
          setStatus(task.status);
        } catch (error) {
          console.error("Error fetching task:", error);
          setError("Failed to load task. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      fetchTask();
    }
  }, [taskId, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (taskId) {
        // Update existing task
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,
          { title, description, status },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create new task
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
          { title, description, status },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      setIsOpen(false); // Close the modal after submission
      fetchTasks(); // Re-fetch tasks to update the list
      router.push("/"); // Redirect to the home page after submission
    } catch (error) {
      console.error("Error saving task:", error);
      setError("Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {taskId ? (
          <Button variant="outline" className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
            Update
          </Button>
        ) : (
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
            Create Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-black text-white">
        <DialogHeader>
          <DialogTitle>{taskId ? "Update Task" : "Create Task"}</DialogTitle>
        </DialogHeader>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Title
            </label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full bg-gray-800 text-white border-gray-700"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full bg-gray-800 text-white border-gray-700"
              required
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-300">
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-700">
                <SelectItem value="pending" className="hover:bg-gray-700">Pending</SelectItem>
                <SelectItem value="in_progress" className="hover:bg-gray-700">In Progress</SelectItem>
                <SelectItem value="completed" className="hover:bg-gray-700">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {taskId ? "Updating..." : "Creating..."}
              </>
            ) : taskId ? (
              "Update Task"
            ) : (
              "Create Task"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}