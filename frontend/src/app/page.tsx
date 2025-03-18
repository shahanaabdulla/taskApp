"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import TaskFormPopup from "@/components/TaskFormPopup"; // Import the TaskFormPopup component

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const router = useRouter();
  useAuth(); // Protect this page

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id: number) => {
    setTaskToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete === null) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks(); // Re-fetch tasks after deletion
    } catch (error) {
      console.error("Error deleting task:", error);
    } finally {
      setIsModalOpen(false);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="min-h-screen p-8 font-sans bg-black text-white">
      {/* Include the Navbar */}
      <Navbar />

      <div className="max-w-4xl mx-auto mt-16">
        <h1 className="text-2xl font-bold mb-6 text-center">
          🌟 "The secret to getting ahead is getting started." – Mark Twain
        </h1>

        <p className="text-lg text-center text-gray-400 mb-6">
          "Every task you complete brings you one step closer to your goals. Let’s make today count!"
        </p>

        {/* Create Task Button */}
        <div className="mb-4">
          <TaskFormPopup fetchTasks={fetchTasks} /> {/* Create Task Popup */}
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 border border-gray-700 rounded-lg shadow-sm bg-gray-800"
            >
              <h2 className="text-xl font-semibold text-white">{task.title}</h2>
              <p className="text-gray-400">{task.description}</p>
              <p
                className={`text-sm ${
                  task.status === "completed" ? "text-green-500" : "text-yellow-500"
                }`}
              >
                {task.status}
              </p>
              <div className="flex gap-2 mt-4">
                {/* Update Task Popup */}
                <TaskFormPopup fetchTasks={fetchTasks} taskId={task.id.toString()} />
                <button
                  onClick={() => handleDelete(task.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
}
