import { Trophy } from "lucide-react";
import { PushNotificationPhone } from "../components/PushNotificationPhone";

export const Widget_AchievementPushNotification: React.FC = () => {
    return (
        <PushNotificationPhone
            icon={Trophy}
            iconColor="#4CC74A"
            title="Achievement Unlocked!"
        />
    );
};
