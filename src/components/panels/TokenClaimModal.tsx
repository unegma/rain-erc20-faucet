import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Modal as ModalMaterial } from '@mui/material';
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Warning from "../various/Warning";
import Console from '../various/Console';
import {TransactionsChartClaim} from "../various/TransactionsChartClaim";
const SALE_BASE_URL = process.env.REACT_APP_SALE_BASE_URL;

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type modalProps = {
  modalOpen: boolean, setModalOpen: any, reserveSymbol: string, buttonLock: any, tokenAddress: string,
  initiateClaim: any, consoleData: string, consoleColor: string, reserveBalance: string
}

export default function TokenClaimModal({
    modalOpen, setModalOpen, reserveSymbol, buttonLock, tokenAddress, initiateClaim, consoleData, consoleColor, reserveBalance
  } : modalProps )
{

  function handleClose() {
    setModalOpen(false)
  }

  return (
    <ModalMaterial
      open={modalOpen}
      onClose={handleClose}
      className="the-modal"
    >
      <Box component="div" sx={style}>
        <HighlightOffIcon className="closeModalButton" onClick={() => { setModalOpen(false)}}/>
        <br/>
        <TransactionsChartClaim reserveSymbol={reserveSymbol} />
        <br/>

        <Typography className="modalText">
          <span className='yourBalance'>Your Balance: {reserveBalance}{reserveSymbol}</span>.
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
