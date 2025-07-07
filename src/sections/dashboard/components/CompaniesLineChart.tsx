import type { CardProps } from '@mui/material/Card';

import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';

import { fShortenNumber } from 'src/utils/format-number';

import { useTranslate } from 'src/locales';

import { Chart, useChart, ChartLegends } from 'src/components/chart';

// ----------------------------------------------------------------------

type Props = CardProps & {
  title?: string;
  categories: string[];
  series: {
    data: {
      name: string;
      data: number[];
    }[];
  };
};

export function CompaniesLineChart({ title, series, categories, ...other }: Props) {
  const theme = useTheme();
  const { t } = useTranslate();

  const totalEnters = series?.data?.[0]?.data?.reduce((a, b) => a + b, 0);
  const totalExit = series?.data?.[1]?.data?.reduce((a, b) => a + b, 0);

  const chartColors = [theme.palette.primary.main, theme.palette.warning.main];

  const chartOptions = useChart({
    colors: chartColors,
    xaxis: {
      categories: ['', ...categories, ''],
      tooltip: {
        enabled: false,
      },
    },
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        action={
          <ChartLegends
            colors={chartOptions?.colors}
            labels={series.data.map((item) => t(item.name))}
            values={[fShortenNumber(totalEnters), fShortenNumber(totalExit)]}
            sx={{ px: 3, gap: 3 }}
          />
        }
      />

      <Chart
        type="area"
        series={series?.data}
        options={chartOptions}
        height={320}
        sx={{ pb: 2.5, pt: 0, pl: 1, pr: 2.5 }}
      />
    </Card>
  );
}
