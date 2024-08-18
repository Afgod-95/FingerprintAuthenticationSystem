import * as React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

export default function CircularLoader({ size }) {
  return (
    <Stack sx={{ color: 'grey.500', size: size }} spacing={2} direction="row">
      <CircularProgress color="inherit" />
    </Stack>
  );
}

