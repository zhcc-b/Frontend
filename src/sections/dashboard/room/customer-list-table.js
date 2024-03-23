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
    events = [],
  } = props;

  const eventToShow = [];
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

  const handlePromotionClick = (roomId) => {
    window.location.href = `http://localhost:3000/pricing?roomId=${roomId}`;
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Current Players</TableCell>
              <TableCell>Max Players</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>End Time</TableCell>
              <TableCell>Promotion</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventToShow.map((event) => (
              <TableRow hover 
              key={event.roomId}>
                <TableCell key={`title-${event.roomId}`}>{event.title}</TableCell>
                <TableCell key={`category-${event.roomId}`}>{event.category}</TableCell>
                <TableCell key={`currentPlayer-${event.roomId}`}>{event.currentPlayer}</TableCell>
                <TableCell key={`maxPlayer-${event.roomId}`}>{event.maxPlayer}</TableCell>
                <TableCell key={`startTime-${event.roomId}`}>{event.startTime}</TableCell>
                <TableCell key={`endTime-${event.roomId}`}>{event.endTime}</TableCell>
                <TableCell key={`promotion-${event.roomId}`}>
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
  events: PropTypes.array,
};
