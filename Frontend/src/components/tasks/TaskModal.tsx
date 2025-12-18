import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Clock, Info, Calendar, AlertCircle } from "lucide-react";
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

  const isCreator = !isEditing || task?.creatorId === currentUserId;

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
    const payload: any = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      assignedToId: data.assignedToId || undefined,
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
      <div className="bg-white rounded-[32px] w-full max-w-6xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[90vh]">
        <div className="h-1/2 md:h-full md:flex-[1.5] lg:flex-[2] p-6 lg:p-10 overflow-y-auto border-b md:border-b-0 md:border-r border-slate-100 flex flex-col bg-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                {isEditing ? "Task Details" : "Create New Task"}
              </h2>
              {!isCreator && (
                <p className="text-amber-500 text-[10px] font-bold uppercase mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> Read-only mode (Assignee), You can
                  only change Status, Priority, Assignee
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
            >
              <X size={20} />
            </button>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 flex-1 flex flex-col"
          >
            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Title
                </label>
                <input
                  {...register("title", { required: true })}
                  disabled={!isCreator}
                  className={`w-full border rounded-2xl px-4 py-3 outline-none transition-all font-medium ${
                    !isCreator
                      ? "bg-slate-100 text-slate-500 cursor-not-allowed border-transparent"
                      : "bg-slate-50 border-slate-200 focus:border-blue-500"
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  disabled={!isCreator}
                  className={`w-full border rounded-2xl px-4 py-3 min-h-[80px] outline-none transition-all text-sm ${
                    !isCreator
                      ? "bg-slate-100 text-slate-500 cursor-not-allowed border-transparent"
                      : "bg-slate-50 border-slate-200 focus:border-blue-500"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <Calendar size={12} /> Due Date
                  </label>
                  <input
                    type="date"
                    {...register("dueDate", { required: true })}
                    disabled={!isCreator}
                    className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none ${
                      !isCreator
                        ? "bg-slate-100 cursor-not-allowed"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1">
                    <AlertCircle size={12} /> Priority
                  </label>
                  <select
                    {...register("priority")}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-sm font-bold text-blue-600 outline-none"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="REVIEW">Review</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Assignee
                  </label>
                  <select
                    {...register("assignedToId")}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none"
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

            <div className="flex items-center gap-3 pt-6 mt-auto border-t border-slate-50">
              {isEditing && isCreator && (
                <button
                  type="button"
                  onClick={() => confirm("Delete task?") && onDelete(task._id)}
                  className="text-red-500 font-bold text-sm hover:underline"
                >
                  Delete
                </button>
              )}
              <div className="flex-1" />
              <button
                type="submit"
                className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all text-sm"
              >
                {isEditing ? "Update Task" : "Create Task"}
              </button>
            </div>
          </form>
        </div>

        <div className="h-1/2 md:h-full w-full md:w-[320px] lg:w-[380px] bg-slate-50/50 flex flex-col">
          <div className="p-4 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center gap-2">
            <Clock size={14} className="text-slate-900" />
            <h3 className="font-bold text-slate-900 text-[10px] uppercase tracking-widest">
              Activity History
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 p-4">
            {isEditing ? (
              <TaskHistory taskId={task._id} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <Info size={24} className="mb-2 opacity-20" />
                <p className="text-[10px] text-center">
                  History will appear here
                  <br />
                  after creation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
