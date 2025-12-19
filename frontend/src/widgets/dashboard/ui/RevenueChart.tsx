interface RevenueChartProps {
  data: {
    month: string;
    revenue: number;
  }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-20 text-sm text-gray-600">{item.month}</div>
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-24 text-right font-semibold text-gray-900">
              ${item.revenue.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
