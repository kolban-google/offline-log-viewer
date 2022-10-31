/**
 * query: [
 *   {
 *     <filter>
 *   }
 * ]
 */

/**
 * <filter>
 * {
 *   "type": "Type of filter"
 *   "invert": boolean (false - include the filter - true - invert the filter)
 *   "path": "Path to record element"
 *   "value": "Value of record element desired to pass or null if we only care that the path exists"
 * }
 * 
 * "type":
 *   - "exists"
 *   - "path-value"
 */
/**
 * 
 * @param {*} record 
 * @param {*} query 
 */

function getByPath(object, path, nullOnNotFound) {
  if (object === undefined) {
    if (nullOnNotFound) {
      return null;
    }
    throw Error(`No object`);
  }
  const parts = path.split('.');
  const start = parts.shift();
  if (object.hasOwnProperty(start)) {
    if (parts.length === 0) {
      return object[start];
    }
    return getByPath(object[start], parts.join('.'), nullOnNotFound)
  }
  if (nullOnNotFound) {
    return null;
  }
  throw Error(`Not found`);
}

function parseRecord(record, query) {
  if (query.length === 0) {
    return true;
  }
  const currentFilter = query[0];
  try {
    const value = getByPath(record, currentFilter.path);
    if (query.value !== null) {
      console.log(`${value}`)
      if (currentFilter.value !== value) {
        return false;
      }
    }
  }
  catch (e) {
    console.log(e);
    return false;
  }
  return true;
}

function filter(logData, query) {
  const filteredData = [];
  for (let i = 0; i < logData.length; i++) {
    const record = logData[i];
    if (parseRecord(record, query) === true) {
      filteredData.push(record);
    }
  }
  return filteredData;
}

function getStats(logData) {
  const types = {};
  const severity = {};
  for (let i=0; i<logData.length; i++) {
    const currentRecord = logData[i]
    let value  = getByPath(currentRecord, "resource.type", true);
    if (value !== null) {
      if (types.hasOwnProperty(value)) {
        types[value] ++;
      } else {
        types[value] = 1;
      }
    }
    value = getByPath(currentRecord, "severity", true);
    if (value !== null) {
      if (severity.hasOwnProperty(value)) {
        severity[value] ++;
      } else {
        severity[value] = 1;
      }
    }
  }
  return { types, severity, startTimestamp: getByPath(logData[0], "timestamp", true), endTimestamp: getByPath(logData[logData.length - 1], "timestamp", true)}
}

function parseQueryString(queryString) {
  // Current line number
  let lineNumber = 0;

  // List of errors detected
  const errors= [];

  // Query string parsed into lines
  const lines = queryString.split('\n');

  // The resulting query
  const queryResult = [];

  // Loop through each of the lines
  for (let i = 0; i < lines.length; i++) {
    lineNumber++;

    // Get the current line
    const currentQueryLine = lines[i].trim();

    // If the line is blank, skip
    if (currentQueryLine.length === 0) {
      continue;
    }

    // field or field.field  ^\s*([a-zA-Z]+(\.[a-zA-Z]+)*)\s*$
    const re1 = /^\s*([a-zA-Z]+[.[a-zA-Z]+]*)\s*$/
    let result = currentQueryLine.match(re1);
    if (result !== null) {
      queryResult.push({
        "path": result[1]
      })
      continue;
    }

    // field="Value" or field.field="value"  ^\s*([a-zA-Z]+[\.[a-zA-Z]+]*)\s*\=\s*\"([^\"]*)\"\s*$  
    const re2 = /^\s*([a-zA-Z]+[.[a-zA-Z]+]*)\s*=\s*"([^"]*)"\s*$/
    result = currentQueryLine.match(re2);
    if (result !== null) {
      queryResult.push({
        "path": result[1],
        "value": result[2]
      })
      continue;
    }

    // We didn't match the line ... flag it as an error
    errors.push({lineNumber: lineNumber, queryLine: currentQueryLine})
    console.log(`Nothing matched for ${currentQueryLine}`)
  }
  if (errors.length > 0) {
    let message = "";
    for (let i=0; i<errors.length; i++) {
      message = message + `\nline: ${errors[i].lineNumber}: text: ${errors[i].queryLine}`
    }
    throw new Error(message);
  }
  return queryResult;
}

const exports = { parseRecord, filter, parseQueryString, getByPath, getStats }
export default exports;