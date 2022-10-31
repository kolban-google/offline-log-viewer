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
import { useState, useEffect } from 'react';
import { Box } from '@mui/material'
import PropTypes from 'prop-types';
//import styles from './index.css'
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import BugReportIcon from '@mui/icons-material/BugReport';
import DirectionsIcon from '@mui/icons-material/Directions';
//import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRight from '@mui/icons-material/ArrowRight';
import LogViewerUtils from './LogViewerUtils.js'

// Record is composed of"
// Severity
// Timestamp
// Summary
// Props contains: record
// Record is a Cloud Logging record
//
/*
{
  "insertId": "s=f8b7e99ba2ea4492b6ac9d8768fdd3a6;i=182;b=75f723c093b84b62a95eae03982ce398;m=33dc18;t=5ec1dd24612e6;x=6205354dbd8086e2",
  "jsonPayload": {
    "message": "ima: No architecture policies found"
  },
  "resource": {
    "type": "dataflow_step",
    "labels": {
      "job_id": "2022-10-28_13_07_17-12646045757829274894",
      "job_name": "app-kolban0kolban0altostrat0com-1028200711-651c29be",
      "project_id": "kolban-dataflow3",
      "region": "us-central1",
      "step_id": ""
    }
  },
  "timestamp": "2022-10-28T20:08:29.567718Z",
  "severity": "INFO",
  "labels": {
    "dataflow.googleapis.com/log_type": "system",
    "compute.googleapis.com/resource_type": "instance",
    "compute.googleapis.com/resource_name": "app-kolban0kolban0altostr-10281307-71o6-harness-cqks",
    "compute.googleapis.com/resource_id": "7989100371629934662",
    "dataflow.googleapis.com/job_name": "app-kolban0kolban0altostrat0com-1028200711-651c29be",
    "dataflow.googleapis.com/region": "us-central1",
    "dataflow.googleapis.com/job_id": "2022-10-28_13_07_17-12646045757829274894"
  },
  "logName": "projects/kolban-dataflow3/logs/dataflow.googleapis.com%2Fsystem",
  "receiveTimestamp": "2022-10-28T20:08:51.783728702Z"
}
*/
function LogRecord(props) {
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    setExpanded(false)
  }, [props.record]);


  let severity
  switch (props.record.severity) {
    case 'INFO':
      severity = (<InfoIcon fontSize='inherit' color='info' />)
      break;
    case 'WARNING':
      severity = (<WarningIcon fontSize='inherit' color='warning' />)
      break;
    case 'ERROR':
      severity = (<ErrorIcon fontSize='inherit' color='error' />)
      break;
    case 'DEBUG':
      severity = (<BugReportIcon fontSize='inherit' />)
      break;
    case 'NOTICE':
      severity = (<DirectionsIcon fontSize='inherit' />)
        break;      
    default:
      severity = (<StarIcon fontSize='inherit' color='success' />)
  }
  const timestamp = props.record.timestamp;
  let message = null;

  const record = props.record;

  if (message === null) {
    let ret = LogViewerUtils.getByPath(record, "jsonPayload.message", true);
    if (ret !== null) {
      message = ret;
    }
  }

  if (message === null) {
    let ret = LogViewerUtils.getByPath(record, "protoPayload.status.message", true);
    if (ret !== null) {
      message = ret;
    }
  }



  if (message === null) {
    let ret = LogViewerUtils.getByPath(record, "jsonPayload.exception", true);
    if (ret !== null) {
      message = ret;
    }
  }

  if (message === null) {
    let ret = LogViewerUtils.getByPath(record, "jsonPayload.resource.labels.method", true);
    if (ret !== null) {
      message = ret;
    }
  }

  if (message === null) {
    let m1 = LogViewerUtils.getByPath(record, "protoPayload.methodName", true);
    let r1 = LogViewerUtils.getByPath(record, "resource.type", true);
    message = `method: ${m1}, type: ${r1}`
  }

  function toggleExpand() {
    setExpanded(!expanded)
  }
  return (

    <Box className='record1' >
      <Box onClick={toggleExpand}>
        {expanded ? <ArrowDropDownIcon fontSize='inherit' /> : <ArrowRight fontSize='inherit' onClick={toggleExpand} />}
        {severity} {new Date(timestamp).toISOString()} &nbsp; {message.substring(0, 180)}
      </Box>
      {expanded ? <Box><pre>{JSON.stringify(record, null, 2)}</pre></Box> : null}
    </Box>
  )
} // EntityInfoDialog

LogRecord.propTypes = {
  'record': PropTypes.object
}

export default LogRecord