import MenuElement from './menuElement';
import CreateUserButton from "./createUserButton";
export default function MenuList({ data, role }) {
    const isAdmin = role == 'admin';
    return (
        <ul className="menu-list">
            {data && data.length > 0 ? (
                data.map((tableName) => (
                <MenuElement key={tableName} tableName={tableName} />
            ))
            ) : (
                <li>Brak danych</li>
            )}
            {isAdmin && 
                <li className="menu-item" style={styles.listItemButton}>
                    <CreateUserButton />
                </li>
            }
        </ul>
    );
}

const styles = {
    listItemButton: {
        textAlign: "center",
    }
}