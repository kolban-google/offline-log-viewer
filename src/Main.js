/*
# Copyright 2022, Google, Inc.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
*/
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Box, AppBar, IconButton, Typography, Toolbar, Button, FormGroup, FormControlLabel, Switch } from '@mui/material'
//mport PropTypes from 'prop-types';
import LogTable from './LogTable';
import Query from './Query';
import LogViewerUtils from './LogViewerUtils.js'
import ErrorDialog from './ErrorDialog';


function Main(props) {
  const [logData, setLogData] = useState([])
  const [filteredLogData, setFilteredData] = useState([])
  const [showQuery, setShowQuery] = React.useState(true);
  const [queryText, setQueryText] = React.useState("");  
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorDialogMessage, setErrorDialogMessage] = useState({message: "No Message"});
  const inputFile = useRef(null)

  function onCloseError() {
    setOpenErrorDialog(false);
  }
  function onRefresh() {
    filterData();
  }

  function filterData() {
    let query;
    try {
      query = LogViewerUtils.parseQueryString(queryText)
    }
    catch(e) {
      setErrorDialogMessage(e);
      setOpenErrorDialog(true);
      return;
    }
    const filteredData = LogViewerUtils.filter(logData, query)
    setFilteredData(filteredData)
    const stats = LogViewerUtils.getStats(filteredData)
    console.dir(stats)
    //debugger;
  }


  function onLoad() {
    inputFile.current.click();
  }

  useEffect(() => {
    filterData()
  }, [logData]);


  /**
   * 
   * @param {*} e 
   * Called when the file has been loaded.
   */
  function onFileLoad(e) {
    const file = inputFile.current.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      console.dir(reader.result)
      const data = JSON.parse(reader.result);
      setLogData(data);
    };
    reader.readAsText(file);
  }

  /**
   * 
   * @param {*} e 
   * Called when a request to change the state of the query is made.
   */
  function changeShowQuery(e) {
    setShowQuery(e.target.checked);
  }

  function onQueryChanged(txt) {
    console.log("Query changed ... " + txt)
    setQueryText(txt)
  }

  return (
    <Box style={{height: "100%", display: "flex", flexDirection: "column"}}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            Offline Cloud Log Viewer
          </Typography>
        </Toolbar>

      </AppBar>
      <Box>
      <input type='file' id='file' ref={inputFile} style={{ display: 'none' }} onChange={onFileLoad} />

      <Button onClick={onLoad}>Load</Button>
      <Button onClick={onRefresh}>Refresh</Button>

      <FormGroup>
        <FormControlLabel control={<Switch checked={showQuery} onChange={changeShowQuery} />} label="Show Query" />
      </FormGroup>

      {showQuery?<Query query={queryText} onChange={onQueryChanged}/>:null}
      </Box>


      <LogTable logData={filteredLogData} />
      <ErrorDialog open={openErrorDialog} error={errorDialogMessage} close={onCloseError}/>
    </Box>
  )
} // EntityInfoDialog

Main.propTypes = {
}

export default Main