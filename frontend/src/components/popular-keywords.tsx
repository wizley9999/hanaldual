import { useEffect, useState } from "react";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { getSavedKeywords } from "../lib/firestore";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { Spinner } from "./ui/spinner";

export default function PopularKeywords() {
  const chartConfig = {
    count: {
      label: "등록된 수",
      color: "var(--chart-2)",
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
    return <Spinner />;
  }

  if (chartData.length === 0) {
    return <></>;
  }

  return (
    <>
      <h1 className="text-primary leading-tight max-w-2xl text-2xl font-semibold tracking-tight text-balance lg:leading-[1.1] lg:font-semibold xl:text-3xl xl:tracking-tighter break-keep">
        인기 키워드
      </h1>

      <ChartContainer config={chartConfig} className="w-full max-w-2xl pt-8">
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
            fill="var(--color-chart-3)"
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
              offset={8}
              className="fill-foreground"
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </>
  );
}
