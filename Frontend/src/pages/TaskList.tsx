import { useState } from "react";
import { useTask } from "../hooks/useTasks";
import { TaskCard } from "../components/tasks/TaskCard";
import { TaskModal } from "../components/tasks/TaskModal";
import { getUsers } from "../api/user.api";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

export default function TaskList() {
  // ✅ Unified State: Only one set of controls for the modal
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<any>(null);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("");
  const { user } = useAuth();

  const { taskQuery, createMutation, updateMutation, deleteMutation } = useTask(
    { status, priority, sort }
  );

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // ✅ Unified handlers
  const handleOpenCreate = () => {
    setActiveTask(null); // No task data means "Create Mode"
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: any) => {
    setActiveTask(task); // Task data means "Edit/History Mode"
    setIsModalOpen(true);
  };

  if (!taskQuery.data || !usersQuery.data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="font-medium">Loading workspace...</p>
        </div>
      </div>
    );
  }

  const tasks = taskQuery.data.data;
  const users = usersQuery.data.data;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Task Workspace
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage, filter, and track team progress.
            </p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95 flex items-center justify-center"
          >
            + Create New Task
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:items-center gap-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                Status
              </label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                Priority
              </label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none"
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">All Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                Sort By
              </label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none"
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">None</option>
                <option value="dueDate">Due Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task: any) => (
            <div
              key={task._id}
              onClick={() => handleOpenEdit(task)} // ✅ Clicking a card opens Edit/History
              className="transition-transform active:scale-95"
            >
              <TaskCard task={task} users={users} />
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Single Shared Modal */}
      {isModalOpen && (
        <TaskModal
          task={activeTask}
          users={users}
          onClose={() => setIsModalOpen(false)}
          currentUserId={user?.id}
          onDelete={(id: string) => {
            deleteMutation.mutate(id, {
              onSuccess: () => setIsModalOpen(false),
            });
          }}
          onUpdate={(id: string, data: any) =>
            updateMutation.mutate(
              { id, data },
              {
                onSuccess: () => {
                  // ✅ CRUCIAL: Tell React Query to refresh the logs for THIS task
                  queryClient.invalidateQueries({ queryKey: ["taskLogs", id] });
                  setIsModalOpen(false);
                },
              }
            )
          }
          onCreate={(data: any) =>
            createMutation.mutate(data, {
              onSuccess: () => setIsModalOpen(false),
            })
          }
        />
      )}
    </div>
  );
}
