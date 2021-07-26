import { useDispatch } from '@/store';
import { setTheme } from '@/store/reducer/app';
import DocumentImage from '/documents.svg';
import PowerTables from '/powerTables.svg';
import WhiteJelly from '/white_jelly.svg';
import Favicon from '/favicon.svg';

import {
  AppBar,
  Button,
  Grid,
  makeStyles,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  IconButton,
} from '@material-ui/core';
import { InvertColors } from '@material-ui/icons';
import { FC, useCallback, useState } from 'react';
import { ThemePreference } from '@/gql';

const useStyles = makeStyles(theme => ({
  title: {},
  toolButtons: {
    width: 'initial',
  },
  colors: {
    marginRight: 10,
  },
  highlight: {
    backgroundColor: theme.palette.primary.main,
    padding: '5rem',
  },
  highlightText: {
    color: '#FFFFFF',
  },
  heading: {
    fontWeight: 'bold',
  },
  spacing: {
    margin: '1rem',
  },
  start: {
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  images: {
    height: 100,
  },
  simplyEffective: {
    marginTop: 50,
  },
}));

const LandingPage: FC = () => {
  const styles = useStyles();
  const dispatch = useDispatch();

  const [menu, setMenu] = useState<null | HTMLElement>(null);

  const signIn = useCallback(() => {
    window.location.assign(`${import.meta.env.VITE_API_URL}/auth/`);
  }, [import.meta.env.VITE_API_URL]);

  return (
    <Grid container direction="column">
      <AppBar position="static" color="transparent">
        <Toolbar>
          <Grid container direction="row" justifyContent="space-between">
            <Grid item xs={1} container alignItems="center" direction="row">
              <Grid item>
                <Favicon width="75%" />
              </Grid>
              <Grid item>
                <Typography variant="h4" className={styles.heading}>
                  Jello
                </Typography>
              </Grid>
            </Grid>
            <Grid
              container
              direction="row"
              item
              alignItems="center"
              justifyContent="flex-end"
              className={styles.toolButtons}>
              <Menu
                id="themeMenu"
                anchorEl={menu}
                keepMounted
                open={!!menu}
                onClose={() => setMenu(null)}>
                <MenuItem
                  onClick={() => {
                    dispatch(setTheme(ThemePreference.System));
                    setMenu(null);
                  }}>
                  System Theme
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(setTheme(ThemePreference.Dark));
                    setMenu(null);
                  }}>
                  Dark Mode
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(setTheme(ThemePreference.Light));
                    setMenu(null);
                  }}>
                  Light Mode
                </MenuItem>
              </Menu>
              <Grid item className={styles.colors}>
                <IconButton
                  onClick={e => setMenu(e.currentTarget)}
                  aria-haspopup="true"
                  aria-controls="themeMenu">
                  <InvertColors />
                </IconButton>
              </Grid>
              <Grid item>
                <Button onClick={signIn}>Login</Button>
              </Grid>
              <Grid item>
                <Button variant="contained" onClick={signIn}>
                  Sign-up
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction="column"
        className={styles.highlight}>
        <Grid
          container
          item
          direction="row"
          alignItems="center"
          justifyContent="center"
          spacing={1}>
          <Grid item>
            <WhiteJelly height="100%" />
          </Grid>
          <Grid item />
          <Grid item>
            <Typography
              variant="h2"
              component="h1"
              align="center"
              className={[styles.highlightText, styles.heading].join(' ')}>
              Jello
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography
            variant="h4"
            component="p"
            align="center"
            className={styles.highlightText}>
            A tool to organize your tasks
          </Typography>
        </Grid>
        <Grid item className={styles.spacing} />
        <Grid item>
          <Button
            fullWidth
            variant="contained"
            className={styles.start}
            onClick={signIn}>
            Start now
          </Button>
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        justifyContent="center"
        spacing={2}
        className={styles.simplyEffective}>
        <Grid item>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center">
            <Grid item className={styles.images}>
              <DocumentImage height="100%" />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h3" align="center">
                Simple
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" align="center">
                With an intuitive UI as this, even the cavemen could make stuff
                work.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center">
            <Grid item className={styles.images}>
              <PowerTables height="100%" />
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h3" align="center">
                Effective
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" align="center">
                Inspired from proven designs. It is warrantied to work.
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default LandingPage;
