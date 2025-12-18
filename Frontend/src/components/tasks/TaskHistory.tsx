import { useQuery } from "@tanstack/react-query";
import { Clock } from "lucide-react";
import { fetchTaskLogs } from "../../api/task.api";

export const TaskHistory = ({ taskId }: { taskId: string }) => {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["taskLogs", taskId],
    queryFn: () => fetchTaskLogs(taskId),
    enabled: !!taskId,
  });

  if (isLoading)
    return (
      <div className="p-4 text-sm animate-pulse text-slate-500">
        Loading history...
      </div>
    );

  if (!logs || logs.length === 0)
    return (
      <div className="p-4 text-sm text-slate-400 italic">
        No activity recorded yet.
      </div>
    );

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4 text-slate-800">
        <Clock size={16} />
        <h4 className="text-sm font-bold uppercase tracking-wider">
          Activity Log
        </h4>
      </div>

      <div className="relative space-y-6 before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
        {logs.map((log: any) => (
          <div key={log._id} className="relative pl-8">
            <span className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-sm"></span>

            <div className="flex flex-col">
              <p className="text-sm text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-900">
                  {log.userId.name}
                </span>
                {" moved this from "}
                <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-xs">
                  {log.oldStatus}
                </span>
                {" to "}
                <span className="px-1.5 py-0.5 rounded bg-blue-50 font-mono text-xs text-blue-700">
                  {log.newStatus}
                </span>
              </p>
              <time className="text-xs text-slate-400 mt-1">
                {new Date(log.timestamp).toLocaleString()}
              </time>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
