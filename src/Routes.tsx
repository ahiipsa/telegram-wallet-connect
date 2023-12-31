import  * as React from 'react'
import {Route, Routes, useNavigate} from "react-router-dom";
// import {UserAccount} from "./pages/account/Account";
// import {CreateWallet} from "./pages/create-wallet/CreateWallet";
// import {TOTP} from "./pages/totp/totp";
// import SendOne from "./pages/send";
import {observer} from "mobx-react";
import {useStores} from "./stores/useStores";
import {WCAccount} from "./pages/wc-account/WCAccount";
import {WCSendForm} from "./pages/wc-send-form/WCSendForm";
import {WCConfirmTransaction} from "./pages/wc-confirm-transaction/WCConfirmTransaction";
import {PoolsPage} from "./pages/pools/PoolsPage";

export const AppRoutes = observer(() => {
  const { authStore } = useStores()
  // const { userAccount, isLoggedIn, isAccountLoaded, isAccountCreated } = authStore
  // const navigate = useNavigate()

  // useEffect(() => {
  //   const initialRedirects = () => {
  //     if(!userAccount) {
  //       navigate(`/create-wallet`)
  //     }
  //   }
  //   if(isAccountLoaded) {
  //     initialRedirects()
  //   }
  // }, [isAccountLoaded, userAccount, navigate, isAccountCreated, isLoggedIn])

  return <Routes>

    <Route index path={'/'} element={<WCAccount />} />
    <Route index path={'/wc-send-form'} element={<WCSendForm />} />
    <Route index path={'/wc-confirm-transaction'} element={<WCConfirmTransaction />} />
    <Route index path={'/pools'} element={<PoolsPage />} />
    {/*<Route*/}
    {/*  index*/}
    {/*  path={'/'}*/}
    {/*  element={<UserAccount />}*/}
    {/*/>*/}
    {/*<Route path={'create-wallet'} element={<CreateWallet />} />*/}
    {/*<Route path={'send'} element={<SendOne />} />*/}
    {/*<Route path={'totp'} element={<TOTP />} />*/}
  </Routes>
})
