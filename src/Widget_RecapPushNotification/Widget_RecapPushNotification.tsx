import { ChartArea } from "lucide-react";
import { PushNotificationPhone } from "../components/PushNotificationPhone";

export const Widget_RecapPushNotification: React.FC = () => {
    return (
        <PushNotificationPhone
            icon={ChartArea}
            iconColor="#4CC74A"
            title="Your weekly recap is here!"
        />
    );
};

