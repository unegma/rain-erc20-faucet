import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Modal as ModalMaterial } from '@mui/material';
import {Bar} from "react-chartjs-2";
const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME; // Mumbai (Polygon Testnet) Chain ID
// const displayedImage = 'https://assets.unegma.net/unegma.work/rain-erc20-faucet.unegma.work/faucet.jpg'
const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '42vw',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type modalProps = {
  modalOpen: boolean, setModalOpen: any, reserveSymbol: string, reserveInitialSupply: any, buttonLock: any, tokenAddress: string,
  // initiateBuy: any, buttonLock: boolean, redeemableTokenAddress: string,
  // staticReservePriceOfRedeemable: any,  redeemableSymbol: string, consoleData: string,
  initiateClaim: any,
  consoleData: string,
  consoleColor: string
}

export default function Modal({
    modalOpen, setModalOpen, reserveSymbol, reserveInitialSupply, buttonLock, tokenAddress,
    // initiateBuy, buttonLock, redeemableTokenAddress, staticReservePriceOfRedeemable,
    // redeemableSymbol, consoleData, consoleColor}
    initiateClaim, consoleData, consoleColor
  } : modalProps )
{


  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Upcoming Transaction Cost Ratios (Estimated MATIC Ratios based on costs at: 2022-05-30T15:32:44Z)',
      },
    },
  };


  const data = {
    labels: [`Tx1: Claim ${reserveSymbol}`],
    datasets: [
      {
        label: '',
        data: [1],
        backgroundColor: 'rgba(0, 0, 0, 0)',
      },
      {
        label: '',
        data: [0.00927434], // todo base it on dynamic matic costs
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '',
        data: [1],
        backgroundColor: 'rgba(0, 0, 0, 0)',
      }
    ],
  };

  function handleClose() {
    setModalOpen(false)
  }

  return (
    <ModalMaterial
      open={modalOpen}
      onClose={handleClose}
    >
      <Box component="div" sx={style}>
        {/*<img className="modalImage" src={displayedImage} alt="#" /><br/>*/}

        {/*todo create graph of transaction costs*/}

        <br/>

        {/*{ !staticReservePriceOfRedeemable.includes('e') && (*/}
          <Bar options={options} data={data} />
        {/*)}*/}

        <br/>


        <Typography className="modalText">
          To see these tokens in your Wallet, you may need to add the address: <b>{tokenAddress}</b> for <b>{reserveSymbol}</b>.
        </Typography><br/>

        <Typography className="modalText">
          These <b>{reserveSymbol}</b> can be used as the <b>Reserve Token</b> in the <a href={`https://rain-voucher-sale.unegma.work?t=${tokenAddress}`} target="_blank">Rain Voucher Sale (link passes <b>{reserveSymbol}</b> address).</a>
        </Typography><br/>

        <Typography className="modalText">
          Make sure you are connected to the <b className='modalTextRed'>{CHAIN_NAME}</b> Network.
        </Typography><br/>

        { consoleColor === 'red' && (
          <Typography className="modalTextRed">{consoleData}</Typography>
        )}

        { consoleColor === 'green' && (
          <Typography className="modalTextGreen">{consoleData}</Typography>
        )}

        <br/>

        <div className="buttons-box">
          <Button disabled={buttonLock} className="fifty-percent-button" variant="outlined" onClick={() => {setModalOpen(false)}}>Close</Button>

          {/*{ !staticReservePriceOfRedeemable.includes('e') && (*/}
            <Button disabled={buttonLock} className="fifty-percent-button" variant="contained" onClick={initiateClaim}>Get {reserveSymbol}!</Button>
          {/*)}*/}
          {/*{ staticReservePriceOfRedeemable.includes('e')  && (*/}
          {/*  <Button disabled={buttonLock} className="fifty-percent-button" variant="contained">Buy Limit Reached</Button>*/}
          {/*)}*/}

        </div>

      </Box>
    </ModalMaterial>
  );
}
