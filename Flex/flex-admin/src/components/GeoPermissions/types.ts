export type RiskTypes = "All" | "Low and High Risk Numbers" | "Low Risk Number" | "High Risk Numbers";

export interface FilterGroupProps {
  children?: never;
  defaultRoomType?: RiskTypes;
}

export interface TableDataRow2 {
  isoCode: string;
  name: string;
  continent: string;
  countryCodes: string[];
  lowRiskNumbersEnabled: boolean;
  highRiskSpecialNumbersEnabled: boolean;
  highRiskTollfraudNumbersEnabled: boolean;
  url: string;
  links: Link;
}

export interface Link {
  highrisk_special_prefixes: string;
}