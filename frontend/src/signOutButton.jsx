import { Link } from "react-router-dom";

export default function SignOutButton() {
    const signOut = () => {
        try {
            const response = fetch("api/sign_out.php", {
                method: "POST",
            });
            if (!response.ok) {
                throw new Error("Response nie okej stary");
            }
        } catch (error) {
            console.error("Błąd: ", error);
        }
    }
    return (
    <>
        <Link to="/login" className="button" onClick={(e) => { signOut }}>Wyloguj</Link>
    </>
    )
}