import { useSelector } from '@/store';
import {
  AppBar,
  Avatar,
  Button,
  Grid,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { FC } from 'react';

const useStyles = makeStyles(_theme => ({
  title: {
    fontWeight: 'bold',
  },
}));

const Header: FC = () => {
  const styles = useStyles();

  const name = useSelector(state => state.user.currentUser?.name);
  const image = useSelector(state => state.user.currentUser?.picture);

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
