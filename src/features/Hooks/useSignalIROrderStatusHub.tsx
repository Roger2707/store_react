import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { icons } from "../../app/utils/helper";

export const useSignalIROrderStatusHub = (token: string | null) => {
    const [connection, setConnection] = useState<HubConnection | null>(null);

    useEffect(() => {
        if (!token) return;

        const connect = async () => {
            const conn = new HubConnectionBuilder()
                .withUrl("http://localhost:5110/ordersHub", {
                    accessTokenFactory: () => token,
                })
                .withAutomaticReconnect()
                .build();

            conn.on('OrderUpdateStatus', (orderUpdateMessage) => {
                const {orderId, orderStatus, notification} = orderUpdateMessage
                toast.success(`Your Order: #${orderId} has been: ${getStatusName(orderStatus)}`, { icon: icons.success });
            });

            try {
                   conn
                    .start()
                    .then(() => console.log("✅ SignalR connected"))
                    .catch((err) => console.error("❌ SignalR error", err));

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

    }, [token]);

    return connection;
}


const getStatusName = (status: number | string) => {
  switch (+status) {
    case 0: return "Created";
    case 1: return "Prepare";
    case 2: return "Shipping";
    case 3: return "Shipped";
    case 4: return "Completed";
    default: return `Status: ${status}`;
  }
};