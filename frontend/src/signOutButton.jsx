import { Link } from "react-router-dom";

export default function SignOutButton() {
    async function signOut() {
        try {
            const response = await fetch("api/sign_out.php", {
                method: "POST",
            });
            if (!response.ok) {
                throw new Error(response.status);
            }
            sessionStorage.clear();
        } catch (error) {
            console.error("Błąd: ", error);
        }
    }
    return (
    <>
        <Link to="/login" className="button" onClick={signOut}>Wyloguj</Link>
    </>
    )
}