import {Badge} from "react-bootstrap";

const InternetConnection = () => {
    const badgeStyleOffline = "text-light bg-danger";
    const badgeStyleOnline = "text-light bg-success";

    const badgeTextOffline = "Disconnected from the Internet ❌";
    const badgeTextOnline = "Connected to the Internet 🌐";

    return (
        <div>
            <Badge className={badgeStyleOnline}>️
                {badgeTextOnline}
            </Badge>
        </div>
    );
}

export default InternetConnection;
