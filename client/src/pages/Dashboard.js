// Dashboard.js
import CustomerDashboard from "../components/CustomerDashboard";
import OwnerDashboard from "../components/OwnerDashboard";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return user?.role === "owner"
    ? <OwnerDashboard />
    : <CustomerDashboard />;
}

export default Dashboard;