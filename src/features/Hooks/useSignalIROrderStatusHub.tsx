import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { icons } from "../../app/utils/helper";

export const useSignalIROrderStatusHub = (token: string | null) => {
    const [connection, setConnection] = useState<HubConnection | null>(null);

    useEffect(() => {        
        if (!token) return;

        let conn: HubConnection;

        const connect = async () => {
            conn = new HubConnectionBuilder()
                .withUrl("http://localhost:5110/ordersHub", {
                    accessTokenFactory: () => token,
                })
                .withAutomaticReconnect()
                .build();

            conn.on('OrderUpdateStatus', (orderUpdateMessage) => {
                const {orderId, orderStatus} = orderUpdateMessage
                console.log(orderUpdateMessage);        
                toast.success(`Your Order: #${orderId} has been: ${getStatusName(orderStatus)}`, { icon: icons.success });
            });

            conn.onreconnecting(() => {
                console.warn("🔄 SignalR reconnecting...");
            });

            conn.onreconnected(() => {
                console.log("✅ SignalR reconnected");
            });

            conn.onclose((error) => {
                console.error("❌ SignalR closed", error);
            });

            try {
                await conn.start();
                console.log("✅ SignalR initial connection");
                setConnection(conn);
            } catch (err) {
                console.error("❌ Initial SignalR connection failed", err);
            }
        };

        connect();

        // Clean up
        return () => {
            if (conn) {
                conn.stop();
            }
        };

    // eslint-disable-next-line
    // add this line to avoid dependency connection- if give connection in this - useEffect loop infinity 
    }, [token]);

    return connection;
}


export const getStatusName = (status: number | string) => {
  switch (+status) {
    case 0: return "Created";
    case 1: return "Prepare";
    case 2: return "Shipping";
    case 3: return "Shipped";
    case 4: return "Completed";
    default: return `Status: ${status}`;
  }
};