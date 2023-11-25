import { useState, useEffect } from 'react';
import { Theme } from '@twilio-paste/core/theme';
import { AxiosResponse } from 'axios';
import { Heading, Box, Alert, Flex, Text, Spinner, Modal, ModalBody, Tabs, TabList, Tab, TabPanels, TabPanel, useTabState } from '@twilio-paste/core';
import GeneralConfig from './DowntimeManagerView/GeneralConfig';
import WeeklyConfig from './DowntimeManagerView/WeeklyConfig';
import EmergencyConfig from './DowntimeManagerView/EmergencyConfig';
import HolidayConfig from './DowntimeManagerView/HolidayConfig';
import PartialDayConfig from './DowntimeManagerView/PartialDayConfig';
import {
    loadQueues,
    loadRemoteConfigCountry,
    saveRemoteConfigCountry,
} from '../helpers';
import './DowntimeManagerView/index.css';
import { ApiService, DowntimeManagerConfig } from '../Types';

type Props = {}

const DowntimeManagerView = (props : Props) => {
    const { REACT_APP_TEAM_SCHEDULE_MUTEX_SYNC_UNIQUE_NAME: mutexUniqueName } = process.env;


    const [isReadOnly, setIsReadOnly] = useState(false);

    const [teamScheduleConfig, setTeamScheduleConfig] = useState<DowntimeManagerConfig | any>({});

    const [showInProgress,setShowInProgress] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [showErrorMessage,setShowErrorMessage] = useState(false);
    const [displayMessage, setDisplayMessage] = useState<boolean | string>(false);

    const [queues, setQueues] = useState<Array<any>>([])
    const [country, setCountry] = useState<ApiService.CountryResponse  | any>();

    
    const tab = useTabState();

    // Load queues
    const loadQueuesIntoArray = async () => {
        let loadedQueues = await loadQueues();   
        
        setQueues(loadedQueues);
    }

    useEffect(() => {
        loadCountryData()
        loadQueuesIntoArray()
    }, [])

    const loadCountryData = async () => {
        setShowInProgress(true);
        loadRemoteConfigCountry().then((country: ApiService.CountryResponse) => {
            setCountry(country)
            setShowInProgress(false)
        })
    }

    useEffect(() => {
        //loadExistingData(tab.currentId ? tab.currentId : '')
    }, [tab])

    useEffect(() => {

    },[teamScheduleConfig])

    const handleSaveCountryAttribute = async (values : any) : Promise<AxiosResponse<any, any>> => {
        return saveRemoteConfigCountry(country, values).then((res) => {
            setCountry(res.data.data);
            return res
        });
    }

    const handleSaveHolidays = async () => {

    }
    const handleSavePartialDays = async () => {

    }

    const clearAlerts = ()=>{
        setShowSuccessMessage(false);
        setShowErrorMessage(false);
        setDisplayMessage("");
    }

    return (
        <Theme.Provider theme="flex">
      
        {showSuccessMessage &&
            <Alert onDismiss={clearAlerts} variant="neutral">
                <Text as="span">
                    {displayMessage}
                </Text>
            </Alert>
        }
        {showErrorMessage &&
            <Alert onDismiss={clearAlerts} variant="error">
                <Text as="span">
                    {displayMessage}
                </Text>
            </Alert>
        }
        
        <Box as="article" backgroundColor="colorBackgroundBody" padding="space60" overflow="auto">
            <Flex hAlignContent="between">
                <Heading as="h1" variant="heading10">
                    Downtime Manager
                </Heading>
            </Flex>

            <Tabs baseId='downtime-manager-tabs'>
                <TabList aria-label="My tabs">
                    <Tab>Hours of Operation</Tab>
                    <Tab>Emergency Downtime</Tab>

                    <Tab>Holidays</Tab>
                    <Tab>Partial Days</Tab>
                    <Tab>General Settings</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <WeeklyConfig
                            queues={queues}
                            isReadOnly={isReadOnly}
                        />
                    </TabPanel>
                    <TabPanel>
                        <EmergencyConfig
                            country={country}
                            saveHandler={handleSaveCountryAttribute}
                        />
                    </TabPanel>
                    <TabPanel>
                        <HolidayConfig />
                    </TabPanel>
                    <TabPanel>
                        <PartialDayConfig
                            queues={queues}    
                        />
                    </TabPanel>
                    <TabPanel>
                        <GeneralConfig
                            country={country}
                            saveHandler={handleSaveCountryAttribute}
                        />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
     
        <Modal isOpen={showInProgress} onDismiss={()=>{}} size="default" ariaLabelledby="loader-modal" >       
            <ModalBody>       
                <Flex hAlignContent="center" vAlignContent="center" minHeight={170}>
                    <Spinner decorative={false}   size="sizeIcon110" title="Loading" />
                </Flex>
            </ModalBody>
        </Modal>
     
    </Theme.Provider>
  );
}

export default DowntimeManagerView;