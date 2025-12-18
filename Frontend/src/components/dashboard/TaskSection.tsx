interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
}

interface Props {
  title: string;
  tasks: Task[];
  variant?: "default" | "danger";
}

export const TaskSection = ({ title, tasks, variant = "default" }: Props) => {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <h2
          className={`text-xl font-bold ${
            variant === "danger" ? "text-red-600" : "text-slate-800"
          }`}
        >
          {title}
        </h2>
        <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
          {tasks.length}
        </span>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-4 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-400">
          <p className="text-sm italic text-center">
            No tasks found in this section.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`group bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 relative overflow-hidden`}
            >
              <div
                className={`absolute top-0 left-0 w-1 h-full ${
                  task.priority === "high"
                    ? "bg-red-500"
                    : task.priority === "medium"
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
              />

              <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {task.title}
              </h3>

              <p className="text-sm text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                {task.description}
              </p>

              <div className="mt-6 pt-4 border-t border-slate-50 space-y-3">
                <div className="flex justify-between items-center text-[11px] font-medium">
                  <span className="text-slate-400 uppercase tracking-wider">
                    Status
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                      task.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-600"
                        : task.status === "IN_PROGRESS"
                        ? "bg-blue-50 text-blue-600"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {task.status.replace("_", " ")}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px] font-medium">
                  <span className="text-slate-400 uppercase tracking-wider">
                    Priority
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                      task.priority === "HIGH" || task.priority === "URGENT"
                        ? "bg-red-50 text-red-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px] font-medium">
                  <span className="text-slate-400 uppercase tracking-wider">
                    Due Date
                  </span>
                  <span
                    className={
                      variant === "danger"
                        ? "text-red-500 font-bold"
                        : "text-slate-600"
                    }
                  >
                    {new Date(task.dueDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
