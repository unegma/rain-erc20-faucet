import React, {useEffect, useState} from 'react';
import {ethers, Signer} from "ethers";
import * as rainSDK from "rain-sdk";
import { connect } from "./connect.js"; // a very basic web3 connection implementation
import {CircularProgress} from "@mui/material";
import AdminPanelView from "./components/AdminPanelView";
import SaleView from "./components/SaleView";

declare var process : {
  env: {
    REACT_APP_RESERVE_NAME: string
    REACT_APP_RESERVE_SYMBOL: string
    REACT_APP_RESERVE_ERC20_DECIMALS: string
    REACT_APP_RESERVE_INITIAL_SUPPLY: string
  }
}

/**
 * App
 */
function App() {

  /** State Config **/

  // high level
  const [signer, setSigner] = useState<Signer|undefined>(undefined);
  const [address, setAddress] = useState("");
  const [tokenAddress, setTokenAddress] = React.useState("");
  const [consoleData, setConsoleData] = React.useState("");
  const [consoleColor, setConsoleColor] = React.useState('red');

  // page controls
  const [buttonLock, setButtonLock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminConfigPage, setAdminConfigPage] = useState(0);
  const [faucetView, setFaucetView] = React.useState(false); // show sale or admin view (if there is a sale address in the url)
  const [modalOpen, setModalOpen] = React.useState(false);

  // all these from .env will be replaced by calls to blockchain within the getTokenData function when faucetView is set to true
  const [reserveInitialSupply, setReserveInitialSupply] = useState(process.env.REACT_APP_RESERVE_INITIAL_SUPPLY);
  const [reserveDecimals, setReserveDecimals] = useState(process.env.REACT_APP_RESERVE_ERC20_DECIMALS);
  const [reserveName, setReserveName] = React.useState(process.env.REACT_APP_RESERVE_NAME);
  const [reserveSymbol, setReserveSymbol] = React.useState(process.env.REACT_APP_RESERVE_SYMBOL);

  // // a bit isolated because not taken from .env and only used in the Sale (and got from getSaleData())
  // const [redeemableTokenAddress, setRedeemableTokenAddress] = React.useState("");

  // these must be the same as the above in .env
  function resetToDefault() {
    setReserveDecimals(process.env.REACT_APP_RESERVE_ERC20_DECIMALS);
    setReserveInitialSupply(process.env.REACT_APP_RESERVE_INITIAL_SUPPLY);
    setReserveName(process.env.REACT_APP_RESERVE_NAME);
    setReserveSymbol(process.env.REACT_APP_RESERVE_SYMBOL);
  }

  /** UseEffects **/

  // run once on render and check url parameters
  useEffect(() => {
    let queryString = new URLSearchParams(window.location.search);
    let tParam = queryString.get('t');

    if (typeof tParam !== 'undefined' && tParam) {
      console.log(`tokenAddress is ${tParam}`) // why logged twice: https://stackoverflow.com/questions/60971185/why-does-create-react-app-initialize-twice
      setFaucetView(true);
      setTokenAddress(tParam);
    }
  },[]);

  // basic connection to web3 wallet
  useEffect(() => {
    makeWeb3Connection(); // todo test what happens if not signed in
  },[]);

  // this relies on useEffect above to get tokenAddress from url // todo may be able to merge this one with the above one
  useEffect(() => {
    if (tokenAddress && signer) {
      getTokenData(); // get saleContract and then get amount of shoes, and then load shoes
    }
  }, [tokenAddress, signer]); // only get sale data when signer and saleAddress have been loaded // monitor saleComplete so that the amount displayed on the button is updated when the sale is finished

  /** Handle Form Inputs **/
  //
  // const handleChangeReserveTokenAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setReserveTokenAddress(event.target.value);
  // };
  // const handleChangeStaticReservePriceOfRedeemable = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setStaticReservePriceOfRedeemable(event.target.value);
  // };
  // const handleChangeSaleTimeout = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setSaleTimeoutInBlocks(event.target.value);
  // };
  // const handleChangeRedeemableName = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setRedeemableName(event.target.value);
  // };
  // const handleChangeRedeemableSymbol = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setRedeemableSymbol(event.target.value);
  // };
  // const handleChangeRedeemableInitialSupply = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setRedeemableInitialSupply(event.target.value);
  // };

  /** Functions **/

  async function makeWeb3Connection() {
    try {
      const {signer, address} = await connect(); // get the signer and account address using a very basic connection implementation
      setSigner(signer);
      setAddress(address);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Get Token Data from blockchain instead of .env
   * THIS WILL ALL BE AS IF THERE IS NO .ENV ON SALE LOAD
   */
  async function getTokenData() {
    try {
      // // @ts-ignore
      // const tokenContract = new rainSDK.Sale(saleAddress, signer);
      // console.log(saleContract);
      //
      // setReserveTokenAddress(reserve.address);
      // setReserveName(await reserve.name());
      // setReserveSymbol(await reserve.symbol());
      // setRedeemableTokenAddress(redeemable.address);
      // setRedeemableName(await redeemable.name());
      // setRedeemableSymbol(await redeemable.symbol())
      // setRedeemableDecimals((await redeemable.decimals()).toString());
      //
      // // unnecessary, but here for reference // TODO ADD A SALE TIMEOUT INDICATOR AND A PRICE GETTER
      // // setRedeemableWalletCap(process.env.REACT_APP_REDEEMABLE_WALLET_CAP);
      // // setStaticReservePriceOfRedeemable(saleContract.calculatePrice(process.env.REACT_APP_REDEEMABLE_WALLET_CAP)); // should be desired units
      // // setSaleTimeoutInBlocks(process.env.REACT_APP_SALE_TIMEOUT_IN_BLOCKS);
      //
      // const amountOfShoesBN = await redeemable.totalSupply();
      // const amountOfShoesDecimals = await redeemable.decimals();
      // const amountOfShoes = parseInt(amountOfShoesBN.toString()) / 10 ** amountOfShoesDecimals;
      // console.log(`Shoes in Sale: ${amountOfShoes}`); // todo check if this changes when they are bought
      // setRedeemableInitialSupply(amountOfShoes.toString()); // TODO THIS SHOULD BE REMAINING SHOES NOT TOTAL SUPPLY
      //
      // // todo this will cause a giant number if signer has more than the walletcap
      // const priceOfRedeemableInUnitsOfReserve = await saleContract.calculatePrice(DESIRED_UNITS_OF_REDEEMABLE); // THIS WILL CALCULATE THE PRICE FOR **YOU** AND WILL TAKE INTO CONSIDERATION THE WALLETCAP, if the user's wallet cap is passed, the price will be so high that the user can't buy the token (you will see a really long number as the price)
      // let readablePrice = (parseInt(priceOfRedeemableInUnitsOfReserve.toString())/(10**parseInt(redeemableDecimals))).toString();
      // setStaticReservePriceOfRedeemable(readablePrice);
      // console.log(`Price for you: ${readablePrice}`);
      //
      // // @ts-ignore
      // setShowShoes(true);
    } catch(err) {
      console.log('Error getting sale data', err);
    }
  }

  /**
   * Deploy a Sale and Start it (2txs)
   */
  async function deploySale() {
    setButtonLock(true);
    setLoading(true);
    //
    // const saleConfig = {
    //   canStartStateConfig: opcodeData.canStartStateConfig, // config for the start of the Sale (see opcodes section below)
    //   canEndStateConfig: opcodeData.canEndStateConfig, // config for the end of the Sale (see opcodes section below)
    //   calculatePriceStateConfig: opcodeData.calculatePriceStateConfig(
    //     ethers.utils.parseUnits(staticReservePriceOfRedeemable, parseInt(reserveDecimals)),
    //     ethers.utils.parseUnits(redeemableWalletCap, parseInt(redeemableDecimals)),
    //   ), // config for the `calculatePrice` function (see opcodes section below).
    //   recipient: address, // who will receive the RESERVE token (e.g. USDCC) after the Sale completes
    //   reserve: reserveTokenAddress, // the reserve token contract address (MUMBAI MATIC in this case)
    //   saleTimeout: saleTimeoutInBlocks,
    //   cooldownDuration: 100, // this will be 100 blocks (10 mins on MUMBAI) // this will stay as blocks in upcoming releases
    //   // USING THE REDEEMABLE_INITIAL_SUPPLY HERE BECAUSE WE HAVE CONFIGURED 1 REDEEMABLE TO COST 1 RESERVE
    //   minimumRaise: ethers.utils.parseUnits(redeemableInitialSupply, reserveDecimals), // minimum to complete a Raise // TODO CHECK IF FINISHES AUTOMATICALLY WHEN HIT
    //   dustSize: ethers.utils.parseUnits("0", reserveDecimals), // todo check this: for bonding curve price curves (that generate a few left in the contract at the end)
    // };
    // const redeemableConfig = {
    //   // todo can erc721 be used instead?
    //   erc20Config: { // config for the redeemable token (rTKN) which participants will get in exchange for reserve tokens
    //     name: redeemableName, // the name of the rTKN
    //     symbol: redeemableSymbol, // the symbol for your rTKN
    //     distributor: "0x0000000000000000000000000000000000000000", // distributor address
    //     initialSupply: ethers.utils.parseUnits(redeemableInitialSupply, redeemableDecimals), // initial rTKN supply
    //   },
    //   // todo why can't I decompile? https://mumbai.polygonscan.com/address/0xC064055DFf6De32f44bB7cCB0ca59Cbd8434B2de#code
    //   tier: "0xC064055DFf6De32f44bB7cCB0ca59Cbd8434B2de", // tier contract address (used for gating)
    //   minimumTier: 0, // minimum tier a user needs to take part
    //   distributionEndForwardingAddress: "0x0000000000000000000000000000000000000000" // the rTKNs that are not sold get forwarded here (0x00.. will burn them)
    // }
    //
    // try {
    //   console.log("Info: Creating Sale with the following state:", saleConfig, redeemableConfig);
    //   // @ts-ignore
    //   const saleContract = await rainSDK.Sale.deploy(signer, saleConfig, redeemableConfig);
    //   console.log('Result: Sale Contract:', saleContract); // the Sale contract and corresponding address
    //   const redeemableContract = await saleContract.getRedeemable();
    //   console.log('Result: Redeemable Contract:', redeemableContract); // the Sale contract and corresponding address
    //   console.log('------------------------------'); // separator
    //
    //   // ### Interact with the newly deployed ecosystem
    //
    //   console.log('Info: Starting The Sale.');
    //   const startStatusTransaction = await saleContract.start();
    //   const startStatusReceipt = await startStatusTransaction.wait();
    //   console.log('Info: Sale Started Receipt:', startStatusReceipt);
    //   console.log('------------------------------'); // separator
    //
    //   console.log(`Redirecting to Sale: ${saleContract.address}`);
    //   window.location.replace(`${window.location.origin}?s=${saleContract.address}`);
    // } catch (err) {
    //   console.log(err);
    //   setLoading(false);
    //   alert('Failed Deployment, please start again or manually activate start() if the Sale deployed.');
    // }
  }

  /**
   * Called within the modal for making a buy
   * THIS MUST NOT BE SHOWN BEFORE getSaleData() HAS FINISHED OR THE DATA WILL BE FROM .ENV
   */
  async function initiateBuy() {
    // setButtonLock(true);
    // setLoading(true);
    //
    // try {
    //   // @ts-ignore
    //   const reserveContract = new rainSDK.ERC20(reserveTokenAddress, signer);
    //   // @ts-ignore
    //   const saleContract = new rainSDK.Sale(saleAddress, signer);
    //
    //   // approval
    //   console.log(`Info: Connecting to Reserve token for approval of spend of ${staticReservePriceOfRedeemable}${reserveSymbol}:`, reserveTokenAddress); // this will have been gotten dynamically in getSaleData()
    //
    //   // todo maybe create a toBigNumber() function instead of putting ethers everywhere
    //   const approveTransaction = await reserveContract.approve(saleContract.address, ethers.utils.parseUnits(staticReservePriceOfRedeemable.toString(), parseInt(reserveDecimals)));
    //   const approveReceipt = await approveTransaction.wait();
    //   console.log(`Info: Approve Receipt:`, approveReceipt);
    //   console.log('------------------------------'); // separator
    //
    //   console.log(`Info: Price of tokens in the Sale: ${staticReservePriceOfRedeemable}${await reserveContract.symbol()} (${reserveContract.address})`);
    //
    //   const buyConfig = {
    //     feeRecipient: address,
    //     fee: ethers.utils.parseUnits("0", parseInt(reserveDecimals)), // TODO DOES DECIMALS NEED CONVERTING TO INT? // fee to be taken by the frontend
    //     minimumUnits: ethers.utils.parseUnits(DESIRED_UNITS_OF_REDEEMABLE.toString(), parseInt(redeemableDecimals)), // this will cause the sale to fail if there are (DESIRED_UNITS - remainingUnits) left in the sale
    //     desiredUnits: ethers.utils.parseUnits(DESIRED_UNITS_OF_REDEEMABLE.toString(), parseInt(redeemableDecimals)),
    //     maximumPrice: ethers.constants.MaxUint256, // this is for preventing slippage (for static price curves, this isn't really needed and can be set to the same as staticPrice) // todo is this better as STATIC_RESERVE_PRICE_OF_REDEEMABLE?
    //   }
    //
    //   console.log(`Info: Buying ${DESIRED_UNITS_OF_REDEEMABLE}${redeemableSymbol} from Sale with parameters:`, buyConfig);
    //   const buyStatusTransaction = await saleContract.buy(buyConfig);
    //   const buyStatusReceipt = await buyStatusTransaction.wait();
    //   console.log(`Info: Buy Receipt:`, buyStatusReceipt);
    //   console.log('------------------------------'); // separator
    //
    //   setConsoleData(`Complete! You can view the ${redeemableSymbol} in your wallet by adding: ${redeemableTokenAddress}`);
    //   setConsoleColor(`green`); // todo add to struct
    //   setSaleComplete(true);
    //   setButtonLock(false);
    //   setLoading(false);
    // } catch(err) {
      // setLoading(false);
      // setButtonLock(false);
      // setConsoleData(`Sale Failed (Check console for more data).`);
      // setConsoleColor(`red`); // todo add to struct
      // console.log(`Info: Something went wrong:`, err);
    // }
  }

  /** Various **/

  /** View **/

  return (
    <div className="rootContainer">

      { loading && (
        <div className="deploying"><CircularProgress /></div>
      )}

      {/*if nothing is set, show admin panel*/}
      { !faucetView && (
        <AdminPanelView
          // adminConfigPage={adminConfigPage} reserveTokenAddress={reserveTokenAddress}
        />
      )}

      {/*{ faucetView && (*/}
      {/*  <SaleView*/}
      {/*    // redeemableName={redeemableName} redeemableSymbol={redeemableSymbol} modalOpen={modalOpen}*/}
      {/*/>*/}
      {/*)}*/}

    </div>
  );
}

export default App;
