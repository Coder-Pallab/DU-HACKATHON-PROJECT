import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { TrendingUp, ChartLine } from "lucide-react";
import { useLanguage } from "../../hooks/useLanguage";

const progressData = [
  {
    week: "Week 1",
    technical: 35,
    aptitude: 40,
    communication: 30,
  },
  {
    week: "Week 2",
    technical: 45,
    aptitude: 48,
    communication: 38,
  },
  {
    week: "Week 3",
    technical: 52,
    aptitude: 55,
    communication: 48,
  },
  {
    week: "Week 4",
    technical: 65,
    aptitude: 62,
    communication: 55,
  },
  {
    week: "Week 5",
    technical: 72,
    aptitude: 70,
    communication: 65,
  },
  {
    week: "Week 6",
    technical: 85,
    aptitude: 78,
    communication: 75,
  },
];

function ProgressChart() {
  const { t } = useLanguage();

  const localizedData = progressData.map((item) => ({
    ...item,
    week: t(item.week, item.week),
  }));

  return (
    <div className="w-full min-w-0 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
            <ChartLine size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {t("Preparation Progress")}
            </h2>

            <p className="text-sm text-gray-500">
              {t("Track your weekly improvement.")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm font-medium text-green-600">
          <TrendingUp size={17} />
          <span>{t("6 weeks overview")}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px] w-full min-w-0 sm:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={localizedData}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "12px",
              }}
            />

            <Legend
              wrapperStyle={{
                fontSize: "12px",
                paddingTop: "15px",
              }}
            />

            <Line
              type="monotone"
              dataKey="technical"
              name={t("Technical Skills")}
              stroke="#0f766e"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              type="monotone"
              dataKey="aptitude"
              name={t("Aptitude")}
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ r: 4 }}
            />

            <Line
              type="monotone"
              dataKey="communication"
              name={t("Communication")}
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="mt-4 border-t border-gray-100 pt-4 text-xs text-gray-400">
        {t("Sample progress data for frontend demonstration.")}
      </p>
    </div>
  );
}

export default ProgressChart;
