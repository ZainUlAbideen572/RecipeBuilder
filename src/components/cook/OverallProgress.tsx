import { Box, Typography, LinearProgress } from '@mui/material';
import { formatTime, calculateOverallProgress } from '@/utils/calculations';

interface OverallProgressProps {
  totalDurationSec: number;
  overallRemainingSec: number;
}

const OverallProgress = ({
  totalDurationSec,
  overallRemainingSec,
}: OverallProgressProps) => {
  const { progressPercent } = calculateOverallProgress(
    totalDurationSec,
    overallRemainingSec
  );

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" fontWeight="bold">
          Overall Progress
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {progressPercent}% · {formatTime(overallRemainingSec)} remaining
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={progressPercent}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: 'hsl(var(--muted))',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            background: 'var(--gradient-warm)',
          },
        }}
      />
    </Box>
  );
};
export default OverallProgress
