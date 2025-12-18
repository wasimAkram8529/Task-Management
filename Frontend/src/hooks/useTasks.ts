import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, updateTask, deleteTask } from "../api/task.api";
import { toast } from "react-hot-toast";

export const useTask = (filters: any) => {
  const queryClient = useQueryClient();

  const taskQuery = useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => getTasks(filters),
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create task";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => updateTask(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["taskLogs", variables.id] });
      toast.success("Task updated!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Update failed";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted permanently");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Could not delete task";
      toast.error(message);
    },
  });

  return {
    taskQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
