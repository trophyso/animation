import { RefreshCcw } from "lucide-react";
import { PushNotificationPhone } from "../components/PushNotificationPhone";

export const Widget_ReactivationPushNotification: React.FC = () => {
    return (
        <PushNotificationPhone
            icon={RefreshCcw}
            iconColor="#4CC74A"
            showStackedNotifications={true}
            title="We miss you!"
        />
    );
};

