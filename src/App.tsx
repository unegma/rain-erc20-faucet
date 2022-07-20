import React, {useEffect, useState} from 'react';
import {
  Route, Routes, useParams
} from "react-router-dom";
import {ethers, Signer} from "ethers";
import * as rainSDK from "rain-sdk";
// import { connect } from "./connect.js"; // a very basic web3 connection implementation
import {CircularProgress} from "@mui/material";
import AdminPanelView from "./components/panels/DeployPanelView";
import TokenView from "./components/panels/TokenView";
import TokenDashboardView from "./components/panels/TokenDashboardView";
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";

declare var process : {
  env: {
    REACT_APP_RESERVE_NAME: string
    REACT_APP_RESERVE_SYMBOL: string
    REACT_APP_RESERVE_ERC20_DECIMALS: string
    REACT_APP_RESERVE_INITIAL_SUPPLY: string
    REACT_APP_BASE_URL: string
    REACT_APP_CHAIN_ID: string
  }
}
const SUBGRAPH_ENDPOINT = rainSDK.AddressBook.getSubgraphEndpoint(parseInt(process.env.REACT_APP_CHAIN_ID));

/**
 * App
 */
function App() {

  /** State Config **/

  const context = useWeb3React<Web3Provider>(); // todo check because this web3provider is from ethers
  const { connector, library, chainId, account, activate, deactivate, active, error }: any = context;

  // high level
  const [signer, setSigner] = useState<Signer|undefined>(undefined);
  const [address, setAddress] = useState("");
  const [tokenAddress, setTokenAddress] = React.useState(""); // this is now retrieved from the url
  const [consoleData, setConsoleData] = React.useState("");
  const [consoleColor, setConsoleColor] = React.useState('red');

  // page controls
  const [buttonLock, setButtonLock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminConfigPage, setAdminConfigPage] = useState(0);
  const [faucetView, setFaucetView] = React.useState(false); // show faucet or admin view (if there is a faucet address in the url)
  const [modalOpen, setModalOpen] = React.useState(false);

  // all these from .env will be replaced by calls to blockchain within the getTokenData function when faucetView is set to true
  const [reserveInitialSupply, setReserveInitialSupply] = useState(process.env.REACT_APP_RESERVE_INITIAL_SUPPLY);
  const [reserveDecimals, setReserveDecimals] = useState(process.env.REACT_APP_RESERVE_ERC20_DECIMALS);
  const [reserveName, setReserveName] = React.useState(process.env.REACT_APP_RESERVE_NAME);
  const [reserveSymbol, setReserveSymbol] = React.useState(process.env.REACT_APP_RESERVE_SYMBOL);

  // these must be the same as the above in .env
  function resetToDefault() {
    setReserveDecimals(process.env.REACT_APP_RESERVE_ERC20_DECIMALS);
    setReserveInitialSupply(process.env.REACT_APP_RESERVE_INITIAL_SUPPLY);
    setReserveName(process.env.REACT_APP_RESERVE_NAME);
    setReserveSymbol(process.env.REACT_APP_RESERVE_SYMBOL);
  }

  /** UseEffects **/

  // basic connection to web3 wallet
  // useEffect(() => {
  //   makeWeb3Connection(); // todo test what happens if not signed in
  // },[]);

  useEffect(() => {
    setSigner(library?.getSigner());
    setAddress(account);
  }, [library, account]);

  // this relies on useEffect above to get tokenAddress from url // todo may be able to merge this one with the above one
  // todo check this section because it is different in all frontends
  // TODO CHECK THIS WORKS WITH INJECTED CONNECTOR
  // TODO CHECK IF THIS WORKS WITHOUT SIGNER ON SALE EXAMPLE
  useEffect(() => {
    // todo check this still works with new url parameter
    if (tokenAddress) {
      getTokenData(tokenAddress);
    }
  }, [tokenAddress]); // only get sale data when signer and saleAddress have been loaded // monitor saleComplete so that the amount displayed on the button is updated when the sale is finished

  /** Handle Form Inputs **/

  const handleChangeReserveName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReserveName(event.target.value);
  }
  const handleChangeReserveSymbol = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReserveSymbol(event.target.value);
  }
  const handleChangeReserveInitialSupply = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReserveInitialSupply(event.target.value);
  }

  /** Functions **/

  // async function makeWeb3Connection() {
  //   try {
  //     const {signer, address} = await connect(); // get the signer and account address using a very basic connection implementation
  //     setSigner(signer);
  //     setAddress(address);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }



  /**
   * Get Token Data from blockchain instead of .env
   * THIS WILL ALL BE AS IF THERE IS NO .ENV ON SALE LOAD
   */
  async function getTokenData(tokenAddress: string) {
    try {
      let subgraphData = await fetch(SUBGRAPH_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              emissionsERC20S (where: {id: "${tokenAddress.toLowerCase()}"}) {
                id
                symbol
                name
                decimals
              }
            }
          `
        })
      });

      // the response will then come back as promise, the data of which will need to be accessed as such:
      subgraphData = await subgraphData.json();
      console.log(subgraphData);

      // @ts-ignore
      subgraphData = subgraphData.data.emissionsERC20S[0]; // should only be one here anyway. // todo--question is there potential for 'too quick' to cause it not to exist yet in the subgraph?
      if (subgraphData === undefined) throw new Error('NO_SUBGRAPH_DATA');

      console.log(`Result: data from subgraph with endpoint ${SUBGRAPH_ENDPOINT}:`);
      // @ts-ignore
      setReserveName(subgraphData.name);
      // @ts-ignore
      setReserveSymbol(subgraphData.symbol);
      // @ts-ignore
      setReserveDecimals((subgraphData.decimals.toString()));
      setFaucetView(true);
    } catch (err) {
      console.log(err);
    }
  }


  // /**
  //  * Get Token Data from blockchain instead of .env
  //  * THIS WILL ALL BE AS IF THERE IS NO .ENV ON SALE LOAD
  //  */
  // async function getTokenData(tokenAddress: string) {
  //   try {
  //     // @ts-ignore
  //     const tokenContract = new rainSDK.EmissionsERC20(tokenAddress, new ethers.VoidSigner(tokenAddress, provider) );
  //     console.log(tokenContract);
  //
  //     setReserveName(await tokenContract.name());
  //     setReserveSymbol(await tokenContract.symbol());
  //     setReserveDecimals((await tokenContract.decimals()).toString());
  //     setFaucetView(true);
  //   } catch(err) {
  //     console.log('Error getting token data', err);
  //   }
  // }

  /**
   * Deploy a Sale and Start it (2txs)
   */
  async function deployToken() {
    setButtonLock(true);
    setLoading(true);

    const emissionsERC20Config = {
      allowDelegatedClaims: false, // can mint on behalf of someone else
      erc20Config: {
        name: reserveName,
        symbol: reserveSymbol,
        distributor: address, // initialSupply is given to the distributor during the deployment of the emissions contract
        initialSupply: ethers.utils.parseUnits("0", reserveDecimals), // todo change this to 0 if possible, or tell the deployer that they will get an amoujnt of tokens
      },
      vmStateConfig: {
        // todo should really change 'initialSupply' to now be 'faucetSupply' or something
        constants: [ethers.utils.parseUnits(reserveInitialSupply, reserveDecimals)], // mint a set amount at a time (infinitely), if set to 10, will mint 10 at a time, no more no less (infinitely)
        sources: [
          ethers.utils.concat([
            rainSDK.utils.op(rainSDK.Sale.Opcodes.VAL, 0),
          ]),
        ],
        stackLength: 1,
        argumentsLength: 0,
      },
    };

    try {
      console.log(`Deploying and Minting ERC20 Token with the following parameters:`, emissionsERC20Config);
      // @ts-ignore
      const emissionsErc20 = await rainSDK.EmissionsERC20.deploy(signer, emissionsERC20Config);
      // // todo claim function will mint another token (in addition to initial supply)??
      const emissionsERC20Address = emissionsErc20.address;
      console.log(`Result: deployed emissionsErc20, with address: ${emissionsERC20Address} and sent you ${reserveInitialSupply} tokens.`, emissionsErc20);
      console.log('Info: to see the tokens in your Wallet, add a new token with the address above. ALSO, REMEMBER TO NOTE DOWN THIS ADDRESS, AS IT WILL BE USED AS RESERVE_TOKEN IN FUTURE TUTORIALS.');

      // wait so subgraph has time to index
      setTimeout(() => {
        console.log(`Redirecting to Token Faucet: ${emissionsERC20Address}`);
        window.location.replace(`${window.location.origin}/${emissionsERC20Address}`);
      }, 5000)
    } catch (err) {
      console.log(err);
      setLoading(false);
      setButtonLock(false);
      alert('Failed Deployment.');
    }
  }

  /**
   * Called within the modal for making a buy
   * THIS MUST NOT BE SHOWN BEFORE getSaleData() HAS FINISHED OR THE DATA WILL BE FROM .ENV
   */
  async function initiateClaim() {
    setButtonLock(true);
    setLoading(true);
    //
    try {
      // @ts-ignore
      const emissionsErc20 = new rainSDK.EmissionsERC20(tokenAddress, signer);

      // TODO FIGURE OUT WHAT IS HAPPENING WITH ADDRESSZERO
      const claimTransaction = await emissionsErc20.claim(address, ethers.constants.AddressZero);
      const claimReceipt = await claimTransaction.wait();
      console.log('Success', claimReceipt);

      setConsoleData(`Complete!`);
      setConsoleColor(`green`); // todo add to struct
    //   setButtonLock(false); // don't set to true to disincentive users from continuing to click it
      setLoading(false);
    } catch(err) {
      setLoading(false);
      setButtonLock(false);
      setConsoleData(`Claim Failed (Check console for more data).`);
      setConsoleColor(`red`); // todo add to struct
      console.log(`Info: Something went wrong:`, err);
    }
  }

  /** Various **/

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
            <AdminPanelView
              adminConfigPage={adminConfigPage} reserveName={reserveName}
              handleChangeReserveName={handleChangeReserveName} reserveSymbol={reserveSymbol}
              handleChangeReserveSymbol={handleChangeReserveSymbol}
              reserveInitialSupply={reserveInitialSupply}
              handleChangeReserveInitialSupply={handleChangeReserveInitialSupply} resetToDefault={resetToDefault}
              setAdminConfigPage={setAdminConfigPage} buttonLock={buttonLock} deployToken={deployToken}
              address={address} setAddress={setAddress}
            />
          }
        />

        <Route
          key={'token'}
          path="/:id"
          element={
            <TokenView
              consoleData={consoleData} consoleColor={consoleColor} initiateClaim={initiateClaim}
              reserveName={reserveName} reserveSymbol={reserveSymbol} modalOpen={modalOpen}
              reserveInitialSupply={reserveInitialSupply}
              setModalOpen={setModalOpen} buttonLock={buttonLock} tokenAddress={tokenAddress}
              setTokenAddress={setTokenAddress} faucetView={faucetView} BASE_URL={process.env.REACT_APP_BASE_URL}
              address={address} setAddress={setAddress}
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
