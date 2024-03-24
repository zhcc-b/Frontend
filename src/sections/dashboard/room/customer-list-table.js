import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import { Scrollbar } from 'src/components/scrollbar';

export const CustomerListTable = (props) => {
  const {
    onPageChange = () => {},
    onRowsPerPageChange,
    page = 0,
    rowsPerPage = 5,
    events =[],
  } = props;
console.log(events)
  // Process events into eventToShow
  const eventToShow = [];
  // const sport123 = {name:"I'm name"};
  // const contend = {"id":1,"sport":sport123,"title": "I'm title" ,"players":["1","2","3"],"max_players":5,"start_time":"I'mstart time","end_time":"I'm endtime"}
  // const events = [contend, contend, contend];
  for (let i = 0; i < events.length; i++) {
    eventToShow.push({
      roomId: events[i].id,
      category: events[i].sport.name,
      title: events[i].title,
      currentPlayer: events[i].players.length,
      maxPlayer: events[i].max_players,
      startTime: events[i].start_time,
      endTime: events[i].end_time,
    });
  }
  console.log(eventToShow)
  const handlePromotionClick = (roomId) => {
    // Navigate to the URL with the Room ID
    window.location.href = `http://localhost:3000/pricing?roomId=${roomId}`;
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell> {/* Swapped with Category */}
              <TableCell>Category</TableCell> {/* Swapped with Title */}
              <TableCell>Current Players</TableCell>
              <TableCell>Max Players</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Promotion</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventToShow.map((event) => (
              <TableRow hover key={event.roomId}>
                <TableCell>{event.title}</TableCell> 
                <TableCell>{event.category}</TableCell> 
                <TableCell>{event.currentPlayer}</TableCell>
                <TableCell>{event.maxPlayer}</TableCell>
                <TableCell>{event.startTime}</TableCell>
                <TableCell>{event.endTime}</TableCell>
                <TableCell>
                  <Button 
                    color="primary" 
                    onClick={() => handlePromotionClick(event.roomId)}
                  >
                    Promotion
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={eventToShow.length}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Box>
  );
};

CustomerListTable.propTypes = {
  // ... other prop types ...
};
