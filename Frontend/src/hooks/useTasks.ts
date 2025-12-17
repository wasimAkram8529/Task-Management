import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, updateTask, deleteTask } from "../api/task.api";

export const useTask = (filters: any) => {
  const queryClient = useQueryClient();

  const taskQuery = useQuery({
    queryKey: ["tasks", filters],
    queryFn: () => getTasks(filters),
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: any) => updateTask(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return {
    taskQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
