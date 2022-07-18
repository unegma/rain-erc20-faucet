import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Web3ConnectionButtons from '../components/Web3ConnectionButtons';
import {useWeb3React} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";

export default function NavBar({string, stringRight, address, setAddress}: {string?: string, stringRight?: string, address: string, setAddress: any}) {

  const context = useWeb3React<Web3Provider>(); // todo check because this web3provider is from ethers
  const { connector, library, chainId, account, activate, deactivate, active, error } = context;

  return (
    <Box component="div" sx={{ flexGrow: 1 }} className="navBar" >
      <AppBar position="fixed" color="transparent">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {!string ? 'Configure ERC20 Faucet' : string}
          </Typography>

          <Web3ConnectionButtons setAddress={setAddress} className='connect-button' />

          {/*<Typography className="right" variant="h6" component="div" sx={{ flexGrow: 1 }}>*/}
          {/*  {!stringRight ? '' : stringRight}*/}
          {/*</Typography>*/}
        </Toolbar>
      </AppBar>
    </Box>
  )
}
