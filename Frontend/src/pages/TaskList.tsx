import { useState } from "react";
import { useTask } from "../hooks/useTasks";
import { TaskCard } from "../components/tasks/TaskCard";
import { TaskModal } from "../components/tasks/TaskModal";
import { getUsers } from "../api/user.api";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Filter, LayoutDashboard, RotateCcw } from "lucide-react"; // Added RotateCcw for Reset

export default function TaskList() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<any>(null);

  // 1. Temporary states (The current selection in the UI)
  const [tempStatus, setTempStatus] = useState("");
  const [tempPriority, setTempPriority] = useState("");
  const [tempSort, setTempSort] = useState("");

  // 2. Applied states (The values used for the API call)
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

  // ✅ Trigger: Apply selection to the query
  const handleApplyFilters = () => {
    setStatus(tempStatus);
    setPriority(tempPriority);
    setSort(tempSort);
  };

  // ✅ Trigger: Clear everything and refresh list
  const handleResetFilters = () => {
    setTempStatus("");
    setTempPriority("");
    setTempSort("");
    setStatus("");
    setPriority("");
    setSort("");
  };

  const handleOpenCreate = () => {
    setActiveTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: any) => {
    setActiveTask(task);
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
          <div className="flex items-center gap-4">
            {/* ✅ BACK TO DASHBOARD BUTTON */}
            <Link
              to="/"
              className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-100 group"
              title="Go to Dashboard"
            >
              <LayoutDashboard
                size={20}
                className="group-active:scale-90 transition-transform"
              />
            </Link>

            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Task Workspace
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Manage, filter, and track team progress.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenCreate}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
          >
            + Create New Task
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:items-end gap-4">
            {/* Status Select */}
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                Status
              </label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500 transition-all"
                value={tempStatus}
                onChange={(e) => setTempStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="REVIEW">Review</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            {/* Priority Select */}
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                Priority
              </label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500 transition-all"
                value={tempPriority}
                onChange={(e) => setTempPriority(e.target.value)}
              >
                <option value="">All Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">
                Sort By
              </label>
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:border-blue-500 transition-all"
                value={tempSort}
                onChange={(e) => setTempSort(e.target.value)}
              >
                <option value="">None</option>
                <option value="dueDate">Due Date</option>
              </select>
            </div>

            {/* BUTTON GROUP */}
            <div className="flex gap-2">
              <button
                onClick={handleResetFilters}
                title="Reset Filters"
                className="bg-slate-100 text-slate-600 p-2.5 rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center h-[42px]"
              >
                <RotateCcw size={18} />
              </button>

              <button
                onClick={handleApplyFilters}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 flex items-center justify-center gap-2 h-[42px] flex-1 lg:flex-none"
              >
                <Filter size={16} />
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.length > 0 ? (
            tasks.map((task: any) => (
              <div
                key={task._id}
                onClick={() => handleOpenEdit(task)}
                className="transition-transform active:scale-95"
              >
                <TaskCard task={task} users={users} />
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">
                No tasks found matching your filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="text-blue-600 text-sm font-bold mt-2 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

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
