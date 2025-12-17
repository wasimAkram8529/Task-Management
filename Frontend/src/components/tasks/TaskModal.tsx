import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  X,
  Clock,
  Info,
  Calendar,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { TaskHistory } from "./TaskHistory";

export const TaskModal = ({
  users,
  onCreate,
  onUpdate,
  onClose,
  onDelete,
  task,
  currentUserId,
}: any) => {
  const isEditing = !!task;
  const { register, handleSubmit, reset } = useForm();

  const isCreator = task?.creatorId === currentUserId;

  useEffect(() => {
    if (task) {
      reset({
        ...task,
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      reset({
        title: "",
        description: "",
        priority: "MEDIUM",
        status: "TODO",
        assignedToId: "",
        dueDate: new Date().toISOString().split("T")[0],
      });
    }
  }, [task, reset]);

  const onSubmit = (data: any) => {
    // Standardize payload to match Zod DTOs
    const payload: any = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      assignedToId: data.assignedToId || undefined, // Send undefined instead of empty string
      dueDate: data.dueDate,
    };

    if (isEditing) {
      payload.status = data.status;
      onUpdate(task._id, payload);
    } else {
      onCreate(payload);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* LAYOUT FIX: 
          max-w-6xl for breathing room. 
          flex-row for Side-by-Side on desktop. 
      */}
      <div className="bg-white rounded-[32px] w-full max-w-6xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-full max-h-[90vh]">
        {/* LEFT SIDE: FORM (Flexible) */}
        <div className="flex-[1.5] lg:flex-[2] p-6 lg:p-10 overflow-y-auto border-r border-slate-100 flex flex-col bg-white">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                {isEditing ? "Task Details" : "Create New Task"}
                {isEditing && (
                  <span className="text-blue-500 text-xs bg-blue-50 px-2 py-1 rounded-lg">
                    ID: {task._id.slice(-4)}
                  </span>
                )}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {isEditing
                  ? "Manage progress and view logs."
                  : "Fill in the details to assign a new task."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 flex-1 flex flex-col"
          >
            <div className="grid grid-cols-1 gap-6">
              {/* Title */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Title
                </label>
                <input
                  {...register("title", { required: true })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all font-medium"
                  placeholder="Task title..."
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 min-h-[100px] outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all text-sm"
                  placeholder="Additional details..."
                />
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <Calendar size={12} /> Due Date
                  </label>
                  <input
                    type="date"
                    {...register("dueDate", { required: true })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <AlertCircle size={12} /> Priority
                  </label>
                  <select
                    {...register("priority")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                {isEditing && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Current Status
                    </label>
                    <select
                      {...register("status")}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 font-bold text-blue-600"
                    >
                      <option value="TODO">To Do</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="REVIEW">Review</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Assignee
                  </label>
                  <select
                    {...register("assignedToId")}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {users.map((u: any) => (
                      <option key={u._id} value={u._id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS: mt-auto pushes them to the bottom */}
            <div className="flex items-center gap-3 pt-8 mt-auto border-t border-slate-50">
              {isEditing && isCreator && (
                <button
                  type="button"
                  onClick={() =>
                    confirm("Delete this task permanently?") &&
                    onDelete(task._id)
                  }
                  className="px-4 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-all text-sm"
                >
                  Delete
                </button>
              )}

              <div className="flex-1" />

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-slate-400 font-bold hover:bg-slate-50 rounded-xl transition-all text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all active:scale-95 whitespace-nowrap text-sm"
              >
                {isEditing ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE: ACTIVITY (Fixed width sidebar) */}
        <div className="w-full md:w-[320px] lg:w-[380px] bg-slate-50/50 flex flex-col border-l border-slate-100">
          <div className="p-6 border-b border-slate-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-slate-900 rounded-lg flex items-center justify-center">
                <Clock size={12} className="text-white" />
              </div>
              <h3 className="font-bold text-slate-900 text-[10px] uppercase tracking-[0.2em]">
                Activity History
              </h3>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {isEditing ? (
              <TaskHistory taskId={task._id} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
                <div className="w-12 h-12 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center mb-3">
                  <Info size={20} />
                </div>
                <p className="text-[10px] font-medium text-center leading-relaxed">
                  Timeline will appear <br /> after task creation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
