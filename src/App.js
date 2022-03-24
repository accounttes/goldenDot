import React from 'react';

import { useDispatch } from 'react-redux';
import { addItems, setSort } from './redux/actionCreators/items.js';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { CurrApi } from './api/FetchApi.js';
import Button from '@mui/material/Button';

function App() {
  const dispatch = useDispatch();
  const setValutes = (valutes) => dispatch(addItems(valutes));

  const [val, setVal] = React.useState([]);
  const [active, setActive] = React.useState(false);

  const valutes = useSelector(({ items }) => items.items);
  const currVal = Object.entries(valutes);

  const items = [];

  const currS = useSelector(({ prevItems }) => prevItems.prevItems);
  const currValute = [];

  function addItem(item) {
    items.push(item);
    if (items.length >= 10) {
      dispatch(setSort(items));
    }
  }

  const currDate = new Date().getTime();
  const oneDayM = 86400000;
  let count = 0;

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 18.5,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
    transition: '0.3s',
    '&:hover': {
      background: 'lightgrey',
      cursor: 'pointer',
    },
  }));

  function handleElem(NumCode) {
    setVal(NumCode);
    setActive(true);
  }

  React.useEffect(() => {
    CurrApi()
      .then((resp) => resp.json())
      .then((result) => setValutes(result.Valute));

    for (let i = 0; i < 50; i++) {
      if (count === 10) {
        continue;
      }
      const day = new Date(currDate - oneDayM * i).getDay();

      const currD = new Date(currDate - oneDayM * i)
        .toISOString()
        .slice(0, 10)
        .split('-')
        .join('/');

      if (!(day === 0 || day === 1)) {
        count++;
        fetch(`https://www.cbr-xml-daily.ru/archive/${currD}/daily_json.js`).then((resp) =>
          resp.json().then((result) => addItem(result)),
        );
      }
    }
  }, []);

  return (
    <div>
      {active && (
        <Button
          variant="contained"
          disableElevation
          style={{ position: 'absolute', top: '10px', left: '265px' }}
          onClick={() => setActive(false)}>
          Вернуться назад
        </Button>
      )}
      <TableContainer
        component={Paper}
        style={{ width: '1000px', marginLeft: 'auto', marginRight: 'auto' }}>
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          style={{ border: '1px solid black' }}>
          <TableHead>
            <TableRow>
              <StyledTableCell>Код валюты</StyledTableCell>
              <StyledTableCell>Значение в рублях</StyledTableCell>
              <StyledTableCell align="right">
                Разница в процентах в сравнении с предыдущим днем
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {active
              ? currS &&
                currS.map((item, index) => {
                  const obj = item.Valute;

                  return (
                    <Tooltip title={val} key={index} placement="bottom-end" followCursor>
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">
                          {obj[val].NumCode}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {item.Valute[val].Value}
                        </StyledTableCell>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          style={{ paddingLeft: '250px' }}>
                          {`${
                            Math.ceil(
                              ((item.Valute[val].Value - item.Valute[val].Previous) /
                                item.Valute[val].Previous) *
                                100 *
                                100,
                            ) / 100
                          } %`}
                        </StyledTableCell>
                      </StyledTableRow>
                    </Tooltip>
                  );
                })
              : currVal &&
                currVal.map((item, index) => {
                  return (
                    <Tooltip title={item[0]} key={index} placement="bottom-end" followCursor>
                      <StyledTableRow key={index} onClick={() => handleElem(item[0])}>
                        <StyledTableCell component="th" scope="row">
                          {item[1].NumCode}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {item[1].Value}
                        </StyledTableCell>
                        <StyledTableCell
                          component="th"
                          scope="row"
                          style={{ paddingLeft: '250px' }}>
                          {`${
                            Math.ceil(
                              ((item[1].Value - item[1].Previous) / item[1].Previous) * 100 * 100,
                            ) / 100
                          } %`}
                        </StyledTableCell>
                      </StyledTableRow>
                    </Tooltip>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
