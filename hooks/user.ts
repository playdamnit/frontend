import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { getConfig } from "@/config";
import { authClient } from "@/lib/authClient";

export const useUserSettings = (enabled = true) => {
  return useQuery({
    queryKey: ["userSettings"],
    queryFn: async () => {
      const { data } = await authClient.getSession();

      return data?.user;
    },
    enabled,
  });
};

export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const updateUserSettingsMutation = useMutation<unknown, Error, string>({
    mutationKey: ["updateUserSettings"],
    mutationFn: (settings: any) => {
      return authClient.updateUser({
        ...(settings.name && { name: settings.name }),
        ...(settings.username && { username: settings.username }),
        ...(settings.image && { image: settings.image }),
      });
    },
    onMutate: (id) => {
      setDeletingId(id);
    },
    onSuccess: (data, id) => {
      console.log(`User settings updated:`, data);
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
      queryClient.invalidateQueries({ queryKey: ["session"] });
      queryClient.invalidateQueries({ queryKey: ["userGames"] });
      queryClient.invalidateQueries({ queryKey: ["userByUsername"] });
    },
    onError: (error, id) => {
      console.error(`Error updating user settings:`, error);
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  return {
    updateUserSettingsMutation,
  };
};
