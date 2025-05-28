import { Link } from "react-router-dom";
export default function CreateUserButton() {
    return (
        <>
            <Link to="/create-user" className="button" style={styles.button}>
                Stwórz użytkownika
            </Link>
        </>
    );
}
const styles = {
    button: {
        position: "inherit",
    }
}