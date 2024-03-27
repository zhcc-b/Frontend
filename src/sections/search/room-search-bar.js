import SearchMdIcon from '@untitled-ui/icons-react/build/esm/SearchMd';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Autocomplete, FormControl, InputLabel, Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import useUserInput from "src/hooks/use-user-input";
import { useRouter } from "next/router";
import { useEffect } from "react";

const sport_type = ['Badminton', 'Basketball', 'Football', 'Tennis', 'Volleyball'];

export const SearchBar = ({defaultQuery}) => {

  const router = useRouter();

  const [formData, setFormValue, handleInputChange, handleDateChange, handleEditorChange, handleAutocompleteChange] = useUserInput({
    keywords: '',
    sports: null,
    levels: '',
    age_groups: '',
    start_time: null,
    end_time: null
  });

  useEffect(() => {
    setFormValue({
      keywords: defaultQuery.keywords || '',
      sports: defaultQuery.sports || null,
      levels: defaultQuery.levels || '',
      age_groups: defaultQuery.age_groups || '',
      start_time: defaultQuery.start_time ? new Date(defaultQuery.start_time) : null,
      end_time: defaultQuery.end_time ? new Date(defaultQuery.end_time) : null
    });
  }, [defaultQuery, setFormValue]);

  function handleClick() {
    const cleanedFormData = Object.fromEntries(
      Object.entries(formData).filter(([key, value]) => value !== null && value !== '')
    );

    if (cleanedFormData.start_time) {
      cleanedFormData.start_time = cleanedFormData.start_time.toISOString();
    }
    if (cleanedFormData.end_time) {
      cleanedFormData.end_time = cleanedFormData.end_time.toISOString();
    }

    const params = new URLSearchParams(cleanedFormData).toString();
    if (params) {
      router.push(`/search?${params}`);
    }
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleClick();
              }
            }}
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
            onChange={(event, value) => {
              handleAutocompleteChange('sports', value);
            }}
            renderInput={(params) =>
              <TextField
                {...params}
                id={'sport-type-select-option'}
                label="Sport"
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
              onChange={handleInputChange}
            >
              <MenuItem value={'B'}>Beginner</MenuItem>
              <MenuItem value={'I'}>Intermediate</MenuItem>
              <MenuItem value={'A'}>Advanced</MenuItem>
              <MenuItem value={'P'}>Professional</MenuItem>
            </Select>
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
              onChange={handleInputChange}
            >
              <MenuItem value={'C'}>Children</MenuItem>
              <MenuItem value={'T'}>Teenagers</MenuItem>
              <MenuItem value={'A'}>Adults</MenuItem>
              <MenuItem value={'S'}>Seniors</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Stack>
    </Card>
  );
};
