// material
import { styled } from '@material-ui/core/styles';
import { Card, Stack, Container, Typography } from '@material-ui/core';
// layouts
// components
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import AuthSocial from '../components/authentication/AuthSocial';
// ----------------------------------------------------------------------
const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));
const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));
const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));
// ----------------------------------------------------------------------
export default function Login() {
  return (
    <RootStyle title="Waiting Room">
      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Hi, Welcome Back
          </Typography>
          <img src="/static/illustrations/illustration_login.png" alt="login" />
        </SectionStyle>
      </MHidden>
      <Container maxWidth="sm">
        <ContentStyle>
          <Stack sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Visit your Task Room, Create and Get Updates on your Schedule
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>Just a demo for now. ;) </Typography>
          </Stack>
          <AuthSocial />
          {/* <LoginForm /> */}
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
