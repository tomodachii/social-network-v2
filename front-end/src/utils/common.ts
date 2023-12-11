import toString from "lodash/toString";

import { MAX_LENGTH_NUMERIC_INPUT, REGEX_NUMBER_DEFAULT } from "@/constants/common";

export const getNumericValue = (input: string) => {
  return input.replace(/\D/g, "");
};

export const allowNumbersOnly = (
  event: any,
  maxLengthParam = MAX_LENGTH_NUMERIC_INPUT,
  regexInput = REGEX_NUMBER_DEFAULT
) => {
  const regex = new RegExp(regexInput);
  const key = String.fromCharCode(event.charCode ? event.which : event.charCode);
  if (!regex.test(key) || getNumericValue(toString(event.target.value)).length > maxLengthParam - 1) {
    event.preventDefault();
    return false;
  }
};

export const allowNumbersOnlyOnPaste = (
  event: any,
  maxLengthParam = MAX_LENGTH_NUMERIC_INPUT,
  regexInput = REGEX_NUMBER_DEFAULT
) => {
  const clipBoardText = event.clipboardData.getData("text");

  const regex = new RegExp(regexInput);
  if (
    !regex.test(clipBoardText) ||
    getNumericValue(toString(clipBoardText)).length + getNumericValue(toString(event.target.value)).length >
      maxLengthParam
  ) {
    event.preventDefault();
    return false;
  }
};
