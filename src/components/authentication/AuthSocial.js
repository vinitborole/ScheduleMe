import { Icon } from '@iconify/react';
import activityFill from '@iconify/icons-eva/activity-fill';
import { Link } from 'react-router-dom';
// material
import { Stack, Button, Divider, Typography } from '@material-ui/core';

// ----------------------------------------------------------------------

export default function AuthSocial() {
  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button
          component={Link}
          to="/dashboard/tasks"
          fullWidth
          size="large"
          color="inherit"
          variant="outlined"
        >
          <Icon icon={activityFill} color="#DF3E30" height={24} />
          <Typography style={{ marginLeft: 10 }} color="primary">
            Get In
          </Typography>
        </Button>
      </Stack>

      <Divider sx={{ my: 3 }} />
    </>
  );
}
