import { Card, Typography, CardContent } from '@mui/material';

import { fTime } from 'src/utils/format-time';

import type { ILoad } from '../api/load/get';

// ----------------------------------------------------------------------

interface DraggedLoadCardProps {
  load: ILoad;
}

export function DragOverlayCard({ load }: DraggedLoadCardProps) {
  return (
    <Card
      sx={{
        cursor: 'grabbing',
        boxShadow: 4,
        opacity: 0.9,
        width: 120,
        height: 60,
        pointerEvents: 'none',
        border: '2px solid',
        borderColor: 'primary.main',
        borderRadius: 1,
        scale: '1.05',
      }}
    >
      <CardContent
        sx={{
          p: 0.5,
          '&:last-child': { pb: 0.5 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <Typography
          variant="caption"
          color="primary.main"
          fontWeight={600}
          sx={{
            fontSize: '0.75rem',
            lineHeight: 1,
            mb: 0.25,
          }}
        >
          #{load.id}
        </Typography>
        <Typography
          variant="caption"
          fontWeight={500}
          sx={{
            fontSize: '0.65rem',
            lineHeight: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100px',
            textAlign: 'center',
          }}
        >
          {load.arendator.length > 10 ? `${load.arendator.substring(0, 10)}...` : load.arendator}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontSize: '0.6rem',
            lineHeight: 1,
            mt: 0.25,
          }}
        >
          {fTime(load.period_start)?.slice(0, 5)}-{fTime(load.period_stop)?.slice(0, 5)}
        </Typography>
      </CardContent>
    </Card>
  );
}
