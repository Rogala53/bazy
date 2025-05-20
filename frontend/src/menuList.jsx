import MenuElement from './menuElement';
export default function MenuList({ data, role }) {
    return (
        <ul className="menu-list">
            {data && data.length > 0 ? (
                data.map((tableName) => (
                <MenuElement key={tableName} tableName={tableName} role={role} />
            ))
            ) : (
                <li>Brak danych</li>
            )}
        </ul>
    );
}