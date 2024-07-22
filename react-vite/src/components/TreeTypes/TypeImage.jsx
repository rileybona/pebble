import sprout4 from './sprout4.png'
import pine from './pine.png'
// import cress from './cress.png'
import cress2 from './cress2.png'
import dead from './dead.png'
import ghostweed from './ghostweed.png'

export default function TypeImage({type}) {
    const img_url = new Map();
    img_url.set("sprout", sprout4);
    img_url.set("dead", dead);
    img_url.set("Pine", pine);
    img_url.set("Thale Cress", cress2);
    img_url.set("ghostweed", ghostweed)

    const imgsrc = img_url.get(type)
    return (
        <img 
            className={"preview-image"}
            src={imgsrc}
            alt={type || "default"}
        ></img>
    );
}