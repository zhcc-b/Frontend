import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Autocomplete, FormControl, FormHelperText, InputLabel, Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import useUserInput from "src/hooks/use-user-input";
import sendHttpRequest from "../../utils/send-http-request";

const sport_type = ['Badminton', 'Basketball', 'Football', 'Tennis', 'Volleyball'];

export const SearchBar = (props) => {
  const [formData, setFormValue, handleInputChange, handleDateChange, handleEditorChange, handleAutocompleteChange] = useUserInput({
    keywords: '',
    sports: null,
    levels: '',
    age_groups: '',
    start_time: null,
    end_time: null
  });

  function handleClick() {
    const params = new URLSearchParams(formData).toString();
    sendHttpRequest( `http://localhost:3000/search?${params}`, 'GET').then(response => {
      props.onResponse(response);
    })
  }

  return (
    <Card>
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        gap={3}
        sx={{ p: 3 }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <TextField
            value={formData.keywords}
            fullWidth
            label="Search"
            name="keywords"
            placeholder="Title, description or content"
            onChange={handleInputChange}
          />
        </Box>
        <Button
          size="large"
          startIcon={
            <SvgIcon>
              <SearchMdIcon />
            </SvgIcon>
          }
          variant="contained"
          onClick={handleClick}
        >
          Search
        </Button>
      </Stack>
      <Stack
        alignItems="center"
        direction="row"
        flexWrap="wrap"
        gap={3}
        sx={{ p: 3, pt: 0}}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Autocomplete
            id="sport-type-select"
            name={'sports'}
            value={formData.sports}
            options={sport_type}
            // isOptionEqualToValue={(option, value) => option === value || value === ""}
            onChange={(event, value) => {
              handleAutocompleteChange('sports', value);
            }}
            renderInput={(params) =>
              <TextField
                {...params}
                id={'sport-type-select-option'}
                label="Sport"
                // error={formError.sport_data.error}
                // helperText={formError.sport_data.message}
                variant={'outlined'}
              />
            }
          />
        </Box>
        <div>
          <DateTimePicker
            label="From"
            name='start_time'
            value={formData.start_time}
            onChange={(newValue) => {
              handleDateChange('start_time', newValue);
            }}
          />
        </div>
        <div>
          <DateTimePicker
            label="To"
            name='end_time'
            value={formData.end_time}
            onChange={(newValue) => {
              handleDateChange('end_time', newValue);
            }}
          />
        </div>

        <Box sx={{ flexGrow: 1 }}>
          <FormControl
            fullWidth
          >
            <InputLabel id="levels-select-label">Skill Level</InputLabel>
            <Select
              labelId="levels-select-label"
              id="levels-select"
              label=" Skill Level "
              name={'levels'}
              value={formData.levels}
              // error={formError.level.error}
              onChange={handleInputChange}
            >
              <MenuItem value={'B'}>Beginner</MenuItem>
              <MenuItem value={'I'}>Intermediate</MenuItem>
              <MenuItem value={'A'}>Advanced</MenuItem>
              <MenuItem value={'P'}>Professional</MenuItem>
            </Select>
            {/*{formError.level.error && (*/}
            {/*  <FormHelperText error>*/}
            {/*    {formError.level.message}*/}
            {/*  </FormHelperText>*/}
            {/*)}*/}
          </FormControl>
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <FormControl
            fullWidth
          >
            <InputLabel id="age-group-select-label">Age Group</InputLabel>
            <Select
              labelId="age-group-select-label"
              id="age-group-select"
              label=" Age Group "
              name={'age_groups'}
              value={formData.age_groups}
              // error={formError.age_group.error}
              onChange={handleInputChange}
            >
              <MenuItem value={'C'}>Children</MenuItem>
              <MenuItem value={'T'}>Teenagers</MenuItem>
              <MenuItem value={'A'}>Adults</MenuItem>
              <MenuItem value={'S'}>Seniors</MenuItem>
            </Select>
            {/*{formError.age_group.error && (*/}
            {/*  <FormHelperText error>*/}
            {/*    {formError.age_group.message}*/}
            {/*  </FormHelperText>*/}
            {/*)}*/}
          </FormControl>
        </Box>
      </Stack>
    </Card>
  );
};
