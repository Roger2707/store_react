import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";

export const useSignalIROrderStatusHub = () => {
    const [connection, setConnection] = useState<HubConnection | null>(null);

    useEffect(() => {
        const connect = async () => {
            const conn = new HubConnectionBuilder()
                .withUrl('/orderStatusHub')  
                .build();

            conn.on('ReceiveOrderUpdate', (orderUpdateMessage) => {
                // Xử lý thông báo nhận được từ server (cập nhật trạng thái đơn hàng)
                console.log('Order Update:', orderUpdateMessage);
            });

            try {
                await conn.start();
                console.log("SignalR connection established");
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
    }, [connection]);

    return connection;
}