import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";

export const useSignalIROrderStatusHub = () => {
    const [connection, setConnection] = useState<HubConnection | null>(null);

    useEffect(() => {
        const connect = async () => {
            const conn = new HubConnectionBuilder()
                .withUrl("http://localhost:5110/orderStatusHub") 
                .withAutomaticReconnect()
                .build();

            conn.on('ReceiveOrderUpdate', (orderUpdateMessage) => {
                console.log('Order Update:', orderUpdateMessage);
            });

            try {
                await conn.start();
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