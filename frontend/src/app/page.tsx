"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/Navbar";
import TaskFormPopup from "@/components/TaskFormPopup";

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
  useAuth();

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black font-sans text-white">
      {/* Include the Navbar */}
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          🌟 "The secret to getting ahead is getting started." – Mark Twain
        </h1>

        <p className="text-lg text-center text-gray-400 mb-8">
          "Every task you complete brings you one step closer to your goals. Let’s make today count!"
        </p>

        {/* Create Task Button */}
        <div className="mb-8 flex justify-center">
          <TaskFormPopup fetchTasks={fetchTasks} />
        </div>

        <div className="space-y-6">
          {tasks.map((task) => (
            <div
            key={task.id}
            className="p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
          >
            {/* Task Title with Icon */}
            <div className="flex items-center gap-2 mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h2 className="text-xl font-semibold text-white">{task.title}</h2>
            </div>
          
            {/* Task Description */}
            <p className="text-gray-400 mb-4 text-sm leading-relaxed">
              {task.description}
            </p>
          
            {/* Task Status with Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Progress</span>
                <span
                  className={`text-sm font-semibold ${
                    task.status === "completed" ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {task.status === "completed" ? "Completed" : "In Progress"}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    task.status === "completed" ? "bg-green-400" : "bg-yellow-400"
                  }`}
                  style={{
                    width: task.status === "completed" ? "100%" : "50%",
                  }}
                ></div>
              </div>
            </div>
          
            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              {/* Update Task Popup */}
              <TaskFormPopup fetchTasks={fetchTasks} taskId={task.id.toString()} />
          
              {/* Delete Button */}
              <button
                onClick={() => handleDelete(task.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
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