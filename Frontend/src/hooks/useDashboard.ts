import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../api/task.api";

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });
};
