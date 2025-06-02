
import { useCallback } from "react";
import { useUserFetching } from "./useUserFetching";
import { useUserOperations } from "./useUserOperations";
import { useAuth } from "./useAuth";
import { PermissionManager } from "@/utils/permissions";

export const useUserManagement = () => {
  const { profile } = useAuth();
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
    if (!PermissionManager.canManageUsers(profile)) {
      throw new Error('Permissão insuficiente para alterar planos');
    }
    if (!userId || !newPlan) {
      throw new Error('ID do usuário e plano são obrigatórios');
    }
    await updateUserPlanOperation(userId, newPlan, fetchUsers);
  }, [updateUserPlanOperation, fetchUsers, profile]);

  const toggleUserStatus = useCallback(async (userId: string, currentStatus: boolean, userName: string) => {
    if (!PermissionManager.canManageUsers(profile)) {
      throw new Error('Permissão insuficiente para alterar status de usuários');
    }
    if (!userId || !userName) {
      throw new Error('Dados do usuário são obrigatórios');
    }
    await toggleUserStatusOperation(userId, currentStatus, userName, fetchUsers);
  }, [toggleUserStatusOperation, fetchUsers, profile]);

  const resetPassword = useCallback(async (userId: string, userName: string) => {
    if (!PermissionManager.isSuperAdmin(profile)) {
      throw new Error('Apenas super administradores podem resetar senhas');
    }
    if (!userId || !userName) {
      throw new Error('Dados do usuário são obrigatórios');
    }
    await resetPasswordOperation(userId, userName);
  }, [resetPasswordOperation, profile]);

  const toggleEmailConfirmation = useCallback(async (userId: string, userName: string, currentStatus: boolean) => {
    if (!PermissionManager.canManageUsers(profile)) {
      throw new Error('Permissão insuficiente para alterar confirmação de email');
    }
    if (!userId || !userName) {
      throw new Error('Dados do usuário são obrigatórios');
    }
    await toggleEmailConfirmationOperation(userId, userName, currentStatus, fetchUsers);
  }, [toggleEmailConfirmationOperation, fetchUsers, profile]);

  const editPlanExpiration = useCallback(async (userId: string, userName: string) => {
    if (!PermissionManager.canManageUsers(profile)) {
      throw new Error('Permissão insuficiente para editar expiração de planos');
    }
    if (!userId || !userName) {
      throw new Error('Dados do usuário são obrigatórios');
    }
    await editPlanExpirationOperation(userId, userName, fetchUsers);
  }, [editPlanExpirationOperation, fetchUsers, profile]);

  const deleteUser = useCallback(async (userId: string, userName: string) => {
    if (!PermissionManager.canDeleteUsers(profile)) {
      throw new Error('Apenas super administradores podem excluir usuários');
    }
    if (!userId || !userName) {
      throw new Error('Dados do usuário são obrigatórios');
    }
    await deleteUserOperation(userId, userName, true, fetchUsers);
  }, [deleteUserOperation, fetchUsers, profile]);

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
    canManageUsers: PermissionManager.canManageUsers(profile),
    canDeleteUsers: PermissionManager.canDeleteUsers(profile),
    isSuperAdmin: PermissionManager.isSuperAdmin(profile),
  };
};
