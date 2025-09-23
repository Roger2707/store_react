import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { icons } from "../../app/utils/helper";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/store/configureStore";
import { setActivePaymentUI, setOrderStatus } from "../../app/store/orderSlice";
import { PaymentProcessingResponse } from "../../app/models/Payment";

export const useSignalIROrderStatusHub = (token: string | null) => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!token) return;

        let conn: HubConnection;
        const connect = async () => {
            conn = new HubConnectionBuilder()
                .withUrl("http://localhost:5110/notificationsHub", {
                    accessTokenFactory: () => token,
                })
                .withAutomaticReconnect()
                .build();

            conn.on('OrderUpdateStatus', (orderUpdateMessage) => {
                const { orderId, orderStatus } = orderUpdateMessage
                const orderStatusName = getStatusName(orderStatus);
                toast.success(`Your Order: #${orderId} has been: ${orderStatusName}`, { icon: icons.success });
                dispatch(setOrderStatus({orderId, orderStatusName}));
            });

            conn.on('PaymentProcessingUpdate', (paymentProcessing: PaymentProcessingResponse) => {
                const { requestId, clientSecret, message, status } = paymentProcessing;
                console.log(status);
                switch (status) {
                    case 0:
                        toast.info(`Your Payment: #${requestId} has been created! Please waiting for processing...`);
                        break;
                    case 1:
                        toast.success(`Your Payment: #${requestId} has been completed`, { icon: icons.success });
                        dispatch(setActivePaymentUI(false));
                        navigate(`/checkout/${clientSecret}`);
                        break;
                    case 2:
                        toast.error(`${message}`, { icon: icons.error });
                        dispatch(setActivePaymentUI(false));
                        break;
                }
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
    }, [token, dispatch, navigate]);

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