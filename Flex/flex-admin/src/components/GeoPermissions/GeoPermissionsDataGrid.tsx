import React from "react";
import { DataGrid, DataGridHead, DataGridRow, DataGridHeader, DataGridBody, DataGridCell } from "@twilio-paste/data-grid";
import { tableHeaders2 } from "./constants";
import type { TableDataRow2 } from "./types";
import { SkeletonLoader } from "@twilio-paste/core";

export const GeoPermissionsDataGrid: React.FC<{ tableData2: TableDataRow2[], tableDataOrigin: TableDataRow2[]
  , CheckboxCell: any, allChecked: any, allChecked2: any, indeterminate: any, indeterminate2: any
  , checkedItems: any, checkedItems2: any, setCheckedItems: any, setCheckedItems2: any }> 
  = ({ tableData2, tableDataOrigin, CheckboxCell, allChecked, allChecked2, indeterminate, indeterminate2
    , checkedItems, checkedItems2, setCheckedItems, setCheckedItems2 }) => 
  {
  return (
  <DataGrid aria-label="Voice Geographic Permissions">
    <DataGridHead stickyHeader>
      <DataGridRow>
        {tableHeaders2.map((header) => (
          <DataGridHeader key={header}>{header}</DataGridHeader>
        ))}
          <DataGridHeader width="300px">
            <CheckboxCell 
              onClick={(checked: boolean) => {
                const newCheckedItems = checkedItems.map(() => checked);
                setCheckedItems(newCheckedItems);
              }}
              id={"select-all"}
              checked={allChecked}
              indeterminate={indeterminate}
              label="Select all"
              text="LOW-RISK"
            />
          </DataGridHeader>
          <DataGridHeader width="300px">
            <CheckboxCell 
              onClick={(checked: boolean) => {
                const newCheckedItems = checkedItems2.map(() => checked);
                setCheckedItems2(newCheckedItems);
              }}
              id={"select-all-high-risk"}
              checked={allChecked2}
              indeterminate={indeterminate2}
              label="Select all high risk"
              text="HIGH-RISK"
            />
          </DataGridHeader>          
      </DataGridRow>
    </DataGridHead>
    <DataGridBody>
      {tableData2.map(
        ({ isoCode, name, countryCodes, lowRiskNumbersEnabled }, rows, arr) => (
          <DataGridRow key={isoCode} selected={checkedItems[rows] || checkedItems2[rows] }>
            <DataGridCell>{name}</DataGridCell>
            <DataGridCell>{isoCode}</DataGridCell>
            <DataGridCell>{countryCodes ? '(+ ' + countryCodes.toString() + ')': '**'}</DataGridCell>
            <DataGridCell>
                <CheckboxCell
                  onClick={(checked: boolean) => {
                    const newCheckedItems = [...checkedItems];
                    newCheckedItems[tableDataOrigin.findIndex(x => x.name === name)] = checked;
                    setCheckedItems(newCheckedItems);
                  }}
                  id={`row-${rows}-checkbox-low-risk`}
                  checked={checkedItems[tableDataOrigin.findIndex(x => x.name === name)]}
                  label={`Select row lowrisk ${rows}`}
                />
            </DataGridCell>
            <DataGridCell>
                <CheckboxCell
                  onClick={(checked: boolean) => {
                    const newCheckedItems = [...checkedItems2];
                    newCheckedItems[tableDataOrigin.findIndex(x => x.name === name)] = checked;
                    setCheckedItems2(newCheckedItems);
                  }}
                  id={`row-${rows}-checkbox-high-risk`}
                  checked={checkedItems2[tableDataOrigin.findIndex(x => x.name === name)]}
                  label={`Select row high risk ${rows}`}
                />
            </DataGridCell>            
          </DataGridRow>
        )
      )}
    </DataGridBody>
  </DataGrid>
)};

