import MuiTextField, { type TextFieldProps } from "@mui/material/TextField";

type InputProps = TextFieldProps;

export function Input(props: InputProps) {
  const { className, ...rest } = props;

  return (
    <MuiTextField
      className={className}
      variant="outlined"
      fullWidth
      {...rest} // caller can override variant/fullWidth if they pass them
    />
  );
}
