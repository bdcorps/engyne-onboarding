import Layout from "@/components/Layout";
import { Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";

interface DashboardProps {}

const Dashboard: FunctionComponent<DashboardProps> = () => {
  return (
    <Layout>
      <Text>Dashboard</Text>
    </Layout>
  );
};

export default Dashboard;
