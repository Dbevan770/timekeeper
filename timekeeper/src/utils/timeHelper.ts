export const handleHourChange = (
  value: string,
  setter: React.Dispatch<React.SetStateAction<string>>,
  error: React.Dispatch<React.SetStateAction<boolean>>
) => {
  error(false);
  const intValue = parseInt(value);

  if (isNaN(intValue)) {
    setter("");
    return;
  } else if (intValue > 12 || intValue < 0 || value.length > 2) {
    return;
  } else {
    if (value.length === 2 && value[1] === "0" && value[0] !== "1") {
      setter(value.slice(1));
    } else {
      setter(value);
    }
    return;
  }
};

export const handleMinuteChange = (
  value: string,
  setter: React.Dispatch<React.SetStateAction<string>>
) => {
  const intValue = parseInt(value);
  if (isNaN(intValue)) {
    setter("");
    return;
  } else if (intValue > 59 || intValue < 0 || value.length > 2) {
    return;
  } else {
    setter(value);
    return;
  }
};
