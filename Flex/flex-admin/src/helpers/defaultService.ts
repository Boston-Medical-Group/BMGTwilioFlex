import * as Flex from '@twilio/flex-ui';

const manager = Flex.Manager.getInstance();

export const loadQueues = async () => {
    let queues : Array<any> = [];
    await manager.insightsClient.liveQuery('tr-queue', '')
        .then(function (args) {
            console.log('Subscribed to live data updates for workers');
            let items = args.getItems();
            Object.entries(items).forEach(([key, value]) => {
                queues.push(value);
            });
        })
        .catch(function (err) {
            console.log('Error when subscribing to live updates', err);
        });
    
    return queues;
}