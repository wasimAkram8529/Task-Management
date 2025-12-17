import { AlertCircle, Clock, User2, ShieldCheck } from "lucide-react";

export const TaskCard = ({ task, users }: any) => {
  // Find both users from the list provided via props
  const assignee = users?.find((u: any) => u._id === task.assignedToId);
  const creator = users?.find(
    (u: any) => u._id === (task.creatorId?._id || task.creatorId)
  );

  const statusColors: any = {
    TODO: "bg-slate-100 text-slate-600",
    IN_PROGRESS: "bg-blue-50 text-blue-600",
    REVIEW: "bg-purple-50 text-purple-600",
    COMPLETED: "bg-emerald-50 text-emerald-600",
  };

  const priorityColors: any = {
    LOW: "bg-slate-50 text-slate-500",
    MEDIUM: "bg-blue-50 text-blue-600",
    HIGH: "bg-orange-50 text-orange-600",
    URGENT: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex flex-col h-full">
      {/* Title and Description */}
      <div className="mb-4">
        <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-1">
          {task.title}
        </h3>
        <p className="text-slate-500 text-xs line-clamp-2">
          {task.description}
        </p>
      </div>

      {/* Metadata Section - Unified Label/Value rows */}
      <div className="mt-auto pt-4 border-t border-slate-50 space-y-3">
        {/* Owner (Creator) Row */}
        <div className="flex justify-between items-center text-[11px] font-medium">
          <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-slate-300" /> Owner
          </span>
          <span className="text-slate-700 font-bold">
            {creator?.name || "System"}
          </span>
        </div>

        {/* Assignee Row */}
        <div className="flex justify-between items-center text-[11px] font-medium">
          <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <User2 size={12} className="text-slate-300" /> Assignee
          </span>
          <span className="text-blue-600 font-bold">
            {assignee?.name || "Unassigned"}
          </span>
        </div>

        {/* Status Row */}
        <div className="flex justify-between items-center text-[11px] font-medium">
          <span className="text-slate-400 uppercase tracking-wider">
            Status
          </span>
          <span
            className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
              statusColors[task.status]
            }`}
          >
            {task.status.replace("_", " ")}
          </span>
        </div>

        {/* Priority Row */}
        <div className="flex justify-between items-center text-[11px] font-medium">
          <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <AlertCircle size={12} /> Priority
          </span>
          <span
            className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
              priorityColors[task.priority]
            }`}
          >
            {task.priority}
          </span>
        </div>

        {/* Due Date Row */}
        {task.dueDate && (
          <div className="flex justify-between items-center text-[11px] font-medium">
            <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Clock size={12} /> Due Date
            </span>
            <span className="text-slate-600 font-bold">
              {new Date(task.dueDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
