import {Link} from "react-router-dom";

export default function MenuElement({tableName, role}) {
    const isAdmin = role === 'admin';
    return (
        <li className="menu-item">
            <div className="menu-item-header"></div>
            <span className="table-name">{tableName}</span>
            <div className="button-group">
                {isAdmin && (
                    <Link to={`/table/${tableName}`} className="btn edit-button">Edytuj</Link>
                )}
                <Link to={`/table/${tableName}`} className="btn show-button">Pokaż</Link>
            </div>
        </li>
    );
}