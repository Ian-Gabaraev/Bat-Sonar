import {Badge} from "react-bootstrap";

const CurrentDevice = () => {
    const badgeStyle = "text-light bg-primary";
    const badgeText = "Microphone: Pettersson Electronics u256";

    return (
        <div>
            <Badge className={badgeStyle}>️
                <h6>{badgeText}</h6>
            </Badge>
        </div>
    );
}

export default CurrentDevice;
