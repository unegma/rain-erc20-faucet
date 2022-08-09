import NavBar from "../layout/NavBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import Button from "@mui/material/Button";
import React, { Suspense } from "react";
import {Environment, Html, OrbitControls} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";
import ReserveToken from "../3d/ReserveToken";
import {InputAdornment} from "@mui/material";
import Warning from "../various/Warning";
import {TransactionsChartDeploy} from "../various/TransactionsChartDeploy";
const BASE_URL = process.env.REACT_APP_BASE_URL;
const RESERVE_EXAMPLE = process.env.REACT_APP_RESERVE_EXAMPLE;
const GITHUB_LINK = process.env.REACT_APP_GITHUB_URL;

type adminPanelProps = {
  adminConfigPage: number
  reserveName: string, handleChangeReserveName: any,
  reserveSymbol: string, handleChangeReserveSymbol: any,
  reserveClaimable: any, handleChangeReserveClaimable: any,
  resetToDefault: any, setAdminConfigPage: any,
  buttonLock: any, deployToken: any
}

export default function DeployPanelView({
  adminConfigPage,
  reserveName, handleChangeReserveName,
  reserveSymbol, handleChangeReserveSymbol,
  reserveClaimable, handleChangeReserveClaimable,
  resetToDefault, setAdminConfigPage,
  buttonLock, deployToken,
  } : adminPanelProps)
{

  return (
    <>
      <NavBar />
      <p className={'github github--firstview'}><a href={`${GITHUB_LINK}`} target="_blank">(Github Link)</a></p>

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
              {/*<a className='bullet' href="#" target="_blank">Rain Protocol ERC20 Faucet Demo Video</a><br/>*/}
              <a className='bullet'  href="https://docs.rainprotocol.xyz">Docs at: docs.rainprotocol.xyz</a><br/>
              {/*todo change to rUSD?*/}
              <a className='bullet'  href={`${window.location.origin}/${RESERVE_EXAMPLE}`} target="_blank">Example Faucet: Rain USD (rUSD)</a>
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
              <InputLabel className="input-box-label" htmlFor="component-helper">Amount a Faucet User will Receive Each Claim</InputLabel>
              <Input
                id="component-helper"
                value={reserveClaimable}
                onChange={handleChangeReserveClaimable}
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
            <TransactionsChartDeploy />

            <Typography variant="h5" component="h3" color="black">
              (Page 2/2)
            </Typography>

            <Warning />

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
