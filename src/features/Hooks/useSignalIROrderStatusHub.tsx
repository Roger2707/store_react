import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";

export const useSignalIROrderStatusHub = (clientSecret: string) => {
    const [connection, setConnection] = useState<HubConnection | null>(null);

    useEffect(() => {
        const connect = async () => {
            const conn = new HubConnectionBuilder()
                .withUrl("http://localhost:5110/orderStatusHub") 
                .withAutomaticReconnect()
                .build();

            conn.on('OrderCreated', (orderUpdateMessage) => {
                console.log('Order Message:', orderUpdateMessage);
            });

            try {
                await conn.start();
                await conn.invoke("JoinGroup", clientSecret); 
                setConnection(conn);
            } catch (err) {
                console.error("SignalR connection failed", err);
            }
        };

        connect();

        // Clean up
        return () => {
            if (connection) {
                connection.stop();
            }
        };

    // eslint-disable-next-line
    }, []);

    return connection;
}