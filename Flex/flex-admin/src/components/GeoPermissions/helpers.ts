import type { RiskTypes } from "./types";

export const filterBySearchString2 = (
  isoCode: string,
  name: string,
  countryCodes: string[],
  searchValue: string
): boolean => {
  const lowerCaseName = name.toLocaleLowerCase();
  const lowerCaseIsoCode = isoCode.toLocaleLowerCase();
  const lowerCaseCountryCodes = countryCodes.map(e => e.toLocaleLowerCase());

  return (
    lowerCaseName.includes(searchValue.toLocaleLowerCase()) || lowerCaseIsoCode.includes(searchValue.toLocaleLowerCase()) 
    || lowerCaseCountryCodes.includes(searchValue.replace(/\D+/g, '').toLocaleLowerCase())
  );
};

export const filterByRoomType = (roomType: RiskTypes, filterValue: RiskTypes): boolean => {
  if (filterValue === "All") return true;
  return roomType === filterValue;
};