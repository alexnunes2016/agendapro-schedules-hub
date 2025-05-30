
import { useUserFetching } from "./useUserFetching";
import { useUserOperations } from "./useUserOperations";

export const useUserManagement = () => {
  const { users, loading, fetchUsers } = useUserFetching();
  const {
    updateUserPlan: updateUserPlanOperation,
    toggleUserStatus: toggleUserStatusOperation,
    resetPassword: resetPasswordOperation,
    toggleEmailConfirmation: toggleEmailConfirmationOperation,
    editPlanExpiration: editPlanExpirationOperation,
    deleteUser: deleteUserOperation,
    sendNotification,
  } = useUserOperations();

  const updateUserPlan = async (userId: string, newPlan: string) => {
    await updateUserPlanOperation(userId, newPlan, fetchUsers);
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean, userName: string) => {
    await toggleUserStatusOperation(userId, currentStatus, userName, fetchUsers);
  };

  const resetPassword = async (userId: string, userName: string) => {
    await resetPasswordOperation(userId, userName);
  };

  const toggleEmailConfirmation = async (userId: string, userName: string, currentStatus: boolean) => {
    await toggleEmailConfirmationOperation(userId, userName, currentStatus, fetchUsers);
  };

  const editPlanExpiration = async (userId: string, userName: string) => {
    await editPlanExpirationOperation(userId, userName, fetchUsers);
  };

  const deleteUser = async (userId: string, userName: string, isSuperAdmin: boolean) => {
    await deleteUserOperation(userId, userName, isSuperAdmin, fetchUsers);
  };

  return {
    users,
    loading,
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
