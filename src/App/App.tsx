import React from 'react'
import {CssBaseline, ThemeProvider} from '@material-ui/core'
import {StartGame} from '../StartGame/StartGame'
import {BoardGame} from '../BoardGame/BoardGame'
import {AppPosition} from './App.types'
import {useAppState} from './useAppState'
import {appPositionSelector} from './App.selectors'
import {theme} from '../theme'

export const App: React.FC = () => {
  const [appPosition] = useAppState({selector: appPositionSelector, defaultStateKey: "appPosition"});

  return (
    <ThemeProvider theme={theme}>
      <>
        <CssBaseline></CssBaseline>
        {appPosition === AppPosition.starGame ? <StartGame /> : <BoardGame />}
      </>
    </ThemeProvider>
  );
};
