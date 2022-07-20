import React, {Suspense, useEffect} from "react";
import Typography from "@mui/material/Typography";
import {useParams} from "react-router-dom";

type tokenViewProps = {
  setTokenAddress: any
}

export default function TokenDashboardView({
    setTokenAddress
  }: tokenViewProps)
{

  // this needs to be here as id is within the router
  let {id}: any = useParams();
  console.log(`The ID: ${id}`);
  // set token address by url instead of t= (check line 80 onwards works in app.tsx for getting the tokenData)
  useEffect(() => {
    setTokenAddress(id);
  }, []);

  return (
    <>
      <Typography className="black">Hey</Typography>
    </>
  )
}
