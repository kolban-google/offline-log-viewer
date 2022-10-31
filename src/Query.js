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
import { useState, useRef } from 'react';
import { Box, AppBar, IconButton, Typography, Toolbar, Button, Tab, Tabs, TextField } from '@mui/material'
import PropTypes from 'prop-types';
import LogTable from './LogTable';


function Query(props) {
  function handleChange(e) {
    if (props.onChange) {
      props.onChange(e.target.value)
    }
  }
  return (

    <Box>
        <TextField
          InputProps={{
              className: "query1"
          }}
          inputProps={{ style: { fontFamily: "monospace" } }}
          label="Query"
          fullWidth
          multiline
          maxRows={4}
          value={props.query}
          onChange={handleChange}
        />
    </Box>
  )
} // EntityInfoDialog

Query.propTypes = {
}

export default Query