export default function KeyRow({ keyData }) {
    const fixedKey = fixKey(keyData);


    function fixKey(key) {
        if(key.includes("_")) {
            key = key.replace("_", " ");
        }
        return key;
    }
    
    return (
        <th>
            {fixedKey}
        </th>
    )
}
