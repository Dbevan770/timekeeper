import { useAuthContext } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuthContext();
  return (
    <div>
      dashboard
      <h1>Hello {user && user.displayName}!</h1>
    </div>
  );
};

export default Dashboard;
