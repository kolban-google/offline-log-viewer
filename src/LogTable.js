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
//import { useState, useRef } from 'react';
import { Box } from '@mui/material'
//import PropTypes from 'prop-types';
import LogRecord from './LogRecord';


function LogTable(props) {
  const logData = props.logData;
  const rows = [];
  for (let i = 0; i < logData.length; i++) {
    // note: we are adding a key prop here to allow react to uniquely identify each
    // element in this array. see: https://reactjs.org/docs/lists-and-keys.html
    rows.push(<LogRecord record={logData[i]} />);
  }
  console.log("Log Table Redrawing")
  return (

    <Box style={{height: "100%", overflowY: "scroll"}}>
      {rows}
    </Box>
  )
} // EntityInfoDialog

LogTable.propTypes = {
}

export default React.memo(LogTable)