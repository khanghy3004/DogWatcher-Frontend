import * as React from "react";
import ReactDOM from "react-dom";
import DataTable from "react-data-table-component";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import SortIcon from "@mui/icons-material/ArrowDownward";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import axios from 'axios';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import "./styles.css";

function App() {
  const [data, setData] = React.useState([]);
  const [domains, setDomains] = React.useState([]);
  const [balanceData, setBalanceData] = React.useState({});
  const [tokens, setTokens] = React.useState([]);
  const [pendingDomain, setPendingDomain] = React.useState(true);
  const [pendingToken, setPendingToken] = React.useState(true);
  const [optionNetwork, setOptionNetwork] = React.useState('0x61');

  React.useEffect(async () => {
    var domainData = await axios.get('https://test-api.tanky.tk:5002/domain-status');
    console.log(domainData.data)
    setDomains(domainData.data);
    setPendingDomain(false);
  }, [true]);

  React.useEffect(async () => {
    setPendingToken(true);
    var balanceData = await axios.get(`https://test-api.tanky.tk:5001/walletBalance/${optionNetwork}`);
    console.log(balanceData.data)
    setBalanceData(balanceData.data);
    var tokenData = await axios.get(`https://test-api.tanky.tk:5001/tokenWalletBalance/${optionNetwork}`);
    console.log(tokenData.data)
    setTokens(tokenData.data);
    setPendingToken(false);
  }, [true, optionNetwork]);

  const columns1 = [
    {
      name: "Domain",
      selector: row => row["domain"],
      sortable: true
    },
    {
      name: "Status",
      selector: row => row["status"],
      sortable: true
    },
    {
      name: "SSL",
      selector: row => {
        return row['ssl'].valid ? "True" : "False";
      },
      sortable: true,
    },
    {
      name: "Details",
      selector: row => {
        return <a href="#" onClick={() => {
          setData(row);
        }
        }>Details</a>;
      },
      sortable: true,
    }
  ];

  const columns2 = [
    {
      name: "WalletAddress",
      selector: row => row["WalletAddress"],
      sortable: true
    },
    {
      name: "Details",
      selector: row => {
        return <a href="#" onClick={() => {
          setData(row);
        }
        }>Details</a>;
      },
      sortable: true,
    }
  ];

  const isIndeterminate = (indeterminate) => indeterminate;
  const selectableRowsComponentProps = { indeterminate: isIndeterminate };

  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const options = [
    "0x61", "eth", "mainnet", "0x1", "goerli", "0x5", "bsc", "binance",
    "binance smart chain", "0x38", "bsc testnet", "binance testnet",
    "binance smart chain testnet", "matic", "polygon", "0x89",
    "mumbai", "matic testnet", "polygon testnet", "0x13881", "avalanche",
    "0xa86a", "avalanche testnet", "0xa869", "fantom", "0xfa", "cronos", "0x19"
  ];

  function handleChangeNetwork(e) {
    setOptionNetwork(e.value);
  }
  return (
    <div className="App">
      <Container>
        <Paper>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Domain" value="1" />
                <Tab label="Token" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <DataTable
                title="Dog Watcher"
                columns={columns1}
                data={domains}
                defaultSortField="domain"
                sortIcon={<SortIcon />}
                pagination
                paginationRowsPerPageOptions={[5, 10, 50, 100]}
                progressPending={pendingDomain}
              // selectableRows
              // selectableRowsComponent={Checkbox}
              // selectableRowsComponentProps={selectableRowsComponentProps}
              />

              {data.domain && (
                <CardContent>
                  <Typography sx={{ fontSize: 24 }} color="text.secondary" gutterBottom>
                    {data.domain}
                  </Typography>
                  <Typography sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
                    Domain Info
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Created Date: {data.info['Created Date']}<br />
                    Expiry Date: {data.info['Expiry Date']}<br />
                    Name Server: {JSON.stringify(data.info['Name Server'])}<br />
                  </Typography>
                  <Typography sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
                    SSL Info
                  </Typography>
                  <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Days Remaining: {data.ssl['daysRemaining']}<br />
                    Valid: {data.ssl['valid'] ? 'True' : 'False'}<br />
                    Valid From: {data.ssl['validFrom']}<br />
                    Valid To: {data.ssl['validTo']}<br />
                  </Typography>
                </CardContent>
              )}
            </TabPanel>
            <TabPanel value="2">
              <Dropdown options={options} onChange={(e) => handleChangeNetwork(e)} value={optionNetwork} placeholder="Select an option" />
              <DataTable
                title="Dog Watcher"
                columns={columns2}
                data={tokens}
                defaultSortField="domain"
                sortIcon={<SortIcon />}
                pagination
                paginationRowsPerPageOptions={[5, 10, 50, 100]}
                progressPending={pendingToken}
              // selectableRows
              // selectableRowsComponent={Checkbox}
              // selectableRowsComponentProps={selectableRowsComponentProps}
              />

              {data.WalletAddress && (
                <CardContent>
                  <Typography sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
                    Wallet: {data.WalletAddress}
                  </Typography>
                  <Typography sx={{ fontSize: 18 }} color="text.primary" gutterBottom>
                    Balance Coin Network {optionNetwork}: {balanceData[data.WalletAddress]}
                  </Typography>
                  {data.ListCheck.map((item, index) => {
                    return (
                      <>
                        <Typography sx={{ fontSize: 18 }} color="text.secondary" gutterBottom>
                          {item.Symbol}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary" gutterBottom>
                          Balance: {item.Balance}
                        </Typography>
                      </>
                    )
                  })
                  }
                </CardContent>
              )}
            </TabPanel>
          </TabContext>

        </Paper>


      </Container>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
