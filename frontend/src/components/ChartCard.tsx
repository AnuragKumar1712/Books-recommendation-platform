interface ChartCardProps {
  title: string;
  subtitle?: string;
}

const ChartCard = ({ title, subtitle }: ChartCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>

      {/* Chart Placeholder */}
      <div className="flex items-center justify-center h-64 rounded-lg border-2 border-dashed border-gray-200 text-gray-400">
        Chart will be rendered here
      </div>
    </div>
  );
};

export default ChartCard;
