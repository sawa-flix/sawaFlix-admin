// import DashboardWrapper from '../../components/Dashboard/DashboardWrapper';

import DashboardWrapper from "../../components/Dashboard/DashboardWrapper";
import footer from '../../components/Footer';

export const metadata = {
  title: 'Dashboard | SawaFlix',
  description: 'Your entertainment dashboard',
};

export default function DashboardLayout({ children }) {
  return (
    <>
    <DashboardWrapper>
      {children}
    </DashboardWrapper>
    </>
  );
}
