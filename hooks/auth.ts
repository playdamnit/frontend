import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/authClient";
import { User } from "better-auth";
import { Passkey } from "better-auth/plugins/passkey";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const getConnectedPasskeys = async (): Promise<Passkey[] | null> => {
  const passkeys = await authClient.passkey.listUserPasskeys();
  return passkeys.data;
};

const fetchSession = async () => {
  return authClient.getSession();
};

export const useSession = () => {
  const { data: sessionData, isLoading: isLoadingSession } = useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
  });

  const user = sessionData?.data?.user ?? null;

  return {
    user,
    isLoadingSession,
    sessionData,
  };
};

export const usePasskeys = (user: User | null) => {
  const { data: passkeys, isLoading: isLoadingPasskeys } = useQuery({
    queryKey: ["passkeys"],
    queryFn: getConnectedPasskeys,
    enabled: !!user, // Only fetch passkeys if the user is logged in
  });

  return {
    passkeys,
    isLoadingPasskeys,
  };
};

export const useAddPasskey = () => {
  const queryClient = useQueryClient();

  const addPasskeyMutation = useMutation<unknown, Error, void>({
    mutationKey: ["addPasskey"],
    mutationFn: () =>
      authClient.passkey.addPasskey({
        authenticatorAttachment: "cross-platform",
      }),
    onSuccess: (data) => {
      console.log("Passkey added:", data);
      queryClient.invalidateQueries({ queryKey: ["passkeys"] });
    },
    onError: (error) => {
      console.error("Error adding passkey:", error);
    },
  });

  return addPasskeyMutation;
};

export const useDeletePasskey = () => {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deletePasskeyMutation = useMutation<unknown, Error, string>({
    mutationKey: ["deletePasskey"],
    mutationFn: (id: string) => authClient.passkey.deletePasskey({ id }),
    onMutate: (id) => {
      setDeletingId(id);
    },
    onSuccess: (data, id) => {
      console.log(`Passkey ${id} deleted:`, data);
      queryClient.invalidateQueries({ queryKey: ["passkeys"] });
    },
    onError: (error, id) => {
      console.error(`Error deleting passkey ${id}:`, error);
    },
    onSettled: () => {
      setDeletingId(null);
    },
  });

  return {
    deletePasskeyMutation,
    deletingId,
  };
};

export const useSignIn = () => {
  const queryClient = useQueryClient();

  const emailSignIn = useMutation<
    any,
    Error,
    { identifier: string; password: string }
  >({
    mutationKey: ["emailSignIn"],
    mutationFn: async ({ identifier, password }) => {
      const isEmail = z.string().email().safeParse(identifier).success;
      if (isEmail) {
        return authClient.signIn.email({ email: identifier, password });
      } else {
        return authClient.signIn.username({ username: identifier, password });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (error) => {
      console.error("Error signing in:", error);
    },
  });

  const passkeySignIn = useMutation<any, Error, void>({
    mutationKey: ["passkeySignIn"],
    mutationFn: () => authClient.signIn.passkey(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (error) => {
      console.error("Error signing in with passkey:", error);
    },
  });

  return {
    emailSignIn,
    passkeySignIn,
  };
};

export const useSignUp = () => {
  const queryClient = useQueryClient();

  const emailSignUp = useMutation<
    any,
    Error,
    { email: string; password: string; name: string; username: string }
  >({
    mutationKey: ["emailSignUp"],
    mutationFn: ({ email, password, name, username }) =>
      authClient.signUp.email({ email, password, name, username }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
    onError: (error) => {
      console.error("Error signing up with email:", error);
    },
  });

  return {
    emailSignUp,
  };
};

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const signOut = useMutation<unknown, Error, void>({
    mutationKey: ["signOut"],
    mutationFn: () => authClient.signOut(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] });
      router.push("/");
    },
  });

  return { signOut };
};
