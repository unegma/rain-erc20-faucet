import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Modal as ModalMaterial } from '@mui/material';
import {Bar} from "react-chartjs-2";
import Warning from "../various/Warning";
import Console from '../various/Console';
const SALE_BASE_URL = process.env.REACT_APP_SALE_BASE_URL;

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
  modalOpen: boolean, setModalOpen: any, reserveSymbol: string, buttonLock: any, tokenAddress: string,
  initiateClaim: any, consoleData: string, consoleColor: string
}

export default function TokenClaimModal({
    modalOpen, setModalOpen, reserveSymbol, buttonLock, tokenAddress, initiateClaim, consoleData, consoleColor
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
        <br/>
        <Bar options={options} data={data} />
        <br/>


        <Typography className="modalText">
          To see these tokens in your Wallet,&nbsp;
          <a href="#" onClick={(event: any) =>
            {event.preventDefault();alert(`Copy: ${tokenAddress} to clipboard and import token in to your Wallet.`)}}
          >
            add the address for <b>{reserveSymbol}</b>
          </a>.
        </Typography><br/>

        <Typography className="modalText">
          These <b>{reserveSymbol}</b> can be used <a href={`${SALE_BASE_URL}?t=${tokenAddress}`} target="_blank">as the <b>Reserve Token</b> in a Rain Sale (link passes address)</a>.
        </Typography><br/>

        <Warning /><br/>
        <Console consoleData={consoleData} consoleColor={consoleColor} /><br/>

        <div className="buttons-box">
          <Button disabled={buttonLock} className="fifty-percent-button" variant="outlined" onClick={() => {setModalOpen(false)}}>Close</Button>
          <Button disabled={buttonLock} className="fifty-percent-button" variant="contained" onClick={initiateClaim}>Get {reserveSymbol}!</Button>
        </div>

      </Box>
    </ModalMaterial>
  );
}
