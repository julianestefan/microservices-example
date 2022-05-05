export const eventBusClient = {
    client: {
        publish: jest.fn().mockImplementation((subject: string, data: string, callback: () => void ) =>{
            callback();
        })
    }
}