import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import searchFill from '@iconify/icons-eva/search-fill';
import trash2Fill from '@iconify/icons-eva/trash-2-fill';

import sharpRemoveDone from '@iconify/icons-ic/sharp-remove-done';

import fileDoneOutlined from '@iconify/icons-ant-design/file-done-outlined';

import plusFill from '@iconify/icons-eva/plus-fill';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import {
  Box,
  Toolbar,
  Tooltip,
  Stack,
  IconButton,
  Button,
  Typography,
  OutlinedInput,
  InputAdornment
} from '@material-ui/core';
// ----------------------------------------------------------------------
const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));
const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  height: 40,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`
  }
}));
// ----------------------------------------------------------------------
UserListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  buttonText: PropTypes.string,
  placeHolder: PropTypes.string,
  buttonAction: PropTypes.func,
  markAsDone: PropTypes.func,
  markAsPending: PropTypes.func,
  onFilterName: PropTypes.func,
  deleteButtonAction: PropTypes.func
};
export default function UserListToolbar({
  numSelected,
  filterName,
  onFilterName,
  placeHolder,
  buttonText,
  markAsDone,
  markAsPending,
  buttonAction,
  deleteButtonAction
}) {
  const renderButton = () =>
    buttonText ? (
      <Button variant="contained" onClick={buttonAction} startIcon={<Icon icon={plusFill} />}>
        {buttonText}
      </Button>
    ) : null;

  return (
    <RootStyle
      className="headerTitle"
      style={{ height: 60 }}
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter'
        })
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Stack
          component="div"
          style={{ marginBottom: 0 }}
          className="headerTitleDiv"
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          {placeHolder ? (
            <SearchStyle
              value={filterName}
              onChange={onFilterName}
              placeholder={placeHolder}
              startAdornment={
                <InputAdornment position="start">
                  <Box component={Icon} icon={searchFill} sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              }
            />
          ) : null}
        </Stack>
      )}
      {numSelected > 0 ? (
        <Stack style={{ display: 'flex', flexDirection: 'row' }}>
          <Tooltip title="Mark As Done">
            <IconButton onClick={markAsDone}>
              <Icon icon={fileDoneOutlined} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mark As Not Done">
            <IconButton onClick={markAsPending}>
              <Icon icon={sharpRemoveDone} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={deleteButtonAction}>
              <Icon icon={trash2Fill} />
            </IconButton>
          </Tooltip>
        </Stack>
      ) : (
        renderButton()
      )}
    </RootStyle>
  );
}
