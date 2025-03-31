import Dashboard from "@/components/Dashboard";
import DashboardWrapper from "@/components/DashboardWrapper";
import Main from "@/components/Main";

export const metadata = {
    title: "Emooji ⋅ Dashboard"
  };

export default function DashboardPage() {
    return (
        <Main>
            <DashboardWrapper/>
        </Main>
    )
}