import { Flame } from "lucide-react";
import { PushNotificationPhone } from "../components/PushNotificationPhone";

export const Widget_StreakPushNotification: React.FC = () => {
    return (
        <PushNotificationPhone
            icon={Flame}
            iconColor="#4CC74A"
            title="Keep your streak alive!"
        />
    );
};

