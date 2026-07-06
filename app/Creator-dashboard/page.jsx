import PerformanceChart from "@/components/Dashboard/PerformanceChart";
import ContentTable from "@/components/Dashboard/ContentTable";

export default function CreatorDashboardPage() {

  // 🔹 Mock dashboard stats
  const stats = [
    { title: "Total Views", value: "1.2M", growth: "+8%" },
    { title: "Watch Time", value: "4.5K hrs", growth: "+12%" },
    { title: "Total Uploads", value: "135", growth: "+5%" },
    { title: "Followers", value: "28.4K", growth: "+9%" },
    { title: "Earnings", value: "$5,230", growth: "+15%" },
  ];

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">

      {/* ===== Page Header ===== */}
      <div>
        {/* <h1 className="text-2xl font-bold">Dashboard Overview</h1> */}
        <p className="text-gray-400 text-sm mt-1">
          Track your performance and manage your content.
        </p>
      </div>

      {/* ===== Stats Section ===== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-[#111827] border border-gray-800 rounded-xl p-4 
                       shadow-lg shadow-red-500/5 
                       hover:shadow-red-500/10 
                       transition"
          >
            <p className="text-xs text-gray-400">{stat.title}</p>

            <div className="flex items-center justify-between mt-2">
              <p className="text-xl font-bold">{stat.value}</p>
              <span className="text-green-400 text-xs">
                {stat.growth}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Chart Section (Flexible) ===== */}
      <div className="flex-1 bg-[#1A1A1A] rounded-2xl p-4 overflow-hidden">
        <PerformanceChart />
      </div>

      {/* ===== Table Section (Only Scrollable Area) ===== */}
      <div className="h-64 bg-[#1A1A1A] rounded-2xl p-4 flex flex-col">
        <h2 className="mb-3 text-sm font-semibold text-gray-300">
          Recent Content
        </h2>

        <div className="flex-1 overflow-y-auto">
          <ContentTable />
        </div>
      </div>

    </div>
  );
}