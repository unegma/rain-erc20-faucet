import NavBar from "../layout/NavBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import {Bar} from "react-chartjs-2";
import React, { Suspense } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {Environment, Html, OrbitControls} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";
import ReserveToken from "../3d/ReserveToken";
import {InputAdornment} from "@mui/material";
const CHAIN_NAME = process.env.REACT_APP_CHAIN_NAME; // Mumbai (Polygon Testnet) Chain ID
const BASE_URL = process.env.REACT_APP_BASE_URL;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type adminPanelProps = {
  adminConfigPage: number
  reserveName: string, handleChangeReserveName: any,
  reserveSymbol: string, handleChangeReserveSymbol: any,
  reserveInitialSupply: any, handleChangeReserveInitialSupply: any,
  resetToDefault: any, setAdminConfigPage: any,
  buttonLock: any, deployToken: any
  // todo might be able to change how these are imported
  address: string, setAddress: any
}

export default function DeployPanelView({
  adminConfigPage,
  reserveName, handleChangeReserveName,
  reserveSymbol, handleChangeReserveSymbol,
  reserveInitialSupply, handleChangeReserveInitialSupply,
  resetToDefault, setAdminConfigPage,
  buttonLock, deployToken,
  // todo might be able to change how these are imported
  address, setAddress
  } : adminPanelProps)
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
    labels: ['Tx1: Deploy Token'],
    datasets: [
      {
        label: '',
        data: [1],
        backgroundColor: 'rgba(0, 0, 0, 0)',
      },
      {
        label: '',
        data: [0.01268265], // todo base it on dynamic matic costs
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '',
        data: [1],
        backgroundColor: 'rgba(0, 0, 0, 0)',
      }
    ],
  };

  return (
    <>
      <NavBar address={address} setAddress={setAddress} />

      <Box
        className="admin-form"
        component="form"
        sx={{
          '& > :not(style)': { m: 1 },
        }}
        noValidate
        autoComplete="off"
      >

        <Typography variant="h4" component="h2" color="black" align="center">
          Configure Faucet Deployment
        </Typography>

        { adminConfigPage === 0 && (
          <>
            <Typography color="black" align="center">
              Rain Protocol ERC20 Faucet Demo, tutorials: <a href="https://docs.rainprotocol.xyz">docs.rainprotocol.xyz</a>
            </Typography>

            <Typography color="black" align="center">
              {/*todo change to rUSD?*/}
             <a href={`${BASE_URL}/0xCCe6fb1921497715163F4a038521d3145f308652`} target="_blank">Example Faucet: Rain USD (rUSD)</a>
            </Typography>
          </>
        )}

        <Canvas hidden={!(adminConfigPage !== 1)} className="the-canvas-deploypanel" camera={{ position: [0, 0, 20], fov: 20 }} performance={{ min: 0.1 }}>
          <ambientLight intensity={0.1} />
          <directionalLight intensity={0.01} position={[5, 25, 20]} />
          <Suspense fallback={<Html className="black">loading..</Html>}>
            <ReserveToken rotation={[1,1,1]} reserveSymbol={reserveSymbol} />
            <Environment preset="studio" />
          </Suspense>
          <OrbitControls autoRotate autoRotateSpeed={1} enableZoom={false} enablePan={false} enableRotate={false} />
          {/*<OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />*/}
        </Canvas>


        { adminConfigPage === 0 && (
          <>
            <Typography variant="h5" component="h3" color="black">
              (Page 1/2)
            </Typography>

            <FormControl variant="standard">
              <InputLabel className="input-box-label" htmlFor="component-helper">Reserve Token Name</InputLabel>
              <Input
                id="component-helper"
                value={reserveName}
                onChange={handleChangeReserveName}
              />
            </FormControl>


            <FormControl variant="standard">
              <InputLabel className="input-box-label" htmlFor="component-helper">Reserve Token Symbol</InputLabel>
              <Input
                id="component-helper"
                value={reserveSymbol}
                onChange={handleChangeReserveSymbol}
              />
            </FormControl>

            <FormControl variant="standard">
              <InputLabel className="input-box-label" htmlFor="component-helper">Amount a Faucet User will Receive</InputLabel>
              <Input
                id="component-helper"
                value={reserveInitialSupply}
                onChange={handleChangeReserveInitialSupply}
                endAdornment={<InputAdornment position="end">{reserveSymbol}</InputAdornment>}
              />
            </FormControl>

            <div className="buttons-box">
              <Button className="fifty-percent-button" variant="outlined" onClick={() => {resetToDefault()}}>Reset</Button>
              <Button className="fifty-percent-button" variant="contained" onClick={() => {setAdminConfigPage(adminConfigPage+1)}}>Next</Button>
            </div>
          </>
        )}

        { adminConfigPage === 1 && (
          <>
            <Bar options={options} data={data} />;

            <Typography variant="h5" component="h3" color="black">
              (Page 2/2)
            </Typography>

            <Typography color="red">
              Please make sure you are connected to the <b className='red'>{CHAIN_NAME}</b> Network.
            </Typography>

            <Typography color="black">
              Please be aware, this example does not (currently) have strict checking for all fields, and you will not recover the cost for network fees (gas) if a deployment fails.
            </Typography>

            <div className="buttons-box">
              <Button className="fifty-percent-button" variant="outlined" onClick={() => {setAdminConfigPage(adminConfigPage-1)}}>Previous</Button>
              <Button className="fifty-percent-button" disabled={buttonLock} variant="contained" onClick={() => {deployToken()}}>Deploy</Button>
            </div>
          </>
        )}
      </Box>
    </>
  )
}
