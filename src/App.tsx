import React, {useEffect, useState} from 'react';
import {
  Route, Routes
} from "react-router-dom";
import {Signer} from "ethers";
import {CircularProgress} from "@mui/material";
import DeployPanelView from "./components/panels/DeployPanelView";
import TokenView from "./components/panels/TokenView";
import TokenDashboardView from "./components/panels/TokenDashboardView";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";
import {getTokenData} from './helpers/subgraphCalls';
import {deployToken, getReserveBalance, initiateClaim} from './helpers/web3Functions';

/**
 * App
 */
function App() {

  /** State Config **/

  const context = useWeb3React<Web3Provider>(); // todo check because this web3provider is from ethers
  const { connector, library, chainId, account, activate, deactivate, active, error }: any = context;

  // high level
  const [signer, setSigner] = useState<Signer|undefined>(undefined);
  const [tokenAddress, setTokenAddress] = React.useState(""); // this is now retrieved from the url
  const [consoleData, setConsoleData] = React.useState("");
  const [consoleColor, setConsoleColor] = React.useState('red');
  const [claimComplete, setClaimComplete] = React.useState(false); // used to update user balance when complete

  // page controls
  const [buttonLock, setButtonLock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminConfigPage, setAdminConfigPage] = useState(0);
  const [faucetView, setFaucetView] = React.useState(false); // show faucet or admin view (if there is a faucet address in the url)
  const [modalOpen, setModalOpen] = React.useState(false);

  // all these from .env will be replaced by calls to blockchain within the getTokenData function when faucetView is set to true
  const [reserveClaimable, setReserveClaimable] = useState(process.env.REACT_APP_RESERVE_CLAIMABLE as string);
  const [reserveDecimals, setReserveDecimals] = useState(process.env.REACT_APP_RESERVE_ERC20_DECIMALS as string);
  const [reserveName, setReserveName] = React.useState(process.env.REACT_APP_RESERVE_NAME as string);
  const [reserveSymbol, setReserveSymbol] = React.useState(process.env.REACT_APP_RESERVE_SYMBOL as string);

  const [reserveBalance, setReserveBalance] = React.useState("");

  // these must be the same as the above in .env
  function resetToDefault() {
    setReserveDecimals(process.env.REACT_APP_RESERVE_ERC20_DECIMALS as string);
    setReserveClaimable(process.env.REACT_APP_RESERVE_CLAIMABLE as string);
    setReserveName(process.env.REACT_APP_RESERVE_NAME as string);
    setReserveSymbol(process.env.REACT_APP_RESERVE_SYMBOL as string);
  }

  /** UseEffects **/

  useEffect(() => {
    setSigner(library?.getSigner());
  }, [library, account]);

  // this relies on useEffect above to get tokenAddress from url // todo may be able to merge this one with the above one
  // todo check this section because it is different in all frontends
  // TODO CHECK THIS WORKS WITH INJECTED CONNECTOR
  // TODO CHECK IF THIS WORKS WITHOUT SIGNER ON SALE EXAMPLE
  useEffect(() => {
    // todo check this still works with new url parameter
    if (tokenAddress) {
      getTokenData(tokenAddress, setReserveName, setReserveSymbol, setReserveDecimals, setFaucetView);
    }
  }, [tokenAddress]); // only get sale data when signer and saleAddress have been loaded // monitor saleComplete so that the amount displayed on the button is updated when the sale is finished

  // user balance of reserveToken
  useEffect(() => {
    if (signer && faucetView) {
      getReserveBalance(signer,account,tokenAddress,setReserveBalance);
    }
  }, [signer, account, tokenAddress, claimComplete])

  /** Handle Form Inputs **/

  const handleChangeReserveName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReserveName(event.target.value);
  }
  const handleChangeReserveSymbol = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newReserveSymbol = event.target.value;
    // if (newReserveSymbol.length <= 0) { alert("Must be > 0."); return;}
    if (newReserveSymbol.length > 11) { alert("Symbol must be 11 characters or less."); return;}
    setReserveSymbol(newReserveSymbol);
  }
  const handleChangeReserveClaimable = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newClaimable = event.target.value;
    if (parseInt(newClaimable) <= 0) { alert("Must be > 0."); return;}
    if (parseInt(newClaimable) > 1000) { alert("Can't have more than 1000 in this example."); return;}
    // if (newClaimable == "") { alert("Must be > 0."); return;}
    setReserveClaimable(newClaimable);
  }

  /** View **/

  return (
    <div className="rootContainer">

      { loading && (
        <div className="deploying"><CircularProgress /></div>
      )}

      <Routes>
        <Route
          key={'home'}
          path="/"
          element={
            <DeployPanelView
              adminConfigPage={adminConfigPage} reserveName={reserveName}
              handleChangeReserveName={handleChangeReserveName} reserveSymbol={reserveSymbol}
              handleChangeReserveSymbol={handleChangeReserveSymbol}
              reserveClaimable={reserveClaimable}
              handleChangeReserveClaimable={handleChangeReserveClaimable} resetToDefault={resetToDefault}
              setAdminConfigPage={setAdminConfigPage} buttonLock={buttonLock}
              deployToken={() => deployToken(
                signer, setButtonLock,setLoading,reserveName,reserveSymbol,account,reserveDecimals,reserveClaimable
              )}
            />
          }
        />

        <Route
          key={'token'}
          path="/:id"
          element={
            <TokenView
              consoleData={consoleData} consoleColor={consoleColor}
              reserveName={reserveName} reserveSymbol={reserveSymbol} modalOpen={modalOpen}
              reserveClaimable={reserveClaimable}
              setModalOpen={setModalOpen} buttonLock={buttonLock} tokenAddress={tokenAddress}
              setTokenAddress={setTokenAddress} faucetView={faucetView} reserveBalance={reserveBalance}
              initiateClaim={() => initiateClaim(
                signer, setButtonLock,setLoading,account,setConsoleData,setConsoleColor, tokenAddress, setClaimComplete
              )}
            />
          }
        />

        <Route
          key={'token-dashboard'}
          path="/:id/dashboard"
          element={
            <TokenDashboardView
              setTokenAddress={setTokenAddress}
            />
          }
        />

        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p className='black'>There's nothing here!</p>
            </main>
          }
        />
      </Routes>

    </div>
  );
}

export default App;
