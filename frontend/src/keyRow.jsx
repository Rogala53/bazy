

export default function KeyRow({ keyData }) {
    const fixedKey = fixKey(keyData);
    const isForeignKey = keyData.startsWith("id_");
    let tableLink = null;
    if(isForeignKey) {
        const columnName = keyData.slice(3);
        switch(columnName) {
            case 'pracownika':
                tableLink = 'pracownicy/edit';
                break;
            case 'zgloszenia':
                tableLink = 'zgloszenia/edit';
                break;
            case 'dzialania':
                tableLink = 'dzialania/edit';
                break;
            case 'zespolu':
                tableLink = 'zespoly/edit';
                break;
            case 'klienta':
                tableLink = 'klienci/edit';
                break;
            case 'sprzetu':
                tableLink = 'sprzety/edit';
                break;
            default:
                break;
        }
    }
    const url = `/bazy/index.html#/table/${tableLink}`;
    function fixKey(key) {
        if(key.includes("_")) {
            key = key.replace("_", " ");
        }
        return key;
    }
    
    return (
        <th>
            {isForeignKey && tableLink ?
                (<a href={url} target="_blank" rel="noopener noreferrer" className="table-key-link">{fixedKey}</a>
                ) : (
                    fixedKey
                )
            }
        </th>
    )
}