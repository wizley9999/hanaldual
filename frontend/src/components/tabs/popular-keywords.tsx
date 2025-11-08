import { useEffect, useState } from "react";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { getSavedKeywords } from "../../lib/firestore";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { Spinner } from "../ui/spinner";
import { Label } from "../ui/label";

export default function PopularKeywords() {
  const chartConfig = {
    count: {
      label: "등록된 수",
    },
    label: {
      color: "var(--background)",
    },
  } satisfies ChartConfig;

  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getSavedKeywords();
      const sorted = result.sort((a, b) => b.count - a.count);

      setChartData(sorted);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (chartData.length === 0) {
    return <></>;
  }

  return (
    <div className="flex flex-col w-full h-full p-4 gap-3">
      <Label htmlFor="uid">인기 키워드</Label>

      <ChartContainer config={chartConfig} className="h-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          margin={{
            right: 16,
          }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="keyword"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
            hide
          />
          <XAxis dataKey="count" type="number" hide />

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Bar
            dataKey="count"
            layout="vertical"
            fill="var(--color-muted-foreground)"
            radius={4}
          >
            <LabelList
              dataKey="keyword"
              position="insideLeft"
              offset={8}
              className="fill-(--color-primary-foreground)"
              fontSize={12}
            />
            <LabelList
              dataKey="count"
              position="right"
              offset={2}
              className="fill-foreground"
              fontSize={11}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
}
