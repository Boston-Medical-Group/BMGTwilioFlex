import * as React from "react";
import * as Flex from '@twilio/flex-ui';
import { useUID } from "@twilio-paste/uid-library";
import { Button } from "@twilio-paste/button";
import { Input } from "@twilio-paste/input";
import { Label } from "@twilio-paste/label";
import { Select, Option } from "@twilio-paste/select";
import { Separator } from "@twilio-paste/separator";
import { FilterIcon } from "@twilio-paste/icons/esm/FilterIcon";
import { SearchIcon } from "@twilio-paste/icons/esm/SearchIcon";
import { riskTypes } from "./constants";
import type { FilterGroupProps, RiskTypes, TableDataRow2 } from "./types";
import { filterByRoomType, filterBySearchString2 } from "./helpers";
import { GeoPermissionsDataGrid } from "./GeoPermissionsDataGrid";
import { EmptyState } from "./EmptyState";
import { AlertDialog, Box, Checkbox, ScreenReaderOnly, Spinner, Stack, Toaster, useToaster } from "@twilio-paste/core";
import _ from 'lodash';
import useApi from "./useApi";
import { Flex as FlexBox } from "@twilio-paste/core";

export const DefaultFilterGroup: React.FC<FilterGroupProps> = ({ defaultRoomType }) => {
  const initialized = React.useRef(false);
  const [isLoaded, setIsLoaded] = React.useState < boolean > (false)
  const riskTypesId = `type-${useUID()}`;
  const [tableData2, setTableData2] = React.useState<TableDataRow2[]>([]);
  const [filteredTableData2, setFilteredTableData2] = React.useState(tableData2);  
  const [searchValue, setSearchValue] = React.useState("");
  const [filterRoomType, setFilterRoomType] = React.useState(defaultRoomType || "All");
  const [areButtonsDisabled, setAreButtonsDisabled] = React.useState(!(defaultRoomType));
  const handleApplyFilters2 = (): void => {
    const filtered = tableData2.filter(
      ({ isoCode, name, countryCodes, lowRiskNumbersEnabled, highRiskSpecialNumbersEnabled }, rows) => {
        const _lowRiskNumbersEnabled = checkedItems[rows];
        const _highRiskSpecialNumbersEnabled = checkedItems2[rows];
        const roomType = filterRoomType === 'Low and High Risk Numbers' && (lowRiskNumbersEnabled || _lowRiskNumbersEnabled || highRiskSpecialNumbersEnabled || _highRiskSpecialNumbersEnabled) ? 'Low and High Risk Numbers' 
        : filterRoomType === 'Low Risk Number' && (lowRiskNumbersEnabled || _lowRiskNumbersEnabled) ? 'Low Risk Number' 
        : filterRoomType === 'High Risk Numbers' && (highRiskSpecialNumbersEnabled || _highRiskSpecialNumbersEnabled) ? 'High Risk Numbers' 
        : '*';
        return (
          filterBySearchString2(isoCode, name, countryCodes, searchValue) &&
          filterByRoomType(roomType as RiskTypes, filterRoomType)
        );
      }
    );
    setFilteredTableData2(filtered);
  };

  const handleClearAll = (): void => {
    setFilterRoomType("All");
    setSearchValue("");
    setFilteredTableData2(tableData2);
    setAreButtonsDisabled(true);
  };

  const handleCancel = (): void => {
    setFilterRoomType("All");
    setSearchValue("");
    setFilteredTableData2(tableData2);
    setCheckedItems(tableData2.map(( {lowRiskNumbersEnabled} ) => lowRiskNumbersEnabled));
    setCheckedItems2(tableData2.map(( {highRiskSpecialNumbersEnabled} ) => highRiskSpecialNumbersEnabled));
    setAreButtonsDisabled(true);
  };

  React.useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
    }
    handleApplyFilters2();
  }, [searchValue])

  React.useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
    }
    setAreButtonsDisabled(
      filterRoomType === "All"
    );
  }, [setAreButtonsDisabled, filterRoomType]);

  ////////////////////////////////////////////////////////////////////////////////////////////

  interface CheckboxCellProps {
    onClick: (checked: boolean) => void;
    id: string;
    checked: boolean;
    label: string;
    indeterminate?: boolean;
    text?: string;
  }

  const CheckboxCell: React.FC<CheckboxCellProps> = ({
    onClick,
    id,
    indeterminate,
    checked,
    label,
    text
  }) => {
    const checkboxRef = React.createRef<HTMLInputElement>();

    const handleClick = React.useCallback(() => {
      if (checkboxRef.current == null) {
        return;
      }
      return onClick(!checkboxRef.current.checked);
    }, [onClick, checkboxRef]);
    const handleKeyDown = React.useCallback(
      (event) => {
        if (checkboxRef.current == null) {
          return;
        }
        if (event.keyCode === 32 || event.keyCode === 13) {
          return onClick(!checkboxRef.current.checked);
        }
      },
      [onClick, checkboxRef]
    );

    return (
      <Box textAlign="center" vertical-align="top">
        {text}
        <Box
          position="absolute"
          top="5"
          left="0"
          right="0"
          bottom="0"
          display="flex"
          justifyContent="center"
          alignItems="center"
          onClick={handleClick}
          cursor="pointer"
        >
          <Box marginLeft="space20">
            <Checkbox
              id={id}
              checked={checked}
              onKeyDown={handleKeyDown}
              ref={checkboxRef}
              indeterminate={indeterminate}
            >
              <ScreenReaderOnly>{label}</ScreenReaderOnly>
            </Checkbox>
          </Box>
        </Box>
      </Box>
    );
  };
  ////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////////////////////
  const [checkedItems, setCheckedItems] = React.useState<boolean[]>([]);

  const [checkedItems2, setCheckedItems2] = React.useState<boolean[]>([]);

  const allChecked = checkedItems.every(Boolean);
  const indeterminate = checkedItems.some(Boolean) && !allChecked;

  const allChecked2 = checkedItems2.every(Boolean);
  const indeterminate2 = checkedItems2.some(Boolean) && !allChecked2;
  ////////////////////////////////////////////////////////////////////////////////////////////////
  
  const manager = Flex.Manager.getInstance();  
  const { loaddialingPermissions, updateDialingPermissions } = useApi({ token: manager.store.getState().flex.session.ssoTokenPayload.token });

  const fetchDialingPermissions = async () => {
    setIsLoaded(true);
    const response = await loaddialingPermissions()
      .then((data)=>{
        if (data && data.content) {
          const _tableDataRow2 = data.content as TableDataRow2[];
          setTableData2(_tableDataRow2);
          setFilteredTableData2(_tableDataRow2);
          setCheckedItems(_tableDataRow2.map(( {lowRiskNumbersEnabled} ) => lowRiskNumbersEnabled));
          setCheckedItems2(_tableDataRow2.map(( {highRiskSpecialNumbersEnabled} ) => highRiskSpecialNumbersEnabled));
        }
      })
      .catch((e) => {
        console.log("Error while fetching data from Function")
      })
      .finally(()=>{
        setIsLoaded(false);
      });
  }
  React.useEffect(() => {
      fetchDialingPermissions();
   }, []);
   

   const UpdateDialingPermissions = async (data: string) => {
    setIsLoaded(true);
    const response = await updateDialingPermissions(data)
      .then(async (data)=>{
        if (data && data.content) {
          if (data.content.updateCount > 0) {
            toaster.push({
              message: `It was successfully saved, \nupdate Count: ${data.content.updateCount} status: ${data.content.updateRequest}`,
              variant: 'success',
              dismissAfter: 4000
            });
            fetchDialingPermissions();
          } else {
            toaster.push({
              message: `There was an error when update`,
              variant: 'error',
              dismissAfter: 4000
            });
            setIsLoaded(false);
          }
        }
      })
      .catch((e) => {
        console.log("Error while updating data from Function")
        setIsLoaded(false);
      });
  }

  const toaster = useToaster();
  const saveDialingPermissions = () => {
    handleClose();
    let storyViews: any[]= [];
    tableData2.forEach(({ isoCode, lowRiskNumbersEnabled, highRiskTollfraudNumbersEnabled }, rows) => {
      if (lowRiskNumbersEnabled != checkedItems[rows] || highRiskTollfraudNumbersEnabled != checkedItems2[rows]) {
        const obj = { iso_code: isoCode, low_risk_numbers_enabled: checkedItems[rows]
          , high_risk_special_numbers_enabled: checkedItems2[rows]
          , high_risk_tollfraud_numbers_enabled: checkedItems2[rows] };
        storyViews.push(obj);
      } 
    });
    if (storyViews.length === 0) {
        toaster.push({
          message: 'There is no data to save',
          variant: 'warning',
          dismissAfter: 4000
        }) 
        handleClearAll();
    } else {
      const data = (JSON.stringify(storyViews));
      UpdateDialingPermissions(data);
    }
  }

  const [isOpen, setIsOpen] = React.useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <Box paddingBottom="space70">
      <Box display="flex" alignItems="flex-end" columnGap="space50">
        <Box>
          <Label htmlFor={riskTypesId}>Risk Number type</Label>
          <Select
            id={riskTypesId}
            name="type"
            onChange={(event) => {
              const a = areButtonsDisabled;
              setFilterRoomType(event.target.value as RiskTypes);
              if (event.target.value as RiskTypes === 'All') {
                handleClearAll();
              }
            }}
            value={filterRoomType}
          >
            {riskTypes.map((type) => (
              <Option value={type} key={type}>
                {type}
              </Option>
            ))}
          </Select>
        </Box>
        <Box display="flex" columnGap="space50" paddingLeft="space40">
          <Button
            variant="primary"
            aria-label="Apply filters"
            disabled={areButtonsDisabled}
            onClick={handleApplyFilters2}
          >
            <FilterIcon decorative />
            Apply
          </Button>
          <Button
            variant="link"
            disabled={areButtonsDisabled}
            onClick={handleClearAll}
          >
            Clear all
          </Button>
        </Box>
      </Box> 
      <Box paddingY="space50">
        <Separator orientation="horizontal" />
      </Box> 
      <Box display="flex" justifyContent="space-between">
        <Box
          width="size40"
          as="form"
          onSubmit={(event: React.SyntheticEvent) => {
            event.preventDefault();
            setIsLoaded(true);
            handleApplyFilters2();
          }}
        >
          <Input
            aria-label="Search"
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(event) => {
              setSearchValue(event.target.value);
            }}
            insertAfter={
              <Button variant="link" onClick={handleApplyFilters2}>
                <SearchIcon decorative={false} title="Search" />
              </Button>
            }
          />
        </Box>
      </Box>
      <Box paddingY="space50">
      </Box>
      <Box width="700px" overflowY="auto" minHeight="200px" boxShadow="shadowBorder" maxHeight="550px" borderStyle="solid">
          {isLoaded ? 
            <FlexBox paddingTop="space190" hAlignContent="center" >
              <Spinner decorative={false} title="Loading" size="sizeIcon80" /> 
            </FlexBox> : ''}
        {filteredTableData2.length > 0 && !isLoaded ? (
          <GeoPermissionsDataGrid tableData2={filteredTableData2} tableDataOrigin= {tableData2}
          CheckboxCell={CheckboxCell} allChecked={allChecked} allChecked2={allChecked2}
          indeterminate={indeterminate} indeterminate2={indeterminate2}
          checkedItems={checkedItems} checkedItems2={checkedItems2}
          setCheckedItems={setCheckedItems} setCheckedItems2={setCheckedItems2}
          />
        ) : (
          !initialized.current || isLoaded ? '' : <EmptyState handleClearAll={handleClearAll} />
        )}
      </Box>   
      <Box paddingY="space50">
        <Stack orientation="horizontal" spacing="space60">
          <Button onClick={handleOpen} variant="primary">Save</Button>
          <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
        </Stack>
      </Box> 
      <div>
        <AlertDialog
          heading=""
          isOpen={isOpen}
          onConfirm={saveDialingPermissions}
          onConfirmLabel="Submit"
          onDismiss={handleClose}
          onDismissLabel="Cancel"
        >
          Are you sure you want to submit?
        </AlertDialog>
      </div>
      <Toaster {...toaster} />
    </Box>
  );
};
