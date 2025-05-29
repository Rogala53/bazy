import {Link} from "react-router-dom";

export default function MenuElement({tableName}) {
    return (
        <li className="menu-item">
            <div className="menu-item-header"></div>
            <span className="table-name">{tableName}</span>
            <div className="button-group">
                    <Link to={`/table/${tableName}/edit`} className="btn edit-button">Edytuj</Link>
                
                <Link to={`/table/${tableName}`} className="btn show-button">Pokaż</Link>
            </div>
        </li>
    );
}