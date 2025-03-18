"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react"; // Loading spinner
import { useAuth } from "@/hooks/useAuth";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

export default function TaskForm({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params; // Get the task ID from the URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false); // Loading state for fetching and submitting tasks
  const [error, setError] = useState<string | null>(null); // Error state for showing error messages
  useAuth(); // Protect this page

  // Fetch task details if in update mode
  useEffect(() => {
    if (id) {
      const fetchTask = async () => {
        setLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`, {
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
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (id) {
        // Update existing task
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`,
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
      router.push("/"); // Redirect to homepage after success
    } catch (error) {
      console.error("Error saving task:", error);
      setError("Failed to save task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {id ? "Update Task" : "Create Task"}
        </h1>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : id ? (
                "Update Task"
              ) : (
                "Create Task"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/")}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}