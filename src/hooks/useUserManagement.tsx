
import { useCallback } from "react";
import { useUserFetching } from "./useUserFetching";
import { useUserOperations } from "./useUserOperations";

export const useUserManagement = () => {
  const { users, loading, error, fetchUsers } = useUserFetching();
  const {
    updateUserPlan: updateUserPlanOperation,
    toggleUserStatus: toggleUserStatusOperation,
    resetPassword: resetPasswordOperation,
    toggleEmailConfirmation: toggleEmailConfirmationOperation,
    editPlanExpiration: editPlanExpirationOperation,
    deleteUser: deleteUserOperation,
    sendNotification,
  } = useUserOperations();

  const updateUserPlan = useCallback(async (userId: string, newPlan: string) => {
    if (!userId || !newPlan) {
      throw new Error('ID do usuário e plano são obrigatórios');
    }
    await updateUserPlanOperation(userId, newPlan, fetchUsers);
  }, [updateUserPlanOperation, fetchUsers]);

  const toggleUserStatus = useCallback(async (userId: string, currentStatus: boolean, userName: string) => {
    if (!userId || !userName) {
      throw new Error('Dados do usuário são obrigatórios');
    }
    await toggleUserStatusOperation(userId, currentStatus, userName, fetchUsers);
  }, [toggleUserStatusOperation, fetchUsers]);

  const resetPassword = useCallback(async (userId: string, userName: string) => {
    if (!userId || !userName) {
      throw new Error('Dados do usuário são obrigatórios');
    }
    await resetPasswordOperation(userId, userName);
  }, [resetPasswordOperation]);

  const toggleEmailConfirmation = useCallback(async (userId: string, userName: string, currentStatus: boolean) => {
    if (!userId || !userName) {
      throw new Error('Dados do usuário são obrigatórios');
    }
    await toggleEmailConfirmationOperation(userId, userName, currentStatus, fetchUsers);
  }, [toggleEmailConfirmationOperation, fetchUsers]);

  const editPlanExpiration = useCallback(async (userId: string, userName: string) => {
    if (!userId || !userName) {
      throw new Error('Dados do usuário são obrigatórios');
    }
    await editPlanExpirationOperation(userId, userName, fetchUsers);
  }, [editPlanExpirationOperation, fetchUsers]);

  const deleteUser = useCallback(async (userId: string, userName: string, isSuperAdmin: boolean) => {
    if (!userId || !userName) {
      throw new Error('Dados do usuário são obrigatórios');
    }
    await deleteUserOperation(userId, userName, isSuperAdmin, fetchUsers);
  }, [deleteUserOperation, fetchUsers]);

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUserPlan,
    toggleUserStatus,
    resetPassword,
    toggleEmailConfirmation,
    editPlanExpiration,
    deleteUser,
    sendNotification,
  };
};
