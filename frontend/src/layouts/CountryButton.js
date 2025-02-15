import {Button} from "react-bootstrap";

const country = "Vietnam";
const flag = "🇻🇳";


const CountryButton = () => {
    return (
        <Button variant="primary" className="btn btn-dark">
            {country}
            <span className="badge text-bg-dark">{flag}</span>
        </Button>
    );
}

export default CountryButton;
