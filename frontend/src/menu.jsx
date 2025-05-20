import { useState, useEffect} from "react";
import MenuList from "./menuList";
import SignOutButton from "./signOutButton";
export default function Menu() {
    const username  = sessionStorage.getItem('username');
    const [data, setData] = useState([]);
    const [role, setRole] = useState("");
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const responseTables = await fetch('api/get_tables_names.php', {
                    method: "GET"
                });

                if (!responseTables.ok) {
                    throw new Error(`HTTP error! Status: ${responseTables.status}`);
                }
                const resultTables = await responseTables.json();
                setData(resultTables['tables']);


                const responseRole = await fetch ('api/get_role.php', {
                    method: "GET"
                });

                if(!responseRole.ok) {
                    throw new Error(`HTTP error! Status: ${responseRole.status}`);
                }
                const resultRole = await responseRole.json();
                setRole(resultRole.role);
            } catch(error) {
                console.error("Wystąpił błąd podczas pobierania danych", error);
                setError(error.message);
            }
        }
        fetchData();
    }, []);
    return (
        <>
            {error && <p style={styles.error}>{error}</p>}
            <SignOutButton />
            <div className="menu-container">
                <h1 className="menu-header">Witaj, {username}!</h1>
                <MenuList data={data} role={role} />
            </div>
        </>
    );
}
const styles = {
    error: {
        color: "red",
        marginBottom: "20px",
    },
};

