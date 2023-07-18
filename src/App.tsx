import * as React from 'react';
import {Grommet} from 'grommet';
import {BrowserRouter} from "react-router-dom";
import {AppRoutes} from "./Routes";
import {WagmiConfigProvider} from "./modules/wagmi/WagmiConfigProvider";

function App() {
  return (
    <Grommet full>
      <WagmiConfigProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </WagmiConfigProvider>
    </Grommet>
  )
}

export default App;
