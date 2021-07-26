import { ThemePreference } from '@/gql';
import { useSelector, useDispatch } from '@/store';
import { changeUserTheme } from '@/store/action/user';
import {
  AppBar,
  Avatar,
  Button,
  Grid,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { InvertColors } from '@material-ui/icons';
import { FC, useState } from 'react';

const useStyles = makeStyles(_theme => ({
  title: {
    fontWeight: 'bold',
  },
}));

const Header: FC = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const name = useSelector(state => state.user.currentUser?.name);
  const image = useSelector(state => state.user.currentUser?.picture);

  const [menu, setMenu] = useState<null | HTMLElement>(null);

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h4" className={styles.title}>
              Jello
            </Typography>
          </Grid>
          <Grid />
          <Grid item>
            <Grid container alignItems="center">
              <Menu
                id="themeMenu"
                anchorEl={menu}
                keepMounted
                open={!!menu}
                onClose={() => setMenu(null)}>
                <MenuItem
                  onClick={() => {
                    dispatch(changeUserTheme(ThemePreference.System));
                    setMenu(null);
                  }}>
                  System Theme
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(changeUserTheme(ThemePreference.Dark));
                    setMenu(null);
                  }}>
                  Dark Mode
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(changeUserTheme(ThemePreference.Light));
                    setMenu(null);
                  }}>
                  Light Mode
                </MenuItem>
              </Menu>
              <Grid item>
                <IconButton
                  onClick={e => setMenu(e.currentTarget)}
                  aria-haspopup="true"
                  aria-controls="themeMenu">
                  <InvertColors />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography color="inherit">{name ?? 'User'}</Typography>
              </Grid>
              {image ? (
                <Grid item>
                  <Button startIcon={<Avatar src={image} />} />
                </Grid>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
