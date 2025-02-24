import React from "react";
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";

interface CountryPickerWrapperProps {
  countryCode?: CountryCode;
  withFlag?: boolean;
  withCallingCode?: boolean;
  withFilter?: boolean;
  withEmoji?: boolean;
  onSelect: (country: Country) => void;
  containerButtonStyle?: object;
}

const CountryPickerWrapper: React.FC<CountryPickerWrapperProps> = ({
  countryCode = "US",
  withFlag = true,
  withCallingCode = true,
  withFilter = true,
  withEmoji = true,
  onSelect,
  containerButtonStyle = { alignItems: "center", justifyContent: "center" },
}) => {
  return (
    <CountryPicker
      countryCode={countryCode}
      withFlag={withFlag}
      withCallingCode={withCallingCode}
      withFilter={withFilter}
      withEmoji={withEmoji}
      onSelect={onSelect}
      containerButtonStyle={containerButtonStyle}
    />
  );
};

export default CountryPickerWrapper;
