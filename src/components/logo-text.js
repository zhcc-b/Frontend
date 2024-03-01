import { useTheme } from '@mui/material/styles';

export const LogoText = () => {
  const theme = useTheme();
  const fillColor = theme.palette.primary.main;
  return (
    <svg
      fill="none"
      height="100%"
      width="70%"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="30"
        y="20"
        fontFamily="'Comic Sans MS', sans-serif"
        fontStyle="italic"
        fontSize="20"
        fill={fillColor}
        textAnchor="end"
      >
        PlayPal
      </text>
    </svg>
  );
};
