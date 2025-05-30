
interface DashboardWelcomeProps {
  profileName: string;
}

const DashboardWelcome = ({ profileName }: DashboardWelcomeProps) => {
  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
        Olá, {profileName}! 👋
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Aqui está um resumo dos seus agendamentos e faturamento
      </p>
    </div>
  );
};

export default DashboardWelcome;
